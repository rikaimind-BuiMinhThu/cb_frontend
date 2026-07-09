import { initSentry } from './sentry.js';
import { ensureJQuery } from './integrations/jquery.js';
import { displayPopup } from './displayPopup.js';

initSentry();
ensureJQuery();
displayPopup();
