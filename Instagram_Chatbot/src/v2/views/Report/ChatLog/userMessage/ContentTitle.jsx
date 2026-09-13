import React from 'react';
import PropTypes from 'prop-types';
import { REQUIRED_LABEL } from './constants';

const ContentTitle = ({
  show,
  title,
  required,
  wrapperClassName,
  titleClassName,
  requiredClassName,
}) => {
  if (!show) {
    return null;
  }
  return (
    <div className={`${wrapperClassName} chat-log-um-title-row`}>
      {title ? (
        <span className={titleClassName}>{title}</span>
      ) : null}
      {required ? (
        <span className={requiredClassName || 'ss-message__content--user-text-input-required'}>
          {REQUIRED_LABEL}
        </span>
      ) : null}
    </div>
  );
};

ContentTitle.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.node,
  required: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  requiredClassName: PropTypes.string,
};

export default ContentTitle;
