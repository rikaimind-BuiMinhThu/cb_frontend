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
        if(messsagetype=='pull_down' || messsagetype=='agree_term')
        {
            onClick();
        }
        return
    }
  }, []);

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
