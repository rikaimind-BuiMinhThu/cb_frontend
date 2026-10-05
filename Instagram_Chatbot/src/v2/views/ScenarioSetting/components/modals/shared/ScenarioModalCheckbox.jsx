import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

const ScenarioModalCheckbox = ({
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
}) => (
  <div className={`ss-settings-modal-checkbox ${className}`.trim()}>
    <Checkbox
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    >
      <span className="ss-settings-modal-checkbox__label">{label}</span>
    </Checkbox>
  </div>
);

ScenarioModalCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ScenarioModalCheckbox;
