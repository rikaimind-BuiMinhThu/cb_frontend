import React from 'react';
import PropTypes from 'prop-types';

function ClientFormRow({ label, required, alignTop, children }) {
  const rowClass = alignTop
    ? 'admin-client-form-row admin-client-form-row--align-top'
    : 'admin-client-form-row';

  return (
    <div className={rowClass}>
      {label && (
        <label className="admin-form-row-label admin-client-form-row-label">
          {label}
          {required && <span className="required-badge">必須</span>}
        </label>
      )}
      <div className="admin-client-form-row-control">{children}</div>
    </div>
  );
}

ClientFormRow.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  alignTop: PropTypes.bool,
  children: PropTypes.node,
};

export default ClientFormRow;
