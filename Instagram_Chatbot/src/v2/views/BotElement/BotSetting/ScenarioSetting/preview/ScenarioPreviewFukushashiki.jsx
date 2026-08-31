import React, { useEffect, useRef, useReducer, useState, useCallback } from "react";
import Cookies from "js-cookie";
import CustomButton from "../../CustomButton";
import {
  UserMessage, BotMessage, CombineMessage, CombineMessageNextButton,
  PreviewClosedLauncher, PreviewOpenChatFrame, PreviewMessagesList,
} from "../../PreviewComponent";
import PreviewFukushashikiReducer from "../../PreviewFukushashiki/PreviewFukushashikiReducer";
import "moment/locale/zh-cn";
import {
  CHATBOT_ACTIONS,
  NO_ERROR,
  GETTING_ERROR_NOTIFICATION,
  CART_SYSTEM,
  CONVERSTION_RESPONSE_STATUS,
  PREVIEW_ACTIONS,
  RENDER_CHATBOT_CONFIG,
  BOT_MESSAGE_TYPES,
  CONVERSION_RESPONSE_SUBMIT_TYPE,
  CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE,
  DISPLAY_TYPES,
} from "../../PreviewComponent/Constants";
import { injectBotThemeCss } from "v2/utils/chatbotThemeCss";
import { COLOR_MAP } from "v2/views/BotElement/BotSetting/DesignSetting/constants/designChatbotConstants";
import {
  getPrefectures,
  getScenarioPreviewData,
  sleep,
  changeElementAttributeById,
  userEntryScenario,
  isDislayingLoginForm,
  getElementMessageById,
  sendOpenChatbotCountRequest,
  sendCloseChatbotCountRequest,
  isInteractiveMessage,
  sendLogMessageToServer,
  updateStatusConversion,
  isButtonSubmitMessage,
  createScenarioUserResponseMessageHistory,
  sendErrorLogToServer,
} from "../../PreviewComponent/Utils";
import {
  getChatbotSavedState,
  savedChatbotState,
  saveCheckpointTime,
  savePrevOpenStatus,
  getPrevOpenStatus,
  getTimerConfig,
  setTimerConfig
} from "../../PreviewComponent/SessionStorageUtils";
import { isTokyoDeveloLP, UPDATE_TOKYO_DEVELO_LP_PREFECTURE_JS_CODE } from "../../PreviewComponent/TokyoLPUtils";
import ProcessBar from "../../PreviewComponent/ProcessBar";
import ZipCodePopUp from "../../PreviewComponent/ZipCodePopUp";
import _ from "lodash";
import Timer from "../../Timer";
import { clearChatbotState } from "../../PreviewComponent/previewSessionUtils";
import { getBotInforFromPreviewResponse } from "../../PreviewComponent/previewBotInfoUtils";
import {
  getBotHeaderIconUrl as resolveBotHeaderIconUrl,
  getOpeningBotStyle as buildOpeningBotStyle,
} from "../../PreviewComponent/previewOpeningStyles";
import {
  mapRawDesignSettingsFromExtract,
} from "../../PreviewComponent/previewDesignStateUtils";
import { createPreviewInitialState } from "../../PreviewComponent/createPreviewInitialState";
import { shouldShowPreventExitModal } from "../../PreviewComponent/preventExitModalUtils";
import {
  setConversionParamToLocalStorage, fukushashikiSavedStateToLp, fukushashikiToLP,
  executeLpJsCode, postMessageToParent
} from "../../PreviewFukushashiki/LPUtils";
import { resolveErrMsgLpScript } from "../utils/resolveErrMsgLpScript";
import { generateLaunchButtonLpScript } from "../utils/launchButtonLpScriptUtils";
import { convertToFukushashikiObject } from "../../PreviewFukushashiki/FukushashikiDataConverterUtils";
import { handleValidateField } from "../../PreviewFukushashiki/ValidationUtils";
import { createOrAddLinesCart } from "../../ShopifyUtils";
import { injectHtmlUgcConfigContent } from "../../PreviewComponent/BotMessageUtils";
import { buildEditorDraftPreviewUpdate } from "./buildPreviewStateFromDraft";
import { buildScenarioPreviewHeaderMeta } from "./buildScenarioPreviewHeaderMeta";
import {
  calculateTimerConfigDuration,
  getTimerConfigVariable,
} from "./timerPreviewUtils";
import {
  postToParent,
  SCENARIO_PREVIEW_MESSAGES,
} from "./scenarioPreviewBridge";
import { resolveEditorPreviewBotInfor } from "./editorPreviewUtils";
import {
  usePreviewConversionOnOpen,
  usePreviewIpParams,
  usePreviewDesignSettings,
  usePreviewParentSync,
  usePreviewCustomJs,
  usePreviewThemeCss,
  usePreviewScenarioBootstrap,
  usePreviewAutoScroll,
  usePreviewMessageReveal,
} from "../../PreviewComponent/hooks";

const isPreviewMobile = (deviceMode) => deviceMode === 'sp';

savePrevOpenStatus("0");
var url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let isLoggedIn = params.get('isLoggedIn') === "true";
const previewInitialState = createPreviewInitialState("fukushashiki", {
  params,
  includeOpenAnimation: false,
});


const ScenarioPreviewFukushashiki = ({
  previewDeviceMode = 'pc',
  editorCustomCss,
  editorHtmlUgc,
  embedded = false,
  editorPreview = false,
  editorDraft = null,
}) => {
  const [state, dispatch] = useReducer(PreviewFukushashikiReducer, previewInitialState);
  const [timerChanges, setTimerChanges] = useState({ timeLeft: -1, config: null });
  const containerRef = useRef(null);
  const hasSentCustomJs = useRef(false);
  const [useSharedBootstrap, setUseSharedBootstrap] = useState(() => !getChatbotSavedState());
  const hasSentInitialOpenStateToParent = useRef(false);
  const [msgUpdateState, setMsgUpdateState] = useState({});
  const msgUpdateStateRef = useRef({});

  useEffect(() => {
    if (!editorPreview) return;
    clearChatbotState();
  }, [editorPreview]);

  useEffect(() => {
    if (!editorPreview || !editorDraft) return;

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
      payload: buildEditorDraftPreviewUpdate(editorDraft),
    });
  }, [editorPreview, editorDraft]);

  useEffect(() => {
    if (!editorPreview) return;

    const botInfor = resolveEditorPreviewBotInfor(state.botInfor);
    const isOpen = embedded || editorPreview || state.isOpen;
    postToParent({
      type: SCENARIO_PREVIEW_MESSAGES.PREVIEW_BOT_META,
      payload: buildScenarioPreviewHeaderMeta(botInfor, {
        isOpen,
        themeSettings: state.themeSettings,
      }),
    });
  }, [
    editorPreview,
    embedded,
    state.botInfor,
    state.isOpen,
    state.themeSettings,
  ]);

  useEffect(() => { 
    if (!state.isUseBtnUpdateTracking) return;
    msgUpdateStateRef.current = msgUpdateState; 
  }, [msgUpdateState]);

  // Initialize conversion status when chatbot opens
  useEffect(() => {
    if (!state.isUseBtnUpdateTracking) return;

    const spBody = document.getElementById('sp-body');
    if (!spBody) return;

    const handleChange = (e) => {
      const msgContainer = e.target.closest('.sp-body-user-side');
      if (!msgContainer) return;

      const btn = msgContainer.querySelector('button.btn-update');
      if (btn) btn.classList.remove('btn-update');

      const rawId = msgContainer.id?.replace('msg_id_', '');
      const msgId = rawId ? parseInt(rawId) : NaN;
      if (!isNaN(msgId) && msgUpdateStateRef.current[msgId] === 'clicked') {
        setMsgUpdateState(prev => ({ ...prev, [msgId]: 'editing' }));
      }
    };

    spBody.addEventListener('change', handleChange, true);

    return () => {
      spBody.removeEventListener('change', handleChange, true);
    };
  }, [state.isUseBtnUpdateTracking, state.isOpen]);

  usePreviewConversionOnOpen({ state, dispatch, enabled: !editorPreview });
  usePreviewIpParams({ state, dispatch, enabled: !editorPreview });
  usePreviewDesignSettings({
    state,
    dispatch,
    params,
    refreshPolicy: "untilDisplayTypeSet",
    designSource: "raw",
    includeOpenAnimation: false,
    enabled: !editorPreview,
  });

  const applyScenarioTheme = useCallback((botInfor, themeSettings) => {
    if (!botInfor) return;
    const chatbot = botInfor;
    const apiColorKey = chatbot.main_color && !String(chatbot.main_color).startsWith('#')
      ? chatbot.main_color
      : null;
    const mainColorHex = chatbot.main_color_other
      || COLOR_MAP[chatbot.main_color]
      || chatbot.main_color
      || '#327AED';
    injectBotThemeCss(themeSettings, mainColorHex, apiColorKey);
  }, []);

  const eventHandler = async (event) => {
    if (!event.data || !event.data.actionData) return;

    if (editorPreview) {
      const blockedInEditor = [
        CHATBOT_ACTIONS.GET_ERROR_MESSAGE,
        CHATBOT_ACTIONS.GET_ERROR_MESSAGE_WITH_DISPLAY_MSG,
        CHATBOT_ACTIONS.OPEN_PREVIEW,
      ];
      if (blockedInEditor.includes(event.data.action)) {
        return;
      }
    }

    const actionData = event.data.actionData;

    switch (event.data.action) {
      case CHATBOT_ACTIONS.UPDATE_CREDIT_CARD_FORM:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_CREDIT_CARD_FORM,
          payload: actionData,
        });
      case CHATBOT_ACTIONS.CRAWL_DATA:
        let receiveOptionData = {};
        receiveOptionData[actionData.searchAddress] = actionData.result;

        return dispatch({
          type: PREVIEW_ACTIONS.ADD_LP_OPTION_DATA,
          payload: receiveOptionData
        });

      case CHATBOT_ACTIONS.GET_ERROR_MESSAGE_WITH_DISPLAY_MSG: {
        const error = actionData.error === NO_ERROR ? "" : actionData.error;
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG,
          payload: {
            error: error,
            displayMsg: actionData.displayMsg
          }
        });
      }

      case CHATBOT_ACTIONS.GET_ERROR_MESSAGE:
        await sleep(1000);
        const error = actionData === NO_ERROR ? "" : actionData;
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE,
          payload: error
        });

      case CHATBOT_ACTIONS.OPEN_PREVIEW:
        if (!state.isOpen)
          return onOpenPreview(true);
        break;

      case CHATBOT_ACTIONS.GET_PREVIEW_ORDER_CONTENT:
      case CHATBOT_ACTIONS.PREVIEW_OBJECT:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_PREVIEW_ORDER_CONTENT,
          payload: actionData
        });

      case CHATBOT_ACTIONS.UPDATE_AMAZON_PAY_DATA:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA,
          payload: actionData,
        });

      case CHATBOT_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_BLISS:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_BLISS,
          payload: actionData,
        });
      case CHATBOT_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_ROSEMAY:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_ROSEMAY,
          payload: actionData,
        });
      case CHATBOT_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_PHYSTECH:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_PHYSTECH,
          payload: actionData,
        });
      case CHATBOT_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_YUWAERU:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_YUWAERU,
          payload: actionData,
        });

      case CHATBOT_ACTIONS.UPDATE_AMAZON_PAY_DATA_BY_SELECTOR:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA_BY_SELECTOR,
          payload: actionData,
        });

      case CHATBOT_ACTIONS.UPDATE_NUMBER_ORDER_TO_UPSELL:
        if (actionData) {
          const variables = Object.entries(actionData).map(([k, v]) => ({
            variable_name: k,
            default_value: String(v),
          }));

          return dispatch({
            type: PREVIEW_ACTIONS.UPDATE_NUMBER_ORDER_TO_UPSELL,
            payload: {variables, objParam: actionData}
          });
        }
        break;

      case CHATBOT_ACTIONS.LP_FIELD_CHANGED:
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_LP_FIELD_VALUE,
          payload: actionData,
        });

      default:
        // TODO
        break;
    }
  };

  usePreviewParentSync({
    state,
    eventHandler,
    hasSentInitialOpenStateToParent,
    syncInitialOpen: false,
    enabled: !editorPreview,
  });

  useEffect(() => {
    if (embedded) return undefined;
    if (isPreviewMobile(previewDeviceMode)) {
      document.body.classList.add('is_mobile');
    } else {
      document.body.classList.remove('is_mobile');
    }
    return () => {
      document.body.classList.remove('is_mobile');
    };
  }, [previewDeviceMode, embedded]);

  // post message to parent window
  useEffect(() => {
    if (editorPreview) return;
    if (!state.urlReceive) return;
    const options = {
      isOpen: state.isOpen,
      widthPc: state.widthPc,
      heightPc: state.heightPc,
      widthSp: state.widthSp,
      heightSp: state.heightSp,
      chatbotRight: state.rightMarginPc,
      chatbotBottom: state.bottomMarginPc,
    };
    postMessageToParent(options, state);
  }, [
    editorPreview,
    state.urlReceive,
    state.isOpen,
    state.widthPc,
    state.heightPc,
    state.widthSp,
    state.heightSp,
    state.rightMarginPc,
    state.bottomMarginPc
  ]);

  // Get prefectures
  useEffect(() => {
    if (!state.loadedStateFromSession) return;
    if (state.prefecturesList.length !== 0) return;

    getPrefectures()
      .then((res) => {
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_PREFECTURES_LIST, payload: { prefecturesList: res.data.data } });
      })
  }, [state.prefecturesList, state.loadedStateFromSession]);

    // For run errorJsCode
  useEffect(() => {
    if (editorPreview) return undefined;
    if (!state.isUsedErrMsgByJs) return undefined;
    const jsCode = resolveErrMsgLpScript(state);
    if (jsCode) executeLpJsCode(jsCode, state);
    return undefined;
  }, [
    editorPreview,
    state.isUsedErrMsgByJs,
    state.errMsgJsCode,
    state.errMsgSettingMode,
    state.errMsgFieldSelectors,
    state.errMsgFormSelectors,
    state.themeSettings,
    state.botInfor,
  ]);

  useEffect(() => {
    if (editorPreview) return undefined;
    if (!state.launchButtonSelectors) return undefined;
    const jsCode = generateLaunchButtonLpScript(state.launchButtonSelectors);
    if (jsCode) executeLpJsCode(jsCode, state);
    return undefined;
  }, [editorPreview, state.launchButtonSelectors]);

  usePreviewCustomJs({ state, hasSentCustomJs, enabled: !editorPreview });

  const cssEnabled = editorCustomCss?.isUseCustomCss ?? state.isUsedCustomCss;
  const cssContent = editorCustomCss?.isUseCustomCss
    ? editorCustomCss.content
    : state.customCssContent;

  useEffect(() => {
    const existing = document.getElementById('custom-css');
    if (existing) {
      existing.remove();
    }
    if (!cssEnabled || !cssContent) {
      return undefined;
    }
    const style = document.createElement('style');
    style.id = 'custom-css';
    style.innerHTML = cssContent;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [cssEnabled, cssContent]);

  const htmlUgcEnabled = editorHtmlUgc?.isUseHtmlUgc ?? state.isUsedHtmlUgc;
  const htmlUgcContent = editorHtmlUgc?.isUseHtmlUgc
    ? editorHtmlUgc.content
    : state.htmlUgcConfigContent;

  useEffect(() => {
    if (!htmlUgcEnabled || !htmlUgcContent) return undefined;
    return injectHtmlUgcConfigContent(htmlUgcContent);
  }, [htmlUgcEnabled, htmlUgcContent]);

  usePreviewThemeCss({
    state,
    enabled: !embedded,
    applyTheme: applyScenarioTheme,
  });

  // Editor preview: hydrate bot/scenario ids then fetch scenario data
  useEffect(() => {
    if (!editorPreview) return undefined;
    if (state.loadedStateFromSession) return undefined;

    if (!state.botId) {
      const currentBotId = params.get('bot_id') || Cookies.get('bot_id');
      if (currentBotId) {
        dispatch({ type: PREVIEW_ACTIONS.SET_BOT_ID, payload: currentBotId });
      }
      return undefined;
    }

    if (!state.scenarioId) {
      const currentScenarioId = params.get('scenario_id') || Cookies.get('scenario_id');
      if (currentScenarioId) {
        dispatch({ type: PREVIEW_ACTIONS.SET_SCENARIO_ID, payload: currentScenarioId });
      }
      return undefined;
    }

    return getScenarioPreviewData(state.botId, state.scenarioId)
      .then(extractStateFromPreviewResponse);
  }, [editorPreview, state.botId, state.scenarioId, state.loadedStateFromSession]);

  // Fukushashiki session restore (upsell, LP sync, timer) — not covered by shared bootstrap hook
  useEffect(() => {
    if (editorPreview) return undefined;
    if (useSharedBootstrap) return undefined;
    if (state.loadedStateFromSession) return undefined;

    const savedState = getChatbotSavedState();
    if (!savedState) {
      setUseSharedBootstrap(true);
      return undefined;
    }

    const currentBotId = params.get("order_id") || params.get("bot_id") || Cookies.get("bot_id");
    if (currentBotId && currentBotId !== savedState.botId) {
      clearChatbotState();
      dispatch({ type: PREVIEW_ACTIONS.SET_UPSELL_BOT_ID, payload: currentBotId });
      return getScenarioPreviewData(currentBotId, params.get("scenario_id"))
        .then(extractStateFromPreviewResponse);
    }

    setConversionParamToLocalStorage(
      savedState.scenarioId,
      'web',
      savedState.userInputId || params.get("uuid"),
      params.get("env") || "production",
      savedState
    );

    if (isLoggedIn) {
      return dispatch({
        type: PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SESSION_STORAGE,
        payload: {
          savedState,
          isLoggedIn: isLoggedIn,
          isUsingAmazonPay: params.get('is_using_amazon_pay')
        }
      });
    }

    const timerConfig = getTimerConfig();
    if (timerConfig) {
      setTimerChanges({ timeLeft: calculateTimerConfigDuration(timerConfig?.config?.type, timerConfig?.config?.duration, { timerLeft: timerConfig.timeLeft, useTimerLeft: true }), config: timerConfig });
    }

    return fukushashikiSavedStateToLp(savedState, params, state).then(async () => {
      if (isTokyoDeveloLP(savedState.urlReceive)) {
        executeLpJsCode(UPDATE_TOKYO_DEVELO_LP_PREFECTURE_JS_CODE, savedState);
      }

      return dispatch({
        type: PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SESSION_STORAGE,
        payload: {
          savedState,
          isLoggedIn: isLoggedIn,
          isUsingAmazonPay: params.get('is_using_amazon_pay')
        }
      });
    });
  }, [editorPreview, useSharedBootstrap, state.loadedStateFromSession]);

  usePreviewScenarioBootstrap({
    state,
    dispatch,
    params,
    enabled: !editorPreview && useSharedBootstrap,
    onExtractState: (res) => extractStateFromPreviewResponse(res),
  });
  usePreviewAutoScroll({
    state,
    enabled: !editorPreview && !state.isUpsell,
    enableScrollAuto: true,
    dependencyLength:
      (state.renderMessagesList?.length ?? 0) + (state.submitErrorMessage ? 1 : 0),
  });

  useEffect(() => {
    if (
      state.loadedStateFromSession &&
      state.displayType === DISPLAY_TYPES.RELOAD &&
      !state.isOpen &&
      state.messagesList.length > 0 &&
      state.botInfor &&
      !state.manuallyClosed
    ) {
      setTimeout(() => {
        dispatch({ type: PREVIEW_ACTIONS.OPEN_CHATBOT });
      }, 1000);
    }
  }, [state.loadedStateFromSession, state.displayType, state.isOpen, state.messagesList.length, state.botInfor, state.manuallyClosed]);

  usePreviewMessageReveal({
    state,
    dispatch,
    delayMs: RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE,
    enabled: !editorPreview,
    shouldLogAppear: isInteractiveMessage,
  });

  const renderNextMessage = () => {
    if (editorPreview) return;
    if (state.currentMsgIndex + 1 >= state.nextStopMsgIndex) return;

    const newMsgIndex = state.currentMsgIndex + 1;
    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
      payload: {
        startIndex: 0,
        endIndex: state.currentMsgIndex + 1 + 1,
        fromCallback: true,
      }
    });
    if (newMsgIndex < state.messagesList.length && isInteractiveMessage(state.messagesList[newMsgIndex])) {
      createScenarioUserResponseMessageHistory({
        scenario_id: state.scenarioId,
        user_id: state.uuid,
        msgs: [{ id: state.messagesList[newMsgIndex].id, type: CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE.APPEAR }],
      });
    }
  }

  const setShowPopupCloseBot = (value) => {
    dispatch({ type: PREVIEW_ACTIONS.SET_SHOW_POPUP_CLOSE_BOT, payload: value });
  };

  const onOpenPreview = (opening) => {
    if (editorPreview) {
      if (opening) {
        dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { isOpen: true } });
      } else if (!state.showPopupCloseBot
        && shouldShowPreventExitModal(state.botInfor, state.activePopupCloseBot)) {
        // Bug #11: editor preview cũng chỉ hiện modal khi 離脱防止 hoặc popup_close_bot bật.
        dispatch({ type: PREVIEW_ACTIONS.OPEN_POPUP_CLOSE_BOT_MODAL });
      } else {
        dispatch({ type: PREVIEW_ACTIONS.CLOSE_CHATBOT });
      }
      return;
    }

    const deviceReceive = state.deviceReceive || params.get("deviceReceive");
    if (!deviceReceive) return;

    // Send data to count open chatbot window
    const prevOpenStatus = getPrevOpenStatus();

    if (prevOpenStatus == "0" && opening) {
      savePrevOpenStatus("1");
      sendOpenChatbotCountRequest(state.scenarioId, deviceReceive);
    }

    const timerChatbotStorage = getTimerConfig();
    setTimerChanges((timerChanges) => timerChatbotStorage || timerChanges);

    if (!opening && !state.showPopupCloseBot
      && shouldShowPreventExitModal(state.botInfor, state.activePopupCloseBot)) {
      return dispatch({ type: PREVIEW_ACTIONS.OPEN_POPUP_CLOSE_BOT_MODAL });
    }

    // post message to parent window
    postMessageToParent({ isOpen: opening}, state);

    if (state.alreadyOpenFirstTime || state.isAlreadyOpenFirstTime) {
      if (!opening) {
        return dispatch({ type: PREVIEW_ACTIONS.CLOSE_CHATBOT });
      }

      return userEntryScenario({
        scenario_id: state.scenarioId,
        user_id: state.uuid,
      }).then(() => {
        dispatch({ type: PREVIEW_ACTIONS.OPEN_CHATBOT });
      });
    }

    if (opening) {
      sendOpenChatbotCountRequest(state.scenarioId, deviceReceive).then(() => {
        dispatch({ type: PREVIEW_ACTIONS.OPEN_CHATBOT });
      });
    } else {
      sendCloseChatbotCountRequest(state.scenarioId, deviceReceive).then(() => {
        dispatch({ type: PREVIEW_ACTIONS.CLOSE_CHATBOT });
      });
    }
  }

  const onChatbotHeaderClick = () => {
    if (!state.isOpen) return dispatch({ type: PREVIEW_ACTIONS.OPEN_CHATBOT });
    if (state.showPopupCloseBot) return;
    if (!shouldShowPreventExitModal(state.botInfor, state.activePopupCloseBot)) {
      return dispatch({ type: PREVIEW_ACTIONS.CLOSE_CHATBOT });
    }
    return dispatch({ type: PREVIEW_ACTIONS.OPEN_POPUP_CLOSE_BOT_MODAL });
  }


  const extractStateFromPreviewResponse = async (res) => {
    if (!res || !res.data || res.data.code !== 1) return;

    const designSetting = res.data.design_settings;
    const chatbot = res.data.chatbot;
    const conversation = res.data.data?.conversation;
    let newState = {
      ...state,
      botInfor: getBotInforFromPreviewResponse(res),
      objParam: {},
      loadedStateFromSession: true,
      messagesList: _.cloneDeep(conversation?.messages || []),
      isOpen: embedded || editorPreview ? true : (designSetting?.display_type && Number(designSetting?.display_type) === 1 || state.isOpen),
      ...mapRawDesignSettingsFromExtract(designSetting),
      isUsedErrMsgByJs: chatbot?.is_used_err_msg_by_js,
      errMsgJsCode: chatbot?.err_msg_js_code,
      errMsgSettingMode: chatbot?.err_msg_setting_mode || 'js',
      errMsgFieldSelectors: chatbot?.err_msg_field_selectors || '',
      errMsgFormSelectors: chatbot?.err_msg_form_selectors || '',
      launchButtonSelectors: chatbot?.launch_button_selectors || '',
      useNewProcess: chatbot?.client_cart_system === CART_SYSTEM.EC_FORCE,
      isUsedPastMessageLoaded: !!chatbot?.is_used_message_loaded_past,
      isProcessing: false,
      useFullWidthChatbotMobile: !!chatbot?.use_fullwidth_chatbot_mobile,
      merchandiseId: res.data.data?.merchandise_id,
      isUsedCrosssell: !!res.data.data?.is_used_crosssell,
      productIdCrossSell: res.data.data?.product_id_cross_sell || "",
      isUsedCustomJsCode: !!chatbot?.is_used_custom_js_code,
      headCustomJsCode: chatbot?.head_custom_js_code,
      topBodyCustomJsCode: chatbot?.top_body_custom_js_code,
      bottomBodyCustomJsCode: chatbot?.bottom_body_custom_js_code,
      isUsedCustomCss: !!chatbot?.is_used_custom_css,
      customCssContent: chatbot?.custom_css_content,
    };

    if (chatbot?.timer_config?.enable) {
      const timerConfig = chatbot.timer_config;
      setTimerChanges({ timeLeft: calculateTimerConfigDuration(timerConfig.type, timerConfig.duration), config: timerConfig });
    }

    if (!editorPreview) {
      const prevOpenStatus = getPrevOpenStatus();

      if (designSetting.display_type == DISPLAY_TYPES.RELOAD && prevOpenStatus == "0") {
        savePrevOpenStatus("1");
        sendOpenChatbotCountRequest(state.scenarioId, state.deviceReceive);
      }

      setConversionParamToLocalStorage(
        newState.scenarioId,
        'web',
        newState.userInputId || params.get("uuid"),
        params.get("env") || "production",
        newState
      );
    }

    saveCheckpointTime(res.data.data.updated_at);

    dispatch({
      type: PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SERVER,
      payload: {
        responseData: res.data,
        botInfor: getBotInforFromPreviewResponse(res),
        isLoggedIn: isLoggedIn,
        isUsingAmazonPay: params.get('is_using_amazon_pay'),
        isEditorPreview: editorPreview,
      },
    });
  }

  const handleOnCounting = (config) => (timer) => {
    const timerChanges = { timeLeft: timer, config };
    setTimerConfig(timerChanges);
    setTimerChanges(timerChanges);
  }

  const onClickNext = (clickedMsgIndex, clickedMsg) => {
    if (editorPreview) {
      return;
    }

    savedChatbotState(state);

    const data = {
      scenario_id: state.scenarioId,
      message: clickedMsg,
      user_id: state.uuid,
      bot_type: "web"
    };

    const validationResult = handleValidateField(clickedMsg, clickedMsgIndex);

    if (!validationResult.isValid) {
      dispatch({
        type: PREVIEW_ACTIONS.SET_ERRORS,
        payload: validationResult.errors
      });
      return sendErrorLogToServer(data);
    }

    if (state.isUseBtnUpdateTracking && !clickedMsg.buttonName) {
      setMsgUpdateState(prev => ({ ...prev, [clickedMsg.id]: 'clicked' }));
    }

    const isBtnUpdateClick = clickedMsgIndex < state.renderMessagesList.length - 1;
    const isShopify = state.cartSystem === CART_SYSTEM.SHOPIFY;

    if (isShopify) {
      sendLogMessageToServer(data, isBtnUpdateClick ? CONVERSION_RESPONSE_SUBMIT_TYPE.UPDATE : CONVERSION_RESPONSE_SUBMIT_TYPE.ADD);

      if (isButtonSubmitMessage(clickedMsg)) {
        createOrAddLinesCart(state);
      }
    } else {
      sendLogMessageToServer(data, isBtnUpdateClick ? CONVERSION_RESPONSE_SUBMIT_TYPE.UPDATE : CONVERSION_RESPONSE_SUBMIT_TYPE.ADD);
    }

    if (clickedMsg.button_jscode && clickedMsg.jscode.length > 0) {
      executeLpJsCode(clickedMsg.jscode, state);
    }

    if (clickedMsg.message_content[0]?.type === "button_submit"
      && clickedMsg.message_content[0]?.button_submit_id) {
      const buttonId = clickedMsg.message_content[0]?.button_submit_id;

      if (!isShopify) {
        postMessageToParent({
          action: CHATBOT_ACTIONS.CLICK_BUTTON,
          actionData: buttonId,
          isOpen: true,
        }, state);
      }
    }

    // For GINZA AIRA
    if (isDislayingLoginForm(clickedMsg)) return;

    const fukuData = convertToFukushashikiObject(data);
    fukushashikiToLP(fukuData, state);

    const isClickedButtonSubmit = isButtonSubmitMessage(state.messagesList[clickedMsgIndex]);
    const isClickedLastMessage = state.messagesList.length - 1 === clickedMsgIndex;

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_AFTER_CLICK_NEXT_BUTTON,
      payload: { clickedMsgIndex, clickedMsg, isLoggedIn: isLoggedIn}
    });

    if (isClickedButtonSubmit || isClickedLastMessage) {
      updateStatusConversion({
        scenario_id: state.scenarioId,
        user_input_id: state.uuid,
        status: CONVERSTION_RESPONSE_STATUS.FINISH,
      })
    }

    if (isClickedLastMessage && clickedMsg?.only_display_when_confirm && !state.submitErrorMessage && Object.keys(state.errors).length === 0) {
      setTimeout(() => {
        dispatch({ type: PREVIEW_ACTIONS.CLOSE_CHATBOT });
      }, 1000);
    }
  };

  const onChangeValue = (
    contentIndex,
    contentType,
    value,
    field,
    subField1,
    subField2,
    message
  ) => {
    // Early returns for invalid states
    if (!state.messagesList.length) return;

    savedChatbotState(state);

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_AFTER_CHANGE_VALUE,
      payload: {
        contentIndex,
        contentType,
        value,
        field,
        subField1,
        subField2,
        message,
      }
    });
  };

  const onOpenZipCodePopup = (isOpen, contentIndex, messageIndex) => {
    let newState = {};

    if (contentIndex !== undefined) {
      newState.zipcodeContentIndex = contentIndex;
    }
    if (messageIndex !== undefined) {
      newState.zipcodeIndex = messageIndex;
    }

    if (isOpen) {
      changeElementAttributeById([
        { id: "sp-withdrawal-container", style: { display: "block" }},
        { id: "sp-popup-zip-code-address", style: { display: "block" }}
      ]);

      newState = {
        ...newState,
        prefectures: null,
        cities: null,
        towns: null,
        zipcode: null,
      };
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { ...newState }
      });
      return;
    }

    changeElementAttributeById([
      { id: "sp-withdrawal-container", style: { display: "none" }},
      { id: "sp-popup-zip-code-address", style: { display: "none" }}
    ]);
  };

  const onChangeErrors = (field, value) => {
    let newErrors = { ...state.errors };
    newErrors[field] = value;
    dispatch({ type: PREVIEW_ACTIONS.SET_ERRORS, payload: { newErrors } });
  };

  const renderBotMessageContent = (message, messageIndex) => {
    if (!message || message.belong_to !== "bot" || !Array.isArray(message?.message_content)) return null;

    return message.message_content.map((content, contentIndex) => {
      if (editorPreview && content.type === BOT_MESSAGE_TYPES.DELAY) {
        return (
          <div
            key={`${messageIndex}-${contentIndex}`}
            id={getElementMessageById(message.id)}
            className={`sp-body-bot-side${editorPreview ? '' : ' slideRight'}`}
          >
            <div className="sp-body-bot-side-messages">
              <div className="ss-bot-message">
                <div className="ss-bot-message__content-wrapper">
                  {`${content.delay?.content || 0} 秒`}
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
      <BotMessage
        messageId={message.id}
        key={`${messageIndex}-${contentIndex}`}
        content={content}
        contentIndex={contentIndex}
        botInfor={state.botInfor}
        previewOrderContent={state.previewOrderContent}
        executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
        variables={state.variables}
        onRenderCompleted={editorPreview ? () => {} : renderNextMessage}
        hidden={editorPreview ? false : message.hidden}
        currentMsgIndex={state.currentMsgIndex}
        isBotOpen={state.isOpen}
        delayEachMessage={editorPreview ? 0 : RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE}
        isUseGlobalDelay={editorPreview ? false : state.isUseGlobalDelay}
        globalDelayTime={state.globalDelayTime}
        skipEntryDelay={editorPreview}
      />
      );
    });
  };

  const renderNextButton = (message, messageIndex) => {
    const isUpdate = messageIndex >= state.renderMessagesList.length - 1;
    const firstMsgContent = message?.message_content?.[0];
    const isDisplayBtnNext = (firstMsgContent?.type != "image" && !message.not_use_button) || (firstMsgContent?.type == "image" && firstMsgContent?.image?.displayButtonNext != false);
    const isAutoClick = !isDisplayBtnNext && isUpdate;

    if (!message || message.belong_to !== "user") return null;
    if (message.message_content[0]?.type === "button_submit") return null;

    const isBtnUpdateMode = state.isUseBtnUpdateTracking && !message.buttonName && !isUpdate;
    const msgState = msgUpdateState[message.id]; 

    let btnText = message.buttonName;
    if (!btnText) {
      if (isBtnUpdateMode && msgState === 'clicked') {
        btnText = "OK";
      } else {
        btnText = isUpdate ? "次へ" : "更新";
      }
    }
    const hasBtnUpdateClass = isBtnUpdateMode && msgState !== 'editing';
    const isEditorDisplayOnly = editorPreview;
    return (
      <div className="sp-user-message-button-action" style={{ display: isDisplayBtnNext ? "flex" : "none" }}>
        <CustomButton
          disabled={isEditorDisplayOnly || (state.submitErrorMessage?.length > 0 ? false : message.disabled)}
          style={{
            backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          }}
          className={`ss-user-message__action-btn${hasBtnUpdateClass ? " btn-update" : ""}`}
          onClick={isEditorDisplayOnly ? undefined : () => {
            onClickNext(messageIndex, message);
          }}
          autoClick={!isEditorDisplayOnly && isAutoClick && !state.isExtractFromSession}
          messsagetype={message.message_content[0]?.type}
        >
          {btnText}
        </CustomButton>
      </div>
    );
  };

  const renderUserMessageContent = (message, messageIndex) => {
    if (!message || message.belong_to !== "user") return null;
    if (!Array.isArray(message?.message_content) || message.message_content.length === 0) return null;

    return (
      <div className={`sp-body-user-side${editorPreview ? '' : ' slideLeft'}`} id={getElementMessageById(message.id)}>
        <div className="sp-body-user-side-messages">
          <UserMessage
            postMessageToParent={(options) => postMessageToParent(options, state)}
            message={message}
            captcha={state.captcha}
            messageContentProps={message.message_content}
            disabled={(state.submitErrorMessage?.length > 0 && state.submitErrorMessage !== GETTING_ERROR_NOTIFICATION) ? false : message.disabled}
            onChangeValue={(
              contentIndex,
              contentType,
              value,
              field,
              subField1,
              subField2
            ) =>
              onChangeValue(
                contentIndex,
                contentType,
                value,
                field,
                subField1,
                subField2,
                message
              )
            }
            currentMsgIndex={state.currentMsgIndex}
            onClickNext={() => {
              onClickNext(messageIndex, message)}
            }
            onRenderCompleted={editorPreview ? () => {} : renderNextMessage}
            messageIndex={messageIndex}
            errorsProps={state.errors}
            prefecturesList={[...state.prefecturesList]}
            onOpen={(isOpen, contentIndex) => {
              onOpenZipCodePopup(isOpen, contentIndex, Math.min(state.currentMsgIndex, messageIndex));
            }}
            onChangeErrors={(field, value) =>
              onChangeErrors(field, value)
            }
            variables={state.variables}
            lpOptionData={state.lpOptionData}
            submitErrorMessage={state.submitErrorMessage === GETTING_ERROR_NOTIFICATION ? "" : state.submitErrorMessage}
            botId={state.botId}
            isProcessing={!!state.isProcessing}
            cartSystem={state.cartSystem}
          />
          {renderNextButton(message, messageIndex)}
        </div>
      </div>
    );
  };

  const renderCombineMessageContent = (message, messageIndex) => {
    if (!message || message.belong_to !== "combine") return null;
    if (!Array.isArray(message?.message_content) || message.message_content.length === 0) return null;

    const isUpdate = messageIndex >= state.renderMessagesList.length - 1;

    return (
      <React.Fragment>
        <CombineMessage
          postMessageToParent={(options) => postMessageToParent(options, state)}
          message={message}
          captcha={state.captcha}
          disabled={(state.submitErrorMessage?.length > 0 && state.submitErrorMessage !== GETTING_ERROR_NOTIFICATION) ? false : message.disabled}
          onChangeValue={(
            contentIndex,
            contentType,
            value,
            field,
            subField1,
            subField2
          ) =>
            onChangeValue(
              contentIndex,
              contentType,
              value,
              field,
              subField1,
              subField2,
              message
            )
          }
          onClickNext={() => onClickNext(messageIndex, message)}
          messageIndex={messageIndex}
          errorsProps={state.errors}
          prefecturesList={[...state.prefecturesList]}
          onOpen={(isOpen, contentIndex) => {
            onOpenZipCodePopup(isOpen, contentIndex, Math.min(state.currentMsgIndex, messageIndex));
          }}
          onChangeErrors={(field, value) => onChangeErrors(field, value)}
          variables={state.variables}
          lpOptionData={state.lpOptionData}
          submitErrorMessage={state.submitErrorMessage === GETTING_ERROR_NOTIFICATION ? "" : state.submitErrorMessage}
          botId={state.botId}
          isProcessing={!!state.isProcessing}
          botInfor={state.botInfor}
          previewOrderContent={state.previewOrderContent}
          executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
          isBotOpen={state.isOpen}
          cartSystem={state.cartSystem}
        />
        <CombineMessageNextButton
          message={message}
          messageIndex={messageIndex}
          botInfor={state.botInfor}
          onClickNext={onClickNext}
          isUpdate={isUpdate}
          isExtractFromSession={state.isExtractFromSession}
        />
      </React.Fragment>
    );
  };

  const renderMessages = () => (
    <PreviewMessagesList
      messages={editorPreview
        ? (state.renderMessagesList || []).map((message) =>
            message.hidden ? { ...message, hidden: false } : message
          )
        : state.renderMessagesList}
      renderBotMessage={renderBotMessageContent}
      renderUserMessage={renderUserMessageContent}
      renderCombineMessage={renderCombineMessageContent}
    />
  );

  const renderSubmitErrorMessages = () => {
    if (!state.isUsedErrMsgByJs || !state.submitErrorMessage) return null;

    const className = state.submitErrorMessage === GETTING_ERROR_NOTIFICATION ? "ss-bot-getting-error-notification" : "ss-bot-submit-error-message";
    const text = state.submitErrorMessage === GETTING_ERROR_NOTIFICATION ? "処理中..." : state.submitErrorMessage;
    const htmlText = text.replace(/¥n/g, "<br/>");
    return (
      <div className="ss-user-setting__item-text_input-top">
        <div id="error-message"
          className={`error-message-modal ${className}`}
          dangerouslySetInnerHTML={{ __html: htmlText }}
        />
      </div>
    );
  }

  const headerIconSrc = resolveBotHeaderIconUrl(state.botInfor, state.isOpen);

  if (!editorPreview && (!state.scenarioId || !state.botInfor || state.displayType === null)) {
    return null;
  }

  const effectiveIsOpen = embedded || editorPreview || state.isOpen;
  const hasApiBotInfor = Boolean(
    state.botInfor?.title || state.botInfor?.main_color || state.botInfor?.main_color_other,
  );
  const displayBotInfor = editorPreview && !hasApiBotInfor
    ? resolveEditorPreviewBotInfor(state.botInfor)
    : state.botInfor;

  if (effectiveIsOpen) {
    const { frameClassName, cssVars } = buildOpeningBotStyle(state, {
      embedded,
      editorPreview,
      mobile: isPreviewMobile(previewDeviceMode),
    });
    return (
      <PreviewOpenChatFrame
        containerRef={containerRef}
        containerClassName={`sp-container1${editorPreview ? '' : (isPreviewMobile(previewDeviceMode) ? ' slideUpSp' : ' slideUp')}`}
        frameClassName={frameClassName}
        cssVars={cssVars}
        headerIconSrc={headerIconSrc}
        // Bug #5: title từ Basic Information khi header mở.
        title={displayBotInfor?.title}
        subtitle={displayBotInfor?.subtitle}
        titleBubble={displayBotInfor?.titleBubble}
        isOpen={state.isOpen}
        onHeaderClick={onChatbotHeaderClick}
        botConfig={state}
        showPopupCloseBot={state.showPopupCloseBot}
        onClosePopup={() => setShowPopupCloseBot(false)}
        onCloseBot={() => onOpenPreview(false)}
        overlays={(
          <ZipCodePopUp
            onOpen={onOpenZipCodePopup}
            prefecturesList={state.prefecturesList}
            message={state.messagesList[state.zipcodeIndex]}
            messageIndex={state.currentMsgIndex}
            zipcodeContentIndex={state.zipcodeContentIndex}
            onChangeValue={onChangeValue}
            onChangeErrors={onChangeErrors}
            errors={state.errors}
          />
        )}
        beforeBody={(
          <>
            {!!state.botInfor?.timer_config?.enable && (
              <div className="chatbot_timer_holder">
                <Timer
                  duration={calculateTimerConfigDuration(state.botInfor.timer_config.type, state.botInfor.timer_config.duration)}
                  timeLeft={timerChanges.timeLeft}
                  countMsg={state.botInfor.timer_config.messages.counting}
                  finishMsg={state.botInfor.timer_config.messages.finish}
                  variables={getTimerConfigVariable(state.botInfor.timer_config.variables)}
                  startCount={state.isOpen}
                  isRealtimeRemainingTime={state.botInfor.timer_config.isRealtimeRemainingTime}
                  scenarioId={state.scenarioId}
                  onCounting={handleOnCounting(state.botInfor.timer_config)}
                />
              </div>
            )}
            <ProcessBar
              botInfor={displayBotInfor}
              currentIndex={state.passedUserMsgCount}
              maxIndex={state.progressBarMaxIndex}
            />
          </>
        )}
      >
        {renderMessages()}
        {renderSubmitErrorMessages()}
      </PreviewOpenChatFrame>
    );
  }

  return (
    <PreviewClosedLauncher
      state={state}
      headerIconSrc={headerIconSrc}
      onOpen={onOpenPreview}
      isMobileView={isPreviewMobile(previewDeviceMode)}
      showFallback={false}
      spCircleUseParentOffsets={false}
      requireClosed={false}
      hideWhenDisplayHidden
    />
  );
}

export default ScenarioPreviewFukushashiki;
