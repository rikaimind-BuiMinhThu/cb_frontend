import React from 'react';
import PropTypes from 'prop-types';
import AdminFormRow from '../../../components/AdminShell/AdminFormRow';

function ClientFormRow({ label, required, alignTop, error, htmlFor, children }) {
  return (
    <AdminFormRow
      layout="horizontal"
      label={label}
      required={required}
      alignTop={alignTop}
      error={error}
      htmlFor={htmlFor}
    >
      {children}
    </AdminFormRow>
  );
}

ClientFormRow.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  alignTop: PropTypes.bool,
  error: PropTypes.node,
  htmlFor: PropTypes.string,
  children: PropTypes.node,
};

export default ClientFormRow;
