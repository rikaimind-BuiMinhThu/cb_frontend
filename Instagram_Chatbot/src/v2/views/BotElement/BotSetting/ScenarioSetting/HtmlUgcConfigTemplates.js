export const UGC_HOSTS = {
  production: 'https://ugc-creative.com',
  staging: 'https://st.ugc-creative.com',
  local: 'http://localhost',
};

/** @deprecated use getUgcHost(env) — kept as staging alias for compatibility */
export const UGC_HOST = UGC_HOSTS.staging;

export function getUgcHost(env = 'staging') {
  return UGC_HOSTS[env] || UGC_HOSTS.staging;
}

const buildSharedAssets = (ugcHost) => [
  `<script src="${ugcHost}/ugc/js/chatbot_ugc_modal_bridge.js"></script>`,
];

const buildInstagramSpecific = (ugcHost) => [
  `<script src="${ugcHost}/ugc/js/take.js"></script>`,
  `<input type="hidden" id="ugc-slider-info" data-host="${ugcHost}">`,
];

const buildTiktokSpecific = (ugcHost) => [
  `<script src="${ugcHost}/ugc/js/tiktoks/take.js"></script>`,
  `<input type="hidden" id="ugc-tiktok-slider-info" data-host="${ugcHost}">`,
];

const buildReviewSnippet = (ugcHost) => [
  `<script src="${ugcHost}/ugc/js/api_reviews/take.js"></script>`,
  `<input type="hidden" id="ugc-review-slider-info" data-host="${ugcHost}">`,
];

/**
 * Build HTML_UGC_CONFIG content from selected UGC types and host env.
 * Hidden inputs + take.js first; bridge last so it can read #ugc-*-slider-info.
 */
export function buildHtmlUgcConfigContent({
  isUgcInstagram,
  isUgcTiktok,
  isUgcReview,
  ugcEnv = 'staging',
}) {
  const ugcHost = getUgcHost(ugcEnv);
  const parts = [];

  if (isUgcInstagram) {
    parts.push(...buildInstagramSpecific(ugcHost));
  }
  if (isUgcTiktok) {
    parts.push(...buildTiktokSpecific(ugcHost));
  }
  if (isUgcInstagram || isUgcTiktok) {
    parts.push(...buildSharedAssets(ugcHost));
  }
  if (isUgcReview) {
    parts.push(...buildReviewSnippet(ugcHost));
  }

  return parts.join('\n');
}
