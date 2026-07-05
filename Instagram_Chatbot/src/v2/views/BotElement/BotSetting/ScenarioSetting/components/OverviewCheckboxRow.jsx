import React from 'react';
import PropTypes from 'prop-types';
import ScenarioModalCheckbox from './modals/shared/ScenarioModalCheckbox';

const OverviewCheckboxRow = ({
  checked,
  onChange,
  label,
  actionButton,
  className = '',
}) => (
  <div className={`ss-layout-option-row ${className}`.trim()}>
    <ScenarioModalCheckbox
      checked={checked}
      onChange={onChange}
      label={label}
    />
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
