import React, { useEffect, useRef, useReducer, useState } from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import Cookies from "js-cookie";
import CustomButton from "./CustomButton";
import {
  UserMessage, BotMessage, CombineMessage,
  PreviewClosedLauncher, PreviewOpenChatFrame, PreviewMessagesList,
} from "./PreviewComponent";
import UserMessageTailIcon from "./PreviewComponent/UserMessageTailIcon";
import { resolveUserMessageTheme } from "v2/views/BotElement/BotSetting/DesignSetting/utils/designThemeUtils";
import PreviewFukushashikiReducer from "./PreviewFukushashiki/PreviewFukushashikiReducer";
import { EC_CHATBOT_URL } from "v2/variables/constants";
import "moment/locale/zh-cn";
import {
  CHATBOT_ACTIONS,
  NO_ERROR,
  GETTING_ERROR_NOTIFICATION,
  TIMER_MAP_VARIABLES_FIELD,
  TIMER_TYPES,
  CART_SYSTEM,
  CONVERSTION_RESPONSE_STATUS,
  PREVIEW_ACTIONS,
  RENDER_CHATBOT_CONFIG,
  CONVERSION_RESPONSE_SUBMIT_TYPE,
  CONVERSION_RESPONSE_MESSAGE_SUBMIT_TYPE,
  DISPLAY_TYPES,
} from "./PreviewComponent/Constants";
import { OPEN_ANIMATION_DURATION_MS_DEFAULT } from "v2/views/BotElement/BotSetting/DesignSetting/constants/designChatbotConstants";
import {
  clampOpenAnimationDurationMs,
  parseDesignSettings,
  resolveMainColorContext,
  resolveOpenAnimationClassName,
} from "v2/views/BotElement/BotSetting/DesignSetting/utils/designChatbotUtils";
import {
  isMobile,
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
} from "./PreviewComponent/Utils";
import {
  getChatbotSavedState,
  savedChatbotState,
  saveCheckpointTime,
  savePrevOpenStatus,
  getPrevOpenStatus,
  getTimerConfig,
  setTimerConfig
} from "./PreviewComponent/SessionStorageUtils";
import { isTokyoDeveloLP, UPDATE_TOKYO_DEVELO_LP_PREFECTURE_JS_CODE } from "./PreviewComponent/TokyoLPUtils";
import ProcessBar from "./PreviewComponent/ProcessBar";
import ZipCodePopUp from "./PreviewComponent/ZipCodePopUp";
import _ from "lodash";
import Timer from "./Timer";
import {
  setConversionParamToLocalStorage, fukushashikiSavedStateToLp, fukushashikiToLP,
  executeLpJsCode, postMessageToParent
} from "./PreviewFukushashiki/LPUtils";
import { resolveErrMsgLpScript } from "./ScenarioSetting/utils/resolveErrMsgLpScript";
import { generateLaunchButtonLpScript } from "./ScenarioSetting/utils/launchButtonLpScriptUtils";
import { convertToFukushashikiObject } from "./PreviewFukushashiki/FukushashikiDataConverterUtils";
import { handleValidateField } from "./PreviewFukushashiki/ValidationUtils";
import { createOrAddLinesCart } from "./ShopifyUtils";
import { clearChatbotState } from "./PreviewComponent/previewSessionUtils";
import { getBotInforFromPreviewResponse } from "./PreviewComponent/previewBotInfoUtils";
import {
  getBotHeaderIconPath,
  getOpeningBotStyle as buildOpeningBotStyle,
} from "./PreviewComponent/previewOpeningStyles";
import { mapParsedDesignToState } from "./PreviewComponent/previewDesignStateUtils";
import { createPreviewInitialState } from "./PreviewComponent/createPreviewInitialState";
import { shouldShowPreventExitModal } from "./PreviewComponent/preventExitModalUtils";
import {
  usePreviewConversionOnOpen,
  usePreviewIpParams,
  usePreviewDesignSettings,
  usePreviewParentSync,
  usePreviewCustomJs,
  usePreviewThemeCss,
  usePreviewHtmlUgc,
  usePreviewScenarioBootstrap,
  usePreviewAutoScroll,
  usePreviewMessageReveal,
} from "./PreviewComponent/hooks";

savePrevOpenStatus("0");
var url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let isLoggedIn = params.get('isLoggedIn') === "true";
const previewInitialState = createPreviewInitialState("fukushashiki", { params });


const PreviewFukushashiki = () => {
  const [state, dispatch] = useReducer(PreviewFukushashikiReducer, previewInitialState);
  const [timerChanges, setTimerChanges] = useState({ timeLeft: -1, config: null });
  const containerRef = useRef(null);
  const hasSentCustomJs = useRef(false);
  const hasSentInitialOpenStateToParent = useRef(false);
  const [useSharedBootstrap, setUseSharedBootstrap] = useState(() => !getChatbotSavedState());
  const [msgUpdateState, setMsgUpdateState] = useState({});
  const msgUpdateStateRef = useRef({});
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

  usePreviewConversionOnOpen({ state, dispatch });
  usePreviewIpParams({ state, dispatch });
  usePreviewDesignSettings({
    state,
    dispatch,
    params,
    refreshPolicy: "always",
    includeOpenAnimation: true,
    designSource: "parsed",
  });

  const eventHandler = async (event) => {
    if (!event.data || !event.data.actionData) return;
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
  });
  usePreviewCustomJs({ state, hasSentCustomJs });
  usePreviewThemeCss({ state });
  usePreviewHtmlUgc({ state });
  usePreviewScenarioBootstrap({
    state,
    dispatch,
    params,
    enabled: useSharedBootstrap,
    onExtractState: (res) => extractStateFromPreviewResponse(res),
  });
  usePreviewAutoScroll({
    state,
    enabled: !state.isUpsell,
    enableScrollAuto: true,
    dependencyLength:
      (state.renderMessagesList?.length ?? 0) + (state.submitErrorMessage ? 1 : 0),
  });
  usePreviewMessageReveal({
    state,
    dispatch,
    delayMs: RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE,
    shouldLogAppear: isInteractiveMessage,
  });

  // Initial sync: parent SDK needs layout payload before first user interaction.
  // post message to parent window when layout changes after initial sync
  useEffect(() => {
    if (!hasSentInitialOpenStateToParent.current) return;
    if (!state.urlReceive) return;
    postMessageToParent({ isOpen: state.isOpen }, state);
  }, [
    state.urlReceive,
    state.isOpen,
    state.widthPc,
    state.heightPc,
    state.widthSp,
    state.heightSp,
    state.rightMarginPc,
    state.bottomMarginPc,
    state.rightMarginSp,
    state.bottomMarginSp,
    state.positionPc,
    state.positionSp,
    state.buttonTypePc,
    state.buttonTypeSp,
    state.useFullWidthChatbotMobile,
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
    if (!state.isUsedErrMsgByJs) return;
    const jsCode = resolveErrMsgLpScript(state);
    if (jsCode) executeLpJsCode(jsCode, state);
  }, [
    state.isUsedErrMsgByJs,
    state.errMsgJsCode,
    state.errMsgSettingMode,
    state.errMsgFieldSelectors,
    state.errMsgFormSelectors,
    state.themeSettings,
    state.botInfor,
  ]);

  useEffect(() => {
    if (!state.launchButtonSelectors) return;
    const jsCode = generateLaunchButtonLpScript(state.launchButtonSelectors);
    if (jsCode) executeLpJsCode(jsCode, state);
  }, [state.launchButtonSelectors]);

  // Fukushashiki session restore (upsell, LP sync, timer) — not covered by shared bootstrap hook
  useEffect(() => {
    if (useSharedBootstrap) return;
    if (state.loadedStateFromSession) return;

    const savedState = getChatbotSavedState();
    if (!savedState) {
      // Storage cleared between mount and effect — fall through to shared bootstrap
      setUseSharedBootstrap(true);
      return;
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
  }, [useSharedBootstrap, state.loadedStateFromSession]);

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

  const renderNextMessage = () => {
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
      // Bug #11: chỉ mở confirm khi 離脱防止 hoặc popup_close_bot bật — cả hai off thì đóng thẳng.
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

    const chatbot = res.data.chatbot;
    const conversation = res.data.data?.conversation;
    const { apiColorKey, mainColorHex } = resolveMainColorContext(chatbot);
    const parsedDesign = parseDesignSettings(
      res.data.design_settings,
      mainColorHex,
      apiColorKey,
    );
    const shouldAutoOpen = Number(parsedDesign.displayType) === DISPLAY_TYPES.RELOAD;
    let newState = {
      ...state,
      botInfor: getBotInforFromPreviewResponse(res),
      objParam: {},
      loadedStateFromSession: true,
      messagesList: _.cloneDeep(conversation?.messages || []),
      isOpen: shouldAutoOpen ? true : Boolean(state.isOpen),
      ...mapParsedDesignToState(parsedDesign),
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
      isUsedHtmlUgc: !!chatbot?.is_used_html_ugc,
      htmlUgcConfigContent: chatbot?.html_ugc_config_content,
    };

    if (chatbot?.timer_config?.enable) {
      const timerConfig = chatbot.timer_config;
      setTimerChanges({ timeLeft: calculateTimerConfigDuration(timerConfig.type, timerConfig.duration), config: timerConfig });
    }

    const prevOpenStatus = getPrevOpenStatus();

    if (parsedDesign.displayType == DISPLAY_TYPES.RELOAD && prevOpenStatus == "0") {
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

    saveCheckpointTime(res.data.data.updated_at);

    dispatch({
      type: PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SERVER,
      payload: {
        responseData: res.data,
        botInfor: getBotInforFromPreviewResponse(res),
        themeSettings: parsedDesign.themeSettings,
        isLoggedIn: isLoggedIn,
        isUsingAmazonPay: params.get('is_using_amazon_pay'),
      },
    });
  }

  const handleOnCounting = (config) => (timer) => {
    const timerChanges = { timeLeft: timer, config };
    setTimerConfig(timerChanges);
    setTimerChanges(timerChanges);
  }

  const getTimerConfigVariable = (configVariables) => {
    const variables = Object.values(configVariables)
      .reduce((acc, key) => !TIMER_MAP_VARIABLES_FIELD[key] ? acc : [...acc, { ...TIMER_MAP_VARIABLES_FIELD[key], name: key }], []);

    return variables;
  }

  const calculateTimerConfigDuration = (type, duration, options = {}) => {
    const { timerLeft = 0, useTimerLeft = false } = options;

    if (!duration || !type) return 0;

    const durationConfig = duration[type];
    if (!durationConfig) {
      return 0;
    }

    switch(type) {
      case TIMER_TYPES.COUNTING_DOWN: {
        if (useTimerLeft) {
          return timerLeft;
        }

        const { hour = 0, minute = 0, second = 0 } = duration[type];
        return (hour * 60 + minute) * 60 + second;
      }

      default: {
        return 0;
      }
    }
  }

  const onClickNext = (clickedMsgIndex, clickedMsg) => {
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

    return message.message_content.map((content, contentIndex) => (
      <BotMessage
        messageId={message.id}
        key={`${messageIndex}-${contentIndex}`}
        content={content}
        contentIndex={contentIndex}
        botInfor={state.botInfor}
        themeSettings={state.themeSettings}
        previewOrderContent={state.previewOrderContent}
        executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
        variables={state.variables}
        onRenderCompleted={renderNextMessage}
        hidden={message.hidden}
        currentMsgIndex={state.currentMsgIndex}
        isBotOpen={state.isOpen}
        isUseGlobalDelay={state.isUseGlobalDelay}
        globalDelayTime={state.globalDelayTime}
      />
    ));
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
    return (
      <div className="sp-user-message-button-action" style={{ display: isDisplayBtnNext ? "flex" : "none" }}>
        <CustomButton
          disabled={state.submitErrorMessage.length > 0 ? false : message.disabled}
          className={`ss-user-message__action-btn${hasBtnUpdateClass ? " btn-update" : ""}`}
          onClick={() => {
            onClickNext(messageIndex, message)
          }}
          autoClick={isAutoClick && !state.isExtractFromSession}
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

    const userMessageTheme = resolveUserMessageTheme(state.themeSettings, state.botInfor);

    return (
      <div className="sp-body-user-side slideLeft" id={getElementMessageById(message.id)}>
        <div className="sp-body-user-side-messages position-relative">
          <UserMessage
            postMessageToParent={(options) => postMessageToParent(options, state)}
            message={message}
            captcha={state.captcha}
            messageContentProps={message.message_content}
            disabled={(state.submitErrorMessage.length > 0 && state.submitErrorMessage !== GETTING_ERROR_NOTIFICATION) ? false : message.disabled}
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
            onRenderCompleted={renderNextMessage}
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
            footer={renderNextButton(message, messageIndex)}
          />
          <UserMessageTailIcon
            fillColor={userMessageTheme.bgColor}
            showTail={userMessageTheme.showTail}
          />
        </div>
      </div>
    );
  };

  const renderCombineMessageContent = (message, messageIndex) => {
    if (!message || message.belong_to !== "combine") return null;
    if (!Array.isArray(message?.message_content) || message.message_content.length === 0) return null;

    const isUpdate = messageIndex >= state.renderMessagesList.length - 1;

    return (
      <CombineMessage
          postMessageToParent={(options) => postMessageToParent(options, state)}
          message={message}
          captcha={state.captcha}
          disabled={(state.submitErrorMessage.length > 0 && state.submitErrorMessage !== GETTING_ERROR_NOTIFICATION) ? false : message.disabled}
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
          themeSettings={state.themeSettings}
          previewOrderContent={state.previewOrderContent}
          executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
          isBotOpen={state.isOpen}
          cartSystem={state.cartSystem}
          isUpdate={isUpdate}
          isExtractFromSession={state.isExtractFromSession}
        />
    );
  };

  const renderMessages = () => (
    <PreviewMessagesList
      messages={state.renderMessagesList}
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

  const headerIconSrc = `${EC_CHATBOT_URL}${getBotHeaderIconPath(state.botInfor, state.isOpen)}`;

  if (!state.scenarioId || !state.botInfor || state.displayType === null) return null;

  if (state.isOpen) {
    const { frameClassName, cssVars } = buildOpeningBotStyle(state);
    const openAnimationDurationMs = clampOpenAnimationDurationMs(
      state.openAnimationDurationMs ?? OPEN_ANIMATION_DURATION_MS_DEFAULT,
    );
    return (
      <PreviewOpenChatFrame
        containerRef={containerRef}
        containerClassName={`sp-container1 ${resolveOpenAnimationClassName(state.openAnimationStyle, isMobile())}`}
        frameClassName={frameClassName}
        cssVars={{
          ...cssVars,
          "--chatbot-open-animation-duration": `${openAnimationDurationMs}ms`,
        }}
        headerIconSrc={headerIconSrc}
        // Bug #5: title từ Basic Information, không dùng titleBubble khi mở.
        title={state.botInfor?.title}
        subtitle={state.botInfor?.subtitle}
        titleBubble={state.botInfor?.titleBubble}
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
              botInfor={state.botInfor}
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
      isMobileView={isMobile()}
      showFallback={false}
      spCircleUseParentOffsets={false}
      requireClosed={false}
      hideWhenDisplayHidden
    />
  );
}

export default PreviewFukushashiki;
