import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const AdminHeaderActionsStateContext = createContext(null);
const AdminHeaderActionsDispatchContext = createContext(null);

export function AdminHeaderActionsProvider({ children }) {
  const [actions, setActions] = useState(null);

  return (
    <AdminHeaderActionsDispatchContext.Provider value={setActions}>
      <AdminHeaderActionsStateContext.Provider value={actions}>
        {children}
      </AdminHeaderActionsStateContext.Provider>
    </AdminHeaderActionsDispatchContext.Provider>
  );
}

AdminHeaderActionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAdminHeaderActionsContext() {
  const setActions = useContext(AdminHeaderActionsDispatchContext);
  const actions = useContext(AdminHeaderActionsStateContext);

  if (!setActions) {
    throw new Error('useAdminHeaderActionsContext must be used within AdminHeaderActionsProvider');
  }

  return { actions, setActions };
}

export function useAdminHeaderActions(actions) {
  const setActions = useContext(AdminHeaderActionsDispatchContext);

  if (!setActions) {
    throw new Error('useAdminHeaderActions must be used within AdminHeaderActionsProvider');
  }

  useEffect(() => {
    setActions(actions ?? null);
    return () => setActions(null);
  }, [actions, setActions]);
}
