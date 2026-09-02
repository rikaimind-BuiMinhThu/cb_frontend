import { TIMER_TYPES, TIMER_VARIABLES } from 'v2/views/BotElement/BotSetting/PreviewComponent/Constants';
import _ from 'lodash';
import { initialTimeConfig } from '../constants/scenarioFormConstants';
import {
  buildAutoLogoutApiPayload,
  createEmptyAutoLogoutConfig,
  parseAutoLogoutFromApi,
} from './autoLogoutUtils';
import {
  LP_INTEGRATION_MODES,
  normalizeAmazonPayConfig,
} from '../../../../../variables/amazonPayConstants';
import {
  normalizeAllowedLpDomains,
  parseAmazonPayConfigFromApi,
} from './amazonPayConfigUtils';
import {
  DEFAULT_EXECUTION_POLICY,
  EXECUTION_POLICIES,
} from '../../../../../variables/constants';

const parseExecutionPolicy = (data) => {
  const knownPolicies = Object.values(EXECUTION_POLICIES);
  if (knownPolicies.includes(data.execution_policy)) {
    return data.execution_policy;
  }
  return data.isUseFukushashiki ? EXECUTION_POLICIES.FUKUSHASHIKI : DEFAULT_EXECUTION_POLICY;
};

export const cleanMessageTimerConfig = (config) => {
  const cleanedConfig = { ...config };
  const takenField = {
    isShow: true,
    useHtml: true,
    content: true,
  };

  const messages = {
    finish: {},
    counting: {},
  };

  Object.keys(cleanedConfig.messages.finish).forEach((key) => {
    if (takenField[key]) {
      messages.finish[key] = cleanedConfig.messages.finish[key];
    }
  });

  Object.keys(cleanedConfig.messages.counting).forEach((key) => {
    if (takenField[key]) {
      messages.counting[key] = cleanedConfig.messages.counting[key];
    }
  });

  cleanedConfig.messages = messages;
  return cleanedConfig;
};

export const parseTimerConfigFromApi = (resTimerConfig) => {
  const timerConfig = {
    isOpen: false,
    enable: false,
  };

  const scenarioTimerConfig = {
    duration: resTimerConfig?.duration || initialTimeConfig.duration,
    messages: {
      ...initialTimeConfig.messages,
      ...(resTimerConfig?.messages || {}),
    },
    type: resTimerConfig?.type || TIMER_TYPES.COUNTING_DOWN,
    isRealtimeRemainingTime: resTimerConfig?.isRealtimeRemainingTime ?? initialTimeConfig.isRealtimeRemainingTime,
  };

  timerConfig.temp = scenarioTimerConfig;
  timerConfig.final = scenarioTimerConfig;
  timerConfig.enable = !!resTimerConfig?.enable;
  timerConfig.variables = TIMER_VARIABLES[scenarioTimerConfig.type];

  return timerConfig;
};

export const parseScenarioResponse = (res) => {
  const data = res?.data?.data || {};
  const conversation = data.conversation || {};
  const executionPolicy = parseExecutionPolicy(data);

  return {
    dataMessages: (conversation.messages || []).map((message) => ({
      ...message,
      conditions: message.conditions || [],
    })),
    scenarioName: data.scenario_name || '',
    scenarioType: data.scenario_type || 'payment',
    clientCartSystem: data.cart_system ?? null,
    urlThanks: conversation.urlThanksPage || '',
    merchandiseId: data.merchandise_id || '',
    isUsedCartConfirmPage: conversation.isUsedCartConfirmPage || false,
    urlCartConfirmPage: conversation.urlCartConfirmPage || '',
    coupon: conversation.coupon || '',
    lpProductUrl: data.tamagoLandingPageUrl || '',
    isUseOnlyRegularOrder: data.isUseOnlyRegularOrder || false,
    executionPolicy,
    isUseFukushashiki: executionPolicy === EXECUTION_POLICIES.FUKUSHASHIKI,
    isUseCustomCss: data.is_used_custom_css || false,
    customCssContent: {
      temp: data.custom_css_content || '',
      final: data.custom_css_content || '',
    },
    isUseHtmlUgc: data.is_used_html_ugc || false,
    isUgcInstagram: data.is_ugc_instagram || false,
    isUgcTiktok: data.is_ugc_tiktok || false,
    isUgcReview: data.is_ugc_review || false,
    ugcEnv: data.ugc_env || 'staging',
    htmlUgcConfigContent: {
      temp: data.html_ugc_config_content || '',
      final: data.html_ugc_config_content || '',
    },
    isUseCustomJsCode: data.is_used_custom_js_code || false,
    headCustomJsCode: {
      temp: data.head_custom_js_code || '',
      final: data.head_custom_js_code || '',
    },
    topBodyCustomJsCode: {
      temp: data.top_body_custom_js_code || '',
      final: data.top_body_custom_js_code || '',
    },
    bottomBodyCustomJsCode: {
      temp: data.bottom_body_custom_js_code || '',
      final: data.bottom_body_custom_js_code || '',
    },
    isUseErrMsgByJs: data.is_used_err_msg_by_js || false,
    errMsgJsCode: data.err_msg_js_code || '',
    errMsgSettingMode: data.err_msg_setting_mode || 'js',
    errMsgFieldSelectors: data.err_msg_field_selectors || '',
    errMsgFormSelectors: data.err_msg_form_selectors || '',
    launchButtonSelectors: data.launch_button_selectors || '',
    isUsedMessageLoadedPast: data.is_used_message_loaded_past || false,
    isUsedCrosssell: !!data.is_used_crosssell,
    productIdCrossSell: data.product_id_cross_sell || '',
    isClearLandingPageSession: data.is_clear_landing_page_session || false,
    autoLogoutConfig: (() => {
      const parsed = parseAutoLogoutFromApi(
        data.auto_logout || conversation.auto_logout || {},
      );
      return {
        temp: { ...parsed },
        final: { ...parsed },
      };
    })(),
    isUseBtnUpdateTracking: conversation.isUseBtnUpdateTracking || false,
    isUseGlobalDelay: conversation.isUseGlobalDelay || false,
    globalDelayTime: conversation.globalDelayTime ?? 1.0,
    useFullwidthChatbotMobile: data.use_fullwidth_chatbot_mobile || false,
    timerConfig: parseTimerConfigFromApi(data.timer_config),
    allowedLpDomains: normalizeAllowedLpDomains(data.allowed_lp_domains || []),
    lpIntegrationMode: data.lp_integration_mode || LP_INTEGRATION_MODES.AUTO,
    amazonPayConfig: parseAmazonPayConfigFromApi(data.amazon_pay_config),
    isUseAmazonPay: data.is_use_amazon_pay ?? (normalizeAllowedLpDomains(data.allowed_lp_domains || []).length > 0),
  };
};

export const buildScenarioSavePayload = (state) => {
  const {
    dataMessages,
    urlThanks,
    urlCartConfirmPage,
    isUsedCartConfirmPage,
    coupon,
    isUseBtnUpdateTracking,
    isUseGlobalDelay,
    globalDelayTime,
    scenarioName,
    scenarioType,
    merchandiseId,
    lpProductUrl,
    isUseOnlyRegularOrder,
    executionPolicy,
    isUseCustomCss,
    customCssContent,
    isUseHtmlUgc,
    isUgcInstagram,
    isUgcTiktok,
    isUgcReview,
    ugcEnv,
    htmlUgcConfigContent,
    isUseCustomJsCode,
    headCustomJsCode,
    topBodyCustomJsCode,
    bottomBodyCustomJsCode,
    timerConfig,
    isUseErrMsgByJs,
    errMsgJsCode,
    errMsgSettingMode,
    errMsgFieldSelectors,
    errMsgFormSelectors,
    launchButtonSelectors,
    isUsedMessageLoadedPast,
    useFullwidthChatbotMobile,
    isUsedCrosssell,
    productIdCrossSell,
    isClearLandingPageSession,
    autoLogoutConfig,
    allowedLpDomains,
    amazonPayConfig,
    isUseAmazonPay,
  } = state;

  return {
    conversation: {
      messages: _.cloneDeep(dataMessages),
      urlThanksPage: urlThanks,
      urlCartConfirmPage,
      isUsedCartConfirmPage,
      coupon,
      isUseBtnUpdateTracking,
      isUseGlobalDelay,
      globalDelayTime,
    },
    scenario_name: scenarioName,
    scenario_type: scenarioType,
    merchandise_id: merchandiseId,
    landing_page_product_url: lpProductUrl,
    is_use_only_regular_order: isUseOnlyRegularOrder,
    execution_policy: executionPolicy,
    is_used_fukushashiki: executionPolicy === EXECUTION_POLICIES.FUKUSHASHIKI,
    is_use_amazon_pay: isUseAmazonPay,
    allowed_lp_domains: isUseAmazonPay ? allowedLpDomains : [],
    lp_integration_mode: isUseAmazonPay ? LP_INTEGRATION_MODES.GENERIC : LP_INTEGRATION_MODES.AUTO,
    amazon_pay_config: isUseAmazonPay
      ? normalizeAmazonPayConfig(amazonPayConfig)
      : normalizeAmazonPayConfig({}),
    is_used_custom_css: isUseCustomCss,
    custom_css_content: customCssContent.final,
    is_used_html_ugc: isUseHtmlUgc,
    is_ugc_instagram: isUgcInstagram,
    is_ugc_tiktok: isUgcTiktok,
    is_ugc_review: isUgcReview,
    ugc_env: ugcEnv,
    html_ugc_config_content: htmlUgcConfigContent.final,
    is_used_custom_js_code: isUseCustomJsCode,
    head_custom_js_code: headCustomJsCode.final,
    top_body_custom_js_code: topBodyCustomJsCode.final,
    bottom_body_custom_js_code: bottomBodyCustomJsCode.final,
    timer_config: cleanMessageTimerConfig({
      enable: timerConfig.enable,
      type: timerConfig.final.type,
      variables: timerConfig.variables,
      duration: timerConfig.final.duration,
      messages: timerConfig.final.messages,
      isRealtimeRemainingTime: timerConfig.final.isRealtimeRemainingTime,
    }),
    is_used_err_msg_by_js: isUseErrMsgByJs,
    err_msg_js_code: errMsgJsCode,
    err_msg_setting_mode: errMsgSettingMode || 'js',
    err_msg_field_selectors: errMsgFieldSelectors,
    err_msg_form_selectors: errMsgFormSelectors,
    launch_button_selectors: launchButtonSelectors,
    is_used_message_loaded_past: isUsedMessageLoadedPast,
    use_fullwidth_chatbot_mobile: useFullwidthChatbotMobile,
    is_used_crosssell: isUsedCrosssell,
    product_id_cross_sell: isUsedCrosssell ? productIdCrossSell : null,
    is_clear_landing_page_session: isClearLandingPageSession,
    auto_logout: isClearLandingPageSession
      ? buildAutoLogoutApiPayload(autoLogoutConfig?.final || createEmptyAutoLogoutConfig().final)
      : buildAutoLogoutApiPayload(createEmptyAutoLogoutConfig().final),
  };
};
