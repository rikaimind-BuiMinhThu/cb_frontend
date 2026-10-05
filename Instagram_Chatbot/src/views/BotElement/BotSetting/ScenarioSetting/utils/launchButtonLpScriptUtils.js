export const generateLaunchButtonLpScript = (selectors = '') => {
  const normalizedSelectors = selectors.trim();
  if (!normalizedSelectors) return '';

  return `(function() {
  var SELECTORS = ${JSON.stringify(normalizedSelectors)};

  function openChatBotFnc(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    var iframe = document.getElementById('previewSdk');
    if (!iframe) return;

    iframe.contentWindow.postMessage(
      { action: 'openPreview', actionData: 'none' },
      '*'
    );
  }

  SELECTORS.split(',').forEach(function(selector) {
    var trimmed = selector.trim();
    if (!trimmed) return;
    document.querySelectorAll(trimmed).forEach(function(el) {
      el.addEventListener('click', openChatBotFnc, { capture: true });
    });
  });
})();`;
};
