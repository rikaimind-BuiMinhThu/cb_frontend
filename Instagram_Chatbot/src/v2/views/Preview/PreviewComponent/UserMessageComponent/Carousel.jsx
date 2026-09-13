import React from 'react';
import PropTypes from 'prop-types';
import 'v2/assets/css/bot/preview-chat-bot.css';
import {
  ALT_EMPTY,
  CAROUSEL_TYPE,
  LABEL_SELECT,
  PREVIEW_MESSAGE_CONTENT_TYPES,
  REQUIRED_FIELD_LABEL,
  CHATBOT_ACTIONS,
} from '../Constants';

const Carousel = ({
  content,
  messageIndex,
  contentIndex,
  onChangeValue,
  errors,
  disabled,
  onCarouselInfoClick,
  postMessageToParent,
}) => {
  const carousel = content?.carousel;

  if (!content || content.type !== PREVIEW_MESSAGE_CONTENT_TYPES.CAROUSEL || !carousel) {
    return null;
  }

  const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}`;

  const handleSelect = (itemCarousel) => {
    if (carousel.is_use_js === true && carousel.jscode?.length > 0) {
      postMessageToParent({
        action: CHATBOT_ACTIONS.EXCUTE_JS,
        actionData: carousel.jscode,
        is_use_js: true,
      });
    }
    if (carousel.initial_selection !== itemCarousel.id && !disabled) {
      onChangeValue(contentIndex, content.type, itemCarousel.id, 'initial_selection');
    }
  };

  const getButtonClassName = (itemCarousel) => {
    if (carousel.initial_selection === itemCarousel.id) {
      return 'sp-carousel-preview-button preview-um-carousel-selected';
    }
    if (disabled) {
      return 'sp-carousel-preview-button preview-um-carousel-disabled';
    }
    return 'sp-carousel-preview-button';
  };

  return (
    <div className="preview-um-block">
      {(carousel.title_require || carousel.require) && (
        <div className="ss-message__content--user-pull_down-top preview-um-title-row-mb-0">
          {carousel.title_require && (
            <span className="ss-message__content--user-pull_down-title">
              {carousel.title}
            </span>
          )}
          {carousel.require && (
            <span className="ss-message__content--user-text-input-required">
              {REQUIRED_FIELD_LABEL}
            </span>
          )}
        </div>
      )}
      {carousel.type === CAROUSEL_TYPE.DEFAULT && (
        <div className="sp-carousel-container-preivew">
          {carousel[carousel.type].contents?.map((itemCarousel, indexCarousel) => (
            <div className="sp-carousel-container-block-item" key={indexCarousel}>
              <div
                className="sp-carousel-container-block-item-infor"
                onClick={() => onCarouselInfoClick(itemCarousel.urls, carousel.use_shortened_urls)}
              >
                <div className="sp-carousel-preview-img">
                  <img
                    src={itemCarousel.fileUrl}
                    alt={itemCarousel.title || ALT_EMPTY}
                    className="preview-um-carousel-img"
                  />
                </div>
                <div className="sp-carousel-preview-title_holder">
                  <div className="sp-carousel-preview-title">{itemCarousel.title}</div>
                  <div className="sp-carousel-preview-sub-title">{itemCarousel.subtitle}</div>
                </div>
              </div>
              <div
                className={getButtonClassName(itemCarousel)}
                onClick={() => handleSelect(itemCarousel)}
              >
                {itemCarousel.buttonTitle || LABEL_SELECT}
              </div>
            </div>
          ))}
        </div>
      )}
      {errors?.[errorKey] && (
        <div className="validation-error-message">
          {errors[errorKey]}
        </div>
      )}
    </div>
  );
};

Carousel.propTypes = {
  content: PropTypes.object,
  messageIndex: PropTypes.number,
  contentIndex: PropTypes.number,
  onChangeValue: PropTypes.func,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  onCarouselInfoClick: PropTypes.func,
  postMessageToParent: PropTypes.func,
};

export default Carousel;
