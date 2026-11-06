import React from "react";
import PropTypes from "prop-types";
import "v2/assets/css/bot/preview-chat-bot.css";
import "moment/locale/zh-cn";
import { resolveMainColorCss } from "v2/views/DesignSetting/utils/designChatbotUtils";
import { PROGRESS_LABEL_MODE_FRACTION } from "v2/views/DesignSetting/constants/designThemeConstants";
import {
  PROCESS_BAR_COMPLETE_TEXT,
  formatProcessBarFractionText,
  formatProcessBarRemainingText,
} from "./Constants";

const PROCESS_BAR_EMPTY_INDEX = "0";
const PROCESS_BAR_FULL_WIDTH = "100%";
const PROCESS_BAR_FRACTION_CLASS = "sp-process-bar--fraction";

const ProcessBar = ({
  botInfor,
  currentIndex,
  maxIndex,
  themeSettings,
}) => {
  const current = parseInt(currentIndex || PROCESS_BAR_EMPTY_INDEX, 10);
  const fillColor = themeSettings?.progressBarFillColor
    || themeSettings?.progress_bar_fill_color
    || resolveMainColorCss(
      botInfor?.main_color,
      botInfor?.main_color_other,
    );
  const progressLabelMode = themeSettings?.progressLabelMode
    || themeSettings?.progress_label_mode;
  const isFractionMode = progressLabelMode === PROGRESS_LABEL_MODE_FRACTION;
  const fractionStep = !maxIndex
    ? 0
    : (current >= maxIndex ? maxIndex : Math.max(current, 1));
  const width = (() => {
    if (!maxIndex) return "0%";
    if (isFractionMode) {
      return fractionStep >= maxIndex
        ? PROCESS_BAR_FULL_WIDTH
        : `${(fractionStep / maxIndex) * 100}%`;
    }
    if (current >= maxIndex) return PROCESS_BAR_FULL_WIDTH;
    return `${(current / maxIndex) * 100}%`;
  })();

  const getText = () => {
    if (isFractionMode) {
      if (!maxIndex) return formatProcessBarFractionText(0, 0);
      return formatProcessBarFractionText(fractionStep, maxIndex);
    }
    if (currentIndex) {
      if (maxIndex > currentIndex) return formatProcessBarRemainingText(maxIndex - currentIndex);
      return PROCESS_BAR_COMPLETE_TEXT;
    }
    return formatProcessBarRemainingText(maxIndex);
  };

  const labelText = getText();
  const barClassName = [
    "sp-process-bar",
    isFractionMode ? PROCESS_BAR_FRACTION_CLASS : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      id="sp-process-bar"
      className={barClassName}
    >
      {isFractionMode ? (
        <div className="sp-process-bar__meta">
          <span className="sp-process-bar__step">{labelText}</span>
        </div>
      ) : null}
      <div className="sp-process-bar__track">
        <div
          className="sp-process-bar-color animation"
          style={{
            "--sp-process-bar-width": width,
            ...(fillColor ? { "--sp-process-bar-color": fillColor } : {}),
          }}
        >
          {isFractionMode ? null : labelText}
        </div>
      </div>
    </div>
  );
};

ProcessBar.propTypes = {
  botInfor: PropTypes.object,
  currentIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxIndex: PropTypes.number,
  themeSettings: PropTypes.object,
};

ProcessBar.defaultProps = {
  botInfor: null,
  currentIndex: 0,
  maxIndex: 0,
  themeSettings: null,
};

export default ProcessBar;
