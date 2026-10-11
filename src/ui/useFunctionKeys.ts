import { useEffect, useRef } from 'react';

/**
 * Calls `onKey` with the pressed key when one of `keys` is pressed without
 * modifiers, except while the user is typing in a field or working in a dialog.
 */
export function useFunctionKeys(keys: readonly string[], onKey: (key: string) => void) {
  const onKeyRef = useRef(onKey);
  useEffect(() => {
    onKeyRef.current = onKey;
  });
  const keyList = keys.join(',');
  useEffect(() => {
    const wanted = new Set(keyList.split(','));
    const onKeyDown = (e: KeyboardEvent) => {
      if (!wanted.has(e.key) || e.ctrlKey || e.altKey || e.metaKey) return;
      const target = e.target;
      if (target instanceof Element && target.closest('input, textarea, select, [role="dialog"]')) return;
      e.preventDefault();
      onKeyRef.current(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [keyList]);
}
