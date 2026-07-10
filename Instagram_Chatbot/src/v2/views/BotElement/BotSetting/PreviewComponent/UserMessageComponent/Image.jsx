import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "../Constants";

export default function Image({ content, contentIndex, messageIndex }) {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.IMAGE) return null;

  const image = content.image;

  return (
    <div id={`msg-${messageIndex}-${contentIndex}`} className="ss-message__content--user-text-input-top ss-message__content--user-chat-image">
      <img src={image.imageURL} style={{ width: image.image_width, height: image.image_height }} />
    </div>
  );
};