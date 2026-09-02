/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd';

import {
  REQUIRED_LABEL,
  DEFAULT_SLIDER_COLOR,
  SLIDER_TYPE,
  SLIDER_CONTINUOUS_MIN,
  SLIDER_CONTINUOUS_MAX,
  SLIDER_CONTINUOUS_STEP,
} from './constants';


const SliderContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
}) => {
  const slider = content.slider;
  if (!slider) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(slider.title_require || slider.require) && (
                      <div
                        className="ss-message__content--user-checkbox-top chat-log-um-mb-0"
                    
                      >
                        {slider.title_require && (
                          <span className="ss-message__content--user-checkbox-title">
                            {slider.title}
                          </span>
                        )}
                        {slider.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      className="chat-log-um-slider"
                      style={{ '--um-slider-color': slider.color || DEFAULT_SLIDER_COLOR }}
                    >
                      <Slider
                        disabled={true}
                        value={slider.value}
                        onChange={(value) =>
                          onChangeValue(indexContent, content.type, value, "value")
                        }
                        min={
                          slider.type === SLIDER_TYPE.DISCRETE
                            ? parseInt(slider.min_value)
                            : SLIDER_CONTINUOUS_MIN
                        }
                        max={
                          slider.type === SLIDER_TYPE.DISCRETE
                            ? parseInt(slider.max_value)
                            : SLIDER_CONTINUOUS_MAX
                        }
                        dots={slider.type === SLIDER_TYPE.DISCRETE}
                        step={slider.type !== SLIDER_TYPE.DISCRETE && SLIDER_CONTINUOUS_STEP}
                        marks={
                          slider.type === SLIDER_TYPE.DISCRETE
                            ? {
                                [slider.min_value]: slider.min_label,
                                [slider.max_value]: slider.max_label,
                              }
                            : {
                                [SLIDER_CONTINUOUS_MIN]: slider.min_label,
                                [SLIDER_CONTINUOUS_MAX]: slider.max_label,
                              }
                        }
                      />
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
                  </div>
  );
};

SliderContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default SliderContent;
