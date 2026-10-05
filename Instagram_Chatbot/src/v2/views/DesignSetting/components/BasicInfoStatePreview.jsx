import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import { Button } from 'antd';
import 'v2/assets/css/bot/preview-chat-bot.css';
import {
  DEFAULT_MAIN_COLOR,
  OPEN_ANIMATION_DURATION_MS_DEFAULT,
  OPEN_ANIMATION_STYLE_DEFAULT,
  PREVIEW_CLOSED_TITLE,
  PREVIEW_ICON_PLACEHOLDER,
  PREVIEW_OPEN_TITLE,
  PREVIEW_REPLAY_LABEL,
  PREVIEW_SUBTITLE_FALLBACK,
  PREVIEW_TITLE_FALLBACK,
  THEME_CSS_VAR_ANIMATION_DURATION,
  THEME_CSS_VAR_MAIN_COLOR,
} from '../constants/designChatbotConstants';
import {
  clampOpenAnimationDurationMs,
  resolveOpenAnimationClassName,
} from 'v2/views/DesignSetting/utils/designChatbotUtils';

const resolveIcon = (...candidates) => candidates.find(Boolean) || '';

const BasicInfoStatePreview = ({
  mainColor,
  title,
  subtitle,
  botImage,
  openingBotIcon,
  closingBotIcon,
  openAnimationDurationMs,
  openAnimationStyle,
}) => {
  const openIcon = resolveIcon(openingBotIcon, botImage);
  const closeIcon = resolveIcon(closingBotIcon, openingBotIcon, botImage);
  const durationMs = clampOpenAnimationDurationMs(
    openAnimationDurationMs ?? OPEN_ANIMATION_DURATION_MS_DEFAULT,
  );
  const animationClassName = resolveOpenAnimationClassName(openAnimationStyle, false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [durationMs, animationClassName]);

  return (
    <div className="basic-info-state-preview">
      <div className="basic-info-state-preview__section">
        <h6 className="basic-info-state-preview__title">{PREVIEW_CLOSED_TITLE}</h6>
        <div className="basic-info-state-preview__frame basic-info-state-preview__frame--close">
          <div className="basic-info-state-preview__launcher">
            {closeIcon ? (
              <img src={closeIcon} alt="" className="basic-info-state-preview__launcher-icon" />
            ) : (
              <span className="basic-info-state-preview__launcher-placeholder">{PREVIEW_ICON_PLACEHOLDER}</span>
            )}
          </div>
        </div>
      </div>

      <div className="basic-info-state-preview__section">
        <div className="basic-info-state-preview__open-header">
          <h6 className="basic-info-state-preview__title">{PREVIEW_OPEN_TITLE}</h6>
          <Button
            type="link"
            size="small"
            className="basic-info-state-preview__replay"
            onClick={() => setAnimationKey((prev) => prev + 1)}
          >
            {PREVIEW_REPLAY_LABEL}
          </Button>
        </div>
        <div className="basic-info-state-preview__frame basic-info-state-preview__frame--open">
          <div
            key={animationKey}
            className={`basic-info-state-preview__widget sp-container ${animationClassName}`}
            style={{
              [THEME_CSS_VAR_MAIN_COLOR]: mainColor,
              [THEME_CSS_VAR_ANIMATION_DURATION]: `${durationMs}ms`,
            }}
          >
            <div className="sp-header">
              <div className="sp-header-left">
                <div className="sp-header-left-avatar sp-avatar">
                  {openIcon ? <img src={openIcon} alt="" /> : null}
                </div>
                <div className="sp-header-left-label">
                  <div className="sp-header-left-label-sub-title">{subtitle || PREVIEW_SUBTITLE_FALLBACK}</div>
                  <div className="sp-header-left-label-title">{title || PREVIEW_TITLE_FALLBACK}</div>
                </div>
              </div>
              <div className="sp-header-right">
                <div className="sp-header-right-arrow">
                  <MDBIcon fas icon="chevron-down" />
                </div>
              </div>
            </div>
            <div className="sp-body basic-info-state-preview__body" />
          </div>
        </div>
      </div>
    </div>
  );
};

BasicInfoStatePreview.propTypes = {
  mainColor: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  botImage: PropTypes.string,
  openingBotIcon: PropTypes.string,
  closingBotIcon: PropTypes.string,
  openAnimationDurationMs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openAnimationStyle: PropTypes.string,
};

BasicInfoStatePreview.defaultProps = {
  mainColor: DEFAULT_MAIN_COLOR,
  title: '',
  subtitle: '',
  botImage: '',
  openingBotIcon: '',
  closingBotIcon: '',
  openAnimationDurationMs: OPEN_ANIMATION_DURATION_MS_DEFAULT,
  openAnimationStyle: OPEN_ANIMATION_STYLE_DEFAULT,
};

export default BasicInfoStatePreview;
