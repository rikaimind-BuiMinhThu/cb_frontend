import React, { useEffect } from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { getErrorMessageFromParent } from "../../PreviewFukushashiki/LPUtils"

export default function SubmitButton({ content, submitErrorMessage = "", onChangeValue, onClickNext, isProcessing = false, messageIndex, contentIndex, message}) {
  const buttonSubmit = content?.button_submit;
  const submitButtonId = `chatbot-submit-button-${message?.id ?? 'msg'}-${messageIndex}-${contentIndex}`;

  useEffect(() => {
    if (content?.type !== 'button_submit' || !buttonSubmit?.is_display_error_message) return;

    const error_message_display_element_search_type = content.error_message_display_element_search_type;
    const error_message_display_element_search_value = content.error_message_display_element_search_value;

    if (!error_message_display_element_search_type || !error_message_display_element_search_value) return;

    getErrorMessageFromParent(
      error_message_display_element_search_type, 
      error_message_display_element_search_value, 
      buttonSubmit.is_display_error_message
    );
  }, [
    buttonSubmit,
    content,
  ]);

  if (content.type !== 'button_submit') return null;
  if (!buttonSubmit) return null;

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

  const imageUrl = buttonSubmit.button_image_url;
  const imageWidth = buttonSubmit.button_image_width || '80%';

  const renderButtonContent = () => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={content.button_submit_name || ''}
          style={{ width: imageWidth, maxWidth: '100%' }}
        />
      );
    }

    return getButtonSubmitName();
  };

  const onChangeAndClickNext = () => {
    onChangeValue(
      contentIndex,
      content.type,
      content.button_submit_id,
      "button_submit",
      null,
      null,
      message
    );

    onClickNext(messageIndex, message);
  }

  return (
    <>
      {renderSubmitErrorMessage()}
      <div className="ss-user-setting__item-text_input-top">
        {buttonSubmit?.style && <style dangerouslySetInnerHTML={{ __html: buttonSubmit.style }} />}
        <button
          id={submitButtonId}
          className={[
            'chatbot-submit-button',
            imageUrl ? 'chatbot-submit-button--image' : '',
          ].filter(Boolean).join(' ')}
          onClick={onChangeAndClickNext}
        >
          {renderButtonContent()}
        </button>
      </div>
      {renderLoadingUnderButton()}
    </>
  );
};