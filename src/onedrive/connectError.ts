import type { AcquireOutcome } from './session';

type Failure = Extract<AcquireOutcome, { ok: false }>;

/**
 * What to tell the user when OneDrive won't connect. The token always comes
 * from Island, so each reason says what Island did and what to try next.
 */
export function oneDriveConnectMessage(failure: Pick<Failure, 'reason' | 'detail'>): string {
  switch (failure.reason) {
    case 'no_token':
      return (
        "Island didn't give WebSCP access to OneDrive. If no Microsoft sign-in appeared, " +
        "OneDrive may need to be enabled for this app in Island's settings; if you closed " +
        'the sign-in, try again.'
      );
    case 'timeout':
      return 'The OneDrive sign-in timed out. Finish the Microsoft sign-in if it is still open, then try again.';
    case 'no_host':
      return "WebSCP isn't running inside Island, so it can't reach OneDrive. Open it from Island.";
    default:
      return failure.detail
        ? `Island reported an error while connecting to OneDrive: ${failure.detail}. Try again; if it keeps failing, copy the diagnostics from Settings.`
        : 'Could not connect to OneDrive. Try again; if it keeps failing, copy the diagnostics from Settings.';
  }
}
