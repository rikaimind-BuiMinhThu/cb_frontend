import React from 'react';
import PropTypes from 'prop-types';
import AdminFormRow from '../../../components/AdminShell/AdminFormRow';

function ClientFormRow({ label, required, alignTop, children }) {
  return (
    <AdminFormRow layout="horizontal" label={label} required={required} alignTop={alignTop}>
      {children}
    </AdminFormRow>
  );
}

ClientFormRow.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  alignTop: PropTypes.bool,
  children: PropTypes.node,
};

export default ClientFormRow;
