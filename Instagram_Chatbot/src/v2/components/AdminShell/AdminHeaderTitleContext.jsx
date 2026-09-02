import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { getPageTitle } from './adminMenuConfig';
import { EMPTY_VALUE, HEADER_TITLE_CONTEXT_ERROR } from './constants';

const AdminHeaderTitleContext = createContext(null);

export const AdminHeaderTitleProvider = ({ children }) => {
  const [title, setTitle] = useState(EMPTY_VALUE);

  const value = useMemo(() => ({ title, setTitle }), [title]);

  return (
    <AdminHeaderTitleContext.Provider value={value}>
      {children}
    </AdminHeaderTitleContext.Provider>
  );
};

AdminHeaderTitleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAdminHeaderTitleContext = () => {
  const context = useContext(AdminHeaderTitleContext);
  if (!context) {
    throw new Error(HEADER_TITLE_CONTEXT_ERROR);
  }
  return context;
};

export const useAdminHeaderTitle = (title) => {
  const { setTitle } = useAdminHeaderTitleContext();
  const location = useLocation();

  useEffect(() => {
    setTitle(title || EMPTY_VALUE);
    return () => setTitle(getPageTitle(location.pathname));
  }, [title, setTitle, location.pathname]);
};
