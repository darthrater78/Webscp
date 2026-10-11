import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Commander } from './Commander';
import { useApp } from '../state/AppProvider';
import type { FileSystem } from '../fs/FileSystem';

vi.mock('../state/AppProvider', () => ({
  useApp: vi.fn(),
}));

const mockUseApp = useApp as unknown as ReturnType<typeof vi.fn>;

const baseTheme = { theme: 'light' as const, toggle: vi.fn(), set: vi.fn() };

function baseState(overrides: Partial<ReturnType<typeof useApp>> = {}) {
  return {
    theme: baseTheme,
    local: null,
    remote: null,
    remoteHome: '/',
    remoteConnecting: false,
    remoteError: null,
    connectDialogOpen: false,
    hostKeyPrompt: null,
    openConnectDialog: vi.fn(),
    closeConnectDialog: vi.fn(),
    connections: [],
    vaultState: 'unlocked' as const,
    connectionManagerOpen: false,
    passphraseDialog: null,
    openConnectionManager: vi.fn(),
    closeConnectionManager: vi.fn(),
    connectSaved: vi.fn(),
    settingsOpen: false,
    openSettings: vi.fn(),
    closeSettings: vi.fn(),
    remoteConnect: vi.fn(),
    remoteDisconnect: vi.fn(),
    resolveHostKey: vi.fn(),
    connecting: false,
    connectError: null,
    userName: undefined,
    connect: vi.fn(),
    disconnect: vi.fn(),
    splitRatio: 0.5,
    setSplitRatio: vi.fn(),
    jobs: [],
    conflictPrompt: null,
    resolveConflict: vi.fn(),
    enqueueTransfer: vi.fn(),
    cancelJob: vi.fn(),
    cancelAllJobs: vi.fn(),
    retryJob: vi.fn(),
    clearFinished: vi.fn(),
    localCwd: '/',
    setLocalCwd: vi.fn(),
    remoteCwd: '/',
    setRemoteCwd: vi.fn(),
    localSelection: [],
    setLocalSelection: vi.fn(),
    remoteSelection: [],
    setRemoteSelection: vi.fn(),
    remoteSessions: [],
    activeSessionId: null,
    switchSession: vi.fn(),
    closeSession: vi.fn(),
    openNewSession: vi.fn(),
    ...overrides,
  };
}

function fakeRemoteFs(): FileSystem {
  return {
    kind: 'sftp',
    label: 'bob@example.com',
    list: vi.fn().mockResolvedValue([]),
    stat: vi.fn(),
    mkdir: vi.fn(),
    rename: vi.fn(),
    remove: vi.fn(),
    move: vi.fn(),
    openRead: vi.fn(),
    openWrite: vi.fn(),
  } as unknown as FileSystem;
}

describe('Commander remote pane wiring', () => {
  beforeEach(() => {
    mockUseApp.mockReset();
  });

  it('shows RemoteConnectHint when remote is null', () => {
    mockUseApp.mockReturnValue(baseState());
    render(<Commander />);
    expect(screen.getByText(/no saved connections/i)).toBeTruthy();
    expect(screen.queryByText(/^name$/i)).toBeNull();
  });

  it('renders a PaneView with the fs label when remote is connected', async () => {
    const remote = fakeRemoteFs();
    mockUseApp.mockReturnValue(baseState({ remote, remoteHome: '/home/bob' }));
    render(<Commander />);
    expect((await screen.findAllByText(/bob@example\.com/)).length).toBeGreaterThan(0);
  });

  it('shows ConnectDialog when connectDialogOpen is true', () => {
    mockUseApp.mockReturnValue(baseState({ connectDialogOpen: true }));
    render(<Commander />);
    expect(screen.getByText(/^host$/i)).toBeTruthy();
  });

  it('shows HostKeyPrompt when hostKeyPrompt is set', () => {
    mockUseApp.mockReturnValue(
      baseState({
        hostKeyPrompt: { host: 'example.com:22', fingerprint: 'SHA256:abc', status: 'new' },
      }),
    );
    render(<Commander />);
    expect(screen.getByText(/SHA256:abc/).textContent).toMatch(/SHA256:abc/);
  });
});

describe('Commander Send/Fetch and function keys', () => {
  beforeEach(() => {
    mockUseApp.mockReset();
  });

  const file = { name: 'a.txt', path: '/a.txt', kind: 'file' as const, size: 3, mtime: 0 };

  it('disables Send until something on the OneDrive side is selected', () => {
    mockUseApp.mockReturnValue(baseState({ local: fakeRemoteFs(), remote: fakeRemoteFs() }));
    render(<Commander />);
    expect((screen.getByRole('button', { name: /send/i }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: /fetch/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('Send queues the OneDrive selection for the server folder', () => {
    const enqueueTransfer = vi.fn();
    mockUseApp.mockReturnValue(
      baseState({
        local: fakeRemoteFs(),
        remote: fakeRemoteFs(),
        localSelection: [file],
        remoteCwd: '/srv',
        enqueueTransfer,
      }),
    );
    render(<Commander />);
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(enqueueTransfer).toHaveBeenCalledWith({ from: 'local', entries: [file], toDir: '/srv' });
  });

  it('F7 opens New folder on the active pane, but not while typing in a field', async () => {
    mockUseApp.mockReturnValue(baseState({ local: fakeRemoteFs(), remote: fakeRemoteFs() }));
    render(<Commander />);
    const input = document.createElement('input');
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: 'F7' });
    expect(screen.queryByText('Folder name')).toBeNull();
    input.remove();

    fireEvent.keyDown(window, { key: 'F7' });
    expect(await screen.findByText('Folder name')).toBeTruthy();
  });

  it('the command bar button runs the same command', async () => {
    mockUseApp.mockReturnValue(baseState({ local: fakeRemoteFs(), remote: fakeRemoteFs() }));
    render(<Commander />);
    const bar = screen.getByRole('toolbar', { name: 'Commands' });
    fireEvent.click(within(bar).getByRole('button', { name: /new folder/i }));
    expect(await screen.findByText('Folder name')).toBeTruthy();
  });
});
