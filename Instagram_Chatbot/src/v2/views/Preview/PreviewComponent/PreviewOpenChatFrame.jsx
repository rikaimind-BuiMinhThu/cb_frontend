import React, { useEffect, useMemo, useRef, useState } from "react";
import { MDBIcon } from "mdbreact";
import PropTypes from "prop-types";
import PreventExitChatbotModal from "./PreventExitChatbotModal";
import { isMobile, toNumber } from "./Utils";
import { getDesignTypeClassName } from "v2/utils/designTypeChrome";
import { HEADER_CHROME_LOGO } from "v2/views/DesignSetting/constants/designThemeConstants";
import { PreviewThemeContext } from "./PreviewThemeContext";
import "v2/assets/css/bot/preview-chat-bot.css";

const VERTICAL_POSITION = 2;
const ICON_CHEVRON_CIRCLE_UP = "chevron-circle-up";
const ICON_CHEVRON_CIRCLE_DOWN = "chevron-circle-down";
const ICON_CHEVRON_CIRCLE_LEFT = "chevron-circle-left";
const ICON_CHEVRON_CIRCLE_RIGHT = "chevron-circle-right";
const ICON_TIMES = "times";
const ALT_BOT_HEADER_ICON = "bot-header-icon";
const OPEN_ANIMATION_FALLBACK_MS = 1200;
const HEADER_CLASS_BASE = "sp-header preview-open-frame__header";
const HEADER_CLASS_LOGO = "sp-header--logo";

const OPEN_ANIMATION_CLASS_NAMES = [
  "slideUp",
  "slideUpSp",
  "fadeIn",
  "fadeInSp",
  "zoomIn",
  "zoomInSp",
  "slideFromRight",
  "slideFromRightSp",
  "expandFromCorner",
  "expandFromCornerSp",
];

const OPEN_ANIMATION_CLASS_SET = new Set(OPEN_ANIMATION_CLASS_NAMES);

const stripOpenAnimationClasses = (className) => (
  String(className || "")
    .split(/\s+/)
    .filter((token) => token && !OPEN_ANIMATION_CLASS_SET.has(token))
    .join(" ")
);

const applyCssVars = (element, cssVars = {}) => {
  if (!element) return;
  Object.entries(cssVars).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      element.style.removeProperty(key);
      return;
    }
    if (element.style.getPropertyValue(key) === String(value)) return;
    element.style.setProperty(key, String(value));
  });
};

const resolveHeaderArrowIcon = (isVerticalPosition, isOpen, isLogoChrome) => {
  if (isLogoChrome && isOpen) return ICON_TIMES;
  if (isVerticalPosition) {
    return isOpen ? ICON_CHEVRON_CIRCLE_RIGHT : ICON_CHEVRON_CIRCLE_LEFT;
  }
  if (isOpen) return ICON_CHEVRON_CIRCLE_DOWN;
  return ICON_CHEVRON_CIRCLE_UP;
};

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
  themeSettings = null,
  children,
}) => {
  const [openAnimationDone, setOpenAnimationDone] = useState(false);
  const localRef = useRef(null);

  const setContainerRef = (node) => {
    localRef.current = node;
    if (typeof containerRef === "function") {
      containerRef(node);
      return;
    }
    if (containerRef) {
      containerRef.current = node;
    }
  };

  const mergedCssVars = useMemo(() => ({
    ...cssVars,
    ...(themeSettings?.headerBgColor
      ? { "--pof-header-bg": themeSettings.headerBgColor }
      : {}),
    ...(themeSettings?.headerLogoImage
      ? { "--c-header-logo-image": `url("${themeSettings.headerLogoImage}")` }
      : {}),
  }), [cssVars, themeSettings?.headerBgColor, themeSettings?.headerLogoImage]);

  useEffect(() => {
    setOpenAnimationDone(false);
  }, [containerClassName]);

  useEffect(() => {
    applyCssVars(localRef.current, mergedCssVars);
  }, [mergedCssVars]);

  useEffect(() => {
    if (openAnimationDone) return undefined;
    const timeoutId = window.setTimeout(() => {
      setOpenAnimationDone(true);
    }, OPEN_ANIMATION_FALLBACK_MS);
    return () => window.clearTimeout(timeoutId);
  }, [openAnimationDone, containerClassName]);

  const designTypeClass = getDesignTypeClassName(
    designType || botConfig?.botInfor?.design_type,
  );
  const resolvedContainerClassName = openAnimationDone
    ? stripOpenAnimationClasses(containerClassName)
    : containerClassName;
  const className = [resolvedContainerClassName, frameClassName, designTypeClass]
    .filter(Boolean)
    .join(" ");

  const position = isMobile()
    ? toNumber(botConfig?.positionSp, 1)
    : toNumber(botConfig?.positionPc, 1);
  const isVerticalPosition = position === VERTICAL_POSITION;
  const isLogoChrome = themeSettings?.headerChrome === HEADER_CHROME_LOGO;
  const headerArrowIcon = resolveHeaderArrowIcon(
    isVerticalPosition,
    isOpen,
    isLogoChrome,
  );
  const headerClassName = [HEADER_CLASS_BASE, isLogoChrome ? HEADER_CLASS_LOGO : ""]
    .filter(Boolean)
    .join(" ");

  const handleOpenAnimationEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    setOpenAnimationDone(true);
  };

  return (
    <PreviewThemeContext.Provider value={themeSettings}>
      <div
        ref={setContainerRef}
        id="sp-container1"
        className={className}
        onAnimationEnd={handleOpenAnimationEnd}
      >
        {overlays}
        <div id="sp-header" className={headerClassName}>
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
    </PreviewThemeContext.Provider>
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
  themeSettings: PropTypes.object,
  children: PropTypes.node,
};

export default PreviewOpenChatFrame;
