import React from 'react';
import PropTypes from 'prop-types';

function AdminFormRow({
  label,
  required,
  children,
  hint,
  error,
  htmlFor,
  layout = 'horizontal',
  alignTop,
}) {
  const isHorizontal = layout === 'horizontal';
  const rowClass = [
    'admin-form-row',
    isHorizontal && 'admin-form-row--horizontal',
    alignTop && 'admin-form-row--align-top',
    error && 'admin-form-row--error',
  ]
    .filter(Boolean)
    .join(' ');

  const control = (
    <>
      {children}
      {hint && <div className="admin-form-row-hint">{hint}</div>}
      {error && (
        <div className="admin-form-error" role="alert">
          {error}
        </div>
      )}
    </>
  );

  return (
    <div className={rowClass}>
      {label && (
        <label className="admin-form-row-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="required-badge">必須</span>}
        </label>
      )}
      <div className="admin-form-row-control">{control}</div>
    </div>
  );
}

AdminFormRow.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node,
  hint: PropTypes.node,
  error: PropTypes.node,
  htmlFor: PropTypes.string,
  layout: PropTypes.oneOf(['stacked', 'horizontal']),
  alignTop: PropTypes.bool,
};

export default AdminFormRow;
