import '../styles/base/preview-common.css';
import React from 'react';
import { Slider } from 'antd';

const SliderPreview = ({
  content,
  message,
  indexContent,
}) => {
  const slider = content.slider;
  return (
    <>
      {
        content.type === 'slider' && (
          <div className="ss-content-preview">
            {(slider.title_require || slider.require) &&
              <div className="ss-message__content--user-checkbox-top ss-content-preview__header--no-mb">
                {slider.title_require &&
                  <span className="ss-message__content--user-checkbox-title">
                    {slider.title}
                  </span>
                }
                {slider.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            <div>
              <Slider
                trackStyle={{ backgroundColor: slider.color || '#2C75F0' }}
                min={slider.type === 'discrete_type' ? parseInt(slider.min_value) : 0}
                max={slider.type === 'discrete_type' ? parseInt(slider.max_value) : 100}
                dots={slider.type === 'discrete_type'}
                step={slider.type !== 'discrete_type' && 0.1}
                marks={
                  slider.type === 'discrete_type' ?
                    {
                      [slider.min_value]: slider.min_label,
                      [slider.max_value]: slider.max_label
                    } :
                    {
                      0: slider.min_label,
                      100: slider.max_label
                    }
                }
              />
            </div>
          </div>
        )
      }
    </>
  );
};

export default SliderPreview;
