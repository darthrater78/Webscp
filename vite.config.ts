import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readAppVersion(): string {
  // Prefer the npm-provided env var (set for any `npm run` script) so we don't
  // need to resolve a path; fall back to reading package.json directly so this
  // still works when invoked in ways that don't set it.
  if (process.env.npm_package_version) return process.env.npm_package_version;
  try {
    const pkgPath = fileURLToPath(new URL('./package.json', import.meta.url));
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version?: string };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function readGitSha(): string {
  // The deploy artifact is produced via `git archive`, which does not include
  // .git -- git rev-parse will fail there. Fall back gracefully so the build
  // never breaks just because .git is absent.
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'release';
  }
}

// Adds a Content-Security-Policy <meta> to the production index.html. The app
// holds SSH keys, passwords and the OneDrive token in page memory, so script
// injection must not be able to run: scripts are limited to our own files plus
// the inline scripts present at build time (allowed by hash). Build-only,
// because the dev server injects its own inline scripts.
//
// connect-src stays at `https:` because OneDrive upload/download URLs are
// pre-authenticated links on Microsoft hosts that cannot be listed up front.
// Inline styles are allowed for React `style` attributes.
function contentSecurityPolicy(): Plugin {
  return {
    name: 'webscp-csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
          (m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`,
        );
        const policy = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(' ')}`.trim(),
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "connect-src 'self' https:",
          "worker-src 'self'",
          "manifest-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ');
        return [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: policy },
            injectTo: 'head-prepend',
          },
        ];
      },
    },
  };
}

const appVersion = readAppVersion();
const buildTime = new Date().toISOString();
const gitSha = readGitSha();

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __BUILD_TIME__: JSON.stringify(buildTime),
    __GIT_SHA__: JSON.stringify(gitSha),
  },
  plugins: [
    react(),
    contentSecurityPolicy(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'WebSCP',
        short_name: 'WebSCP',
        description: 'SFTP / file transfer client with OneDrive as the local side.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          // Dedicated full-bleed, safe-zone artwork so platform masking never
          // clips the rounded-badge corners (a transparent-corner icon is wrong
          // for the 'maskable' purpose).
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/graph\.microsoft\.com\//,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  build: { target: 'es2021', outDir: 'dist', sourcemap: false },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
