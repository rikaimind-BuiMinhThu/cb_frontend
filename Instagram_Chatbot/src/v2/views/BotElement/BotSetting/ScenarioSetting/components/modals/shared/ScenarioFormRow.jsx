import React from 'react';
import PropTypes from 'prop-types';
import { AdminInfoTooltip } from '../../../../../../../components/AdminShell';

const ScenarioFormRow = ({
  label,
  tooltip,
  children,
  alignTop = false,
  className = '',
  required = false,
  error,
  htmlFor,
}) => (
  <div className={`ss-settings-form-row ${alignTop ? 'ss-settings-form-row--top' : ''} ${error ? 'ss-settings-form-row--error' : ''} ${className}`.trim()}>
    <div className="ss-settings-form-row__label">
      {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : <span>{label}</span>}
      {required && <span className="required-badge">必須</span>}
      {tooltip && <AdminInfoTooltip text={tooltip} />}
    </div>
    <div className="ss-settings-form-row__control">
      {children}
      {error && (
        <div className="admin-form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  </div>
);

ScenarioFormRow.propTypes = {
  label: PropTypes.node.isRequired,
  tooltip: PropTypes.string,
  children: PropTypes.node.isRequired,
  alignTop: PropTypes.bool,
  className: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.node,
  htmlFor: PropTypes.string,
};

export default ScenarioFormRow;
