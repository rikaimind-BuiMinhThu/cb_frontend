import React from 'react';
import PropTypes from 'prop-types';

function AdminFormRow({ label, required, children, hint, layout = 'stacked', alignTop }) {
  const rowClass = [
    'admin-form-row',
    layout === 'horizontal' && 'admin-form-row--horizontal',
    alignTop && 'admin-form-row--align-top',
  ]
    .filter(Boolean)
    .join(' ');

  const control = (
    <>
      {children}
      {hint && <div className="admin-form-row-hint">{hint}</div>}
    </>
  );

  return (
    <div className={rowClass}>
      {label && (
        <label className="admin-form-row-label">
          {label}
          {required && <span className="required-badge">必須</span>}
        </label>
      )}
      {layout === 'horizontal' ? (
        <div className="admin-form-row-control">{control}</div>
      ) : (
        control
      )}
    </div>
  );
}

AdminFormRow.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node,
  hint: PropTypes.node,
  layout: PropTypes.oneOf(['stacked', 'horizontal']),
  alignTop: PropTypes.bool,
};

export default AdminFormRow;
