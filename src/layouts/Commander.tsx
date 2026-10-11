import { useRef, useState } from 'react';
import type { FsEntry } from '../fs/FileSystem';
import { useApp } from '../state/AppProvider';
import { MenuBar } from '../ui/MenuBar';
import { Splitter } from '../ui/Splitter';
import { PaneView, type PaneActions } from '../ui/PaneView';
import { FKeyBar, type FKey } from '../ui/FKeyBar';
import { SendFetch } from '../ui/SendFetch';
import { useFunctionKeys } from '../ui/useFunctionKeys';
import { RemoteTabs } from '../ui/RemoteTabs';
import { TransferQueue } from '../ui/TransferQueue';
import { ConnectHint } from '../ui/ConnectHint';
import { RemoteConnectHint } from '../ui/RemoteConnectHint';
import { ConnectDialog } from '../ui/ConnectDialog';
import { HostKeyPrompt } from '../ui/HostKeyPrompt';
import { ConnectionManager } from '../ui/ConnectionManager';
import { MasterPassphraseDialog } from '../ui/MasterPassphraseDialog';
import { ConflictDialog } from '../ui/ConflictDialog';
import { SettingsDialog } from '../ui/SettingsDialog';
import { SyncDialog } from '../ui/SyncDialog';

export function Commander() {
  const {
    theme,
    local,
    remote,
    remoteDisconnect,
    connectDialogOpen,
    hostKeyPrompt,
    splitRatio,
    setSplitRatio,
    connecting,
    connectError,
    userName,
    connect,
    disconnect,
    connectionManagerOpen,
    passphraseDialog,
    conflictPrompt,
    settingsOpen,
    syncOpen,
    activeSessionId,
    localCwd,
    remoteCwd,
    setLocalCwd,
    setRemoteCwd,
    setLocalSelection,
    setRemoteSelection,
    enqueueTransfer,
    localRefreshNonce,
    remoteRefreshNonce,
    localSelection,
    remoteSelection,
    canSync,
    openSync,
  } = useApp();

  // The pane the function keys act on: the one last clicked or focused.
  const [activeSide, setActiveSide] = useState<'local' | 'remote'>('local');
  const localActions = useRef<PaneActions | null>(null);
  const remoteActions = useRef<PaneActions | null>(null);
  const runOnActive = (cmd: keyof PaneActions) =>
    (activeSide === 'local' ? localActions : remoteActions).current?.[cmd]();

  const byKey: Record<string, keyof PaneActions> = { F2: 'rename', F7: 'newFolder', F8: 'remove', F9: 'properties' };
  useFunctionKeys(Object.keys(byKey), (key) => runOnActive(byKey[key]));

  const keys: FKey[] = [
    { keyLabel: 'F2', label: 'Rename', onRun: () => runOnActive('rename') },
    { keyLabel: 'F5', label: 'Copy across', onRun: () => runOnActive('send') },
    { keyLabel: 'F7', label: 'New folder', onRun: () => runOnActive('newFolder') },
    { keyLabel: 'F8', label: 'Delete', onRun: () => runOnActive('remove') },
    { keyLabel: 'F9', label: 'Properties', onRun: () => runOnActive('properties') },
    { label: 'Refresh', onRun: () => runOnActive('refresh') },
    ...(canSync ? [{ label: 'Synchronize', onRun: openSync }] : []),
  ];

  const uploadToRemote = (entries: FsEntry[]) =>
    entries.length && enqueueTransfer({ from: 'local', entries, toDir: remoteCwd });
  const downloadToLocal = (entries: FsEntry[]) =>
    entries.length && enqueueTransfer({ from: 'remote', entries, toDir: localCwd });

  const pane = (isActive: boolean) =>
    `min-w-0 flex flex-col overflow-hidden rounded-[10px] border bg-surface ${
      isActive ? 'border-accent' : 'border-border'
    }`;

  return (
    <div className="flex flex-col h-full gap-3 p-3 bg-bg">
      <MenuBar
        sessionLabel={remote?.label ?? 'not connected'}
        connected={remote !== null}
        theme={theme}
        signedIn={local !== null}
        connecting={connecting}
        userName={userName}
        onConnect={connect}
        onDisconnect={disconnect}
      />
      <div className="flex flex-1 min-h-0">
        <div
          style={{ width: `calc(${splitRatio} * (100% - 168px))` }}
          className={pane(!!local && activeSide === 'local')}
        >
          {local ? (
            <PaneView
              fs={local}
              header={local.label}
              side="local"
              active={activeSide === 'local'}
              onActivate={() => setActiveSide('local')}
              actionsRef={localActions}
              onCwdChange={setLocalCwd}
              onSelectionChange={setLocalSelection}
              onTransferOut={uploadToRemote}
              onDropIn={downloadToLocal}
              refreshSignal={localRefreshNonce}
            />
          ) : (
            <ConnectHint connecting={connecting} error={connectError} onConnect={connect} />
          )}
        </div>
        <Splitter ratio={splitRatio} onRatio={setSplitRatio} />
        <SendFetch
          canSend={!!local && !!remote && localSelection.length > 0}
          canFetch={!!local && !!remote && remoteSelection.length > 0}
          onSend={() => uploadToRemote(localSelection)}
          onFetch={() => downloadToLocal(remoteSelection)}
        />
        <div className="w-3 shrink-0" />
        <div className={`flex-1 ${pane(!!remote && activeSide === 'remote')}`}>
          <RemoteTabs />
          {remote ? (
            <div className="flex-1 min-h-0">
              <PaneView
                key={activeSessionId ?? 'remote'}
                fs={remote}
                header={remote.label}
                initialPath={remoteCwd}
                side="remote"
                active={activeSide === 'remote'}
                onActivate={() => setActiveSide('remote')}
                actionsRef={remoteActions}
                onDisconnect={remoteDisconnect}
                onCwdChange={setRemoteCwd}
                onSelectionChange={setRemoteSelection}
                onTransferOut={downloadToLocal}
                onDropIn={uploadToRemote}
                refreshSignal={remoteRefreshNonce}
              />
            </div>
          ) : (
            <RemoteConnectHint />
          )}
        </div>
      </div>
      <TransferQueue />
      <FKeyBar keys={keys} />
      {connectDialogOpen && <ConnectDialog />}
      {hostKeyPrompt && <HostKeyPrompt />}
      {connectionManagerOpen && <ConnectionManager />}
      {passphraseDialog && <MasterPassphraseDialog />}
      {conflictPrompt && <ConflictDialog />}
      {settingsOpen && <SettingsDialog />}
      {syncOpen && <SyncDialog />}
    </div>
  );
}
