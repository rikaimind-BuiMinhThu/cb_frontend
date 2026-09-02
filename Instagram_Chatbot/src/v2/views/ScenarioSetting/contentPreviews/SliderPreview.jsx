import '../styles/base/preview-common.css';
import React from 'react';
import { Slider } from 'antd';
import { PREVIEW_LABELS } from '../constants/scenarioSettingLabels';
import {
  DEFAULT_SLIDER_COLOR,
  PREVIEW_MESSAGE_CONTENT_TYPES,
  SLIDER_CONTINUOUS_MAX,
  SLIDER_CONTINUOUS_MIN,
  SLIDER_CONTINUOUS_STEP,
  SLIDER_TYPE,
} from 'v2/views/Preview/PreviewComponent/Constants';

const SliderPreview = ({
  content,
}) => {
  if (content.type !== PREVIEW_MESSAGE_CONTENT_TYPES.SLIDER) return null;

  const slider = content.slider;
  const isDiscrete = slider.type === SLIDER_TYPE.DISCRETE;

  return (
    <div className="ss-content-preview">
      {(slider.title_require || slider.require) && (
        <div className="ss-message__content--user-checkbox-top ss-content-preview__header--no-mb">
          {slider.title_require && (
            <span className="ss-message__content--user-checkbox-title">
              {slider.title}
            </span>
          )}
          {slider.require === true && (
            <span className="ss-message__content--user-text-input-required">
              {PREVIEW_LABELS.requiredMark}
            </span>
          )}
        </div>
      )}
      <div
        className="ss-content-preview__slider"
        style={{ '--preview-slider-color': slider.color || DEFAULT_SLIDER_COLOR }}
      >
        <Slider
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
      </div>
    </div>
  );
};

export default SliderPreview;
