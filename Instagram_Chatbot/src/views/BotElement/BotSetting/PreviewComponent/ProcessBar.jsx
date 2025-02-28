import React, { } from "react";
import "../../../../assets/css/bot/preview-chat-bot.css";
import "moment/locale/zh-cn";

const ProcessBar = ({
  botInfor,
  currentIndex,
  maxIndex,
}) => {
  const getBackgroundColor = () => {
    if (botInfor?.main_color) return {backgroundColor: botInfor?.main_color};
    if (botInfor?.main_color_other) return {backgroundColor: botInfor?.main_color_other};
    return {};
  };

  const getWidth = () => {
    let width;
    if (!currentIndex || currentIndex >= maxIndex) width = "100%";
    else width = `${((currentIndex - 1 < 0 ? 0 : currentIndex - 1) * 100) / maxIndex }%`;

    return { width: width };
  };

  const getText = () => {
    if (currentIndex) {
      if (maxIndex !== currentIndex - 1) return `あと${maxIndex - currentIndex + 1}間`;
      return "完了しました。";
    }
    return `あと${maxIndex}間`;
  }

  return (
    <div
      id="sp-process-bar"
      className="sp-process-bar"
      style={{ backgroundColor: botInfor?.opacity_color }}
    >
      <div
        className="sp-process-bar-color animation"
        style={{
          ...getWidth(),
          ...getBackgroundColor(),
          display: "block",
          marginTop: "1px",
        }}
      >
        {getText()}
      </div>
    </div>
  );
};

export default ProcessBar;