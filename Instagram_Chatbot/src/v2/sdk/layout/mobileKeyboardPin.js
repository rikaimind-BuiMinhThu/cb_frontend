import { mobileCheck } from '../device.js';

const PINNED_STYLE_PROPS = ['position', 'top', 'left', 'right', 'bottom', 'width', 'height'];
const KEYBOARD_OPEN_THRESHOLD_PX = 150;

let listenersAttached = false;
let pinRafId = null;
let pinnedIframe = null;
let savedStyles = null;
let chatIsOpen = false;
let lastPostedInset = null;

const isKeyboardOpen = () => {
  const viewport = window.visualViewport;
  if (!viewport) return false;
  return document.documentElement.clientHeight - viewport.height > KEYBOARD_OPEN_THRESHOLD_PX;
};

const getKeyboardInset = () => {
  const root = document.documentElement;
  const layoutHeight = Math.max(root.clientHeight, 1);
  const vv = window.visualViewport;
  const visibleHeight = Math.round(vv?.height || window.innerHeight || layoutHeight);
  return Math.max(0, layoutHeight - visibleHeight);
};

const postKeyboardInset = (iframe, keyboardInset) => {
  if (!iframe?.contentWindow) return;
  if (lastPostedInset === keyboardInset) return;
  lastPostedInset = keyboardInset;
  try {
    iframe.contentWindow.postMessage({
      source: 'ec-chatbot-sdk',
      action: 'mobile_viewport',
      keyboardInset,
    }, '*');
  } catch {
    // Cross-origin or unloaded iframe: ignore.
  }
};

const saveIframeStyles = (iframe) => {
  savedStyles = PINNED_STYLE_PROPS.map((prop) => ({
    prop,
    value: iframe.style.getPropertyValue(prop),
    priority: iframe.style.getPropertyPriority(prop),
  }));
};

const restoreIframeStyles = () => {
  if (!pinnedIframe || !savedStyles) return;
  savedStyles.forEach(({ prop, value, priority }) => {
    if (value) {
      pinnedIframe.style.setProperty(prop, value, priority);
      return;
    }
    pinnedIframe.style.removeProperty(prop);
  });
  savedStyles = null;
};

const applyPin = (iframe) => {
  const root = document.documentElement;
  iframe.style.setProperty('position', 'absolute', 'important');
  iframe.style.setProperty('top', `${window.scrollY}px`, 'important');
  iframe.style.setProperty('left', '0', 'important');
  iframe.style.setProperty('right', 'auto', 'important');
  iframe.style.setProperty('bottom', 'auto', 'important');
  iframe.style.setProperty('width', `${root.clientWidth}px`, 'important');
  iframe.style.setProperty('height', `${root.clientHeight}px`, 'important');
};

const pinTick = () => {
  pinRafId = null;
  if (!pinnedIframe || !mobileCheck() || !chatIsOpen || !isKeyboardOpen()) {
    restoreIframeStyles();
    if (pinnedIframe) {
      postKeyboardInset(pinnedIframe, 0);
    }
    return;
  }
  if (!savedStyles) {
    saveIframeStyles(pinnedIframe);
  }
  applyPin(pinnedIframe);
  postKeyboardInset(pinnedIframe, getKeyboardInset());
};

// Coalesce visualViewport scroll/resize storms into one paint per frame.
const schedulePin = () => {
  if (pinRafId !== null) return;
  pinRafId = window.requestAnimationFrame(pinTick);
};

const attachPinListeners = () => {
  if (listenersAttached) return;
  window.addEventListener('scroll', schedulePin, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', schedulePin);
    window.visualViewport.addEventListener('scroll', schedulePin);
  }
  listenersAttached = true;
};

const detachPinListeners = () => {
  if (!listenersAttached) return;
  window.removeEventListener('scroll', schedulePin);
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', schedulePin);
    window.visualViewport.removeEventListener('scroll', schedulePin);
  }
  listenersAttached = false;
};

/**
 * Watch the open mobile chatbot iframe and pin it over the LP while the keyboard is open.
 * Does nothing on desktop / tablet. Does not pin until the keyboard opens.
 */
export const startMobileKeyboardPin = (iframe) => {
  if (!iframe || !mobileCheck()) return;

  if (listenersAttached && pinnedIframe === iframe && chatIsOpen) {
    return;
  }

  stopMobileKeyboardPin();
  pinnedIframe = iframe;
  chatIsOpen = true;
  attachPinListeners();
  pinTick();
};

/**
 * Stop the pin watcher and restore iframe styles saved before the pin.
 */
export const stopMobileKeyboardPin = () => {
  const iframe = pinnedIframe;
  chatIsOpen = false;
  detachPinListeners();
  if (pinRafId !== null) {
    window.cancelAnimationFrame(pinRafId);
    pinRafId = null;
  }
  restoreIframeStyles();
  if (iframe) {
    postKeyboardInset(iframe, 0);
  }
  lastPostedInset = null;
  pinnedIframe = null;
};
