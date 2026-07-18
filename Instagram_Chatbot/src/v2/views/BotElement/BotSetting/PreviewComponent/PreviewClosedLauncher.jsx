import React from "react";
import { MDBIcon } from "mdbreact";
import { DISPLAY_TYPES } from "./Constants";
import { toNumber } from "./Utils";
import { getClosedBarWidth, getClosedLauncherPosition } from "v2/utils/sdkLayoutUtils";
import "v2/assets/css/bot/preview-chat-bot.css";

const buildPositionVars = (position = {}) => ({
  ...(position.bottom != null ? { "--pcl-bottom": position.bottom } : {}),
  ...(position.right != null ? { "--pcl-right": position.right } : {}),
  ...(position.left != null ? { "--pcl-left": position.left } : {}),
  ...(position.top != null ? { "--pcl-top": position.top } : {}),
});

/**
 * Closed chatbot launcher matrix (PC/SP × circle/bar/vertical).
 * Layout lives in CSS; only dynamic tokens (color, size, position) use CSS variables.
 */
const PreviewClosedLauncher = ({
  state,
  headerIconSrc,
  onOpen,
  isMobileView,
  showFallback = false,
  spCircleUseParentOffsets = false,
  requireClosed = true,
  hideWhenDisplayHidden = true,
}) => {
  if (hideWhenDisplayHidden && state.displayType === DISPLAY_TYPES.HIDDEN) {
    return null;
  }

  const positionPc = toNumber(state.positionPc, 1);
  const buttonTypePc = toNumber(state.buttonTypePc, 1);
  const positionSp = toNumber(state.positionSp, 1);
  const buttonTypeSp = toNumber(state.buttonTypeSp, 1);
  const mainColor =
    state.botInfor?.main_color || state.botInfor?.main_color_other;
  const title = state.botInfor?.title;
  const toggleOpen = () => onOpen(!state.isOpen);
  const fullWidthMobile = Boolean(state.useFullWidthChatbotMobile);

  const iconImg = headerIconSrc ? (
    <img
      className="preview-closed-launcher__icon-img"
      src={headerIconSrc}
      alt="bot-header-icon"
    />
  ) : null;

  const avatarImg = headerIconSrc ? (
    <img src={headerIconSrc} alt="bot-header-icon" />
  ) : null;

  const closedOk = !requireClosed || !state.isOpen;
  const colorVars = { "--pcl-bg": mainColor || "#327AED" };

  if (closedOk && !isMobileView && positionPc === 1 && buttonTypePc === 2) {
    const position = getClosedLauncherPosition(state);
    return (
      <div
        className="preview-closed-launcher preview-closed-launcher--circle-pc"
        onClick={toggleOpen}
        style={{ ...colorVars, ...buildPositionVars(position) }}
      >
        {iconImg}
      </div>
    );
  }

  if (closedOk && !isMobileView && positionPc === 1 && buttonTypePc === 1) {
    const position = getClosedLauncherPosition(state);
    return (
      <div
        className="preview-closed-launcher preview-closed-launcher--bar-pc"
        onClick={toggleOpen}
        style={{
          ...colorVars,
          "--pcl-width": getClosedBarWidth(state, false),
          ...buildPositionVars(position),
        }}
      >
        <div className="sp-header-left-bt" onClick={toggleOpen}>
          <div className="sp-header-left-avatar sp-avatar-bt">{avatarImg}</div>
        </div>
        <div className="preview-closed-launcher__bar-title">
          <div id="comment_bubble" className="preview-closed-launcher__bar-bubble">
            <span className="preview-closed-launcher__bar-title-text">{title}</span>
          </div>
        </div>
        <div className="sp-header-right-arrow preview-closed-launcher__bar-arrow">
          <MDBIcon fas icon="chevron-circle-up" />
        </div>
      </div>
    );
  }

  if (closedOk && !isMobileView && positionPc === 2) {
    const position = getClosedLauncherPosition(state, { variant: "vertical" });
    return (
      <div
        className="preview-closed-launcher preview-closed-launcher--vertical-pc"
        onClick={toggleOpen}
        style={{ ...colorVars, ...buildPositionVars(position) }}
      >
        <div className="sp-header-left" onClick={toggleOpen}>
          <div className="sp-header-left-avatar sp-avatar">{avatarImg}</div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-title">{state.rightPcTitle}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!state.isOpen && isMobileView && positionSp === 1 && buttonTypeSp === 2) {
    const position = spCircleUseParentOffsets
      ? { bottom: "0px", right: "0px" }
      : getClosedLauncherPosition(state, { isMobile: true });
    return (
      <div
        className="preview-closed-launcher preview-closed-launcher--circle-sp"
        onClick={toggleOpen}
        style={{ ...colorVars, ...buildPositionVars(position) }}
      >
        {iconImg}
      </div>
    );
  }

  if (!state.isOpen && isMobileView && positionSp === 1 && buttonTypeSp === 1) {
    const position = getClosedLauncherPosition(state, { isMobile: true });
    return (
      <div
        className={`preview-closed-launcher preview-closed-launcher--bar-sp${
          fullWidthMobile ? " preview-closed-launcher--bar-sp-fullwidth fullwidth_mobile_chatbot" : ""
        }`}
        onClick={toggleOpen}
        style={{
          ...colorVars,
          "--pcl-width": getClosedBarWidth(state, true),
          ...buildPositionVars(position),
        }}
      >
        <div
          className={`sp-header-left preview-closed-launcher__sp-bar-left${
            fullWidthMobile ? "" : " preview-closed-launcher__sp-bar-left--padded"
          }`}
        >
          <div
            className={
              fullWidthMobile
                ? "fullwidth_mobile_chatbot sp-header-left-avatar sp-avatar preview-closed-launcher__sp-avatar--full"
                : "sp-header-left-avatar sp-avatar preview-closed-launcher__sp-avatar"
            }
          >
            {avatarImg}
          </div>
          <div>
            <div id="comment_bubble" className="sp-bubble">
              <span
                className={
                  fullWidthMobile
                    ? "preview-closed-launcher__sp-title--full"
                    : "preview-closed-launcher__sp-title"
                }
              >
                {title}
              </span>
            </div>
          </div>
          <div className="sp-header-right-arrow preview-closed-launcher__sp-arrow">
            <MDBIcon fas icon="chevron-circle-up" />
          </div>
        </div>
      </div>
    );
  }

  if (!state.isOpen && isMobileView && positionSp === 2) {
    const position = getClosedLauncherPosition(state, {
      isMobile: true,
      variant: "vertical",
    });
    return (
      <div
        className="preview-closed-launcher preview-closed-launcher--vertical-sp"
        onClick={toggleOpen}
        style={{ ...colorVars, ...buildPositionVars(position) }}
      >
        <div className="sp-header-left">
          <div className="sp-header-left-avatar sp-avatar">{avatarImg}</div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-title">{state.rightSpTitle}</div>
          </div>
        </div>
      </div>
    );
  }

  if (showFallback && !state.isOpen) {
    const position = isMobileView
      ? { bottom: "0px", right: "0px" }
      : {
          bottom: `${toNumber(state.bottomMarginPc, 10)}px`,
          right: `${toNumber(state.rightMarginPc, 10)}px`,
        };
    return (
      <div
        className="preview-closed-launcher preview-closed-launcher--fallback"
        onClick={() => onOpen(true)}
        style={{ ...colorVars, ...buildPositionVars(position) }}
      >
        {iconImg}
      </div>
    );
  }

  return <div />;
};

export default PreviewClosedLauncher;
