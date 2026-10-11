import { IconUser } from './icons';

interface Props {
  signedIn: boolean;
  connecting?: boolean;
  userName?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function AccountButton({ signedIn, connecting, userName, onConnect, onDisconnect }: Props) {
  if (!signedIn) {
    return (
      <button
        className="px-3 h-8 shrink-0 whitespace-nowrap rounded-md bg-accent text-accent-fg font-semibold disabled:opacity-60"
        onClick={onConnect}
        disabled={connecting}
      >
        {connecting ? 'Connecting…' : 'Connect OneDrive'}
      </button>
    );
  }
  return (
    <button
      className="inline-flex items-center gap-1.5 px-2 h-8 min-w-0 rounded-md text-muted hover:text-text hover:bg-surface-2"
      title="Disconnect OneDrive"
      aria-label={`Sign out of OneDrive${userName ? ` (${userName})` : ''}`}
      onClick={onDisconnect}
    >
      <IconUser />
      <span className="truncate">{userName ?? 'OneDrive'} · Sign out</span>
    </button>
  );
}
