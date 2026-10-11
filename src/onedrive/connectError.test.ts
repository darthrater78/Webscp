import { describe, it, expect } from 'vitest';
import { oneDriveConnectMessage } from './connectError';

describe('oneDriveConnectMessage', () => {
  it('points at the Island OneDrive setting when no token is granted', () => {
    expect(oneDriveConnectMessage({ reason: 'no_token' })).toMatch(/enabled for this app in Island/);
  });

  it('asks the user to finish the sign-in on a timeout', () => {
    expect(oneDriveConnectMessage({ reason: 'timeout' })).toMatch(/timed out/);
  });

  it('explains that Island is required when there is no host', () => {
    expect(oneDriveConnectMessage({ reason: 'no_host' })).toMatch(/isn't running inside Island/);
  });

  it('includes the host error detail when there is one', () => {
    expect(oneDriveConnectMessage({ reason: 'error', detail: 'RPC error' })).toMatch(/RPC error/);
    expect(oneDriveConnectMessage({ reason: 'error' })).toMatch(/^Could not connect to OneDrive\./);
  });
});
