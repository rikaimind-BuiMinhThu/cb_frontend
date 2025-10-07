import React, { useEffect } from "react";
import "assets/css/bot/preview-chat-bot.css";

export default function SubmitButton({ content, submitErrorMessage = "", onClickNext, isProcessing = false }) {
  if (content.type !== 'button_submit') return null;

  const buttonSubmit = content.button_submit;

  useEffect(() => {
    if (!buttonSubmit.is_display_error_message) return;

    const error_message_display_element_search_type = content.error_message_display_element_search_type;
    const error_message_display_element_search_value = content.error_message_display_element_search_value;

    if (!error_message_display_element_search_type || !error_message_display_element_search_value) return;

    getErrorMessageFromParent(
      error_message_display_element_search_type, 
      error_message_display_element_search_value, 
      buttonSubmit.is_display_error_message
    );
  }, []);

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

  const getButtonSubmitName = () => {
    if (!content.button_submit_use_loading_text) return content.button_submit_name;

    if (isProcessing && content[content.type]?.loading_config) {
      const { buttonHtml = "", buttonStyle = "" } = content[content.type].loading_config;

      return (
        <>
          <style dangerouslySetInnerHTML={{ __html: buttonStyle }} />
          <div dangerouslySetInnerHTML={{ __html: buttonHtml.trim() || content.button_submit_name}} />
        </>
      );
    }

    return content.button_submit_name;
  }

  const renderLoadingUnderButton = () => {
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
          {getButtonSubmitName()}
        </button>
      </div>
      {renderLoadingUnderButton()}
    </>
  );
};