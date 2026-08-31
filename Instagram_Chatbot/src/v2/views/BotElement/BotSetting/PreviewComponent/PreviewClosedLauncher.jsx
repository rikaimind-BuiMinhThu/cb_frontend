import React from "react";
import { DISPLAY_TYPES } from "./Constants";
import { getClosedLauncherPosition } from "v2/utils/sdkLayoutUtils";
import "v2/assets/css/bot/preview-chat-bot.css";

const buildPositionVars = (position = {}) => ({
  ...(position.bottom != null ? { "--pcl-bottom": position.bottom } : {}),
  ...(position.right != null ? { "--pcl-right": position.right } : {}),
  ...(position.left != null ? { "--pcl-left": position.left } : {}),
  ...(position.top != null ? { "--pcl-top": position.top } : {}),
});

/**
 * Closed chatbot launcher: circular avatar only.
 * Layout lives in CSS; only dynamic tokens (color, position) use CSS variables.
 */
const PreviewClosedLauncher = ({
  state,
  headerIconSrc,
  onOpen,
  isMobileView,
  spCircleUseParentOffsets = false,
  hideWhenDisplayHidden = true,
}) => {
  if (hideWhenDisplayHidden && state.displayType === DISPLAY_TYPES.HIDDEN) {
    return null;
  }

  if (state.isOpen) {
    return <div />;
  }

  const mainColor = state.botInfor?.main_color || state.botInfor?.main_color_other;
  const colorVars = { "--pcl-bg": mainColor || "#327AED" };
  const toggleOpen = () => onOpen(true);

  const iconImg = headerIconSrc ? (
    <img
      className="preview-closed-launcher__icon-img"
      src={headerIconSrc}
      alt="bot-header-icon"
    />
  ) : null;

  const position = isMobileView
    ? (spCircleUseParentOffsets
      ? { bottom: "0px", right: "0px" }
      : getClosedLauncherPosition(state, { isMobile: true }))
    : getClosedLauncherPosition(state);

  const className = isMobileView
    ? "preview-closed-launcher preview-closed-launcher--circle-sp"
    : "preview-closed-launcher preview-closed-launcher--circle-pc";

  return (
    <div
      className={className}
      onClick={toggleOpen}
      style={{ ...colorVars, ...buildPositionVars(position) }}
    >
      {iconImg}
    </div>
  );
};

export default PreviewClosedLauncher;
