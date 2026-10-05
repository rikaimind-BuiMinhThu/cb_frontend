import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { HEADER_ACTIONS_CONTEXT_ERROR, HEADER_ACTIONS_HOOK_ERROR } from './constants';

const AdminHeaderActionsStateContext = createContext(null);
const AdminHeaderActionsDispatchContext = createContext(null);

export const AdminHeaderActionsProvider = ({ children }) => {
  const [actions, setActions] = useState(null);

  return (
    <AdminHeaderActionsDispatchContext.Provider value={setActions}>
      <AdminHeaderActionsStateContext.Provider value={actions}>
        {children}
      </AdminHeaderActionsStateContext.Provider>
    </AdminHeaderActionsDispatchContext.Provider>
  );
};

AdminHeaderActionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAdminHeaderActionsContext = () => {
  const setActions = useContext(AdminHeaderActionsDispatchContext);
  const actions = useContext(AdminHeaderActionsStateContext);

  if (!setActions) {
    throw new Error(HEADER_ACTIONS_CONTEXT_ERROR);
  }

  return { actions, setActions };
};

export const useAdminHeaderActions = (actions) => {
  const setActions = useContext(AdminHeaderActionsDispatchContext);

  if (!setActions) {
    throw new Error(HEADER_ACTIONS_HOOK_ERROR);
  }

  useEffect(() => {
    setActions(actions ?? null);
    return () => setActions(null);
  }, [actions, setActions]);
};
