// Stand-in for src/state/AppProvider used only by the screenshot harness.
// Every name and file here is demo data.
import type { FileSystem, FsEntry } from '../../src/fs/FileSystem';

const at = (s: string) => Date.parse(`${s}:00Z`);
const KB = 1024;
const MB = 1024 * 1024;

type Row = [name: string, size: number | null, mtime: string];

function demoFs(kind: string, label: string, tree: Record<string, Row[]>): FileSystem {
  const list = async (path: string): Promise<FsEntry[]> =>
    (tree[path] ?? []).map(([name, size, mtime]) => ({
      name,
      path: `${path === '/' ? '' : path}/${name}`,
      kind: size === null ? 'dir' : 'file',
      size: size ?? undefined,
      mtime: at(mtime),
    }));
  const refuse = async () => {
    throw new Error('demo data is read-only');
  };
  return { kind, label, list, stat: refuse, mkdir: refuse, rename: refuse, remove: refuse, move: refuse, openRead: refuse, openWrite: refuse } as unknown as FileSystem;
}

const local = demoFs('onedrive', 'Your OneDrive', {
  '/': [
    ['Documents', null, '2026-10-02 08:15'],
    ['Pictures', null, '2026-07-19 17:40'],
    ['Projects', null, '2026-10-09 11:05'],
    ['Releases', null, '2026-10-08 14:20'],
    ['architecture-notes.docx', 278 * KB, '2026-09-28 13:22'],
    ['Q3-report.xlsx', 94 * KB, '2026-10-03 09:48'],
    ['site-export.zip', 18 * MB, '2026-10-07 19:02'],
    ['todo.txt', 612, '2026-10-10 07:30'],
  ],
});

const remote = demoFs('sftp', 'deploy@files.example.com', {
  '/home/deploy': [
    ['backups', null, '2026-10-01 02:00'],
    ['logs', null, '2026-10-10 23:59'],
    ['releases', null, '2026-10-08 14:12'],
    ['www', null, '2026-09-30 09:41'],
    ['deploy.sh', 2.3 * KB, '2026-10-08 14:10'],
    ['docker-compose.yml', 1.1 * KB, '2026-09-22 16:35'],
    ['nginx.conf', 3.5 * KB, '2026-09-22 16:31'],
    ['README.md', 1.8 * KB, '2026-08-14 10:02'],
    ['site-backup-2026-10-01.tar.gz', 48 * MB, '2026-10-01 02:04'],
  ],
});

const params = new URLSearchParams(location.search);
const view = params.get('view') ?? 'main';
const noop = () => {};
const started = Date.now() - 2400;

const state: Record<string, unknown> = {
  theme: { theme: params.get('theme') === 'dark' ? 'dark' : 'light', toggle: noop, set: noop },
  local,
  remote,
  userName: 'Alex Morgan',
  connecting: false,
  connectError: null,
  remoteConnecting: false,
  remoteError: null,
  remoteHome: '/home/deploy',
  connectDialogOpen: view === 'connect',
  connectDialogPrefill: undefined,
  enablePassphraseKeys: false,
  hostKeyPrompt:
    view === 'hostkey'
      ? { host: 'files.example.com:22', fingerprint: 'SHA256:3fJq0m9N1v8pWc2LrX5yTz7KbHdE4sAaGuQiOe6lVnM', status: 'new' }
      : null,
  connections: [],
  vaultState: 'unlocked',
  connectionManagerOpen: false,
  passphraseDialog: null,
  conflictPrompt: null,
  settingsOpen: false,
  syncOpen: false,
  canSync: true,
  canReconnect: false,
  splitRatio: 0.5,
  jobs:
    view === 'main'
      ? [
          { id: '1', name: 'site-export.zip', direction: 'up', size: 18 * MB, bytes: 11.2 * MB, state: 'active', isDir: false, startedAt: started },
          { id: '2', name: 'Q3-report.xlsx', direction: 'up', size: 94 * KB, bytes: 0, state: 'queued', isDir: false },
        ]
      : [],
  localCwd: '/',
  remoteCwd: '/home/deploy',
  // Matches the two rows shoot.mts selects, so Send shows as available.
  localSelection: [{ name: 'Q3-report.xlsx' }, { name: 'site-export.zip' }],
  remoteSelection: [],
  remoteSessions: [{ id: 's1', label: 'deploy@files.example.com', active: true, dropped: false }],
  activeSessionId: 's1',
  localRefreshNonce: 0,
  remoteRefreshNonce: 0,
};

// Anything not listed above is an action; the harness ignores it.
const app = new Proxy(state, { get: (t, k: string) => (k in t ? t[k] : noop) });

export function useApp() {
  return app as never;
}
