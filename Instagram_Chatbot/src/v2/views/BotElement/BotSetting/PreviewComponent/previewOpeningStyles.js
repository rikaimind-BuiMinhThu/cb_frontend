import { EC_CHATBOT_URL } from "v2/variables/constants";
import { isMobile } from "./Utils";
import { resolveIconUrl, resolveMainColorContext } from "../DesignSetting/utils/designChatbotUtils";
import { resolveHeaderBgColor } from "../DesignSetting/utils/designThemeUtils";

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
 * Bug #1: Header chatbot thật không có nền — SDK/embedded phải set --pof-header-bg
 * (trước đây chỉ preview admin có nền, chatbot thật fallback transparent).
 * Bug #6: Main color header không đổi màu header thật — dùng headerBgColor, không bind buttonNormalBgColor.
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

  const { mainColorHex } = resolveMainColorContext(state.botInfor);
  // Bug #1 / #6: nền header từ theme.headerBgColor (Main color header), fallback #327AED.
  const headerBg = resolveHeaderBgColor(state.themeSettings, mainColorHex);
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
        // Bug #1: embedded/SDK trước đây không set --pof-header-bg → header trong suốt.
        // CSS đọc --c-header-bg trước, rồi --pof-header-bg; set cả hai để cùng một màu.
        "--pof-header-bg": headerBg,
        "--c-header-bg": headerBg,
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
      // Bug #1 / #6: chatbot đang mở cũng phải set cả hai var (không chỉ preview).
      // CSS: var(--c-header-bg, var(--pof-header-bg, #327AED)).
      "--pof-header-bg": headerBg,
      "--c-header-bg": headerBg,
      ...(bodyBg ? { "--pof-body-bg": bodyBg } : {}),
    },
  };
};
