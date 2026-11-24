import {
  getElementMessageById,
  isCombineMessage,
  isUserMessage,
} from "./Utils";

export const USER_ALIGN_BEGINNING_STOP = "user_align_beginning_stop";

export const SP_BODY_SELECTOR = "#sp-body";

export const SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX = 0;

export const SCROLL_MSG_OFFSET_SCROLL_AUTO_PX = 200;

export const ALIGN_BEGINNING_SCROLL_DELAY_MS = 300;

export const ALIGN_BEGINNING_IMAGE_READY_TIMEOUT_MS = 2000;

export const ALIGN_BEGINNING_REALIGN_DELAYS_MS = [0, 100, 400, 1000];

export const SCROLL_AUTO_DELAY_MS = 1000;

export const BOTTOM_SCROLL_DELAY_MS = 300;

export const SCROLL_BEHAVIOR_AUTO = "auto";

export const resolveAlignBeginningMsgId = (message) => {
  if (!message?.[USER_ALIGN_BEGINNING_STOP]) {
    return null;
  }
  if (message.hidden) {
    return null;
  }
  if (!isUserMessage(message) && !isCombineMessage(message)) {
    return null;
  }
  if (message.id) return message.id;
  return null;
};

const resolveAlignMessageElement = (
  msgId,
  containerSelector = SP_BODY_SELECTOR
) => {
  const container = document.querySelector(containerSelector);
  const elementId = getElementMessageById(msgId);
  if (!container || !elementId) {
    return { container: null, element: null };
  }
  const matches = document.querySelectorAll(`#${elementId}`);
  const element = matches[matches.length - 1] || null;
  return { container, element };
};

export const scrollMsgIntoSpBody = ({
  msgId,
  behavior = "smooth",
  containerSelector = SP_BODY_SELECTOR,
}) => {
  const { element } = resolveAlignMessageElement(msgId, containerSelector);
  if (!element) {
    return false;
  }
  element.scrollIntoView({ behavior, block: "start" });
  return true;
};

/**
 * Align the message to the top of the viewport via scrollIntoView.
 * @returns {() => void} cancel function (no-op; kept for call-site compatibility)
 */
export const scrollMsgIntoSpBodyWhenReady = ({
  msgId,
  containerSelector = SP_BODY_SELECTOR,
  onResult,
}) => {
  const scrolled = scrollMsgIntoSpBody({
    msgId,
    behavior: SCROLL_BEHAVIOR_AUTO,
    containerSelector,
  });
  if (onResult) {
    onResult(scrolled);
  }
  return () => {};
};
