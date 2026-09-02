import React, { useEffect } from "react";
import { MESSAGE_CONTENT_TYPES } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";

const AUTO_CLICK_MESSAGE_TYPES = [
  MESSAGE_CONTENT_TYPES.PULL_DOWN,
  MESSAGE_CONTENT_TYPES.AGREE_TERM,
  MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON,
];

const CustomButton = ({
  disabled,
  cssVars,
  className,
  onClick,
  children,
  autoClick,
  messsagetype,
}) => {
  useEffect(() => {
    if (autoClick && typeof onClick === "function") {
      if (AUTO_CLICK_MESSAGE_TYPES.includes(messsagetype))
        onClick();
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/click wiring; messsagetype/onClick identity is unstable
  }, [autoClick]);

  return (
    <button
      type="button"
      disabled={disabled}
      style={cssVars}
      className={`btn btn-new-bot ${className || ''}`.trim()}
      onClick={onClick}
      data-messsagetype={messsagetype}
    >
      {children}
    </button>
  );
};

export default CustomButton;
