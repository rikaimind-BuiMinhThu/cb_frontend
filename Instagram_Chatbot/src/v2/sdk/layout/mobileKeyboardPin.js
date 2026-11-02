import { mobileCheck } from '../device.js';

const PINNED_STYLE_PROPS = [
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'width',
  'height',
  'transform',
];

let pinnedIframe = null;
let savedStyles = null;
let chatIsOpen = false;
let lastPinGeometry = null;
let pinRaf = null;
let listenersBound = false;

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

const getViewportMetrics = () => {
  const viewport = window.visualViewport;
  if (viewport) {
    return {
      width: Math.max(Math.round(viewport.width), 1),
      height: Math.max(Math.round(viewport.height), 1),
      offsetLeft: Math.round(viewport.offsetLeft || 0),
      offsetTop: Math.round(viewport.offsetTop || 0),
    };
  }

  return {
    width: Math.max(Math.round(window.innerWidth || document.documentElement.clientWidth), 1),
    height: Math.max(Math.round(window.innerHeight || document.documentElement.clientHeight), 1),
    offsetLeft: 0,
    offsetTop: 0,
  };
};

const applyPin = (iframe) => {
  const { width, height, offsetLeft, offsetTop } = getViewportMetrics();
  const nextWidth = `${width}px`;
  const nextHeight = `${height}px`;
  const nextTransform = `translate(${offsetLeft}px, ${offsetTop}px)`;
  const geometryKey = `${nextWidth}|${nextHeight}|${nextTransform}`;

  if (
    lastPinGeometry === geometryKey
    && iframe.style.getPropertyValue('position') === 'fixed'
  ) {
    return;
  }

  lastPinGeometry = geometryKey;
  iframe.width = nextWidth;
  iframe.height = nextHeight;
  iframe.style.setProperty('position', 'fixed', 'important');
  iframe.style.setProperty('top', '0', 'important');
  iframe.style.setProperty('left', '0', 'important');
  iframe.style.setProperty('right', 'auto', 'important');
  iframe.style.setProperty('bottom', 'auto', 'important');
  iframe.style.setProperty('width', nextWidth, 'important');
  iframe.style.setProperty('height', nextHeight, 'important');
  iframe.style.setProperty('transform', nextTransform, 'important');
};

const schedulePin = () => {
  if (pinRaf !== null) {
    window.cancelAnimationFrame(pinRaf);
  }
  pinRaf = window.requestAnimationFrame(() => {
    pinRaf = null;
    if (!pinnedIframe || !mobileCheck() || !chatIsOpen) {
      restoreIframeStyles();
      return;
    }
    if (!savedStyles) {
      saveIframeStyles(pinnedIframe);
    }
    applyPin(pinnedIframe);
  });
};

const bindViewportListeners = () => {
  if (listenersBound) return;
  listenersBound = true;
  window.addEventListener('scroll', schedulePin, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', schedulePin);
    window.visualViewport.addEventListener('scroll', schedulePin);
  }
};

const unbindViewportListeners = () => {
  if (!listenersBound) return;
  listenersBound = false;
  window.removeEventListener('scroll', schedulePin);
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', schedulePin);
    window.visualViewport.removeEventListener('scroll', schedulePin);
  }
};

/**
 * True while the open-mobile pin has overridden iframe geometry.
 */
export const isMobileKeyboardPinApplied = () => Boolean(pinnedIframe && savedStyles);

/**
 * Keep the open mobile chatbot iframe sized to the visible viewport.
 * Uses visualViewport events so the iframe follows iOS keyboard offset
 * without waiting for a polling interval.
 */
export const startMobileKeyboardPin = (iframe) => {
  if (!iframe || !mobileCheck()) return;

  if (pinnedIframe === iframe && chatIsOpen && listenersBound) {
    schedulePin();
    return;
  }

  stopMobileKeyboardPin();
  pinnedIframe = iframe;
  chatIsOpen = true;
  bindViewportListeners();
  schedulePin();
};

/**
 * Stop the pin watcher and restore iframe styles saved before the pin.
 */
export const stopMobileKeyboardPin = () => {
  chatIsOpen = false;
  unbindViewportListeners();
  if (pinRaf !== null) {
    window.cancelAnimationFrame(pinRaf);
    pinRaf = null;
  }
  restoreIframeStyles();
  pinnedIframe = null;
};
