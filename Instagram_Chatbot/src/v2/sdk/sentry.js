const SENTRY_CDN_URL = 'https://browser.sentry-cdn.com/7.57.0/bundle.min.js';
const SENTRY_DSN = 'https://12b50bfdf6c0598e78a84630e5f7e40b@o4510197539930112.ingest.us.sentry.io/4510256042868736';
const SDK_LABEL = 'sdk-v2';

function captureExceptionSafe(error, captureContext) {
  if (!window.Sentry) return null;
  try {
    return window.Sentry.captureException(error, captureContext);
  } catch (e) {
    console.warn(`Sentry.captureException failed (${SDK_LABEL})`, e);
    return null;
  }
}

function errorFromWindowEvent(evt) {
  if (evt?.error) return evt.error;
  const message = evt?.message ? evt.message : String(evt);
  return new Error(`window.error: ${message}`);
}

function errorFromRejection(evt) {
  return evt?.reason ? evt.reason : new Error('Unhandled rejection');
}

function errorFromConsoleArgs(args) {
  const first = args[0];
  if (first instanceof Error) return first;
  try {
    return new Error(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
  } catch (e) {
    return new Error(String(first));
  }
}

function initializeSentryClient() {
  if (!window.Sentry || window.__SENTRY_INITIALIZED__) return false;

  window.__SENTRY_INITIALIZED__ = true;
  window.Sentry.init({
    dsn: SENTRY_DSN,
    debug: false,
    sendDefaultPii: true,
    integrations: (typeof window.Sentry.BrowserTracing === 'function')
      ? [new window.Sentry.BrowserTracing()]
      : [],
  });
  console.log(`Sentry initialized (${SDK_LABEL})`);
  return true;
}

function installConsoleErrorBridge() {
  const origConsoleError = console.error?.bind
    ? console.error.bind(console)
    : function () { return; };
  let inProgress = false;

  console.error = function () {
    const args = Array.prototype.slice.call(arguments);
    if (inProgress) {
      return origConsoleError.apply(console, args);
    }

    try {
      inProgress = true;
      if (window.Sentry) {
        const err = errorFromConsoleArgs(args);
        const eid = captureExceptionSafe(err);
        if (eid != null) {
          origConsoleError('Sentry.captureException eventId:', eid);
        }
      }
    } finally {
      inProgress = false;
      return origConsoleError.apply(console, args);
    }
  };
}

function installAxiosInterceptor() {
  if (!window.axios || !window.Sentry || window.__sdk_v2_axios_installed__) return;

  window.__sdk_v2_axios_installed__ = true;
  window.axios.interceptors.response.use(
    (resp) => resp,
    (error) => {
      const ev = captureExceptionSafe(error);
      if (ev != null) {
        console.log('Sentry.captureException eventId (axios):', ev);
      }
      return Promise.reject(error);
    },
  );
}

function attachGlobalHandlers() {
  try {
    window.addEventListener('error', (evt) => {
      try {
        const err = errorFromWindowEvent(evt);
        captureExceptionSafe(err);
        console.log('Sentry captured window.error');
      } catch (e) {
        console.warn('Error forwarding window.error to Sentry', e);
      }
    });

    window.addEventListener('unhandledrejection', (evt) => {
      try {
        const reason = errorFromRejection(evt);
        captureExceptionSafe(reason);
        console.log('Sentry captured unhandledrejection');
      } catch (e) {
        console.warn('Error forwarding unhandledrejection to Sentry', e);
      }
    });

    window.__sdk_v2_captureException = (e) => captureExceptionSafe(e);

    installConsoleErrorBridge();

    try {
      installAxiosInterceptor();
    } catch (e) {
      console.warn(`Failed to install axios interceptor (${SDK_LABEL}):`, e);
    }
  } catch (handlerErr) {
    console.warn(`Failed to attach global Sentry handlers (${SDK_LABEL}):`, handlerErr);
  }
}

function onSentryBundleLoad() {
  try {
    if (!initializeSentryClient()) return;
    attachGlobalHandlers();
  } catch (e) {
    console.error(`Sentry init error (${SDK_LABEL}):`, e);
  }
}

export function initSentry() {
  try {
    if (window.__SENTRY_SDK_V2_INITIALIZED__) return;
    window.__SENTRY_SDK_V2_INITIALIZED__ = true;

    const sentryScript = document.createElement('script');
    sentryScript.src = SENTRY_CDN_URL;
    sentryScript.crossOrigin = 'anonymous';
    sentryScript.onload = onSentryBundleLoad;
    sentryScript.onerror = (err) => {
      console.error(`Failed to load Sentry script (${SDK_LABEL}):`, err);
    };

    document.head.appendChild(sentryScript);
  } catch (outer) {
    console.error(`Failed to setup Sentry loader (${SDK_LABEL}):`, outer);
  }
}

export function trackError(error, context = {}) {
  const ev = captureExceptionSafe(error, { extra: context });
  if (ev != null) {
    console.log('Sentry.captureException eventId:', ev);
  }
  console.error(error);
}
