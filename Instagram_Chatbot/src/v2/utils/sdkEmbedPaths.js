export const CHAT_BODY_VERSION_1 = '1.0';
export const CHAT_BODY_VERSION_2 = '2.0';
export const CHAT_BODY_VERSION_DEFAULT = CHAT_BODY_VERSION_2;

/**
 * Resolve recommended SDK embed script paths for a chatbot version.
 * @param {string} version
 * @param {string} baseUrl frontend base URL (no trailing slash)
 * @returns {{ paymentSdkUrl: string, faqSdkUrl: string }}
 */
export const getSdkEmbedPaths = (version, baseUrl) => {
  const normalizedBase = (baseUrl || '').replace(/\/$/, '');
  const isV1 = version === CHAT_BODY_VERSION_1;

  return {
    paymentSdkUrl: isV1
      ? `${normalizedBase}/sdk-v2.js`
      : `${normalizedBase}/v2/sdk.js`,
    faqSdkUrl: isV1
      ? `${normalizedBase}/sdk-faq-v1.js`
      : `${normalizedBase}/v2/sdk-faq.js`,
  };
};

export const buildPaymentEmbedScript = (botId, paymentSdkUrl) =>
  `<script>sessionStorage.setItem("bot_id", "${botId}");</script>\n<script src="${paymentSdkUrl}" defer></script>`;

export const buildFaqEmbedScript = (botId, faqSdkUrl, { includeBotType = false } = {}) => {
  const sessionLines = includeBotType
    ? `sessionStorage.setItem("bot_id", "${botId}");sessionStorage.setItem("bot_type", "faq");`
    : `sessionStorage.setItem("bot_id", "${botId}");`;
  return `<script>${sessionLines}</script>\n<script src="${faqSdkUrl}" defer></script>`;
};
