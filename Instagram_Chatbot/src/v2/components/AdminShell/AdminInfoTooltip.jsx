import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { EMPTY_VALUE, TOOLTIP_PLACEMENT_TOP } from './constants';

const AdminInfoTooltip = ({ text, placement = TOOLTIP_PLACEMENT_TOP }) => {
  if (!text) return null;

  return (
    <Tooltip title={text} placement={placement}>
      <span
        className="admin-info-tooltip"
        tabIndex={0}
        role="button"
        aria-label={text}
      >
        <QuestionCircleOutlined />
      </span>
    </Tooltip>
  );
};

AdminInfoTooltip.propTypes = {
  text: PropTypes.string,
  placement: PropTypes.string,
};

AdminInfoTooltip.defaultProps = {
  text: EMPTY_VALUE,
  placement: TOOLTIP_PLACEMENT_TOP,
};

export default AdminInfoTooltip;
