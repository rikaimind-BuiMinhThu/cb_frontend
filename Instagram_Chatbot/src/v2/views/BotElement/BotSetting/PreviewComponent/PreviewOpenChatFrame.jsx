import React from "react";
import { MDBIcon } from "mdbreact";
import PreventExitChatbotModal from "./PreventExitChatbotModal";
import "v2/assets/css/bot/preview-chat-bot.css";

/**
 * Open chatbot chrome: header, exit modal, optional slots, and body.
 * Layout via CSS classes; only CSS variables for dynamic tokens.
 */
const PreviewOpenChatFrame = ({
  containerRef,
  containerClassName = "sp-container1",
  frameClassName = "",
  cssVars = {},
  headerIconSrc,
  title,
  subtitle,
  titleBubble,
  isOpen,
  onHeaderClick,
  botConfig,
  showPopupCloseBot,
  onClosePopup,
  onCloseBot,
  overlays = null,
  beforeBody = null,
  children,
}) => {
  const className = [containerClassName, frameClassName]
    .filter(Boolean)
    .join(" ");
  const headerTitle = title || titleBubble || "";

  return (
    <div
      ref={containerRef}
      id="sp-container1"
      className={className}
      style={cssVars}
    >
      {overlays}
      <div id="sp-header" className="sp-header preview-open-frame__header">
        <div className="sp-header-left" onClick={onHeaderClick}>
          <div className="preview-open-frame__avatar">
            {headerIconSrc ? (
              <img src={headerIconSrc} alt="bot-header-icon" />
            ) : null}
          </div>
          <div className="sp-header-left-label">
            {subtitle ? (
              <div className="sp-header-left-label-sub-title">{subtitle}</div>
            ) : null}
            {headerTitle ? (
              <div className="sp-header-left-label-title">{headerTitle}</div>
            ) : null}
          </div>
        </div>
        <div className="sp-header-right" onClick={onHeaderClick}>
          <div className="sp-header-right-arrow">
            {isOpen ? (
              <MDBIcon fas icon="chevron-circle-down" />
            ) : (
              <MDBIcon fas icon="chevron-circle-up" />
            )}
          </div>
        </div>
      </div>
      <PreventExitChatbotModal
        botConfig={botConfig}
        isOpen={showPopupCloseBot}
        onClose={onClosePopup}
        onCloseBot={onCloseBot}
      />
      {beforeBody}
      <div id="sp-body" className="sp-body preview-open-frame__body">
        {children}
      </div>
    </div>
  );
};

export default PreviewOpenChatFrame;
