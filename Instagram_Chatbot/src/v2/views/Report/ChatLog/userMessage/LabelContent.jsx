/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  REQUIRED_LABEL,
} from './constants';

const LabelContent = ({
  content,
}) => {
  const label = content.label;
  if (!label?.lbl_content) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    <div className="ss-message__content--user-label-top">
                      <span className="ss-message__content--user-label-title">
                        {label.lbl_content}
                      </span>
                      {label?.require === true && (
                        <span className="ss-message__content--user-required">
                          {REQUIRED_LABEL}
                        </span>
                      )}
                    </div>
                  </div>
  );
};

LabelContent.propTypes = {
  content: PropTypes.object,
};

export default LabelContent;
