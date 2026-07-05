import React from 'react';
import PropTypes from 'prop-types';
import DesignSettingInfoTooltip from './DesignSettingInfoTooltip';

const DesignSettingLabel = ({
  children,
  tooltip,
  required = false,
  className = 'label-field',
}) => (
  <span className={className}>
    {children}
    {required && <span style={{ color: 'red' }}> *</span>}
    {tooltip && <DesignSettingInfoTooltip text={tooltip} />}
  </span>
);

DesignSettingLabel.propTypes = {
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default DesignSettingLabel;
