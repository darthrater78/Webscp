// Retakes the README screenshots from demo data: `npx tsx scripts/screenshots/shoot.mts`.
// Renders the real Commander against fakeApp.ts, so no OneDrive or server is needed.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/postcss';
import { chromium } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../docs/screenshots');

const server = await createServer({
  root: here,
  configFile: false,
  logLevel: 'error',
  plugins: [react()],
  css: { postcss: { plugins: [tailwind()] } },
  resolve: { alias: [{ find: /^.*\/state\/AppProvider$/, replacement: path.join(here, 'fakeApp.ts') }] },
  server: { host: '127.0.0.1', port: 0 },
});
await server.listen();
const base = server.resolvedUrls!.local[0];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 950 }, deviceScaleFactor: 1.6 });
try {
  for (const theme of ['light', 'dark']) {
    await page.goto(`${base}?theme=${theme}`);
    await page.getByText('site-export.zip', { exact: true }).first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const left = page.getByRole('listbox').first();
    await left.getByText('Q3-report.xlsx', { exact: true }).click();
    await left.getByText('site-export.zip', { exact: true }).click({ modifiers: ['Shift'] });
    await page.mouse.move(0, 0);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.screenshot({ path: `${out}/commander-${theme}.png` });
  }
  for (const view of ['connect', 'hostkey']) {
    await page.goto(`${base}?view=${view}`);
    await page.getByRole('dialog').waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (view === 'connect') {
      const dialog = page.getByRole('dialog');
      await dialog.getByLabel('Host').fill('files.example.com');
      await dialog.getByLabel('Username').fill('deploy');
      await dialog.getByLabel('Save this connection').check();
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    }
    const file = view === 'connect' ? 'connect-dialog' : 'host-key-prompt';
    await page.getByRole('dialog').screenshot({ path: `${out}/${file}.png` });
  }
} finally {
  await browser.close();
  await server.close();
}
console.log(`wrote 4 screenshots to ${path.relative(process.cwd(), out)}`);
