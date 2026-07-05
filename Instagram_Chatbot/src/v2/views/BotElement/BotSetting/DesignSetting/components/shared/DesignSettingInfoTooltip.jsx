import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import { MDBIcon } from 'mdbreact';

const DesignSettingInfoTooltip = ({ text, placement = 'top' }) => {
  if (!text) return null;

  return (
    <Tooltip title={text} placement={placement} arrow>
      <span
        className="design-setting-info-tooltip"
        tabIndex={0}
        role="button"
        aria-label={text}
      >
        <MDBIcon fas icon="question-circle" />
      </span>
    </Tooltip>
  );
};

DesignSettingInfoTooltip.propTypes = {
  text: PropTypes.string,
  placement: PropTypes.string,
};

export default DesignSettingInfoTooltip;
