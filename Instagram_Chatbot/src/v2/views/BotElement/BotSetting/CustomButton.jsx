import React, { useEffect } from "react";

const CustomButton = ({
  disabled,
  style,
  className,
  onClick,
  children,
  autoClick,
  messsagetype,
}) => {
  useEffect(() => {
    if (autoClick && typeof onClick === "function") {
      const acceptableTypes = ['pull_down', 'agree_term', 'card_payment_radio_button'];
      if (acceptableTypes.includes(messsagetype))
        onClick();
      return
    }
  }, [autoClick]);

  return (
    <button
      type="button"
      disabled={disabled}
      style={style}
      className={`btn btn-new-bot ${className || ''}`.trim()}
      onClick={onClick}
      data-messsagetype={messsagetype}
    >
      {children}
    </button>
  );
};

export default CustomButton;
