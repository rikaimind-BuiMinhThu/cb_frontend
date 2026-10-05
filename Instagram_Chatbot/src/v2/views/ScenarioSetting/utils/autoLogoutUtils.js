import { CART_SYSTEM } from 'v2/views/Preview/PreviewComponent/Constants';

export const AUTO_LOGOUT_DOMAIN_MISMATCH_ERROR = 'ドメインが一致しないため、ログアウト処理を行えず保存できません。';
export const AUTO_LOGOUT_TEMPLATE_MISSING_ERROR = 'このカートシステム用のログアウトテンプレートが未定義です。スーパー管理者にテンプレートの定義を依頼してください。';
export const AUTO_LOGOUT_INVALID_URL_ERROR = '有効なURLを入力してください。';
export const AUTO_LOGOUT_INCOMPLETE_CONFIG_ERROR = '自動ログアウトの設定が完了していません。LP URLとSignout URLを設定してください。';

export const createEmptyAutoLogoutEntry = () => ({
  lpUrl: '',
  signoutUrl: '',
  generatedJs: '',
});

export const createEmptyAutoLogoutConfig = () => ({
  temp: createEmptyAutoLogoutEntry(),
  final: createEmptyAutoLogoutEntry(),
});

export const normalizeDomain = (urlString) => {
  if (!urlString?.trim()) return null;

  try {
    const url = new URL(urlString.trim());
    return url.hostname.toLowerCase();
  } catch {
    return null;
  }
};

export const validateSameDomain = (lpUrl, signoutUrl) => {
  const lpDomain = normalizeDomain(lpUrl);
  const signoutDomain = normalizeDomain(signoutUrl);

  if (!lpDomain || !signoutDomain) {
    return { valid: false, error: AUTO_LOGOUT_INVALID_URL_ERROR };
  }

  if (lpDomain !== signoutDomain) {
    return { valid: false, error: AUTO_LOGOUT_DOMAIN_MISMATCH_ERROR };
  }

  return { valid: true };
};

const LOGOUT_JS_TEMPLATES = {
  [CART_SYSTEM.EC_FORCE]: (signoutUrl) => `if (!document.getElementById("amazon_payment_method")) {
  fetch(${JSON.stringify(signoutUrl)}, {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.text())
    .catch(err => console.error(err));
}`,
};

export const generateLogoutJsByCartSystem = (cartSystem, { signoutUrl }) => {
  const template = LOGOUT_JS_TEMPLATES[cartSystem];

  if (!template) {
    throw new Error(AUTO_LOGOUT_TEMPLATE_MISSING_ERROR);
  }

  return template(signoutUrl.trim());
};

export const buildAutoLogoutConfigFromUrls = (cartSystem, lpUrl, signoutUrl) => {
  const domainValidation = validateSameDomain(lpUrl, signoutUrl);

  if (!domainValidation.valid) {
    return { error: domainValidation.error };
  }

  try {
    const generatedJs = generateLogoutJsByCartSystem(cartSystem, { signoutUrl });

    return {
      lpUrl: lpUrl.trim(),
      signoutUrl: signoutUrl.trim(),
      generatedJs,
      error: null,
    };
  } catch (error) {
    return { error: error.message || AUTO_LOGOUT_TEMPLATE_MISSING_ERROR };
  }
};

export const isAutoLogoutConfigValid = (config) => {
  if (!config?.lpUrl?.trim() || !config?.signoutUrl?.trim() || !config?.generatedJs?.trim()) {
    return false;
  }

  return validateSameDomain(config.lpUrl, config.signoutUrl).valid;
};

export const parseAutoLogoutFromApi = (rawAutoLogout = {}) => ({
  lpUrl: rawAutoLogout.lp_url || rawAutoLogout.lpUrl || '',
  signoutUrl: rawAutoLogout.signout_url || rawAutoLogout.signoutUrl || '',
  generatedJs: rawAutoLogout.generated_js || rawAutoLogout.generatedJs || '',
});

export const buildAutoLogoutApiPayload = (config) => ({
  lp_url: config?.lpUrl || '',
  signout_url: config?.signoutUrl || '',
  generated_js: config?.generatedJs || '',
});
