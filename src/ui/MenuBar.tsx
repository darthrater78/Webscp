import { IconMoon, IconSun, IconCheck } from './icons';
import type { ThemeApi } from '../theme/useTheme';
import { AccountButton } from './AccountButton';
import { useApp } from '../state/AppProvider';

interface Props {
  sessionLabel: string;
  /** True when a remote session is open; shows the plain-language status pill. */
  connected?: boolean;
  theme: ThemeApi;
  compact?: boolean;
  signedIn: boolean;
  connecting?: boolean;
  userName?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function MenuBar({
  sessionLabel,
  connected,
  theme,
  compact,
  signedIn,
  connecting,
  userName,
  onConnect,
  onDisconnect,
}: Props) {
  const { openConnectionManager, openSettings, canSync, openSync } = useApp();
  const btn = 'h-8 px-3 shrink-0 whitespace-nowrap rounded-md border border-border text-text hover:bg-surface-2';
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-2 bg-surface border border-border rounded-[10px] select-none">
      <span className="font-mono font-semibold text-[16px] text-accent-text shrink-0">webscp</span>
      {!compact && connected && (
        <span className="inline-flex items-center gap-1.5 min-w-0 px-2.5 py-1 rounded-md bg-ok-wash text-ok font-semibold">
          <IconCheck />
          <span className="truncate">Connected to {sessionLabel}</span>
        </span>
      )}
      {!compact && !connected && <span className="text-muted truncate">No server connected</span>}
      <div className="ml-auto flex flex-wrap items-center gap-2 min-w-0">
        {canSync && (
          <button className={btn} title="Synchronize the two folders" onClick={openSync}>
            Synchronize folders
          </button>
        )}
        <button className={btn} title="Saved connections" onClick={openConnectionManager}>
          Connections
        </button>
        <button className={btn} onClick={openSettings}>
          Settings
        </button>
        <button
          className={`${btn} inline-flex items-center gap-1.5`}
          title="Toggle light/dark"
          aria-label="Toggle light/dark theme"
          onClick={theme.toggle}
        >
          {theme.theme === 'dark' ? <IconSun /> : <IconMoon />}
          {theme.theme === 'dark' ? 'Bright' : 'Dark'}
        </button>
        <AccountButton
          signedIn={signedIn}
          connecting={connecting}
          userName={userName}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </div>
    </div>
  );
}
