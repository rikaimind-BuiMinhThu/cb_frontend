import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { message as antMessage } from 'antd';
import useInstagramConnect from '../hooks/useInstagramConnect';
import useReleaseSettings from '../hooks/useReleaseSettings';
import useIceBreakers from '../hooks/useIceBreakers';
import usePersistentMenus from '../hooks/usePersistentMenus';
import useKeywordSettings from '../hooks/useKeywordSettings';

const ReleaseEditorContext = createContext(null);

export function ReleaseEditorProvider({ children }) {
  const [confirmState, setConfirmState] = useState(null);

  const notify = useCallback((text, type = 'success') => {
    if (type === 'error') {
      antMessage.error(text);
    } else {
      antMessage.success(text);
    }
  }, []);

  const connect = useInstagramConnect({ onNotify: notify });
  const settings = useReleaseSettings();
  const igId = connect.account?.ig_id;
  const iceBreakers = useIceBreakers(igId);
  const persistentMenus = usePersistentMenus(igId);
  const keywords = useKeywordSettings();

  const askConfirm = useCallback((options) => {
    setConfirmState(options);
  }, []);

  const clearConfirm = useCallback(() => {
    setConfirmState(null);
  }, []);

  const value = useMemo(() => ({
    notify,
    connect,
    settings,
    iceBreakers,
    persistentMenus,
    keywords,
    confirmState,
    askConfirm,
    clearConfirm,
  }), [askConfirm, clearConfirm, confirmState, connect, iceBreakers, keywords, notify, persistentMenus, settings]);

  return (
    <ReleaseEditorContext.Provider value={value}>
      {children}
    </ReleaseEditorContext.Provider>
  );
}

export function useReleaseEditor() {
  const context = useContext(ReleaseEditorContext);
  if (!context) {
    throw new Error('useReleaseEditor must be used within ReleaseEditorProvider');
  }
  return context;
}
