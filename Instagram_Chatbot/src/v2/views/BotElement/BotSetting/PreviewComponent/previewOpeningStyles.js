import { EC_CHATBOT_URL } from "v2/variables/constants";
import { isMobile } from "./Utils";
import { resolveIconUrl } from "v2/views/DesignSetting/utils/designChatbotUtils";

/**
 * Relative icon path used by runtime previews (prefixed with EC_CHATBOT_URL by callers).
 */
export const getBotHeaderIconPath = (botInfor, isOpen) => {
  if (isOpen) {
    return botInfor?.opening_bot_icon?.url || botInfor?.icon?.url;
  }
  return botInfor?.closing_bot_icon?.url || botInfor?.icon?.url;
};

/**
 * Absolute/resolvable icon URL used by scenario editor previews.
 */
export const getBotHeaderIconUrl = (botInfor, isOpen) => {
  if (isOpen) {
    return (
      resolveIconUrl(botInfor?.opening_bot_icon) ||
      resolveIconUrl(botInfor?.icon)
    );
  }
  return (
    resolveIconUrl(botInfor?.closing_bot_icon) ||
    resolveIconUrl(botInfor?.icon)
  );
};

export const resolveHeaderIconSrc = (botInfor, isOpen, { absolute = false } = {}) => {
  if (absolute) {
    return getBotHeaderIconUrl(botInfor, isOpen);
  }
  const path = getBotHeaderIconPath(botInfor, isOpen);
  return path ? `${EC_CHATBOT_URL}${path}` : "";
};

/**
 * Open-frame layout tokens for PreviewOpenChatFrame (CSS classes + CSS variables).
 *
 * @param {object} state - preview reducer state
 * @param {object} [options]
 * @param {boolean} [options.mobile] - override isMobile(); defaults to isMobile()
 * @param {boolean} [options.embedded]
 * @param {boolean} [options.editorPreview]
 * @returns {{ frameClassName: string, cssVars: Record<string, string|number> }}
 */
export const getOpeningBotStyle = (state, options = {}) => {
  const { embedded = false, editorPreview = false } = options;
  const mobile =
    typeof options.mobile === "boolean" ? options.mobile : isMobile();

  const headerBg =
    state.botInfor?.main_color || state.botInfor?.main_color_other || "";
  const bodyBg = state.botInfor?.opacity_color || "";

  if (embedded) {
    const classNames = [
      "preview-open-frame",
      "preview-open-frame--embedded",
      editorPreview ? "preview-open-frame--editor" : null,
    ].filter(Boolean);

    return {
      frameClassName: classNames.join(" "),
      cssVars: {
        ...(bodyBg ? { "--pof-body-bg": bodyBg } : {}),
      },
    };
  }

  const right = mobile
    ? state.isOpen
      ? "0px"
      : `${state.rightMarginSp}px`
    : `${state.rightMarginPc}px`;
  const width = mobile ? `${state.widthSp}%` : `${state.widthPc}px`;
  let height = mobile ? `${state.heightSp}%` : `${state.heightPc}px`;

  const classNames = [
    "preview-open-frame",
    "preview-open-frame--fixed",
    mobile ? "preview-open-frame--mobile" : "preview-open-frame--desktop",
  ];

  if (!state.activePopupCloseBot) {
    classNames.push("preview-open-frame--no-exit-popup");
    height = mobile
      ? `${state.heightSp || 100}%`
      : `${state.heightPc || 600}px`;
  }

  return {
    frameClassName: classNames.join(" "),
    cssVars: {
      "--pof-right": right,
      "--pof-width": width,
      "--pof-height": height,
      ...(headerBg ? { "--pof-header-bg": headerBg } : {}),
      ...(bodyBg ? { "--pof-body-bg": bodyBg } : {}),
    },
  };
};
