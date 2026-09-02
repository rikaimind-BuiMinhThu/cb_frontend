import {
  computeOpenIframeSize,
  formatClosedIframeSize,
  formatOpenIframeSize,
  getClosedIframeDimensions,
} from '../../utils/sdkLayoutUtils.js';
import { chatbotLayout } from '../state.js';
import { mobileCheck } from '../device.js';

const resolveOffsetPx = (primaryValue, fallbackValue, defaultValue = 0) => {
  const primaryParsed = parseInt(primaryValue, 10);
  if (Number.isFinite(primaryParsed)) return primaryParsed;

  const fallbackParsed = parseInt(fallbackValue, 10);
  if (Number.isFinite(fallbackParsed)) return fallbackParsed;

  return defaultValue;
};

const parseHorizontalMarginRule = (value) => {
  if (value === undefined || value === null) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  const widthExpr = /^(?:width|innerwidth|innerWidth|clientwidth|clientWidth)\s*\(\s*\)\s*-\s*(\d+)\s*$/i;
  const match = raw.match(widthExpr);
  if (match) {
    const leftPx = parseInt(match[1], 10);
    return Number.isFinite(leftPx)
      ? { mode: 'left', leftPx, rightPx: 0 }
      : null;
  }

  const leadingNumber = parseInt(raw, 10);
  if (Number.isFinite(leadingNumber)) {
    const normalized = raw.replace(/^0+(\d)/, '$1');
    const looksNumeric =
      /^-?\d+$/.test(raw) ||
      normalized.startsWith(String(leadingNumber)) ||
      raw.startsWith(String(leadingNumber));

    if (looksNumeric) {
      if (leadingNumber < 0) {
        return { mode: 'left', leftPx: Math.abs(leadingNumber), rightPx: 0 };
      }
      return { mode: 'right', rightPx: leadingNumber, leftPx: 0 };
    }
  }

  return null;
};

const resolveHorizontalMarginRule = (primaryValue, fallbackValue) => (
  parseHorizontalMarginRule(primaryValue) ||
  parseHorizontalMarginRule(fallbackValue) ||
  { mode: 'right', rightPx: 0, leftPx: 0 }
);

export const applyIframeHorizontalAnchor = (iframe, rule) => {
  if (!iframe || !rule) return;

  if (rule.mode === 'left') {
    iframe.style.setProperty('left', `${rule.leftPx}px`, 'important');
    iframe.style.setProperty('right', 'auto', 'important');
    return;
  }

  iframe.style.setProperty('right', `${rule.rightPx}px`, 'important');
  iframe.style.setProperty('left', 'auto', 'important');
};

const resetIframeHorizontalForFullBleed = (iframe) => {
  if (!iframe) return;
  iframe.style.setProperty('left', '0px', 'important');
  iframe.style.setProperty('right', '0px', 'important');
};

export const getMobileCloseOffsets = () => ({
  horizontal: resolveHorizontalMarginRule(chatbotLayout.chatbotRightSp, chatbotLayout.chatbotRight),
  bottom: resolveOffsetPx(chatbotLayout.chatbotBottomSp, chatbotLayout.chatbotBottom, 0),
});

export const getDesktopOffsets = () => ({
  horizontal: resolveHorizontalMarginRule(chatbotLayout.chatbotRightPc, chatbotLayout.chatbotRight),
  bottom: resolveOffsetPx(chatbotLayout.chatbotBottomPc, chatbotLayout.chatbotBottom, 0),
});

export const getUseMobileFullwidth = (messageData) => {
  if (typeof messageData.useMoblieFullwidth === 'boolean') {
    return messageData.useMoblieFullwidth;
  }
  return sessionStorage.getItem('useFullwidthChatbotMobile') === 'true';
};

export const getClosedContentDimensions = (messageData, useMoblieFullwidth) => (
  getClosedIframeDimensions({
    closedContentWidth: messageData?.closedContentWidth,
    closedContentHeight: messageData?.closedContentHeight,
    isMobile: mobileCheck(),
    useFullWidthMobile: useMoblieFullwidth,
  })
);

export const getOpenDimensions = (messageData, isMobileDevice) => (
  computeOpenIframeSize({
    isMobile: isMobileDevice,
    widthPc: messageData?.widthPc ?? chatbotLayout.chatbotW,
    heightPc: messageData?.heightPc ?? chatbotLayout.chatbotH,
    widthSp: messageData?.widthSp ?? chatbotLayout.chatbotW,
    heightSp: messageData?.heightSp ?? chatbotLayout.chatbotH,
  })
);

const applyIframeLayout = (iframe, width, height, options = {}) => {
  iframe.width = width;
  iframe.height = height;
  iframe.style.setProperty('width', width, 'important');
  iframe.style.setProperty('height', height, 'important');

  if (options.bottom !== undefined) {
    iframe.style.setProperty('bottom', options.bottom, 'important');
  }

  if (options.resetHorizontal) {
    resetIframeHorizontalForFullBleed(iframe);
    return;
  }

  if (options.horizontalRule) {
    applyIframeHorizontalAnchor(iframe, options.horizontalRule);
  }
};

export const resizeIframeFromMessage = (iframe, messageData) => {
  if (messageData.isOpen === undefined) return;

  const useMoblieFullwidth = getUseMobileFullwidth(messageData);

  if (messageData.isOpen && mobileCheck()) {
    const openDimensions = getOpenDimensions(messageData, true);
    applyIframeLayout(iframe, openDimensions.width, openDimensions.height, {
      bottom: '0px',
      resetHorizontal: true,
    });
    return;
  }

  if (messageData.isOpen) {
    const desktopOpenOffsets = getDesktopOffsets();
    const openDimensions = getOpenDimensions(messageData, false);
    const formatted = formatOpenIframeSize({
      openDimensions,
      horizontalRule: desktopOpenOffsets.horizontal,
      bottomPx: desktopOpenOffsets.bottom,
      isMobile: false,
    });
    applyIframeLayout(iframe, formatted.width, formatted.height, {
      bottom: '0px',
      horizontalRule: desktopOpenOffsets.horizontal,
    });
    return;
  }

  if (!messageData.isOpen && mobileCheck()) {
    const mobileOffsets = getMobileCloseOffsets();
    const contentDimensions = getClosedContentDimensions(messageData, useMoblieFullwidth);
    const formatted = formatClosedIframeSize(
      contentDimensions,
      mobileOffsets.horizontal,
      mobileOffsets.bottom,
    );
    applyIframeLayout(iframe, formatted.width, formatted.height, {
      bottom: `${mobileOffsets.bottom}px`,
      horizontalRule: mobileOffsets.horizontal,
    });
    return;
  }

  if (!messageData.isOpen) {
    const desktopCloseOffsets = getDesktopOffsets();
    const contentDimensions = getClosedContentDimensions(messageData, useMoblieFullwidth);
    const formatted = formatClosedIframeSize(
      contentDimensions,
      desktopCloseOffsets.horizontal,
      desktopCloseOffsets.bottom,
    );
    applyIframeLayout(iframe, formatted.width, formatted.height, {
      bottom: '0px',
      horizontalRule: desktopCloseOffsets.horizontal,
    });
  }
};

export { formatClosedIframeSize };
