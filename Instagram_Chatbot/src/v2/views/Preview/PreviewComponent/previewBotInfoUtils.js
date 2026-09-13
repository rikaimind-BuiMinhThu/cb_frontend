import iconMessageBlue from "v2/views/Preview/images/icon-mess/icon-message-chat-blue.png";
import iconMessageGreen from "v2/views/Preview/images/icon-mess/icon-message-chat-green.png";
import iconMessageOrange from "v2/views/Preview/images/icon-mess/icon-message-chat-orange.png";
import iconMessageYellow from "v2/views/Preview/images/icon-mess/icon-message-chat-yellow.png";
import iconMessagePink from "v2/views/Preview/images/icon-mess/icon-message-chat-pink.png";
import iconMessagePurple from "v2/views/Preview/images/icon-mess/icon-message-chat-purple.png";
import iconMessageBlack from "v2/views/Preview/images/icon-mess/icon-message-chat-black.png";
import iconMessageWhite from "v2/views/Preview/images/icon-mess/icon-message-chat-white.png";
import { lightenColor } from "./Utils";

const MAIN_COLOR_PALETTES = {
  blue: {
    opacity_color: "#D6E0EF",
    message_color: "#3CACEF",
    font_color: "#fff",
    icon_mess: iconMessageBlue,
  },
  green: {
    opacity_color: "#DEEADB",
    message_color: "#9DDB7C",
    font_color: "#fff",
    icon_mess: iconMessageGreen,
  },
  orange: {
    opacity_color: "#F4E5DA",
    message_color: "#EF8D2F",
    font_color: "#fff",
    icon_mess: iconMessageOrange,
  },
  yellow: {
    opacity_color: "#F0EFEB",
    message_color: "#F3AA2D",
    font_color: "#fff",
    icon_mess: iconMessageYellow,
  },
  pink: {
    opacity_color: "#EBDDE3",
    message_color: "#E65B83",
    font_color: "#fff",
    icon_mess: iconMessagePink,
  },
  purple: {
    opacity_color: "#E9E8F1",
    message_color: "#AF82D5",
    font_color: "#fff",
    icon_mess: iconMessagePurple,
  },
  black: {
    opacity_color: "#ecede8",
    message_color: "#c3c3c3",
    font_color: "#000",
    icon_mess: iconMessageBlack,
  },
  white: {
    opacity_color: "#fff",
    message_color: "#F5F5F5",
    font_color: "#000",
    icon_mess: iconMessageWhite,
  },
};

const MAIN_COLOR_HEX_OVERRIDES = {
  yellow: "#F6CA21",
  pink: "#F170AA",
  purple: "#8C66D9",
};

const getOtherMainColorPalette = (mainColorOther) => ({
  opacity_color: lightenColor(mainColorOther, 0.1),
  message_color: mainColorOther,
  font_color: "#fff",
});

/**
 * Maps chatbot main_color from a scenario preview API response into palette fields.
 * Mutates yellow/pink/purple named colors to hex on res.data.chatbot (legacy behavior).
 */
export const getBotInforFromPreviewResponse = (res) => {
  if (!res || !res.data || !res.data.chatbot) return {};

  const namedColor = res.data.chatbot.main_color;
  const hexOverride = MAIN_COLOR_HEX_OVERRIDES[namedColor];
  if (hexOverride) {
    res.data.chatbot.main_color = hexOverride;
  }

  const palette = MAIN_COLOR_PALETTES[namedColor]
    || (res.data.chatbot.main_color_other
      ? getOtherMainColorPalette(res.data.chatbot.main_color_other)
      : {});

  return {
    ...res.data.chatbot,
    ...palette,
    main_color: res.data.chatbot.main_color || res.data.chatbot.main_color_other,
    main_color_other: res.data.chatbot.main_color_other,
    titleBubble: res.data.design_settings.title_bubble,
  };
};
