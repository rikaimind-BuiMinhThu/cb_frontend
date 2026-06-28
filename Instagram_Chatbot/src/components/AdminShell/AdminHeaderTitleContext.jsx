import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

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

  useEffect(() => {
    setTitle(title || '');
    return () => setTitle('');
  }, [title, setTitle]);
}
