import React from 'react';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";

const Label = ({ content }) => {
  if (content.type !== MESSAGE_CONTENT_TYPES.LABEL) return null;

  const label = content.label;
  if (!label.lbl_content) return null;

  return (
    <div className="m-b-10">
      <div className="ss-message__content--user-label-top">
        <span className="ss-message__content--user-label-title">
          {label.lbl_content}
        </span>
        {label?.require === true && (
          <span className="ss-message__content--user-required">
            {REQUIRED_FIELD_LABEL}
          </span>
        )}
      </div>
    </div>
  );
};

Label.propTypes = {
  ...baseUserMessageComponentPropTypes,
};

export default Label;
