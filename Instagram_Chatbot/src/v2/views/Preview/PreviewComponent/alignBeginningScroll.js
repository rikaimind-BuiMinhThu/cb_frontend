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

const IMG_SELECTOR = "img";
const LOAD_EVENT = "load";
const ERROR_EVENT = "error";

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

const collectPendingImagesAtOrAbove = (container, element) => {
  const images = Array.from(container.querySelectorAll(IMG_SELECTOR));
  return images.filter((img) => {
    if (img.complete) {
      return false;
    }
    if (element.contains(img)) {
      return true;
    }
    const position = element.compareDocumentPosition(img);
    return !!(position & Node.DOCUMENT_POSITION_PRECEDING);
  });
};

export const scrollMsgIntoSpBody = ({
  msgId,
  offsetPx = SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX,
  behavior = "smooth",
  containerSelector = SP_BODY_SELECTOR,
}) => {
  const container = document.querySelector(containerSelector);
  const elementId = getElementMessageById(msgId);
  if (!container || !elementId) {
    return false;
  }
  const matches = document.querySelectorAll(`#${elementId}`);
  const element = matches[matches.length - 1] || null;
  if (!element) {
    return false;
  }
  const targetScrollTop =
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    offsetPx;
  container.scrollTo({
    top: targetScrollTop,
    behavior,
  });
  return true;
};

/**
 * Scroll after images in/above the target message have loaded (or readyTimeoutMs).
 * Uses behavior auto and re-aligns while layout settles (tall % images).
 * @returns {() => void} cancel function for listeners / timeout
 */
export const scrollMsgIntoSpBodyWhenReady = ({
  msgId,
  offsetPx = SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX,
  containerSelector = SP_BODY_SELECTOR,
  readyTimeoutMs = ALIGN_BEGINNING_IMAGE_READY_TIMEOUT_MS,
  onResult,
}) => {
  const preciseScrollOptions = {
    msgId,
    offsetPx,
    behavior: SCROLL_BEHAVIOR_AUTO,
    containerSelector,
  };
  const container = document.querySelector(containerSelector);
  const elementId = getElementMessageById(msgId);
  const matches = elementId ? document.querySelectorAll(`#${elementId}`) : [];
  const element = matches[matches.length - 1] || null;

  const lifecycle = {
    cancelled: false,
    imageTimeoutId: null,
    onImageDone: null,
    realignTimerIds: [],
    resizeObserver: null,
    reportedResult: false,
  };

  const runPreciseScroll = () => {
    if (lifecycle.cancelled) {
      return false;
    }
    const scrolled = scrollMsgIntoSpBody(preciseScrollOptions);
    if (!lifecycle.reportedResult && onResult) {
      lifecycle.reportedResult = true;
      onResult(scrolled);
    }
    return scrolled;
  };

  const stopRealign = () => {
    lifecycle.realignTimerIds.forEach((timerId) => clearTimeout(timerId));
    lifecycle.realignTimerIds = [];
    if (lifecycle.resizeObserver) {
      lifecycle.resizeObserver.disconnect();
      lifecycle.resizeObserver = null;
    }
  };

  const startRealignWindow = () => {
    runPreciseScroll();
    ALIGN_BEGINNING_REALIGN_DELAYS_MS.forEach((delayMs) => {
      const timerId = setTimeout(() => {
        runPreciseScroll();
      }, delayMs);
      lifecycle.realignTimerIds.push(timerId);
    });
    if (typeof ResizeObserver === "undefined" || !element) {
      return;
    }
    lifecycle.resizeObserver = new ResizeObserver(() => {
      runPreciseScroll();
    });
    lifecycle.resizeObserver.observe(element);
    if (container) {
      lifecycle.resizeObserver.observe(container);
    }
    const stopTimerId = setTimeout(() => {
      stopRealign();
    }, readyTimeoutMs);
    lifecycle.realignTimerIds.push(stopTimerId);
  };

  if (!container || !element) {
    if (onResult) {
      onResult(false);
    }
    return () => {};
  }

  const pendingImages = collectPendingImagesAtOrAbove(container, element);
  if (pendingImages.length === 0) {
    startRealignWindow();
    return () => {
      lifecycle.cancelled = true;
      stopRealign();
    };
  }

  const detachImageListeners = () => {
    if (!lifecycle.onImageDone) {
      return;
    }
    pendingImages.forEach((img) => {
      img.removeEventListener(LOAD_EVENT, lifecycle.onImageDone);
      img.removeEventListener(ERROR_EVENT, lifecycle.onImageDone);
    });
  };

  const finishWaitingForImages = () => {
    if (lifecycle.cancelled) {
      return;
    }
    detachImageListeners();
    if (lifecycle.imageTimeoutId !== null) {
      clearTimeout(lifecycle.imageTimeoutId);
      lifecycle.imageTimeoutId = null;
    }
    startRealignWindow();
  };

  lifecycle.onImageDone = () => {
    const stillPending = pendingImages.some((img) => !img.complete);
    if (!stillPending) {
      finishWaitingForImages();
    }
  };

  pendingImages.forEach((img) => {
    img.addEventListener(LOAD_EVENT, lifecycle.onImageDone);
    img.addEventListener(ERROR_EVENT, lifecycle.onImageDone);
  });
  lifecycle.imageTimeoutId = setTimeout(finishWaitingForImages, readyTimeoutMs);

  return () => {
    lifecycle.cancelled = true;
    detachImageListeners();
    if (lifecycle.imageTimeoutId !== null) {
      clearTimeout(lifecycle.imageTimeoutId);
      lifecycle.imageTimeoutId = null;
    }
    stopRealign();
  };
};
