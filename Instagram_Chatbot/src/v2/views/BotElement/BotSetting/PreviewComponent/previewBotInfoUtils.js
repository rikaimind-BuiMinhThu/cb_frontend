import iconMessageBlue from "assets/img/icon-mess/icon-message-chat-blue.png";
import iconMessageGreen from "assets/img/icon-mess/icon-message-chat-green.png";
import iconMessageOrange from "assets/img/icon-mess/icon-message-chat-orange.png";
import iconMessageYellow from "assets/img/icon-mess/icon-message-chat-yellow.png";
import iconMessagePink from "assets/img/icon-mess/icon-message-chat-pink.png";
import iconMessagePurple from "assets/img/icon-mess/icon-message-chat-purple.png";
import iconMessageBlack from "assets/img/icon-mess/icon-message-chat-black.png";
import iconMessageWhite from "assets/img/icon-mess/icon-message-chat-white.png";
import { lightenColor } from "./Utils";

/**
 * Maps chatbot main_color from a scenario preview API response into palette fields.
 * Mutates yellow/pink/purple named colors to hex on res.data.chatbot (legacy behavior).
 */
export const getBotInforFromPreviewResponse = (res) => {
  if (!res || !res.data || !res.data.chatbot) return {};

  let opacity_color;
  let message_color;
  let font_color;
  let icon_mess;
  if (res.data.chatbot.main_color === "blue") {
    opacity_color = "#D6E0EF";
    message_color = "#3CACEF";
    font_color = "#fff";
    icon_mess = iconMessageBlue;
  } else if (res.data.chatbot.main_color === "green") {
    opacity_color = "#DEEADB";
    message_color = "#9DDB7C";
    font_color = "#fff";
    icon_mess = iconMessageGreen;
  } else if (res.data.chatbot.main_color === "orange") {
    opacity_color = "#F4E5DA";
    message_color = "#EF8D2F";
    font_color = "#fff";
    icon_mess = iconMessageOrange;
  } else if (res.data.chatbot.main_color === "yellow") {
    opacity_color = "#F0EFEB";
    message_color = "#F3AA2D";
    res.data.chatbot.main_color = "#F6CA21";
    font_color = "#fff";
    icon_mess = iconMessageYellow;
  } else if (res.data.chatbot.main_color === "pink") {
    opacity_color = "#EBDDE3";
    message_color = "#E65B83";
    res.data.chatbot.main_color = "#F170AA";
    font_color = "#fff";
    icon_mess = iconMessagePink;
  } else if (res.data.chatbot.main_color === "purple") {
    opacity_color = "#E9E8F1";
    message_color = "#AF82D5";
    res.data.chatbot.main_color = "#8C66D9";
    font_color = "#fff";
    icon_mess = iconMessagePurple;
  } else if (res.data.chatbot.main_color === "black") {
    opacity_color = "#ecede8";
    message_color = "#c3c3c3";
    font_color = "#000";
    icon_mess = iconMessageBlack;
  } else if (res.data.chatbot.main_color === "white") {
    opacity_color = "#fff";
    message_color = "#F5F5F5";
    font_color = "#000";
    icon_mess = iconMessageWhite;
  } else if (res.data.chatbot.main_color_other) {
    opacity_color = lightenColor(res.data.chatbot.main_color_other, 0.1);
    message_color = res.data.chatbot.main_color_other;
    font_color = "#fff";
  }

  return {
    ...res.data.chatbot,
    opacity_color,
    message_color,
    font_color,
    icon_mess,
    main_color: res.data.chatbot.main_color || res.data.chatbot.main_color_other,
    main_color_other: res.data.chatbot.main_color_other,
    // Bug #5: giữ title Basic Information trên botInfor để header mở bind đúng (không chỉ titleBubble).
    title: res.data.chatbot.title,
    titleBubble: res.data.design_settings.title_bubble,
  };
};
