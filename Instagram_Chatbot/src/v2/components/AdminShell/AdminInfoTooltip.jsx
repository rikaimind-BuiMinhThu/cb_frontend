import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import { MDBIcon } from 'mdbreact';

const AdminInfoTooltip = ({ text, placement = 'top' }) => {
  if (!text) return null;

  return (
    <Tooltip title={text} placement={placement} arrow>
      <span
        className="admin-info-tooltip"
        tabIndex={0}
        role="button"
        aria-label={text}
      >
        <MDBIcon fas icon="question-circle" />
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
