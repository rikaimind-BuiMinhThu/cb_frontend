import { TIMER_TYPES, TIMER_VARIABLES } from '../../PreviewComponent/Constants';
import { initialTimeConfig } from '../constants/scenarioFormConstants';
import {
  buildAutoLogoutApiPayload,
  createEmptyAutoLogoutConfig,
  parseAutoLogoutFromApi,
} from './autoLogoutUtils';

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

  return {
    dataMessages: conversation.messages || [],
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
    isUseFukushashiki: data.isUseFukushashiki || false,
    isUseCustomCss: data.is_used_custom_css || false,
    customCssContent: {
      temp: data.custom_css_content || '',
      final: data.custom_css_content || '',
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
    useFullwidthChatbotMobile: data.use_fullwidth_chatbot_mobile || false,
    timerConfig: parseTimerConfigFromApi(data.timer_config),
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
    scenarioName,
    scenarioType,
    merchandiseId,
    lpProductUrl,
    isUseOnlyRegularOrder,
    isUseFukushashiki,
    isUseCustomCss,
    customCssContent,
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
  } = state;

  return {
    conversation: {
      messages: [...dataMessages],
      urlThanksPage: urlThanks,
      urlCartConfirmPage,
      isUsedCartConfirmPage,
      coupon,
      isUseBtnUpdateTracking,
    },
    scenario_name: scenarioName,
    scenario_type: scenarioType,
    merchandise_id: merchandiseId,
    landing_page_product_url: lpProductUrl,
    is_use_only_regular_order: isUseOnlyRegularOrder,
    is_used_fukushashiki: isUseFukushashiki,
    is_used_custom_css: isUseCustomCss,
    custom_css_content: customCssContent.final,
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
