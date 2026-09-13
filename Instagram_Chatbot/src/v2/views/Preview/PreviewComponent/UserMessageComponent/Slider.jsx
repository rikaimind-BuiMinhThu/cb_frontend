import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd';
import 'v2/assets/css/bot/preview-chat-bot.css';
import {
  DEFAULT_SLIDER_COLOR,
  PREVIEW_MESSAGE_CONTENT_TYPES,
  REQUIRED_FIELD_LABEL,
  SLIDER_CONTINUOUS_MAX,
  SLIDER_CONTINUOUS_MIN,
  SLIDER_CONTINUOUS_STEP,
  SLIDER_TYPE,
} from '../Constants';

const SliderInput = ({
  content,
  messageIndex,
  contentIndex,
  onChangeValue,
  errors,
  disabled,
}) => {
  const slider = content?.slider;

  if (!content || content.type !== PREVIEW_MESSAGE_CONTENT_TYPES.SLIDER || !slider) {
    return null;
  }

  const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}`;
  const isDiscrete = slider.type === SLIDER_TYPE.DISCRETE;

  return (
    <div className="preview-um-block">
      {(slider.title_require || slider.require) && (
        <div className="ss-message__content--user-checkbox-top preview-um-title-row-mb-0">
          {slider.title_require && (
            <span className="ss-message__content--user-checkbox-title">
              {slider.title}
            </span>
          )}
          {slider.require === true && (
            <span className="ss-message__content--user-text-input-required">
              {REQUIRED_FIELD_LABEL}
            </span>
          )}
        </div>
      )}
      <div
        className="preview-um-slider"
        style={{ '--preview-slider-color': slider.color || DEFAULT_SLIDER_COLOR }}
      >
        <Slider
          disabled={disabled}
          value={slider.value}
          onChange={(value) => onChangeValue(contentIndex, content.type, value, 'value')}
          min={isDiscrete ? parseInt(slider.min_value, 10) : SLIDER_CONTINUOUS_MIN}
          max={isDiscrete ? parseInt(slider.max_value, 10) : SLIDER_CONTINUOUS_MAX}
          dots={isDiscrete}
          step={!isDiscrete && SLIDER_CONTINUOUS_STEP}
          marks={
            isDiscrete
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
        {errors?.[errorKey] && (
          <div className="validation-error-message">
            {errors[errorKey]}
          </div>
        )}
      </div>
    </div>
  );
};

SliderInput.propTypes = {
  content: PropTypes.object,
  messageIndex: PropTypes.number,
  contentIndex: PropTypes.number,
  onChangeValue: PropTypes.func,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
};

export default SliderInput;
