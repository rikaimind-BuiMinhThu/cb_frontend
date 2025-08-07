import React, { useEffect } from "react";
import { Button } from "reactstrap";

const CustomButton = ({ 
  disabled, 
  style, 
  className, 
  onClick,
  children,
  autoClick,
  messsagetype
}) => {
  useEffect(() => {
    if (autoClick && typeof onClick === "function") {
      const acceptableTypes = ['pull_down', 'agree_term', 'card_payment_radio_button', 'image'];
      if (acceptableTypes.includes(messsagetype))
        onClick();
      return
    }
  }, [autoClick]);

  return (
    <Button
      disabled={disabled}
      style={style}
      className={className}
      onClick={onClick}
      messsagetype={messsagetype}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
