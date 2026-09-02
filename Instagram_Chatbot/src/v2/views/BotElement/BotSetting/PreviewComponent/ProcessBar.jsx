import React, { } from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import "moment/locale/zh-cn";

const ProcessBar = ({
  botInfor,
  currentIndex,
  maxIndex,
}) => {
  const current = parseInt(currentIndex || "0", 10);
  const width = current >= maxIndex ? "100%" : `${(current / maxIndex) * 100}%`;
  const backgroundColor = botInfor?.main_color || botInfor?.main_color_other;

  const getText = () => {
    if (currentIndex) {
      if (maxIndex > currentIndex) return `あと${maxIndex - currentIndex}問`;
      return "完了しました。";
    }
    return `あと${maxIndex}問`;
  }

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