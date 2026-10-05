import {
  GTAG_SCRIPT_ATTR,
  GTAG_SCRIPT_BASE_URL,
  GTAG_SEND_PAGE_VIEW,
} from 'v2/variables/tagFiringConstants';

const GTAG_CONFIGURED_ID_KEY = '__ecchGtagConfiguredId';

const ensureGtagStub = () => {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === 'function') {
    return;
  }
  window.gtag = (...args) => {
    window.dataLayer.push(args);
  };
};

const loadGtagScript = (measurementId) => {
  const existingScript = document.querySelector(`script[${GTAG_SCRIPT_ATTR}]`);
  if (existingScript) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `${GTAG_SCRIPT_BASE_URL}${encodeURIComponent(measurementId)}`;
    script.setAttribute(GTAG_SCRIPT_ATTR, measurementId);
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

export const ensureIframeGtag = (measurementId) => {
  if (!measurementId || typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  const alreadyReady = window[GTAG_CONFIGURED_ID_KEY] === measurementId
    && typeof window.gtag === 'function';
  if (alreadyReady) {
    return Promise.resolve(true);
  }

  ensureGtagStub();

  return loadGtagScript(measurementId).then((ok) => {
    if (!ok) {
      return false;
    }
    if (window[GTAG_CONFIGURED_ID_KEY] === measurementId) {
      return true;
    }
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: GTAG_SEND_PAGE_VIEW });
    window[GTAG_CONFIGURED_ID_KEY] = measurementId;
    return true;
  });
};

export const pushIframeGtagEvent = (measurementId, eventName, params = {}) => {
  if (!measurementId || !eventName) {
    return Promise.resolve();
  }

  return ensureIframeGtag(measurementId).then((ready) => {
    if (!ready || typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', eventName, params);
  });
};
