import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import 'v2/assets/css/bot/preview-chat-bot.css';
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES } from "../Constants";
import { getErrorMessageFromParent } from "v2/views/Preview/PreviewFukushashiki/LPUtils";

const DEFAULT_BUTTON_IMAGE_WIDTH = "80%";

const SubmitButton = ({ content, submitErrorMessage = EMPTY_INPUT_VALUE, onChangeValue, onClickNext, isProcessing = false, messageIndex, contentIndex, message}) => {
  const buttonSubmit = content?.button_submit;
  const submitButtonId = `chatbot-submit-button-${message?.id ?? 'msg'}-${messageIndex}-${contentIndex}`;

  useEffect(() => {
    if (content?.type !== MESSAGE_CONTENT_TYPES.SUBMIT_BUTTON || !buttonSubmit?.is_display_error_message) return;

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

  if (content.type !== MESSAGE_CONTENT_TYPES.SUBMIT_BUTTON) return null;
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
  };

  const getButtonSubmitName = () => {
    if (!content.button_submit_use_loading_text) return content.button_submit_name;

    if (isProcessing && content[content.type]?.loading_config) {
      const { buttonHtml = EMPTY_INPUT_VALUE, buttonStyle = EMPTY_INPUT_VALUE } = content[content.type].loading_config;

      return (
        <>
          <style dangerouslySetInnerHTML={{ __html: buttonStyle }} />
          <div dangerouslySetInnerHTML={{ __html: buttonHtml.trim() || content.button_submit_name}} />
        </>
      );
    }

    return content.button_submit_name;
  };

  const renderLoadingUnderButton = () => {
    if (!isProcessing || !content[content.type]?.loading_config) return null;

    const { loadingHtml, loadingStyle } = content[content.type].loading_config;

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: loadingStyle }} />
        <div dangerouslySetInnerHTML={{ __html: loadingHtml }}/>
      </>
    );
  };

  const imageUrl = buttonSubmit.button_image_url;
  const imageWidth = buttonSubmit.button_image_width || DEFAULT_BUTTON_IMAGE_WIDTH;

  const renderButtonContent = () => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={content.button_submit_name || EMPTY_INPUT_VALUE}
          className="preview-submit-btn-img"
          style={{ '--preview-img-width': imageWidth }}
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
  };

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

SubmitButton.propTypes = {
  ...baseUserMessageComponentPropTypes,
  message: PropTypes.object,
  submitErrorMessage: PropTypes.string,
  onClickNext: PropTypes.func,
  isProcessing: PropTypes.bool,
};

export default SubmitButton;
