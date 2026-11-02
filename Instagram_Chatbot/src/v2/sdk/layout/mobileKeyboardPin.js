import { mobileCheck } from '../device.js';

const PINNED_STYLE_PROPS = ['position', 'top', 'left', 'right', 'bottom', 'width', 'height'];
const KEYBOARD_OPEN_THRESHOLD_PX = 150;
const PIN_INTERVAL_MS = 200;
const KEYBOARD_CLOSE_CONFIRM_TICKS = 2;

let pinTimer = null;
let pinnedIframe = null;
let savedStyles = null;
let chatIsOpen = false;
let keyboardClosedTicks = 0;
let lastPinGeometry = null;

const isKeyboardOpen = () => {
  const viewport = window.visualViewport;
  if (!viewport) return false;
  return document.documentElement.clientHeight - viewport.height > KEYBOARD_OPEN_THRESHOLD_PX;
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
  lastPinGeometry = null;
};

const applyPin = (iframe) => {
  const root = document.documentElement;
  const top = `${window.scrollY}px`;
  const width = `${root.clientWidth}px`;
  const height = `${root.clientHeight}px`;
  const geometryKey = `${top}|${width}|${height}`;

  if (
    lastPinGeometry === geometryKey
    && iframe.style.getPropertyValue('position') === 'absolute'
  ) {
    return;
  }

  lastPinGeometry = geometryKey;
  iframe.style.setProperty('position', 'absolute', 'important');
  iframe.style.setProperty('top', top, 'important');
  iframe.style.setProperty('left', '0', 'important');
  iframe.style.setProperty('right', 'auto', 'important');
  iframe.style.setProperty('bottom', 'auto', 'important');
  iframe.style.setProperty('width', width, 'important');
  iframe.style.setProperty('height', height, 'important');
};

const pinTick = () => {
  if (!pinnedIframe || !mobileCheck() || !chatIsOpen) {
    restoreIframeStyles();
    keyboardClosedTicks = 0;
    return;
  }

  if (!isKeyboardOpen()) {
    keyboardClosedTicks += 1;
    if (keyboardClosedTicks < KEYBOARD_CLOSE_CONFIRM_TICKS) {
      return;
    }
    restoreIframeStyles();
    return;
  }

  keyboardClosedTicks = 0;
  if (!savedStyles) {
    saveIframeStyles(pinnedIframe);
  }
  applyPin(pinnedIframe);
};

/**
 * True while the keyboard pin has overridden iframe geometry.
 */
export const isMobileKeyboardPinApplied = () => Boolean(pinnedIframe && savedStyles);

/**
 * Watch the open mobile chatbot iframe and pin it over the LP while the keyboard is open.
 * Does nothing on desktop / tablet. Does not pin until the keyboard opens.
 */
export const startMobileKeyboardPin = (iframe) => {
  if (!iframe || !mobileCheck()) return;

  if (pinTimer !== null && pinnedIframe === iframe && chatIsOpen) {
    return;
  }

  stopMobileKeyboardPin();
  pinnedIframe = iframe;
  chatIsOpen = true;
  keyboardClosedTicks = 0;
  pinTick();
  pinTimer = window.setInterval(pinTick, PIN_INTERVAL_MS);
};

/**
 * Stop the pin watcher and restore iframe styles saved before the pin.
 */
export const stopMobileKeyboardPin = () => {
  chatIsOpen = false;
  keyboardClosedTicks = 0;
  if (pinTimer !== null) {
    window.clearInterval(pinTimer);
    pinTimer = null;
  }
  restoreIframeStyles();
  pinnedIframe = null;
};
