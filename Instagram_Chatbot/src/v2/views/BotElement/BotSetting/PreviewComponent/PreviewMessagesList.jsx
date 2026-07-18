import React from "react";
import { stringNullOrEmpty } from "./Utils";

/**
 * Thin list renderer; parents supply per-message content renderers.
 */
const PreviewMessagesList = ({
  messages,
  renderBotMessage,
  renderUserMessage,
  renderCombineMessage,
}) => {
  return (messages || []).map((message, messageIndex) => {
    if (message.hidden && !stringNullOrEmpty(message.hidden)) return null;
    return (
      <React.Fragment key={messageIndex}>
        {renderBotMessage(message, messageIndex)}
        {renderUserMessage(message, messageIndex)}
        {renderCombineMessage(message, messageIndex)}
      </React.Fragment>
    );
  });
};

export default PreviewMessagesList;
