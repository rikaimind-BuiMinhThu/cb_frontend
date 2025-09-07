import React from "react";
import "assets/css/bot/preview-chat-bot.css";

export default function SubmitButton({ display = false, content, submitErrorMessage = "", onClickNext, isProcessing = false }) {
  if (!display) return null;

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

  const getButtonSubmitName = (isProcessing) => {
    if (!content.button_submit_use_loading_text) return content.button_submit_name;

    if (isProcessing && content[content.type]?.loading_config) {
      const { buttonHtml = "", buttonStyle = "" } = content[content.type].loading_config;

      return (
        <>
          <style dangerouslySetInnerHTML={{ __html: buttonStyle }} />
          <div dangerouslySetInnerHTML={{ __html: buttonHtml }} />
        </>
      );
    }

    return content.button_submit_name;
  }

  const renderLoadingUnderButton = (isProcessing) => {
    if (!isProcessing || !content[content.type]?.loading_config) return null;

    const { loadingHtml, loadingStyle } = content[content.type].loading_config;

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: loadingStyle }} />
        <div dangerouslySetInnerHTML={{ __html: loadingHtml }}/>
      </>
    )
  }

  return (
    <>
      {renderSubmitErrorMessage()}
      <div className="ss-user-setting__item-text_input-top">
        {buttonSubmit?.style && <style dangerouslySetInnerHTML={{ __html: buttonSubmit.style }} />}
        <button id="chatbot-submit-button" onClick={onClickNext}>
          {getButtonSubmitName(isProcessing)}
        </button>
      </div>
      {renderLoadingUnderButton(isProcessing)}
    </>
  );
};