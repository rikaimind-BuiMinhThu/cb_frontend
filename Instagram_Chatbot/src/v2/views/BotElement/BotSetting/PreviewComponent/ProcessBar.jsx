import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import "moment/locale/zh-cn";
import { resolveMainColorContext } from "../DesignSetting/utils/designChatbotUtils";

const ProcessBar = ({
  botInfor,
  currentIndex,
  maxIndex,
}) => {
  const getBackgroundColor = () => {
    // Bug #1: không gán main_color key ("blue") vào backgroundColor — CSS hiểu named color, sai/trắng.
    // Fill dùng --c-progress-fill (theme) nếu có; fallback HEX Main color đã resolve.
    const { mainColorHex } = resolveMainColorContext(botInfor);
    return { backgroundColor: `var(--c-progress-fill, ${mainColorHex})` };
  };

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