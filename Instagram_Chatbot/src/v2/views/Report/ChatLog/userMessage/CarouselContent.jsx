/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  REQUIRED_LABEL,
  LABEL_SELECT,
  ALT_EMPTY,
  CAROUSEL_TYPE,
} from './constants';


const CarouselContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
  onClickNext,
  messageContentLength,
}) => {
  const carousel = content.carousel;
  if (!carousel) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(carousel.title_require || carousel.require) && (
                      <div
                        className="ss-message__content--user-pull_down-top chat-log-um-mb-0"
                    
                      >
                        {carousel.title_require && (
                          <span className="ss-message__content--user-pull_down-title">
                            {carousel.title}
                          </span>
                        )}
                        {carousel.require && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    {/* carousel: type = 'default' */}
                    {carousel.type === CAROUSEL_TYPE.DEFAULT && (
                      <div className="sp-carousel-container-preivew">
                        {carousel[carousel.type].contents &&
                          carousel[carousel.type].contents.map(
                            (itemCarousel, indexCarousel) => {
                              return (
                                <div
                                  className="sp-carousel-container-block-item"
                                  key={indexCarousel}
                                >
                                  <div className="sp-carousel-container-block-item-infor">
                                    <div className="sp-carousel-preview-img">
                                      <img
                                        alt={ALT_EMPTY}
                                        src={itemCarousel.fileUrl}
                                        className="chat-log-um-field-full" 
                                      />
                                    </div>
                                    <div className="sp-carousel-preview-title">
                                      {itemCarousel.title}
                                    </div>
                                    <div className="sp-carousel-preview-sub-title">
                                      {itemCarousel.subtitle}
                                    </div>
                                  </div>
                                  <div
                                    className={`sp-carousel-preview-button ${carousel.initial_selection === itemCarousel.id ? 'chat-log-um-carousel-selected' : (disabled ? 'chat-log-um-carousel-disabled' : '')}`}
                                    onClick={() => {
                                      if (
                                        carousel.initial_selection !==
                                          itemCarousel.id &&
                                        !disabled
                                      ) {
                                        onChangeValue(
                                          indexContent,
                                          content.type,
                                          itemCarousel.id,
                                          "initial_selection"
                                        );
                                        if (
                                          carousel.require &&
                                          messageContentLength === 1
                                        )
                                          onClickNext();
                                      }
                                    }}
                                  >
                                    {itemCarousel.buttonTitle || LABEL_SELECT}
                                  </div>
                                </div>
                              );
                            }
                          )}
                      </div>
                    )}
                    {errors?.[
                      `message${indexMessage}_content${indexContent}_${content.type}`
                    ] && (
                      <div className="chat-log-um-error" >
                        {
                          errors?.[
                            `message${indexMessage}_content${indexContent}_${content.type}`
                          ]
                        }
                      </div>
                    )}
                  </div>
  );
};

CarouselContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
  onClickNext: PropTypes.func,
  messageContentLength: PropTypes.number,
};

export default CarouselContent;
