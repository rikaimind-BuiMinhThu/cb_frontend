import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import { MDBIcon } from 'mdbreact';

const ScenarioInfoTooltip = ({ text, placement = 'top' }) => {
  if (!text) return null;

  return (
    <Tooltip title={text} placement={placement} arrow>
      <span className="ss-settings-info-tooltip" tabIndex={0} role="button" aria-label={text}>
        <MDBIcon fas icon="question-circle" />
      </span>
    </Tooltip>
  );
};

ScenarioInfoTooltip.propTypes = {
  text: PropTypes.string,
  placement: PropTypes.string,
};

export default ScenarioInfoTooltip;
