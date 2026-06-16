const ERR_MSG_CLASS_NAMES = {
  holder: 'error-container',
  messageContainer: 'message-container',
  emsg: {
    holder: 'emsg_holder',
    formError: 'form-error',
    error: {
      holder: 'error_holder',
      each: 'error_each',
    },
  },
  noti: {
    holder: 'noti_holder',
    p: 'noti_p',
  },
};

const buildStyle = (styles) => Object.entries(styles)
  .map(([key, value]) => `${key}: ${value};`)
  .join('\n');

const buildStylesFromTheme = (themeStyles) => {
  const { bgColor, textColor, fontSize } = themeStyles;
  const styleList = [
    {
      selector: `.${ERR_MSG_CLASS_NAMES.holder}`,
      styles: {
        width: '100%',
        position: 'relative',
        margin: '5px 0',
        padding: '0 5px',
        'box-sizing': 'border-box',
        display: 'flex',
        'flex-direction': 'column',
        gap: '10px',
      },
    },
    {
      selector: `.${ERR_MSG_CLASS_NAMES.messageContainer}`,
      styles: {
        width: '100%',
        'max-height': '70px',
        height: 'fit-content',
        display: 'flex',
        'flex-direction': 'column',
        gap: '5px',
        'overflow-y': 'auto',
        transition: 'max-height 0.3s ease',
      },
    },
    {
      selector: `.${ERR_MSG_CLASS_NAMES.holder}:hover > .${ERR_MSG_CLASS_NAMES.messageContainer}`,
      styles: { 'max-height': '450px' },
    },
    {
      selector: `.${ERR_MSG_CLASS_NAMES.emsg.holder}`,
      styles: {
        display: 'flex',
        width: '100%',
        'flex-direction': 'column',
        'flex-wrap': 'wrap',
        'align-items': 'flex-start',
      },
    },
    {
      selector: `.${ERR_MSG_CLASS_NAMES.emsg.formError}`,
      styles: {
        'background-color': bgColor,
        'border-radius': '5px',
        'box-sizing': 'border-box',
        padding: '3px 10px',
        'font-weight': 'bold',
      },
    },
    {
      selector: `.${ERR_MSG_CLASS_NAMES.emsg.error.holder}`,
      styles: {
        display: 'flex',
        'flex-direction': 'column',
        gap: '2px',
      },
    },
    {
      selector: `.${ERR_MSG_CLASS_NAMES.emsg.error.holder} > p`,
      styles: { margin: '0' },
    },
    {
      selector: `.${ERR_MSG_CLASS_NAMES.emsg.error.each}`,
      styles: {
        margin: '0',
        width: '100%',
        color: textColor,
        'font-size': fontSize,
        'white-space': 'wrap',
        'word-break': 'break-all',
        'word-wrap': 'break-word',
        'text-align': 'left',
      },
    },
    {
      selector: `.${ERR_MSG_CLASS_NAMES.noti.holder}`,
      styles: {
        padding: '5px',
        'background-color': '#f5f5f5',
      },
    },
    {
      selector: `.${ERR_MSG_CLASS_NAMES.noti.p}`,
      styles: {
        margin: '0',
        color: '#333',
      },
    },
  ];

  return styleList
    .map(({ selector, styles }) => `${selector} {\n${buildStyle(styles)}\n}`)
    .join('\n');
};

export const generateErrMsgLpScript = ({
  fieldSelectors = '',
  formSelectors = '',
  themeStyles = {},
}) => {
  const normalizedFieldSelectors = fieldSelectors.trim();
  const normalizedFormSelectors = formSelectors.trim();

  if (!normalizedFieldSelectors && !normalizedFormSelectors) {
    return '';
  }

  const theme = {
    bgColor: themeStyles.bgColor || 'rgba(255, 0, 0, 0.1)',
    textColor: themeStyles.textColor || '#d32f2f',
    fontSize: themeStyles.fontSize || '14px',
  };

  const stylesCss = buildStylesFromTheme(theme);
  const plsUpdate = '修正の上、「更新」ボタンを押下してください。';

  return `(function() {
  var CLASS_NAMES = ${JSON.stringify(ERR_MSG_CLASS_NAMES)};
  var FIELD_SELECTORS = ${JSON.stringify(normalizedFieldSelectors)};
  var FORM_SELECTORS = ${JSON.stringify(normalizedFormSelectors)};
  var STYLES_CSS = ${JSON.stringify(stylesCss)};
  var PLS_UPDATE = ${JSON.stringify(plsUpdate)};

  var buildHTMLMessage = function(msg) {
    var formErrorClass = msg.isFormError ? ' ' + CLASS_NAMES.emsg.formError : '';
    var errorLines = msg.error.map(function(line) {
      return '<p class="' + CLASS_NAMES.emsg.error.each + '">' + line.trim() + '</p>';
    }).join('');
    return '<div class="' + CLASS_NAMES.emsg.holder + formErrorClass + '">' +
      '<div class="' + CLASS_NAMES.emsg.error.holder + '">' + errorLines + '</div>' +
    '</div>';
  };

  var buildHTMLNotiMessage = function(msg) {
    if (!msg) return '';
    return '<div class="' + CLASS_NAMES.noti.holder + '">' +
      '<p class="' + CLASS_NAMES.noti.p + '">' + msg + '</p>' +
    '</div>';
  };

  var buildHTMLErrorMessages = function(messages) {
    if (!messages || !messages.length) return 'NO_ERROR';
    var formErrors = messages.filter(function(m) { return m.isFormError; });
    var fieldErrors = messages.filter(function(m) { return !m.isFormError; });
    var buildMessages = formErrors.concat(fieldErrors);
    var errorMessages = buildMessages.map(buildHTMLMessage).join('');
    return '<style>' + STYLES_CSS + '</style>' +
      '<div class="' + CLASS_NAMES.holder + '">' +
        '<div class="' + CLASS_NAMES.messageContainer + '">' + errorMessages + '</div>' +
        buildHTMLNotiMessage(PLS_UPDATE) +
      '</div>';
  };

  var queryAllSelectors = function(selectors) {
    if (!selectors) return [];
    return selectors.split(',').reduce(function(acc, selector) {
      var trimmed = selector.trim();
      if (!trimmed) return acc;
      var elements = document.querySelectorAll(trimmed);
      return acc.concat(Array.from(elements));
    }, []);
  };

  var getErrorElements = function() {
    var fieldErrors = queryAllSelectors(FIELD_SELECTORS);
    var formErrors = queryAllSelectors(FORM_SELECTORS);
    var hasFieldErrors = fieldErrors.length > 0;
    var hasFormErrors = formErrors.length > 0;

    if (!hasFieldErrors && hasFormErrors) return formErrors;
    if (hasFieldErrors) return fieldErrors;
    return [];
  };

  var postMessageToChatbot = function(messages) {
    var iframe = document.getElementById('previewSdk');
    if (!iframe) return;
    iframe.contentWindow.postMessage({
      action: 'getErrorMessage',
      actionData: buildHTMLErrorMessages(messages),
    }, '*');
  };

  var sendErrorToChatbot = function() {
    var elements = getErrorElements();
    var messages = Array.from(elements).map(function(e) {
      var errorMsg = (e.innerText || '').trim().split('\\n');
      var isFormError = FORM_SELECTORS.split(',').some(function(selector) {
        var trimmed = selector.trim();
        if (!trimmed) return false;
        try {
          return e.matches(trimmed) || (e.id && trimmed.replace('#', '') === e.id);
        } catch (err) {
          return false;
        }
      });
      return {
        error: errorMsg,
        isFormError: isFormError,
        type: 'emsg',
      };
    });
    postMessageToChatbot(messages);
  };

  var observer = new MutationObserver(function() {
    var fieldEls = queryAllSelectors(FIELD_SELECTORS);
    var formEls = queryAllSelectors(FORM_SELECTORS);
    var elements = fieldEls.concat(formEls);

    elements.forEach(function(el) {
      if (!el.dataset._observed) {
        el.dataset._observed = 'true';
      }
    });

    if (!elements.length) {
      postMessageToChatbot([]);
      return;
    }

    sendErrorToChatbot();
  });

  var getLPErrorOnWindowLoad = function() {
    sendErrorToChatbot();
  };

  setTimeout(getLPErrorOnWindowLoad, 2000);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();`;
};
