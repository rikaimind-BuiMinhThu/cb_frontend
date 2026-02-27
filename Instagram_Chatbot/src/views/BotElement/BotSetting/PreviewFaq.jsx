import React, { useEffect, useRef, useReducer, useState, useMemo } from "react";
import "assets/css/bot/preview-chat-bot.css";
import Cookies from "js-cookie";
import { MDBIcon } from "mdbreact";
import CustomButton from "./CustomButton";
import { UserMessage, BotMessage } from "./PreviewComponent";
import PreviewFaqReducer from "./PreviewFaq/PreviewFaqReducer";
import $ from "jquery";
import { EC_CHATBOT_URL } from "variables/constants";
import "moment/locale/zh-cn";
import iconMessageBlue from "assets/img/icon-mess/icon-message-chat-blue.png";
import iconMessageGreen from "assets/img/icon-mess/icon-message-chat-green.png";
import iconMessageOrange from "assets/img/icon-mess/icon-message-chat-orange.png";
import iconMessageYellow from "assets/img/icon-mess/icon-message-chat-yellow.png";
import iconMessagePink from "assets/img/icon-mess/icon-message-chat-pink.png";
import iconMessagePurple from "assets/img/icon-mess/icon-message-chat-purple.png";
import iconMessageBlack from "assets/img/icon-mess/icon-message-chat-black.png";
import iconMessageWhite from "assets/img/icon-mess/icon-message-chat-white.png";
import {
  CHATBOT_ACTIONS,
  NO_ERROR,
  GETTING_ERROR_NOTIFICATION,
  CUSTOM_JS_CODE_POSITION,
  CART_SYSTEM,
  CONVERSTION_RESPONSE_STATUS,
  PREVIEW_ACTIONS,
  RENDER_CHATBOT_CONFIG,
  RENDER_MODES,
  CONVERSION_RESPONSE_SUBMIT_TYPE,
  MESSAGE_CONTENT_TYPES,
  BOT_MESSAGE_TYPES,
} from "./PreviewComponent/Constants";
import {
  getAllUrlParams,
  lightenColor,
  isMobile,
  getScenarioPreviewData,
  getChatBotSetting,
  sleep,
  stringNullOrEmpty,
  changeElementAttributeById,
  scrollToPosition,
  createStatusConversion,
  userEntryScenario,
  isDislayingLoginForm,
  getElementMessageById,
  sendOpenChatbotCountRequest,
  sendCloseChatbotCountRequest,
  isUserMessage,
  isBotMessage,
  getNextUserMsg,
  sendLogMessageToServer,
  updateStatusConversion,
  isButtonSubmitMessage,
  createScenarioUserResponseMessageHistory,
  sendErrorLogToServer,
  sendAppearLogToServer,
} from "./PreviewComponent/Utils";
import {
  getChatbotSavedState,
  savedChatbotState,
  saveCheckpointTime,
  savePrevOpenStatus,
  getPrevOpenStatus,
} from "./PreviewComponent/SessionStorageUtils";
import PreventExitChatbotModal from "./PreviewComponent/PreventExitChatbotModal";
import _ from "lodash";
import {
  setConversionParamToLocalStorage, postMessageToParent, executeLpJsCode
} from "./PreviewFukushashiki/LPUtils";
import { handleValidateField } from "./PreviewFukushashiki/ValidationUtils";

const clearChatbotState = () => {
  sessionStorage.removeItem('chatbotH');
  sessionStorage.removeItem('chatbotBottom');
  sessionStorage.removeItem('chatbotState');
  sessionStorage.removeItem('prevOpenStatus');
  sessionStorage.removeItem('timerConfig');
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('chatbot') || key.startsWith('messages_bot_')) {
      sessionStorage.removeItem(key);
    }
  });
};

savePrevOpenStatus("0");
var url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let isLoggedIn = params.get('isLoggedIn') === "true";
const previewInitialState = {
  isOpen: false,
  urlSend: "",
  urlReceive: "",
  deviceReceive: "",
  uuid: params.get("uuid"),
  botId: Cookies.get("bot_id"),
  scenarioId: params.get("scenario_id"),
  botInfor: {},
  originalMessagesList: [],
  messagesList: [],
  currentMsgIndex: 0,
  renderMessagesList: [],
  passedUserMsgCount: 0,
  errors: {},
  variables: [],
  isDisplayButtonNext: false,
  variablesList: [],
  buttonTypePc: "1",
  positionPc: "1",
  widthPc: 450,
  heightPc: 700,
  widthSp: 100,
  heightSp: 100,
  rightPcTitle: "",
  positionSp: "1",
  buttonTypeSp: "1",
  rightMarginPc: 10,
  bottomMarginPc: 10,
  displayType: 1,
  rightSpTitle: "",
  rightMarginSp: 10,
  bottomMarginSp: 10,
  showPopupCloseBot: false,
  activePopupCloseBot: true,
  titleBubble: "",
  styleModal: {},
  scenarioUserResponses: [],
  submitErrorMessage: '',
  isDisplayErrorMessage: false,
  objParam: {
    current_url: window.location.href,
    current_url_param: getAllUrlParams(window.location.href),
    current_url_title: document.title,
    user_id: Cookies.get("user_id"),
    bot_id: Cookies.get("bot_id")
  },

  // loadedStateFromSession has 2 values: "wait", "loaded"
  loadedStateFromSession: false,
  isProcessing: false,
  conversionStatus: null,
  manuallyClosed: false,
  renderMode: RENDER_MODES.NEXT,
  progressBarMaxIndex: null,
  // FAQ specific fields
  rootMessageIndex: null,
  isInCommonFlow: false,
  commonFlowStartIndex: null,
  loopCount: 0
};

const PreviewFaq = () => {
  const [state, dispatch] = useReducer(PreviewFaqReducer, previewInitialState);
  const containerRef = useRef(null);

  useEffect(() => {
    if (state.conversionStatus || !state.uuid || !state.scenarioId || !state.isOpen) return;

    createStatusConversion({
      scenario_id: state.scenarioId,
      user_input_id: state.uuid,
      status: CONVERSTION_RESPONSE_STATUS.UN_FINISH,
    })
    .then((res) => {
      const status = res?.data?.data?.status;

      if (status) {
        dispatch({ type: PREVIEW_ACTIONS.SET_CONVERSION_STATUS, payload: status });
      }
    });
  }, [state.uuid, state.scenarioId, state.conversionStatus, state.isOpen]);

  // get default obj params
  useEffect(() => {
    if (!state.loadedStateFromSession) return;
    if (!state.objParam?.ip) return;

    $.getJSON("https://api.ipregistry.co/?key=tryout", (data) => {
      const defaultObjParam = {
        user_ip_address: data.ip,
        user_country: data.location.country.name,
        user_city: data.location.city,
        user_device: data.user_agent.device.type,
        user_browser: data.user_agent.name,
        user_agent: data.user_agent.header,
        start_datetime: new Date(),
      };
      dispatch({
        type: PREVIEW_ACTIONS.SET_OBJ_PARAM,
        payload: { ...state.objParam, ...defaultObjParam }
      });
    });
  }, [state.objParam?.ip, state.loadedStateFromSession]);

  // Get chat bot setting
  useEffect(() => {
    if (!state.loadedStateFromSession) return;
    if (!state.botId && params.get("bot_id")) {
      dispatch({ type: PREVIEW_ACTIONS.SET_BOT_ID, payload: params.get("bot_id") });
      return;
    }

    if (state.displayType !== undefined && state.displayType !== null) return;

    getChatBotSetting(state.botId)
      .then((response) => {
        if (!response.data.data) return;

        const result = JSON.parse(response.data.data?.design_settings);
        const newState = {
          activePopupCloseBot: result?.popup_close_bot ? true : false,
          titleBubble: result?.title_bubble ? result?.title_bubble : "簡単90秒で注文完了",
          displayType: result?.display_type,
          widthPc: result?.width_pc ? result?.width_pc : 450,
          heightPc: result?.height_pc ? result?.height_pc : 700,
          widthSp: result?.width_sp ? result?.width_sp : 100,
          heightSp: result?.height_sp ? result?.height_sp : 100,
          positionPc: result?.position_pc ? result?.position_pc : "1",
          isOpen: state.isOpen,
          rightPcTitle: result?.right_position_pc_title,
          buttonTypePc: result?.button_type_pc ? result?.button_type_pc : "1",
          rightMarginPc: result?.right_margin_pc ? result?.right_margin_pc : 10,
          bottomMarginPc: result?.bottom_margin_pc ? result?.bottom_margin_pc : 0,
          positionSp: result?.position_sp ? result?.position_sp : "1",
          buttonTypeSp: result?.button_type_sp ? result?.button_type_sp : "1",
          rightSpTitle: result?.right_position_sp_title,
          rightMarginSp: result?.right_margin_sp,
          bottomMarginSp: result?.bottom_margin_sp,
        };

        dispatch({ type: PREVIEW_ACTIONS.SET_CHATBOT_SETTINGS, payload: newState });
      });
  }, [state.botId, state.loadedStateFromSession, state.displayType]);

  const eventHandler = async (event) => {
    if (!event.data || !event.data.actionData) return;
    const actionData = event.data.actionData;

    switch (event.data.action) {
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
      default:
        // TODO
        break;
    }
  };

  // Add event listener to receive message from parent window
  useEffect(() => {
    window.addEventListener("message", eventHandler, false);

    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, [state.isOpen])

  // Add style to body tag if it's mobile
  useEffect(() => {
    if (isMobile()) {
      document.body.classList.add('is_mobile');
    }
  }, [])

  // For add custom css
  useEffect(() => {
    if (!state.isUsedCustomCss || !state.customCssContent) return;

    const style = document.createElement('style');
    style.id = "custom-css";
    style.innerHTML = state.customCssContent;
    document.head.appendChild(style);
  }, [state.isUsedCustomCss, state.customCssContent]);
  
  // Get Preview Scenario Data
  useEffect(() => {
    if (!state.loadedStateFromSession) {
      let savedState = getChatbotSavedState();
      if (savedState) {
        const currentBotId = params.get("bot_id") || Cookies.get("bot_id");
        if (currentBotId && currentBotId !== savedState.botId) {
          clearChatbotState();
          return getScenarioPreviewData(currentBotId, params.get("scenario_id"))
          .then(extractStateFromPreviewResponse);
        };

        setConversionParamToLocalStorage(
          savedState.scenarioId,
          'web',
          savedState.userInputId || params.get("uuid"),
          params.get("env") || "production",
          savedState
        );

        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
          payload: {
            ...savedState,
            loadedStateFromSession: true,
          }
        });
      }
    }

    if (state.loadedStateFromSession && state.botId)
      return;

    if (!state.botId) {
      dispatch({ type: PREVIEW_ACTIONS.SET_BOT_ID, payload: params.get("bot_id") });
      return;
    }

    if (!state.urlSend) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { urlSend: window.location.href } });
      return;
    }

    if (!state.urlReceive) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { urlReceive: params.get("urlReceive") } });
      return;
    }

    if (!state.deviceReceive) {
      dispatch({ type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE, payload: { deviceReceive: params.get("deviceReceive") } });
      return;
    }

    if (!state.scenarioId) {
      dispatch({ type: PREVIEW_ACTIONS.SET_SCENARIO_ID, payload: params.get("scenario_id") });
      return;
    }

    return getScenarioPreviewData(state.botId, state.scenarioId)
      .then(extractStateFromPreviewResponse);
  }, [
    state.botId, state.urlSend, state.urlReceive,
    state.deviceReceive, state.scenarioId,
    state.isDisplayErrorMessage, state.loadedStateFromSession
  ]);

  // Auto-scroll to bottom of the chatbot when render messages list changes or submit error message changes
  useEffect(() => {
    const curretMsg = state.messagesList[state.currentMsgIndex];
    if (state.isNotAutoScroll) {
      if (curretMsg?.message_content?.[0]?.type !== MESSAGE_CONTENT_TYPES.IMAGE) return;
      setTimeout(() => {
        document.querySelector(`#msg-${state.currentMsgIndex}-0`)?.scrollIntoView({ behavior: "smooth" });
      }, 2000);
      return;
    }

    const timeoutId = setTimeout(() => {
      scrollToPosition({ position: "b", selector: "#sp-body" });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state.renderMessagesList?.length]);

  useEffect(() => {
    if (
      state.loadedStateFromSession &&
      state.displayType === 1 &&
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

  useEffect(() => {
    if (!state.nextStopMsgIndex || state.currentMsgIndex + 1 >= state.nextStopMsgIndex || !state.isOpen) {
      dispatch({ type: PREVIEW_ACTIONS.SET_IS_NOT_AUTO_SCROLL, payload: false });
      return;
    }

    setTimeout(() => {
      // const newMsgIndex = state.currentMsgIndex + 1;
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
        payload: {
          startIndex: 0,
          endIndex: state.currentMsgIndex + 1 + 1,
          fromCallback: false,
        }
      });
      // if (newMsgIndex < state.messagesList.length && isUserMessage(state.messagesList[newMsgIndex])) {
      //   sendAppearLogToServer({
      //     scenario_id: state.scenarioId,
      //     user_id: state.uuid,
      //     message: state.messagesList[newMsgIndex],
      //   });
      // }
    }, RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE_FAQ);
  }, [state.currentMsgIndex, state.nextStopMsgIndex]);

  const renderNextMessage = () => {
    if (state.currentMsgIndex + 1 >= state.nextStopMsgIndex) return;

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
      payload: {
        startIndex: 0,
        endIndex: state.currentMsgIndex + 1 + 1,
        fromCallback: true,
      }
    });
  };

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

    // post message to parent window
    postMessageToParent({ isOpen: opening}, state);
    
    if (state.alreadyOpenFirstTime) {
      if (!opening) {
        if (state.activePopupCloseBot) {
          return dispatch({ type: PREVIEW_ACTIONS.OPEN_POPUP_CLOSE_BOT_MODAL });
        }

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

    // When closing chatbot, show popup close bot modal if has setting
    const openPopupSetting = ["standard_exit_popup", "image_popup"];
    const isWithDrawalEnabled = state.botInfor && openPopupSetting.includes(state.botInfor.withdrawal_prevention_status);

    if (!isWithDrawalEnabled) return dispatch({ type: PREVIEW_ACTIONS.CLOSE_CHATBOT });

    return dispatch({ type: PREVIEW_ACTIONS.OPEN_POPUP_CLOSE_BOT_MODAL });
  }

  const getBotInforFromPreviewResponse = (res) => {
    if (!res || !res.data || !res.data.chatbot) return {};

    let opacity_color, message_color, font_color, icon_mess;
    if (res.data.chatbot.main_color === "blue") {
      opacity_color = "#D6E0EF";
      message_color = "#3CACEF";
      font_color = "#fff";
      icon_mess = iconMessageBlue;
    } else if (res.data.chatbot.main_color === "green") {
      opacity_color = "#DEEADB";
      message_color = "#9DDB7C";
      font_color = "#fff";
      icon_mess = iconMessageGreen;
    } else if (res.data.chatbot.main_color === "orange") {
      opacity_color = "#F4E5DA";
      message_color = "#EF8D2F";
      font_color = "#fff";
      icon_mess = iconMessageOrange;

    } else if (res.data.chatbot.main_color === "yellow") {
      opacity_color = "#F0EFEB";
      message_color = "#F3AA2D";
      res.data.chatbot.main_color = "#F6CA21";
      font_color = "#fff";
      icon_mess = iconMessageYellow;
    } else if (res.data.chatbot.main_color === "pink") {
      opacity_color = "#EBDDE3";
      message_color = "#E65B83";
      res.data.chatbot.main_color = "#F170AA";
      font_color = "#fff";
      icon_mess = iconMessagePink;
    } else if (res.data.chatbot.main_color === "purple") {
      opacity_color = "#E9E8F1";
      message_color = "#AF82D5";
      res.data.chatbot.main_color = "#8C66D9";
      font_color = "#fff";
      icon_mess = iconMessagePurple;
    } else if (res.data.chatbot.main_color === "black") {
      opacity_color = "#ecede8";
      message_color = "#c3c3c3";
      font_color = "#000";
      icon_mess = iconMessageBlack;
    } else if (res.data.chatbot.main_color === "white") {
      opacity_color = "#fff";
      message_color = "#F5F5F5";
      font_color = "#000";
      icon_mess = iconMessageWhite;
    } else if (res.data.chatbot.main_color_other) {
      opacity_color = lightenColor(res.data.chatbot.main_color_other, 0.1);
      message_color = res.data.chatbot.main_color_other;
      font_color = "#fff";
    }

    return {
      ...res.data.chatbot,
      opacity_color,
      message_color,
      font_color,
      icon_mess,
      main_color: res.data.chatbot.main_color || res.data.chatbot.main_color_other,
      main_color_other: res.data.chatbot.main_color_other,
      titleBubble:res.data.design_settings.title_bubble
    };
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
      messagesList: conversation?.messages || [],
      isOpen: designSetting?.display_type && Number(designSetting?.display_type) === 1 || state.isOpen,
      activePopupCloseBot: Boolean(designSetting?.popup_close_bot),
      titleBubble: designSetting?.title_bubble || "簡単90秒で注文完了",
      displayType: designSetting?.display_type,
      widthPc: designSetting?.width_pc || 450,
      heightPc: designSetting?.height_pc || 700,
      widthSp: designSetting?.width_sp || 100,
      heightSp: designSetting?.height_sp || 100,
      positionPc: designSetting?.position_pc || "1",
      rightPcTitle: designSetting?.right_position_pc_title,
      buttonTypePc: designSetting?.button_type_pc || "1",
      rightMarginPc: designSetting?.right_margin_pc || 10,
      bottomMarginPc: designSetting?.bottom_margin_pc || 0,
      positionSp: designSetting?.position_sp || "1",
      buttonTypeSp: designSetting?.button_type_sp || "1",
      rightSpTitle: designSetting?.right_position_sp_title,
      rightMarginSp: designSetting?.right_margin_sp,
      bottomMarginSp: designSetting?.bottom_margin_sp,
      useNewProcess: chatbot?.client_cart_system === CART_SYSTEM.EC_FORCE,
      isUsedPastMessageLoaded: !!chatbot?.is_used_message_loaded_past,
      isProcessing: false,
      useFullWidthChatbotMobile: !!chatbot?.use_fullwidth_chatbot_mobile,
      isUsedCustomCss: !!chatbot?.is_used_custom_css,
      customCssContent: chatbot?.custom_css_content,
    };

    const prevOpenStatus = getPrevOpenStatus();

    if (designSetting.display_type == 1 && prevOpenStatus == "0") {
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
      },
    });
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

    const isBtnUpdateClick = clickedMsgIndex < state.renderMessagesList.length - 1;

    sendLogMessageToServer(data, isBtnUpdateClick ? CONVERSION_RESPONSE_SUBMIT_TYPE.UPDATE : CONVERSION_RESPONSE_SUBMIT_TYPE.ADD);

    if (clickedMsg.button_jscode && clickedMsg.jscode.length > 0) {
      executeLpJsCode(clickedMsg.jscode, state);
    }

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_AFTER_CLICK_NEXT_BUTTON,
      payload: { clickedMsgIndex, clickedMsg, isLoggedIn: isLoggedIn}
    });
  };

  const onChangeValue = (
    contentIndex,
    contentType,
    value,
    field,
    subField1,
    subField2,
    message,
    messageIndex
  ) => {
    // Early returns for invalid states
    if (!state.messagesList.length) return;

    savedChatbotState(state);

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_AFTER_CHANGE_VALUE,
      payload: {
        contentIndex,
        messageIndex,
        contentType,
        value,
        field,
        subField1,
        subField2,
        message
      }
    });
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
        previewOrderContent={state.previewOrderContent}
        executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
        variables={state.variables}
        onRenderCompleted={renderNextMessage}
        hidden={message.hidden}
        currentMsgIndex={state.currentMsgIndex}
        isBotOpen={state.isOpen}
        delayEachMessage={RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE_FAQ}
      />
    ));
  };

  const renderNextButton = (message, messageIndex) => {
    const isUpdate = messageIndex >= state.renderMessagesList.length - 1;
    const firstMsgContent = message?.message_content?.[0];
    const isDisplayBtnNext = firstMsgContent?.type != "image" || firstMsgContent?.image?.displayButtonNext != false;
    const isAutoClick = !isDisplayBtnNext && isUpdate;

    if (!message || message.belong_to !== "user") return null;
    if (message.message_content[0]?.type === "button_submit") return null;

    let btnText = message.buttonName;
    if (!btnText) {
      btnText = isUpdate ? "次へ" : "更新";
    }
    return (
      <div className="sp-user-message-button-action" style={{ display: isDisplayBtnNext ? "flex" : "none" }}>
        <CustomButton
          disabled={state.submitErrorMessage.length > 0 ? false : message.disabled}
          style={{
            backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          }}
          className="ss-user-message__action-btn"
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

    return (
      <div className="sp-body-user-side slideLeft" id={getElementMessageById(message.id)}>
        <div className="sp-body-user-side-messages">
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
                message,
                messageIndex
              )
            }
            currentMsgIndex={state.currentMsgIndex}
            onClickNext={() => {
              onClickNext(messageIndex, message)}
            }
            onRenderCompleted={renderNextMessage}
            messageIndex={messageIndex}
            errorsProps={state.errors}
            prefecturesList={[]}
            onOpen={() => {
              // FAQ Do not use this function
            }}
            onChangeErrors={(field, value) =>
              onChangeErrors(field, value)
            }
            variables={state.variables}
            lpOptionData={state.lpOptionData}
            submitErrorMessage={state.submitErrorMessage === GETTING_ERROR_NOTIFICATION ? "" : state.submitErrorMessage}
            botId={state.botId}
            isProcessing={!!state.isProcessing}
          />
          {renderNextButton(message, messageIndex)}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    return (state.renderMessagesList || []).map((message, messageIndex) => {
      if (message.hidden && !stringNullOrEmpty(message.hidden)) return null;
      return (
        <React.Fragment key={messageIndex}>
          {renderBotMessageContent(message, messageIndex)}
          {renderUserMessageContent(message, messageIndex)}
        </React.Fragment>
      );
    })
  };

  const getBotHeaderIcon = () => {
    if (state.isOpen) {
      return state.botInfor?.opening_bot_icon?.url || state.botInfor?.icon?.url;
    }
    return state.botInfor?.closing_bot_icon?.url || state.botInfor?.icon?.url;
  }

  const getOpeningBotStyle = () => {
    let containerStyle = {
      position: 'fixed',
      bottom: "0px",
      right: isMobile() ? state.isOpen ? 0 : `${state.rightMarginSp}px` : `${state.rightMarginPc}px`,
      width: isMobile() ? `${state.widthSp}%` : `${state.widthPc}px`,
      height: isMobile() ? `${state.heightSp}%` : `${state.heightPc}px`,
      zIndex: 999,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white"
    };
    let headerStyle = {
      borderTopLeftRadius: isMobile() ? "0px" : "5px",
      borderTopRightRadius: isMobile() ? "0px" : "5px",
    };
    let bodyStyle = {
      backgroundColor: state.botInfor?.opacity_color,
      flex: 1,
    };

    if (state.botInfor?.main_color || state.botInfor?.main_color_other) {
      headerStyle.backgroundColor = state.botInfor?.main_color || state.botInfor?.main_color_other;
    }

    if (!state.activePopupCloseBot) {
      containerStyle.height = isMobile() ? `${state.heightSp || 100}%` : `${state.heightPc || 600}px`;
      headerStyle = {
        ...headerStyle,
        position: "static",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
      };
      bodyStyle.display = "block";
    }

    return {
      containerStyle,
      headerStyle,
      bodyStyle,
    };
  };

  // body container
  if (state.scenarioId && state.botInfor && state.isOpen) {
    const { containerStyle, headerStyle, bodyStyle } = getOpeningBotStyle();
    return (
      <div
        ref={containerRef}
        id="sp-container1"
        className={`sp-container1 ${isMobile() ? 'slideUpSp' : 'slideUp'}`}
        style={containerStyle}
      >
        <div id="sp-header" style={headerStyle} className="sp-header">
          <div className="sp-header-left" onClick={onChatbotHeaderClick}>
            <div className="sp-body-bot-side-avatar sp-avatar-bt">
              <img src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`} alt="bot-header-icon"/>
            </div>
            <div className="sp-header-left-label">
              <div className="sp-header-left-label-sub-title">
                {state.botInfor?.subtitle}
              </div>
              <div className="sp-header-left-label-title">{state.botInfor?.titleBubble}</div>
            </div>
          </div>
          <div className="sp-header-right" onClick={onChatbotHeaderClick}>
            <div className="sp-header-right-arrow">
              {state.isOpen ? (
                <MDBIcon fas icon="chevron-circle-down" />
              ) : (
                <MDBIcon fas icon="chevron-circle-up" />
              )}
            </div>
          </div>
        </div>
        <PreventExitChatbotModal
          botConfig={state}
          isOpen={state.showPopupCloseBot}
          onClose={() => setShowPopupCloseBot(false)}
          onCloseBot={() => onOpenPreview(false)}
        />
        <div id="sp-body" className="sp-body" style={bodyStyle}
        >
          {renderMessages()}
        </div>
      </div>
    )
  } else if (!state.isOpen && isMobile() === false && Number(state.positionPc) === 1 && Number(state.buttonTypePc) === 2) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: "56px",
          height: "56px",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: 'fixed',
          bottom: state.bottomMarginPc ? `${state.bottomMarginPc}px` : '10px',
          right: state.rightMarginPc ? `${state.rightMarginPc}px` : '0px',
        }}
      >
        <img
          style={{ width: "96%", height: "96%", borderRadius: "30px" }}
          src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`}
          alt="bot-header-icon"
        />
      </div>
    )
  } else if (!state.isOpen && isMobile() === false && Number(state.positionPc) === 1 && Number(state.buttonTypePc) === 1) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          // width: `${widthPc}px`,
          width: `360px`,
          height: "66px",
          borderRadius: '35px',
          display: "flex",
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '3px',
          paddingRight: '3px',
          position: 'fixed',
          padding: 'auto',
          bottom: state.bottomMarginPc ? `${state.bottomMarginPc}px` : '10px',
          right: state.rightMarginPc ? `${state.rightMarginPc}px` : '0px',
        }}
      >
        <div className="sp-header-left-bt" onClick={() => onOpenPreview(!state.isOpen)}>
          <div className="sp-header-left-avatar sp-avatar-bt">
            <img src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`} alt="bot-header-icon" />
          </div>
        </div>
        <div style={{ alignItems: 'center', justifyContent: "center", padding: 'auto' }}>
          <div id="comment_bubble" style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px', paddingTop: '3px' }}>
            <span style={{ fontSize: '18px', fontWeight: 900 }}>{state.botInfor.title}</span>
          </div>
        </div>
        <div className="sp-header-right-arrow" style={{ marginRight: '8px' }}>
          <MDBIcon fas icon="chevron-circle-up" />
        </div>
      </div>
    )
  } else if (!state.isOpen && isMobile() === false && Number(state.positionPc) === 2) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: '300px',
          height: "65px",
          borderRadius: "0px",
          display: "flex",
          justifyContent: "left",
          position: 'fixed',
          transform: ' rotate(-90deg)',
          bottom: state.bottomMarginPc ? `${parseInt(state.bottomMarginPc) + state.widthPc / 2}px` : '20px',
          right: `${-120}px`,
        }}
      >
        <div className="sp-header-left" onClick={() => onOpenPreview(!state.isOpen)}>
          <div className="sp-header-left-avatar sp-avatar">
            <img src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`} alt="bot-header-icon" />
          </div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-title">{state.rightPcTitle}</div>
          </div>
        </div>
      </div>)
  } else if (!state.isOpen && isMobile() === true && Number(state.positionSp) === 1 && Number(state.buttonTypeSp) === 2) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: "56px",
          height: "56px",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: 'fixed',
          bottom: state.bottomMarginSp ? `${state.bottomMarginSp}px` : '20px',
          right: state.rightMarginSp ? `${state.rightMarginSp}px` : '20px',
        }}
      >
        <img
          style={{ width: "96%", height: "96%", borderRadius: "30px" }}
          src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`}
          alt="bot-header-icon"
        />
      </div>
    )
  } else if (!state.isOpen && isMobile() === true && Number(state.positionSp) === 1 && Number(state.buttonTypeSp) === 1) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        className={state.useFullWidthChatbotMobile ? "fullwidth_mobile_chatbot" : ""}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: state.useFullWidthChatbotMobile ? "calc(100vw - 30px)" : "240px",
          height: state.useFullWidthChatbotMobile ? "75px" : "48px",
          borderRadius: state.useFullWidthChatbotMobile ? "45px" :'35px',
          display: "flex",
          justifyContent: "left",
          position: 'fixed',
          bottom: state.bottomMarginSp ? `${state.bottomMarginSp}px` : '10px',
          right: (state.useFullWidthChatbotMobile) ? "15px" : (state.rightMarginSp ? `${state.rightMarginSp}px` : '10px')
        }}
      >
        <div className="sp-header-left" style={{ width: '100%', padding: state.useFullWidthChatbotMobile ? "15px" : '4px' }}>
          <div className={state.useFullWidthChatbotMobile ? "fullwidth_mobile_chatbot sp-header-left-avatar sp-avatar" :"sp-header-left-avatar sp-avatar"} style={{ width: state.useFullWidthChatbotMobile ? "58px"  :'38px' }}>
            <img
              src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`}
              alt="bot-header-icon"
            />
          </div>
          <div>
            <div id="comment_bubble" className="sp-bubble">
              <span style={{ fontSize: state.useFullWidthChatbotMobile ? "17px" :'14px', fontWeight: 700 }}>{state.botInfor.title}</span>
            </div>
          </div>
          <div className="sp-header-right-arrow" style={{ marginLeft: 'auto' }}>
            <MDBIcon fas icon="chevron-circle-up" />
          </div>
        </div>
      </div>
    )
  } else if (!state.isOpen && isMobile() === true && Number(state.positionSp) === 2) {
    return (
      <div
        onClick={() => onOpenPreview(!state.isOpen)}
        style={{
          backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          width: '300px',
          height: "60px",
          borderRadius: "0px",
          display: "flex",
          justifyContent: "left",
          position: 'fixed',
          transform: ' rotate(-90deg)',
          bottom: state.bottomMarginSp ? `${parseInt(state.bottomMarginSp) + state.widthPc / 2}px` : '20px',
          right: `${-120}px`,
        }}
      >
        <div className="sp-header-left">
          <div className="sp-header-left-avatar sp-avatar">
            <img
              src={`${EC_CHATBOT_URL}${getBotHeaderIcon()}`}
              alt="bot-header-icon"
            />
          </div>
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-title">{state.rightSpTitle}</div>
          </div>
        </div>
      </div>)
  }

  return (<div></div>);
}

export default PreviewFaq;
