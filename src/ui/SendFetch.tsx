import { IconArrowLeft, IconArrowRight } from './icons';

interface Props {
  canSend: boolean;
  canFetch: boolean;
  onSend: () => void;
  onFetch: () => void;
}

/** The column between the panes: Send (local → server) and Fetch (server → local). */
export function SendFetch({ canSend, canFetch, onSend, onFetch }: Props) {
  return (
    <div className="w-[132px] shrink-0 flex flex-col justify-center gap-2.5 text-center">
      <button
        type="button"
        className="flex items-center justify-center gap-2 py-3 rounded-lg bg-accent text-accent-fg font-bold disabled:opacity-40"
        disabled={!canSend}
        onClick={onSend}
        title="Upload the selected files to the server"
      >
        Send <IconArrowRight />
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-2 py-3 rounded-lg border border-border bg-surface font-semibold disabled:opacity-40"
        disabled={!canFetch}
        onClick={onFetch}
        title="Download the selected files to OneDrive"
      >
        <IconArrowLeft /> Fetch
      </button>
      <p className="text-[13px] text-muted">or drag files between the two sides</p>
    </div>
  );
}
