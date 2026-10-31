import React from "react";
import { MDBIcon } from "mdbreact";
import PropTypes from "prop-types";
import PreventExitChatbotModal from "./PreventExitChatbotModal";
import { isMobile, toNumber } from "./Utils";
import { getDesignTypeClassName } from "v2/utils/designTypeChrome";
import "v2/assets/css/bot/preview-chat-bot.css";

const VERTICAL_POSITION = 2;
const ICON_CHEVRON_CIRCLE_UP = "chevron-circle-up";
const ICON_CHEVRON_CIRCLE_DOWN = "chevron-circle-down";
const ICON_CHEVRON_CIRCLE_LEFT = "chevron-circle-left";
const ICON_CHEVRON_CIRCLE_RIGHT = "chevron-circle-right";
const ALT_BOT_HEADER_ICON = "bot-header-icon";

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

  const position = isMobile()
    ? toNumber(botConfig?.positionSp, 1)
    : toNumber(botConfig?.positionPc, 1);
  const isVerticalPosition = position === VERTICAL_POSITION;

  let headerArrowIcon = ICON_CHEVRON_CIRCLE_UP;
  if (isVerticalPosition) {
    headerArrowIcon = isOpen ? ICON_CHEVRON_CIRCLE_RIGHT : ICON_CHEVRON_CIRCLE_LEFT;
  } else if (isOpen) {
    headerArrowIcon = ICON_CHEVRON_CIRCLE_DOWN;
  }

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
              <img src={headerIconSrc} alt={ALT_BOT_HEADER_ICON} />
            ) : null}
          </div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-sub-title">{subtitle}</div>
            <div className="sp-header-left-label-title">{titleBubble}</div>
          </div>
        </div>
        <div className="sp-header-right" onClick={onHeaderClick}>
          <div className="sp-header-right-arrow">
            <MDBIcon fas icon={headerArrowIcon} />
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
