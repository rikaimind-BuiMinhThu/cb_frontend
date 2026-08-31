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
 *
 * Không ép mọi bot về avatar tròn. Bug #12 chỉ sửa nhánh circle
 * (position=1, buttonType=2): avatar 56px / iframe vừa avatar.
 * Bar (title + bubble + mũi tên) và vertical (mép phải, xoay -90°) giữ nguyên.
 *
 * Callers vẫn truyền:
 * - showFallback: FAQ dùng true (circle dự phòng nếu không khớp matrix)
 * - requireClosed: FAQ true = chỉ hiện khi đóng; Fukushashiki false
 *
 * Layout ở CSS; token động (màu, size bar, vị trí) dùng CSS variables.
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

  // requireClosed=false → PC vẫn render launcher chrome theo type (caller Fukushashiki).
  // requireClosed=true  → chỉ hiện khi chatbot đang đóng (caller FAQ).
  const closedOk = !requireClosed || !state.isOpen;
  const colorVars = { "--pcl-bg": mainColor || "#327AED" };

  // PC circle: position=1 + buttonType=2 → avatar 56×56 (Bug #12 chỉ đụng nhánh này).
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

  // PC bar: position=1 + buttonType=1 → avatar + title/bubble + mũi tên.
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

  // PC vertical: position=2 → tab mép phải, xoay -90°.
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

  // SP circle: giống PC circle, 56×56. spCircleUseParentOffsets = FAQ neo 0,0 trong iframe.
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

  // SP bar: compact 240×48, hoặc full-width mobile 100% × 75.
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

  // SP vertical: tab mép phải trên mobile.
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

  // FAQ: nếu không khớp circle/bar/vertical thì vẫn hiện circle dự phòng khi đóng.
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
