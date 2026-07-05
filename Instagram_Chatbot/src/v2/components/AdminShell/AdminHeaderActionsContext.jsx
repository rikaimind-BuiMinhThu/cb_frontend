import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const AdminHeaderActionsContext = createContext(null);

export function AdminHeaderActionsProvider({ children }) {
  const [actions, setActions] = useState(null);

  const value = useMemo(() => ({ actions, setActions }), [actions]);

  return (
    <AdminHeaderActionsContext.Provider value={value}>
      {children}
    </AdminHeaderActionsContext.Provider>
  );
}

AdminHeaderActionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAdminHeaderActionsContext() {
  const context = useContext(AdminHeaderActionsContext);
  if (!context) {
    throw new Error('useAdminHeaderActionsContext must be used within AdminHeaderActionsProvider');
  }
  return context;
}

export function useAdminHeaderActions(actions) {
  const { setActions } = useAdminHeaderActionsContext();

  useEffect(() => {
    setActions(actions ?? null);
    return () => setActions(null);
  }, [actions, setActions]);
}
