import React from 'react';
import PropTypes from 'prop-types';
import { CHATBOT_ACTIONS } from 'v2/variables/chatbotActions';
import { DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL } from 'v2/variables/amazonPayConstants';
import { buildAmazonPayButtonClickActionData } from 'v2/utils/amazonPayButtonUtils';
import 'v2/assets/css/bot/preview-chat-bot.css';

const AMAZON_PAY_LABEL = 'Amazon Pay';
const DEFAULT_MESSAGE_COLOR = '#3CACEF';
const DEFAULT_FONT_COLOR = '#fff';
const DEFAULT_IMAGE_WIDTH = '80%';
const SEARCH_MODE = {
  ID: 1,
  CSS_SELECTOR: 2,
  XPATH: 3,
};

const AmazonPayButtonMessagePreview = ({
  content,
  contentIndex,
  botInfor,
  themeSettings,
}) => {
  const config = content?.amazon_pay_button || {};
  const messageColor = themeSettings?.botMessageBgColor || botInfor?.message_color || DEFAULT_MESSAGE_COLOR;
  const fontColor = themeSettings?.botMessageTextColor || botInfor?.font_color || DEFAULT_FONT_COLOR;
  const iconMess = botInfor?.icon_mess;
  const imageUrl = config.button_image_url || DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL;
  const imageWidth = config.button_image_width || DEFAULT_IMAGE_WIDTH;

  const handleClick = () => {
    const actionData = buildAmazonPayButtonClickActionData(config);

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        source: 'ec-chatbot',
        action: CHATBOT_ACTIONS.CLICK_BUTTON,
        actionData,
      }, '*');
      return;
    }

    if (typeof actionData === 'string') {
      const el = document.getElementById(actionData) || document.querySelector(`#${actionData}`);
      el?.click();
      return;
    }

    const { searchMode, searchValue } = actionData;
    const findElement = () => {
      switch (searchMode) {
        case SEARCH_MODE.ID:
          return document.getElementById(searchValue);
        case SEARCH_MODE.CSS_SELECTOR:
          return document.querySelector(searchValue);
        case SEARCH_MODE.XPATH:
          return document.evaluate(searchValue, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        default:
          return null;
      }
    };
    const el = findElement();
    el?.click();
  };

  return (
    <div className="position-relative">
      <div
        className={`ss-bot-chat-overview-${contentIndex} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value position-relative amazon-pay-button-message`}
        style={{
          '--amazon-pay-bg': messageColor,
          '--amazon-pay-color': fontColor,
          '--amazon-pay-img-width': imageWidth,
        }}
      >
        {config.text_above && (
          <div className="amazon-pay-button-message__text-above">
            {config.text_above}
          </div>
        )}
        <button
          type="button"
          onClick={handleClick}
          className="amazon-pay-button-message__button"
          aria-label={AMAZON_PAY_LABEL}
        >
          <img
            src={imageUrl}
            alt={AMAZON_PAY_LABEL}
            className="amazon-pay-button-message__img"
          />
        </button>
        {config.text_below && (
          <div className="amazon-pay-button-message__text-below">
            {config.text_below}
          </div>
        )}
      </div>
      <div
        className="ss-bot-chat-text-input-bot-icon position-absolute"
        style={{
          '--bot-icon-mess': iconMess ? `url(${iconMess})` : 'none',
        }}
      >
        {!iconMess && (
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="18" viewBox="0 0 37 54">
            <path
              d="M0 0 C7.59 0 15.18 0 23 0 C23.18 6.32 23.34 12.63 23.44 18.95 C23.48 21.1 23.53 23.25 23.6 25.4 C23.7 28.49 23.75 31.58 23.78 34.67 C23.82 35.63 23.86 36.58 23.91 37.57 C23.91 40.27 23.83 42.43 23 45 C20.61 47.35 18.05 48.68 15 50 C13.61 50.67 13.61 50.67 12.19 51.36 C3.42 54.53 -4.81 54.39 -14 54 C-14 53.34 -14 52.68 -14 52 C-13.31 51.7 -12.63 51.39 -11.92 51.08 C-11.02 50.66 -10.12 50.24 -9.19 49.81 C-8.29 49.41 -7.4 49 -6.48 48.58 C-3.39 46.61 -2.53 45.34 -1 42 C-0.54 38.78 -0.51 35.58 -0.49 32.32 C-0.47 31.4 -0.45 30.47 -0.43 29.52 C-0.38 26.58 -0.35 23.63 -0.31 20.69 C-0.28 18.69 -0.24 16.69 -0.21 14.69 C-0.12 9.79 -0.06 4.9 0 0 Z "
              fill={messageColor}
              transform="translate(14,0)"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

AmazonPayButtonMessagePreview.propTypes = {
  content: PropTypes.shape({
    amazon_pay_button: PropTypes.object,
  }).isRequired,
  contentIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  botInfor: PropTypes.object,
  themeSettings: PropTypes.object,
};

AmazonPayButtonMessagePreview.defaultProps = {
  botInfor: null,
  themeSettings: null,
};

export default AmazonPayButtonMessagePreview;
