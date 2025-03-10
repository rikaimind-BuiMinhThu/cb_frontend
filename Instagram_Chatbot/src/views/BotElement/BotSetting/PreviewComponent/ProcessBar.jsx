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
    let width = "0%";
    if (parseInt(currentIndex || "0") >= maxIndex) width = "100%";
    else width = `${(currentIndex /maxIndex ) * 100}%`;

    return { width: width };
  };

  const getText = () => {
    if (currentIndex) {
      if (maxIndex > currentIndex) return `あと${maxIndex - currentIndex}間`;
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