import { log } from './config/environment.js';

const SENTRY_CDN_URL = 'https://browser.sentry-cdn.com/7.57.0/bundle.min.js';
const SENTRY_DSN = 'https://12b50bfdf6c0598e78a84630e5f7e40b@o4510197539930112.ingest.us.sentry.io/4510256042868736';
const SDK_LABEL = 'sdk-v2';
const WINDOW_ERROR_PREFIX = 'window.error: ';
const UNHANDLED_REJECTION_MESSAGE = 'Unhandled rejection';
const SENTRY_CAPTURE_FAILED_PREFIX = 'Sentry.captureException failed (';
const SENTRY_INITIALIZED_SUFFIX = ')';
const SENTRY_INIT_LOG = `Sentry initialized (${SDK_LABEL})`;
const SENTRY_EVENT_ID_PREFIX = 'Sentry.captureException eventId:';
const SENTRY_AXIOS_EVENT_ID_PREFIX = 'Sentry.captureException eventId (axios):';
const WINDOW_ERROR_CAPTURED = 'Sentry captured window.error';
const REJECTION_CAPTURED = 'Sentry captured unhandledrejection';
const WINDOW_ERROR_FORWARD_FAILED = 'Error forwarding window.error to Sentry';
const REJECTION_FORWARD_FAILED = 'Error forwarding unhandledrejection to Sentry';
const AXIOS_INTERCEPTOR_FAILED_PREFIX = 'Failed to install axios interceptor (';
const HANDLERS_FAILED_PREFIX = 'Failed to attach global Sentry handlers (';
const INIT_ERROR_PREFIX = 'Sentry init error (';
const SCRIPT_LOAD_FAILED_PREFIX = 'Failed to load Sentry script (';
const SETUP_FAILED_PREFIX = 'Failed to setup Sentry loader (';
const CROSS_ORIGIN_ANONYMOUS = 'anonymous';
const ERROR_EVENT = 'error';
const UNHANDLED_REJECTION_EVENT = 'unhandledrejection';

const captureExceptionSafe = (error, captureContext) => {
  if (!window.Sentry) return null;
  try {
    return window.Sentry.captureException(error, captureContext);
  } catch (sentryError) {
    console.warn(`${SENTRY_CAPTURE_FAILED_PREFIX}${SDK_LABEL}${SENTRY_INITIALIZED_SUFFIX}`, sentryError);
    return null;
  }
};

const errorFromWindowEvent = (evt) => {
  if (evt?.error) return evt.error;
  const message = evt?.message ? evt.message : String(evt);
  return new Error(`${WINDOW_ERROR_PREFIX}${message}`);
};

const errorFromRejection = (evt) => (
  evt?.reason ? evt.reason : new Error(UNHANDLED_REJECTION_MESSAGE)
);

const errorFromConsoleArgs = (args) => {
  const first = args[0];
  if (first instanceof Error) return first;
  try {
    return new Error(args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' '));
  } catch (parseError) {
    return new Error(String(first));
  }
};

const initializeSentryClient = () => {
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
  log(SENTRY_INIT_LOG);
  return true;
};

const installConsoleErrorBridge = () => {
  const origConsoleError = console.error?.bind
    ? console.error.bind(console)
    : () => undefined;
  const bridgeState = { inProgress: false };

  console.error = (...args) => {
    if (bridgeState.inProgress) {
      return origConsoleError.apply(console, args);
    }

    try {
      bridgeState.inProgress = true;
      if (window.Sentry) {
        const err = errorFromConsoleArgs(args);
        const eventId = captureExceptionSafe(err);
        if (eventId != null) {
          origConsoleError(SENTRY_EVENT_ID_PREFIX, eventId);
        }
      }
    } finally {
      bridgeState.inProgress = false;
    }
    return origConsoleError.apply(console, args);
  };
};

const installAxiosInterceptor = () => {
  if (!window.axios || !window.Sentry || window.__sdk_v2_axios_installed__) return;

  window.__sdk_v2_axios_installed__ = true;
  window.axios.interceptors.response.use(
    (resp) => resp,
    (error) => {
      const eventId = captureExceptionSafe(error);
      if (eventId != null) {
        log(`${SENTRY_AXIOS_EVENT_ID_PREFIX} ${eventId}`);
      }
      return Promise.reject(error);
    },
  );
};

const attachGlobalHandlers = () => {
  try {
    window.addEventListener(ERROR_EVENT, (evt) => {
      try {
        const err = errorFromWindowEvent(evt);
        captureExceptionSafe(err);
        log(WINDOW_ERROR_CAPTURED);
      } catch (handlerError) {
        console.warn(WINDOW_ERROR_FORWARD_FAILED, handlerError);
      }
    });

    window.addEventListener(UNHANDLED_REJECTION_EVENT, (evt) => {
      try {
        const reason = errorFromRejection(evt);
        captureExceptionSafe(reason);
        log(REJECTION_CAPTURED);
      } catch (handlerError) {
        console.warn(REJECTION_FORWARD_FAILED, handlerError);
      }
    });

    window.__sdk_v2_captureException = (error) => captureExceptionSafe(error);

    installConsoleErrorBridge();

    try {
      installAxiosInterceptor();
    } catch (interceptorError) {
      console.warn(`${AXIOS_INTERCEPTOR_FAILED_PREFIX}${SDK_LABEL}):`, interceptorError);
    }
  } catch (handlerErr) {
    console.warn(`${HANDLERS_FAILED_PREFIX}${SDK_LABEL}):`, handlerErr);
  }
};

const onSentryBundleLoad = () => {
  try {
    if (!initializeSentryClient()) return;
    attachGlobalHandlers();
  } catch (initError) {
    console.error(`${INIT_ERROR_PREFIX}${SDK_LABEL}):`, initError);
  }
};

export const initSentry = () => {
  try {
    if (window.__SENTRY_SDK_V2_INITIALIZED__) return;
    window.__SENTRY_SDK_V2_INITIALIZED__ = true;

    const sentryScript = document.createElement('script');
    sentryScript.src = SENTRY_CDN_URL;
    sentryScript.crossOrigin = CROSS_ORIGIN_ANONYMOUS;
    sentryScript.onload = onSentryBundleLoad;
    sentryScript.onerror = (err) => {
      console.error(`${SCRIPT_LOAD_FAILED_PREFIX}${SDK_LABEL}):`, err);
    };

    document.head.appendChild(sentryScript);
  } catch (outer) {
    console.error(`${SETUP_FAILED_PREFIX}${SDK_LABEL}):`, outer);
  }
};

export const trackError = (error, context = {}) => {
  const eventId = captureExceptionSafe(error, { extra: context });
  if (eventId != null) {
    log(`${SENTRY_EVENT_ID_PREFIX} ${eventId}`);
  }
  console.error(error);
};
