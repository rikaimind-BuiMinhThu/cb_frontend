import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";

export default function Label({ content }) {
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
            ※必須
          </span>
        )}
      </div>
    </div>
  );
};