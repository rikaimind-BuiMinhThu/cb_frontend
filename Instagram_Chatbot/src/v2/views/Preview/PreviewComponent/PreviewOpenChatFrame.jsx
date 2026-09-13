import React from "react";
import { MDBIcon } from "mdbreact";
import PropTypes from "prop-types";
import PreventExitChatbotModal from "./PreventExitChatbotModal";
import { getDesignTypeClassName } from "v2/utils/designTypeChrome";
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
  subtitle,
  titleBubble,
  isOpen,
  onHeaderClick,
  botConfig,
  designType,
  showPopupCloseBot,
  onClosePopup,
  onCloseBot,
  overlays = null,
  beforeBody = null,
  children,
}) => {
  const designTypeClass = getDesignTypeClassName(
    designType || botConfig?.botInfor?.design_type,
  );
  const className = [containerClassName, frameClassName, designTypeClass]
    .filter(Boolean)
    .join(" ");

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
          <div className="sp-body-bot-side-avatar sp-avatar-bt">
            {headerIconSrc ? (
              <img src={headerIconSrc} alt="bot-header-icon" />
            ) : null}
          </div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-sub-title">{subtitle}</div>
            <div className="sp-header-left-label-title">{titleBubble}</div>
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

PreviewOpenChatFrame.propTypes = {
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  containerClassName: PropTypes.string,
  frameClassName: PropTypes.string,
  cssVars: PropTypes.object,
  headerIconSrc: PropTypes.string,
  subtitle: PropTypes.string,
  titleBubble: PropTypes.string,
  isOpen: PropTypes.bool,
  onHeaderClick: PropTypes.func,
  botConfig: PropTypes.object,
  designType: PropTypes.string,
  showPopupCloseBot: PropTypes.bool,
  onClosePopup: PropTypes.func,
  onCloseBot: PropTypes.func,
  overlays: PropTypes.node,
  beforeBody: PropTypes.node,
  children: PropTypes.node,
};

export default PreviewOpenChatFrame;
