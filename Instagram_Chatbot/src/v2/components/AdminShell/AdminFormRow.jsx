import React from 'react';
import PropTypes from 'prop-types';
import {
  ALERT_ROLE,
  LAYOUT_HORIZONTAL,
  LAYOUT_STACKED,
  REQUIRED_BADGE,
} from './constants';

const AdminFormRow = ({
  label,
  required,
  children,
  hint,
  error,
  htmlFor,
  layout = LAYOUT_HORIZONTAL,
  alignTop,
}) => {
  const isHorizontal = layout === LAYOUT_HORIZONTAL;
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
        <div className="admin-form-error" role={ALERT_ROLE}>
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
          {required && <span className="required-badge">{REQUIRED_BADGE}</span>}
        </label>
      )}
      <div className="admin-form-row-control">{control}</div>
    </div>
  );
};

AdminFormRow.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node,
  hint: PropTypes.node,
  error: PropTypes.node,
  htmlFor: PropTypes.string,
  layout: PropTypes.oneOf([LAYOUT_STACKED, LAYOUT_HORIZONTAL]),
  alignTop: PropTypes.bool,
};

export default AdminFormRow;
