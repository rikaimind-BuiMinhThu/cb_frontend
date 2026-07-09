const SDK_PREVIEW_BASE_PATH = (() => {
  const src = document.currentScript?.src
    || document.querySelector('script[src*="/v2/sdk"]')?.src
    || document.querySelector('script[src*="sdk.js"]')?.src
    || '';
  try {
    return new URL(src, window.location.href).pathname.includes('/v2/') ? '/v2' : '';
  } catch {
    return src.includes('/v2/') ? '/v2' : '';
  }
})();

export const getSdkPreviewBasePath = () => SDK_PREVIEW_BASE_PATH;
