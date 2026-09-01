import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import "moment/locale/zh-cn";

const ProcessBar = ({
  currentIndex,
  maxIndex,
}) => {
  // Bug #6 / #7: fill lấy --c-progress-fill từ theme CSS, không còn inline màu header (botInfor).
  const getWidth = () => {
    let width = "0%";
    if (parseInt(currentIndex || "0") >= maxIndex) width = "100%";
    else width = `${(currentIndex /maxIndex ) * 100}%`;

    return { width: width };
  };

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
          ...getWidth(),
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