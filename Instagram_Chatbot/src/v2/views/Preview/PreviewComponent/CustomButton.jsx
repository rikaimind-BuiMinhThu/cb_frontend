import React, { useEffect } from 'react';
import { MESSAGE_CONTENT_TYPES } from 'v2/views/Preview/PreviewComponent/Constants';

const AUTO_CLICK_MESSAGE_TYPES = [
  MESSAGE_CONTENT_TYPES.PULL_DOWN,
  MESSAGE_CONTENT_TYPES.AGREE_TERM,
  MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON,
];

const ACTION_BTN_BG_CSS_VAR = '--ss-action-btn-bg';

const CustomButton = ({
  disabled,
  actionBtnBg,
  className,
  onClick,
  children,
  autoClick,
  messageType,
}) => {
  useEffect(() => {
    if (autoClick && typeof onClick === 'function') {
      if (AUTO_CLICK_MESSAGE_TYPES.includes(messageType)) onClick();
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/click wiring; messageType/onClick identity is unstable
  }, [autoClick]);

  return (
    <button
      type="button"
      disabled={disabled}
      style={actionBtnBg ? { [ACTION_BTN_BG_CSS_VAR]: actionBtnBg } : undefined}
      className={`btn btn-new-bot ${className || ''}`.trim()}
      onClick={onClick}
      data-messsagetype={messageType}
    >
      {children}
    </button>
  );
};

export default CustomButton;
