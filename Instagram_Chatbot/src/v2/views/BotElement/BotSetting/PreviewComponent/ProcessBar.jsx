import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import "moment/locale/zh-cn";
import {
  PROCESS_BAR_COMPLETE_TEXT,
  formatProcessBarRemainingText,
} from "./Constants";

const PROCESS_BAR_EMPTY_INDEX = "0";
const PROCESS_BAR_FULL_WIDTH = "100%";

const ProcessBar = ({
  botInfor,
  currentIndex,
  maxIndex,
}) => {
  const current = parseInt(currentIndex || PROCESS_BAR_EMPTY_INDEX, 10);
  const width = current >= maxIndex ? PROCESS_BAR_FULL_WIDTH : `${(current / maxIndex) * 100}%`;
  const backgroundColor = botInfor?.main_color || botInfor?.main_color_other;

  const getText = () => {
    if (currentIndex) {
      if (maxIndex > currentIndex) return formatProcessBarRemainingText(maxIndex - currentIndex);
      return PROCESS_BAR_COMPLETE_TEXT;
    }
    return formatProcessBarRemainingText(maxIndex);
  };

  return (
    <div
      id="sp-process-bar"
      className="sp-process-bar"
    >
      <div
        className="sp-process-bar-color animation"
        style={{
          '--sp-process-bar-width': width,
          ...(backgroundColor ? { '--sp-process-bar-color': backgroundColor } : {}),
        }}
      >
        {getText()}
      </div>
    </div>
  );
};

export default ProcessBar;