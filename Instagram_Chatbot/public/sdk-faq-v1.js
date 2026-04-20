// Initialize Sentry (single clean block)
(function initSentry() {
  try {
    // Avoid double-initializing if sdk is loaded multiple times
    if (window.__SENTRY_SDK_V2_INITIALIZED__) return;
    window.__SENTRY_SDK_V2_INITIALIZED__ = true;

    var sentryScript = document.createElement('script');
    // Use the official browser CDN path (no @sentry/browser prefix) to avoid 404/CORS
    sentryScript.src = 'https://browser.sentry-cdn.com/7.57.0/bundle.min.js';
    sentryScript.crossOrigin = 'anonymous';

    sentryScript.onload = function () {
      try {
        if (window.Sentry && !window.__SENTRY_INITIALIZED__) {
          window.__SENTRY_INITIALIZED__ = true;
          window.Sentry.init({
            dsn: 'https://12b50bfdf6c0598e78a84630e5f7e40b@o4510197539930112.ingest.us.sentry.io/4510256042868736',
            debug: false,
            sendDefaultPii: true,
            integrations: (typeof window.Sentry !== 'undefined' && typeof window.Sentry.BrowserTracing === 'function') ? [new window.Sentry.BrowserTracing()] : []
          });
          console.log('Sentry initialized (sdk-faq-v1)');

          // Attach global handlers so runtime errors and promise rejections are captured
          try {
            window.addEventListener('error', function (evt) {
              try {
                var err = evt && evt.error ? evt.error : new Error('window.error: ' + (evt && evt.message ? evt.message : String(evt)));
                if (window.Sentry) {
                  window.Sentry.captureException(err);
                  console.log('Sentry captured window.error');
                }
              } catch (e) {
                console.warn('Error forwarding window.error to Sentry', e);
              }
            });

            window.addEventListener('unhandledrejection', function (evt) {
              try {
                var reason = evt && evt.reason ? evt.reason : new Error('Unhandled rejection');
                if (window.Sentry) {
                  window.Sentry.captureException(reason);
                  console.log('Sentry captured unhandledrejection');
                }
              } catch (e) {
                console.warn('Error forwarding unhandledrejection to Sentry', e);
              }
            });

            // helper to manually capture exceptions from page
            window.__sdk_v2_captureException = function (e) { if (window.Sentry) { return window.Sentry.captureException(e); } };

            // Override console.error to forward to Sentry (with recursion guard)
            (function () {
              var origConsoleError = console.error && console.error.bind ? console.error.bind(console) : function () { return; };
              var inProgress = false;
              console.error = function () {
                var args = Array.prototype.slice.call(arguments);
                if (inProgress) {
                  return origConsoleError.apply(console, args);
                }
                try {
                  inProgress = true;
                  if (window.Sentry) {
                    var first = args[0];
                    var err;
                    if (first instanceof Error) err = first;
                    else {
                      try { err = new Error(args.map(function (a) { return typeof a === 'string' ? a : JSON.stringify(a); }).join(' ')); }
                      catch (e) { err = new Error(String(first)); }
                    }
                    try {
                      var eid = window.Sentry.captureException(err);
                      origConsoleError('Sentry.captureException eventId:', eid);
                    } catch (e) {
                      origConsoleError('Sentry capture failed:', e);
                    }
                  }
                } finally {
                  inProgress = false;
                  return origConsoleError.apply(console, args);
                }
              };
            })();

            // Axios interceptor to capture response errors automatically
            try {
              if (window.axios && window.Sentry) {
                if (!window.__sdk_v2_axios_installed__) {
                  window.__sdk_v2_axios_installed__ = true;
                  window.axios.interceptors.response.use(function (resp) { return resp; }, function (error) {
                    try {
                      var ev = window.Sentry.captureException(error);
                      console.log('Sentry.captureException eventId (axios):', ev);
                    } catch (e) {
                      console.warn('Failed to capture axios error in Sentry', e);
                    }
                    return Promise.reject(error);
                  });
                }
              }
            } catch (e) {
              console.warn('Failed to install axios interceptor (sdk-faq-v1):', e);
            }
          } catch (handlerErr) {
            console.warn('Failed to attach global Sentry handlers (sdk-faq-v1):', handlerErr);
          }
        }
      } catch (e) {
        console.error('Sentry init error (sdk-faq-v1):', e);
      }
    };

    sentryScript.onerror = function (err) {
      console.error('Failed to load Sentry script (sdk-faq-v1):', err);
    };

    document.head.appendChild(sentryScript);
  } catch (outer) {
    console.error('Failed to setup Sentry loader (sdk-faq-v1):', outer);
  }
})();

// Error tracking wrapper function
function trackError(error, context = {}) {
  if (window.Sentry) {
    try {
      var ev = Sentry.captureException(error, { extra: context });
      console.log('Sentry.captureException eventId:', ev);
    } catch (e) {
      console.warn('Sentry.captureException failed in trackError', e);
    }
  }
  console.error(error);
}

// Wrap your main functions with try-catch
function wrapWithErrorHandling(fn, fnName) {
  return function wrapped(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      trackError(error, {
        functionName: fnName,
        arguments: JSON.stringify(args)
      });
      throw error;
    }
  };
}

const CHATBOT_ACTIONS = {
  EXCUTE_JS: 'excuteJS',
  INJECT_CUSTOM_JS: 'injectCustomJS',
  OPEN_PREVIEW: 'openPreview',
};

const CUSTOM_JS_CODE_POSITION = {
  HEAD: 'head',
  TOP_BODY: 'top_body',
  BOTTOM_BODY: 'bottom_body',
};

const botId = sessionStorage.getItem("bot_id");
const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
let chatbotBottom = sessionStorage.getItem("chatbotBottom");
let chatbotH = sessionStorage.getItem("chatbotH");
let chatbotRight = sessionStorage.getItem("chatbotRight");
let chatbotW = sessionStorage.getItem("chatbotW");
let scenarioId = "";

if (typeof window.jQuery === 'undefined') {
  let head = document.getElementsByTagName("head")[0];
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
  head.appendChild(script);
}

const getEnvFromScriptSrc = () => {
  try {
    if (window.getSdkEnv) return window.sdkEnv;

    window.getSdkEnv = true;

    const SRC_PARSER = {
      "ec-chatbot1.com": "staging",
      "ec-chatbot.com": "production",
      "localhost:3001": "local",
    }

    const src = document.currentScript?.src || "";

    if (!src) return null;

    const host = new URL(src).host;


    const sdkEnv = SRC_PARSER[host];

    if (sdkEnv) {
      window.sdkEnv = sdkEnv;
      return sdkEnv;
    }

    return null;
  } catch {
    return null;
  }
}

const getEnvironment = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params.env || getEnvFromScriptSrc() || "production";
}

const getDebugFlag = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  return params.debug || true;
}

const getParam = (paramName) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params[paramName];
}

const log = (message) => {
  let debugFlag = getDebugFlag();

  if (debugFlag) {
    console.log(message);
  }
}

const getEcChatBotApiServerBaseUrl = () => {
  // Comment out below line if you want to connect the staging backend API server
  // return "https://ec-chatbot-test1.com";
  const environment = getEnvironment();
  switch (environment) {
    case "staging":
    case "test":
      return "https://ec-chatbot-test1.com";
    case "production":
      return "https://ec-chatbot-test.com";
    case "local":
      return "http://localhost:3000";
    default:
      return "http://localhost:3000";
  }
}

const getEcChatBotFrontEndBaseUrl = () => {
  // Comment out below line if you want to use the local frontend
  // return "http://localhost:3001";
  const environment = getEnvironment();

  switch (environment) {
    case "staging":
    case "test":
      return "https://ec-chatbot1.com";
    case "production":
      return "https://ec-chatbot.com";
    case "local":
      return "http://localhost:3001";
    default:
      return "http://localhost:3001";
  }
}

let globalIframe;

const sendMessageToChatbot = (contentMessage, action) => {
  let data = { action: action, actionData: contentMessage };

  globalIframe.contentWindow.postMessage(data, "*");
}

const displayPopup = async () => {
  const device =
    !tabletCheck() && !mobileCheck()
      ? "pc"
      : tabletCheck()
        ? "tablet"
        : "smartphone";
  const response = await fetch(
    `${getEcChatBotApiServerBaseUrl()}/api/v1/managements/chatbots/${botId}/get_scenario_selected`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  scenarioId = data.data.id;

  let iframe = document.createElement("iframe");

  if (mobileCheck()) {
    iframe.width = "100%";
    iframe.style.maxWidth = "100%";
    iframe.style.right = "0";
  } else {
    iframe.width =
      chatbotW && chatbotRight
        ? `${parseInt(chatbotW) + parseInt(chatbotRight)}px`
        : "360px";
    iframe.style.right = "10px";
  }

  iframe.id = "previewSdk";
  iframe.style.position = "fixed";
  iframe.style.bottom = "0";
  iframe.height =
    chatbotH && chatbotBottom
      ? `${parseInt(chatbotH) + parseInt(chatbotBottom)}px`
      : "0px";

  iframe.style.border = "none";
  iframe.style.padding = "0";
  iframe.style.margin = "0";
  iframe.style.borderRadius = "0px";
  // iframe.style.display = "none";
  iframe.style.zIndex = "999999";
  iframe.src = `${getEcChatBotFrontEndBaseUrl()}/preview-faq?bot_id=${botId}&scenario_id=${scenarioId}&urlReceive=${window.location.origin
    }&deviceReceive=${device}&uuid=${uuid}&env=${getEnvironment()}&debug=${getDebugFlag()}`;

  appendIframeToBody(iframe);

  window.addEventListener(
    "message",
    async (e) => {
      if (typeof e.data !== 'object') return;
      if (e.data.source !== 'ec-chatbot') return;
      if (e.data.widthPc) chatbotW = e.data.widthPc;
      if (e.data.heightPc) chatbotH = e.data.heightPc;
      if (e.data.chatbotRight) chatbotRight = e.data.chatbotRight;
      if (e.data.chatbotBottom) chatbotBottom = e.data.chatbotBottom;

      switch (e.data.action) {
        case CHATBOT_ACTIONS.EXCUTE_JS:
          excuteJSCode(e.data.actionData);
          break;
        case CHATBOT_ACTIONS.INJECT_CUSTOM_JS:
          injectCustomJS(e.data.actionData);
          break;
      };

      if (e.data.isOpen === undefined) return;

      if (e.data.isOpen && mobileCheck()) {
        iframe.width = "100%";
        // iframe.height = "620px";
        iframe.height = "100%";
        iframe.style.setProperty("width", "100%", "important");
        iframe.style.setProperty("height", "100%", "important");
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (e.data.isOpen) {
        let w = chatbotW && (chatbotRight !== null) ? `${parseInt(chatbotW) + parseInt(chatbotRight)}px` : "460px";
        let h = chatbotH && (chatbotBottom !== null) ? `${parseInt(chatbotH) + parseInt(chatbotBottom)}px` : "700px";
        iframe.width = w;
        iframe.height = h;
        iframe.style.setProperty("width", w, "important");
        iframe.style.setProperty("height", h, "important");
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (!e.data.isOpen && mobileCheck()) {
        const useMoblieFullwidth = (typeof e.data.useMoblieFullwidth === 'boolean')
          ? e.data.useMoblieFullwidth
          : (sessionStorage.getItem("useFullwidthChatbotMobile") === "true");
        const w = useMoblieFullwidth ? "100%" : "250px";
        const h = useMoblieFullwidth ? "85px" : "58px";
        iframe.width = w;
        iframe.height = h;
        iframe.style.setProperty("width", w, "important");
        iframe.style.setProperty("height", h, "important");
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (!e.data.isOpen) {
        let w = chatbotRight ? `${parseInt(chatbotRight) + 400}px` : "400px";
        let h = chatbotBottom ? `${parseInt(chatbotBottom) + 85}px` : "85px";
        iframe.width = w;
        iframe.height = h;
        iframe.style.setProperty("width", w, "important");
        iframe.style.setProperty("height", h, "important");
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      }

      iframe.style.width = `${iframe.width} !important`;
      iframe.style.height = `${iframe.height} !important`;

      globalIframe = iframe;
    },
    false
  );

  log("device: ", device);
  setTimeout(() => {
    const checkDevice = { scenario_data: device };
    getUser(`${getEcChatBotApiServerBaseUrl()}/api/v1/analytics/scenario_counts/${scenarioId}`, checkDevice)
  }, 5000);
}

const excuteJSCode = (jscode) => {
  if (!jscode) return;
  const func = new Function(jscode);
  func();
}

const extractFromJs = async (options) => {
  const { searchJsCode: jsCode } = options;
  if (!jsCode) return;

  try {
    const func = new Function(jsCode);
    const result = await func();

    return result;
  } catch (error) {
    try {
      if (window.Sentry) {
        var ev = window.Sentry.captureException(error);
        console.log('Sentry.captureException eventId:', ev);
      }
    } catch (e) {
      console.warn('Failed sending EXTRACT_FROM_JS error to Sentry', e);
    }
    console.error("[EXTRACT_FROM_JS]", error);

    return null;
  }
};

const getUser = async (url, datacount) => {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datacount),
  });
  const data = await response.json();
  log(data);
};

const tabletCheck = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      userAgent
    );
  log("isTablet: " + isTablet);
  return isTablet;
}

const mobileCheck = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

const injectCustomJS = (injectCustomJsCodes) => {
  for (const { jsCode, position } of injectCustomJsCodes) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = jsCode;

    switch (position) {
      case CUSTOM_JS_CODE_POSITION.HEAD:
        document.head.appendChild(script);
        break;
      case CUSTOM_JS_CODE_POSITION.TOP_BODY:
        document.body.insertBefore(script, document.body.firstChild);
        break;
      case CUSTOM_JS_CODE_POSITION.BOTTOM_BODY:
        document.body.appendChild(script);
        break;
      default:
        console.error("Invalid position: " + position);
    }
  }
}

const appendIframeToBody = (iframe) => {
  globalIframe = iframe;
  document.body.appendChild(iframe);
}

displayPopup();