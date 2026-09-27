import { initSentry } from './sentry.js';
import { ensureJQuery } from './integrations/jquery.js';
import { registerUgcChatbotModalBridge } from './integrations/ugcModalBridge.js';
import { displayPopup } from './displayPopup.js';
import { resolveChatBodyVersionGate } from './versionGate.js';

resolveChatBodyVersionGate({
  entryVersion: '2.0',
  alternateScriptPath: '/sdk-v2.js',
}).then((redirected) => {
  if (redirected) return;
  initSentry();
  ensureJQuery();
  registerUgcChatbotModalBridge();
  displayPopup();
});
