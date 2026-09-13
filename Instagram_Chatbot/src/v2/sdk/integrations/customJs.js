import { CUSTOM_JS_CODE_POSITION } from '../constants.js';

// Merchant-authored custom JS is a privileged bot setting. The shop page
// executes it as written; operators must treat this as trusted input.
export const injectCustomJS = (injectCustomJsCodes) => {
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
        console.error('Invalid position: ' + position);
    }
  }
};
