import React from 'react';
import PropTypes from 'prop-types';
import ScenarioInfoTooltip from './ScenarioInfoTooltip';

const ScenarioFormRow = ({
  label,
  tooltip,
  children,
  alignTop = false,
  className = '',
}) => (
  <div className={`ss-settings-form-row ${alignTop ? 'ss-settings-form-row--top' : ''} ${className}`.trim()}>
    <div className="ss-settings-form-row__label">
      <span>{label}</span>
      {tooltip && <ScenarioInfoTooltip text={tooltip} />}
    </div>
    <div className="ss-settings-form-row__control">
      {children}
    </div>
  </div>
);

ScenarioFormRow.propTypes = {
  label: PropTypes.node.isRequired,
  tooltip: PropTypes.string,
  children: PropTypes.node.isRequired,
  alignTop: PropTypes.bool,
  className: PropTypes.string,
};

export default ScenarioFormRow;
