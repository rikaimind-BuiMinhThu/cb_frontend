import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { getPageTitle } from './adminMenuConfig';

const AdminHeaderTitleContext = createContext(null);

export function AdminHeaderTitleProvider({ children }) {
  const [title, setTitle] = useState('');

  const value = useMemo(() => ({ title, setTitle }), [title]);

  return (
    <AdminHeaderTitleContext.Provider value={value}>
      {children}
    </AdminHeaderTitleContext.Provider>
  );
}

AdminHeaderTitleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAdminHeaderTitleContext() {
  const context = useContext(AdminHeaderTitleContext);
  if (!context) {
    throw new Error('useAdminHeaderTitleContext must be used within AdminHeaderTitleProvider');
  }
  return context;
}

export function useAdminHeaderTitle(title) {
  const { setTitle } = useAdminHeaderTitleContext();
  const location = useLocation();

  useEffect(() => {
    setTitle(title || '');
    return () => setTitle(getPageTitle(location.pathname));
  }, [title, setTitle, location.pathname]);
}
