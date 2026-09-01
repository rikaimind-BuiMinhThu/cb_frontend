import React from 'react';
import PropTypes from 'prop-types';
import { AdminInfoTooltip } from '../../../../../../components/AdminShell';

const DesignSettingLabel = ({
  children,
  tooltip,
  required = false,
  className = 'label-field',
}) => (
  <span className={className}>
    {children}
    {required && <span className="required-badge">必須</span>}
    {tooltip && <AdminInfoTooltip text={tooltip} />}
  </span>
);

DesignSettingLabel.propTypes = {
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default DesignSettingLabel;
