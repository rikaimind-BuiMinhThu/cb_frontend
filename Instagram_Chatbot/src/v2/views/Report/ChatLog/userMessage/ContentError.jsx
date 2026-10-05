import React from 'react';
import PropTypes from 'prop-types';

const ContentError = ({ errors, errorKey }) => {
  if (!errors?.[errorKey]) {
    return null;
  }
  return <div className="chat-log-um-error">{errors[errorKey]}</div>;
};

ContentError.propTypes = {
  errors: PropTypes.object,
  errorKey: PropTypes.string,
};

export default ContentError;
