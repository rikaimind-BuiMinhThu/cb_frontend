import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const AdminInfoTooltip = ({ text, placement = 'top' }) => {
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
  text: '',
  placement: 'top',
};

export default AdminInfoTooltip;
