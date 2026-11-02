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
  'background-color',
];

const PARENT_LOCK_PROPS = [
  { el: 'html', prop: 'background-color' },
  { el: 'body', prop: 'background-color' },
  { el: 'body', prop: 'position' },
  { el: 'body', prop: 'top' },
  { el: 'body', prop: 'left' },
  { el: 'body', prop: 'right' },
  { el: 'body', prop: 'width' },
  { el: 'body', prop: 'overflow' },
];

// Opaque fill so the translucent iOS keyboard composites the chatbot, not the LP.
const PIN_BACKGROUND = '#ffffff';

let pinnedIframe = null;
let savedStyles = null;
let savedParentStyles = null;
let savedScrollY = 0;
let parentScrollLocked = false;
let chatIsOpen = false;
let lastPinGeometry = null;
let lastPostedInset = null;
let pinRaf = null;
let listenersBound = false;

const getParentEl = (name) => (
  name === 'html' ? document.documentElement : document.body
);

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

const lockParentScroll = () => {
  if (parentScrollLocked || !document.body) return;

  savedScrollY = Math.round(window.scrollY || window.pageYOffset || 0);
  savedParentStyles = PARENT_LOCK_PROPS.map(({ el, prop }) => {
    const node = getParentEl(el);
    return {
      el,
      prop,
      value: node.style.getPropertyValue(prop),
      priority: node.style.getPropertyPriority(prop),
    };
  });

  const html = document.documentElement;
  const body = document.body;
  html.style.setProperty('background-color', PIN_BACKGROUND, 'important');
  body.style.setProperty('background-color', PIN_BACKGROUND, 'important');
  body.style.setProperty('position', 'fixed', 'important');
  body.style.setProperty('top', `-${savedScrollY}px`, 'important');
  body.style.setProperty('left', '0', 'important');
  body.style.setProperty('right', '0', 'important');
  body.style.setProperty('width', '100%', 'important');
  body.style.setProperty('overflow', 'hidden', 'important');
  parentScrollLocked = true;
};

const unlockParentScroll = () => {
  if (!parentScrollLocked) return;

  if (savedParentStyles) {
    savedParentStyles.forEach(({ el, prop, value, priority }) => {
      const node = getParentEl(el);
      if (!node) return;
      if (value) {
        node.style.setProperty(prop, value, priority);
        return;
      }
      node.style.removeProperty(prop);
    });
  }

  savedParentStyles = null;
  parentScrollLocked = false;
  window.scrollTo(0, savedScrollY);
  savedScrollY = 0;
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

const applyPin = (iframe) => {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const layoutWidth = Math.max(root.clientWidth, 1);
  const layoutHeight = Math.max(root.clientHeight, 1);
  const offsetLeft = Math.round(vv?.offsetLeft || 0);
  const offsetTop = Math.round(vv?.offsetTop || 0);
  // Extend past the visual viewport so the translucent keyboard composites white chatbot, not LP.
  const pinHeight = Math.max(layoutHeight + offsetTop, 1);
  const nextWidth = `${layoutWidth}px`;
  const nextHeight = `${pinHeight}px`;
  const nextTransform = `translate(${offsetLeft}px, ${offsetTop}px)`;
  const geometryKey = `${nextWidth}|${nextHeight}|${nextTransform}`;
  const visibleHeight = Math.round(vv?.height || window.innerHeight || layoutHeight);
  const keyboardInset = Math.max(0, layoutHeight - visibleHeight);

  if (
    lastPinGeometry !== geometryKey
    || iframe.style.getPropertyValue('position') !== 'fixed'
  ) {
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
  }

  if (iframe.style.getPropertyValue('background-color') !== PIN_BACKGROUND) {
    iframe.style.setProperty('background-color', PIN_BACKGROUND, 'important');
  }

  postKeyboardInset(iframe, keyboardInset);
};

const schedulePin = () => {
  if (pinRaf !== null) {
    window.cancelAnimationFrame(pinRaf);
  }
  pinRaf = window.requestAnimationFrame(() => {
    pinRaf = null;
    if (!pinnedIframe || !mobileCheck() || !chatIsOpen) {
      restoreIframeStyles();
      unlockParentScroll();
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
 * Keep the open mobile chatbot iframe covering the full layout viewport
 * (plus visualViewport offset under the keyboard) while locking parent scroll.
 */
export const startMobileKeyboardPin = (iframe) => {
  if (!iframe || !mobileCheck()) return;

  if (pinnedIframe === iframe && chatIsOpen && listenersBound) {
    lockParentScroll();
    schedulePin();
    return;
  }

  stopMobileKeyboardPin();
  pinnedIframe = iframe;
  chatIsOpen = true;
  lastPostedInset = null;
  lockParentScroll();
  bindViewportListeners();
  schedulePin();
};

/**
 * Stop the pin watcher and restore iframe + parent styles saved before the pin.
 */
export const stopMobileKeyboardPin = () => {
  const iframe = pinnedIframe;
  chatIsOpen = false;
  unbindViewportListeners();
  if (pinRaf !== null) {
    window.cancelAnimationFrame(pinRaf);
    pinRaf = null;
  }
  if (iframe) {
    postKeyboardInset(iframe, 0);
  }
  restoreIframeStyles();
  unlockParentScroll();
  pinnedIframe = null;
  lastPostedInset = null;
};
