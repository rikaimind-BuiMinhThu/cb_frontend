import React from 'react';
import PropTypes from 'prop-types';

const OverviewCheckboxRow = ({
  checked,
  onChange,
  label,
  actionButton,
  className = '',
}) => (
  <div className={`ss-layout-option-row ${className}`.trim()}>
    <div className="ss-user-setting-checkbox-custom_css">
      <input
        type="checkbox"
        className="ss-user-setting-checkbox-custom"
        onChange={onChange}
        checked={checked}
      />
      <label>{label}</label>
    </div>
    {actionButton}
  </div>
);

OverviewCheckboxRow.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node.isRequired,
  actionButton: PropTypes.node,
  className: PropTypes.string,
};

export default OverviewCheckboxRow;
