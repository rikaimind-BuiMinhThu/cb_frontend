const DEFAULT_UGC_HOST = 'https://st.ugc-creative.com';

const appendStylesheet = (href) => {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};

const appendScript = (src) =>
  new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = script.onerror = () => resolve();
    document.body.appendChild(script);
  });

const ensureHiddenHostInput = (id, ugcHost) => {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('input');
    el.type = 'hidden';
    el.id = id;
    document.body.appendChild(el);
  }
  el.setAttribute('data-host', ugcHost);
};

/**
 * Load SweetAlert + take.js on the host LP so UGC openModal (posted to window.top)
 * opens a fullscreen modal on the landing page, not inside #previewSdk.
 */
export const injectUgcHostModalAssets = async ({
  ugcHost = DEFAULT_UGC_HOST,
  hasInstagram = false,
  hasTiktok = false,
} = {}) => {
  if (window.__ugcHostModalAssetsLoaded) return;
  window.__ugcHostModalAssetsLoaded = true;

  if (!document.getElementById('ugc-host-swal-zindex')) {
    const style = document.createElement('style');
    style.id = 'ugc-host-swal-zindex';
    style.textContent = '.swal2-container{z-index:10000000!important;}';
    document.head.appendChild(style);
  }

  appendStylesheet(
    'https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.7.0/sweetalert2.min.css',
  );
  appendStylesheet(`${ugcHost}/ugc/css/popup.css`);
  appendStylesheet(
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css',
  );

  await appendScript(
    'https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.7.0/sweetalert2.min.js',
  );

  if (hasInstagram) {
    ensureHiddenHostInput('ugc-slider-info', ugcHost);
    await appendScript(`${ugcHost}/ugc/js/take.js`);
  }
  if (hasTiktok) {
    ensureHiddenHostInput('ugc-tiktok-slider-info', ugcHost);
    await appendScript(`${ugcHost}/ugc/js/tiktoks/take.js`);
  }
};

/**
 * Bridge in #previewSdk asks host to load modal assets; openModal targets window.top.
 * Must listen separately from ec-chatbot messages (those require e.data.source).
 */
export const registerUgcChatbotModalBridge = () => {
  window.addEventListener('message', (e) => {
    if (!e.data || e.data.action !== 'ugcEnableChatbotModalBridge') return;
    window.__ugcChatbotModalBridgeEnabled = true;
    injectUgcHostModalAssets({
      ugcHost: e.data.ugcHost || DEFAULT_UGC_HOST,
      hasInstagram: !!e.data.hasInstagram,
      hasTiktok: !!e.data.hasTiktok,
    });
  });
};
