import React, { useState } from "react";
import "assets/css/bot/preview-chat-bot.css";

const SubmitButton = ({content, submitErrorMessage, onClickNext, isProcessing}) => {
  if (content.type !== 'button_submit') return null;

  const buttonSubmit = content.button_submit;

  const renderSubmitErrorMessage = () => {
    if (!buttonSubmit.is_display_error_message) return null;
    if (submitErrorMessage.length === 0) return null;

    return (
      <div className="ss-user-setting__item-text_input-top">
        <div id="error-message"
          dangerouslySetInnerHTML={{ __html: submitErrorMessage }}
        />
      </div>
    );
  }

  console.log("Loading: " + isProcessing);

  return (
    <>
      {renderSubmitErrorMessage()}
      <div className="ss-user-setting__item-text_input-top">
        <button id="chatbot-submit-button" onClick={onClickNext}>
          {isProcessing ? content.button_submit_loading_text : content.button_submit_name}
        </button>
      </div>
    </>
  );
};

export default SubmitButton;