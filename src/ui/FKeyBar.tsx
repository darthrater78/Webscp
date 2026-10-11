export interface FKey {
  /** Key cap shown on the button, e.g. "F2". Omitted for commands with no shortcut. */
  keyLabel?: string;
  label: string;
  onRun: () => void;
}

/** Bottom command bar: one button per command, each showing its function key. */
export function FKeyBar({ keys }: { keys: FKey[] }) {
  return (
    <div role="toolbar" aria-label="Commands" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      {keys.map((k) => (
        <button
          key={k.label}
          type="button"
          onClick={k.onRun}
          className="flex items-center gap-2.5 min-w-0 px-3.5 py-2.5 rounded-lg border border-border bg-surface text-left hover:border-accent"
        >
          {k.keyLabel && (
            <kbd className="shrink-0 min-w-[2.2em] text-center font-mono text-[12px] font-semibold text-accent-text bg-surface-2 border border-border rounded-[5px] px-1.5 py-0.5">
              {k.keyLabel}
            </kbd>
          )}
          <span className="truncate">{k.label}</span>
        </button>
      ))}
    </div>
  );
}
