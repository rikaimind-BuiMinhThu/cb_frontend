import _ from 'lodash';
import { 
  stringNullOrEmpty, 
  checkMessageCondition, 
  processMessagesForErrorState, 
  isTempDelay,
  buildConditionParams
} from '../PreviewComponent/Utils';
import { processForBotMessage } from '../PreviewComponent/BotMessageUtils';
import { processForUserMessage } from '../PreviewComponent/UserMessageUtils';
import { isButtonSubmitMessage, isBotMessage, isUserMessage, getNextUserMsg } from '../PreviewComponent/Utils';
import { mapAmazonPayDataToMessagesList } from '../PreviewComponent/TorizenUtils';
import { RENDER_CHATBOT_CONFIG, GETTING_ERROR_NOTIFICATION, PREVIEW_ACTIONS, CART_SYSTEM, CONVERSTION_RESPONSE_STATUS } from '../PreviewComponent/Constants.jsx';

const PreviewFukushashikiReducer = (state, action) => {
  switch (action.type) {
    case PREVIEW_ACTIONS.UPDATE_MULTI_STATE:
      if (action.payload.removeTempDelay && action.payload.renderMessagesList?.length) {
        action.payload.renderMessagesList = action.payload.renderMessagesList?.filter(m => {
          return !isTempDelay(m, RENDER_CHATBOT_CONFIG.TEMP_DELAY_PREFIX);
        }) || [];
      }
      return { ...state, ...(!!state.submitErrorMessage ? processMessagesForErrorState(action.payload): action.payload) };

    case PREVIEW_ACTIONS.ADD_LP_OPTION_DATA:
      return { ...state, lpOptionData: { ...state.lpOptionData, ...action.payload, isProcessing: false } };
    case PREVIEW_ACTIONS.UPDATE_PREVIEW_ORDER_CONTENT:
      return { ...state, previewOrderContent: action.payload, isProcessing: false };
    case PREVIEW_ACTIONS.UPDATE_OPEN_PREVIEW:
      return { ...state, isOpen: action.payload.isOpen, showPopupCloseBot: action.payload.showPopupCloseBot };
    case PREVIEW_ACTIONS.SET_PROCESSING: 
      return { ...state, isProcessing: action.payload };
    case PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES:
      return {
        ...state,
        renderMessagesList: state.messagesList.slice(action.payload.startIndex, action.payload.endIndex),
        currentMsgIndex: action.payload.endIndex - 1
      };
    case PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE: {
      let messagesList = _.cloneDeep(state.messagesList);

      if (action.payload === GETTING_ERROR_NOTIFICATION || stringNullOrEmpty(action.payload)) {
        return {
          ...state,
          submitErrorMessage: action.payload,
          isProcessing: false,
        };
      }

      messagesList = messagesList.map((message) => {
        if (!message.hidden) {
          message.hidden = message.not_display_when_have_error;
        }
        return message;
      });

      const renderMessagesList = messagesList.slice(0, state.currentMsgIndex + 1)
      return { ...state,
        messagesList: messagesList,
        renderMessagesList: renderMessagesList,
        submitErrorMessage: action.payload,
        isProcessing: false,
      };
    }

    case PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG: {
      let messagesList = _.cloneDeep(state.messagesList);

      if ((action.payload.displayMsg || []).length > 0) {
        messagesList = messagesList.map((message) => {
          if (action.payload.displayMsg.includes(message.name?.trim())) {
            message.hidden = false;
          }
          return message;
        });
      }
      const renderMessagesList = messagesList.slice(0, state.currentMsgIndex + 1)
      return { ...state,
        messagesList: messagesList,
        renderMessagesList: renderMessagesList,
        submitErrorMessage: action.payload.error,
        isProcessing: false,
      };
    }
    case PREVIEW_ACTIONS.UPDATE_AFTER_CLICK_NEXT_BUTTON:
      // TODO: Update state after click Next in here
      // In here, default is validation ok
      const { clickedMsgIndex, clickedMsg, isLoggedIn } = action.payload;
      let newState = {
        errors: {},
        messagesList: _.cloneDeep(state.messagesList),
        variables: _.cloneDeep(state.variables),
      };

      if (isLoggedIn) {
        newState.messagesList = newState.messagesList.map(x => ({...x, hidden: x.not_display_when_logged_in}));
      }

      const isClickedButtonSubmit = isButtonSubmitMessage(state.messagesList[clickedMsgIndex]);
      const isClickedLastMessage = state.messagesList.length - 1 === clickedMsgIndex;

      if (isClickedButtonSubmit || isClickedLastMessage) {
        newState.conversionStatus = CONVERSTION_RESPONSE_STATUS.FINISH;
        newState.currentUserMsgIndex = -1;
        newState.isProcessing = true;
      } else {
        const conditionParams = buildConditionParams(state); // Build with oldState objParams
        for (let i = 0; i < newState.messagesList.length; i++) {
          if (newState.messagesList[i].conditions && newState.messagesList[i].conditions.length !== 0) {
            const result = checkMessageCondition(newState.messagesList[i], conditionParams);
            newState.messagesList[i].hidden = !result;
          }

          if (i <= clickedMsgIndex) continue;
          if (newState.messagesList[i].hidden && !stringNullOrEmpty(newState.messagesList[i].hidden)) continue;

          if (isBotMessage(newState.messagesList[i])) {
            newState = {
              ...newState,
              ...processForBotMessage(newState.messagesList, i, newState, false, false)
            };
          } else if (isUserMessage(newState.messagesList[i])) {
            newState = {
              ...newState,
              ...processForUserMessage(newState.messagesList, i, newState, false)
            };
          }
        }
      }

      newState.userMessagesList = newState.messagesList.filter((item) => isUserMessage(item));
      newState.nextStopMsgIndex = state.messagesList.findIndex(getNextUserMsg((_, index) => index > clickedMsgIndex)) + 1;
      newState.currentMsgIndex = clickedMsgIndex + 1;
      if (newState.nextStopMsgIndex < newState.currentMsgIndex) {
        newState.nextStopMsgIndex = newState.currentMsgIndex;
      }
      newState.renderMessagesList = newState.messagesList.slice(0, newState.currentMsgIndex + 1);

      return { ...state, ...newState };
    case PREVIEW_ACTIONS.UPDATE_PREFECTURES_LIST:
      return { ...state, prefecturesList: action.payload.prefecturesList };
    case PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA:
      // Support only for amazon pay and subscstore cart system
      const newMessagesList = mapAmazonPayDataToMessagesList(action.payload, state.messagesList, state.prefecturesList);
      const renderMessagesList = newMessagesList.slice(0, state.currentMsgIndex + 1);
      return { ...state, messagesList: newMessagesList, renderMessagesList: renderMessagesList };
    case PREVIEW_ACTIONS.SET_CHECKOUT_URL:
      return { ...state, checkoutUrl: action.payload };
    case PREVIEW_ACTIONS.SET_OBJ_PARAM:
      return { ...state, objParam: action.payload };
    case PREVIEW_ACTIONS.SET_SHOW_POPUP_CLOSE_BOT:
      return { ...state, showPopupCloseBot: action.payload };
    case PREVIEW_ACTIONS.SET_SCENARIO_USER_RESPONSES:
      return { ...state, scenarioUserResponses: action.payload };
    case PREVIEW_ACTIONS.SET_BOT_ID:
      return { ...state, botId: action.payload };
    case PREVIEW_ACTIONS.CLOSE_BOT:
      return { ...state, isOpen: false, showPopupCloseBot: false };
    case PREVIEW_ACTIONS.SET_CAPTCHA:
      return { ...state, captcha: action.payload };
    case PREVIEW_ACTIONS.SET_URL_SEND:
      return { ...state, urlSend: action.payload };
    case PREVIEW_ACTIONS.SET_URL_RECEIVE:
      return { ...state, urlReceive: action.payload };
    case PREVIEW_ACTIONS.SET_DEVICE_RECEIVE:
      return { ...state, deviceReceive: action.payload };
    case PREVIEW_ACTIONS.SET_SCENARIO_ID:
      return { ...state, scenarioId: action.payload };
    case PREVIEW_ACTIONS.SET_CONVERSION_STATUS:
      return { ...state, conversionStatus: action.payload };
    case PREVIEW_ACTIONS.SET_STOP_RENDER:
      return { ...state, stopRender: action.payload };
    case PREVIEW_ACTIONS.SET_ERRORS:
      return { ...state, errors: action.payload };
    case PREVIEW_ACTIONS.SET_CURRENT_USER_MSG_INDEX:
      return { ...state, currentUserMsgIndex: action.payload };
    case PREVIEW_ACTIONS.SET_DELAYING:
      return { ...state, isDelaying: action.payload };
    case PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SERVER: {
      // This action is used to set the state after retrieve scenario
      const designSetting = action.payload.responseData.design_settings;
      const chatbot = action.payload.responseData.chatbot;
      const botInfor = action.payload.botInfor;
      const { conversation } = action.payload.responseData?.data;
      const { variables, all_variables } = action.payload.responseData;

      let newState = {
        ...state,
        botInfor: botInfor,
        objParam: {},
        loadedStateFromSession: true,
        messagesList: conversation?.messages || [],
        isOpen: state.isOpen || Number(designSetting.display_type) === 1,
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
        isUsedErrMsgByJs: chatbot?.is_used_err_msg_by_js,
        errMsgJsCode: chatbot?.err_msg_js_code,
        useNewProcess: chatbot?.client_cart_system === CART_SYSTEM.EC_FORCE,
        isUsedPastMessageLoaded: !!chatbot?.is_used_message_loaded_past,
        isProcessing: false,
        useFullWidthChatbotMobile: !!chatbot?.use_fullwidth_chatbot_mobile,
        isUsedCustomJsCode: !!chatbot?.is_used_custom_js_code,
        headCustomJsCode: chatbot?.head_custom_js_code,
        topBodyCustomJsCode: chatbot?.top_body_custom_js_code,
        bottomBodyCustomJsCode: chatbot?.bottom_body_custom_js_code,
        isUsedCustomCss: !!chatbot?.is_used_custom_css,
        customCssContent: chatbot?.custom_css_content,
        currentMsgIndex: 0, // Start
      };

      if (variables) {
        newState.variables = [...variables, ...all_variables];
        newState.variables.forEach((item) => {
          newState.objParam[item.variable_name] = item.default_value;
        });
      }

      if (action.payload.isLoggedIn) {
        newState.messagesList.forEach((x) => x.hidden = x.not_display_when_logged_in);
      }

      newState.nextStopMsgIndex = newState.messagesList.findIndex(getNextUserMsg()) + 1;
      if (newState.nextStopMsgIndex < newState.currentMsgIndex) {
        newState.nextStopMsgIndex = newState.currentMsgIndex + 1;
      }
      newState.renderMessagesList = newState.messagesList.slice(0, newState.currentMsgIndex + 1);

      return { ...state, ...newState };
    }
    case PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SESSION_STORAGE: {
      const newState = {...action.payload.savedState};

      if (action.payload.isUsingAmazonPay) {
        // Support only for amazon pay and subscstore cart system (torizen san)
        const conditionParams = buildConditionParams(newState);
        for (let i = 0; i < newState.messagesList.length; i++) {
          const result = checkMessageCondition(newState.messagesList[i], conditionParams);
          newState.messagesList[i].hidden = !result;
        }
      }

      if (action.payload.isLoggedIn) {
        newState.messagesList.forEach((x) => x.hidden = x.not_display_when_logged_in);
      }

      if (newState.nextStopMsgIndex < newState.currentMsgIndex) {
        newState.nextStopMsgIndex = newState.currentMsgIndex + 1;
      }

      newState.renderMessagesList = newState.messagesList.slice(0, newState.currentMsgIndex + 1);
      newState.loadedStateFromSession = true;
      newState.isExtractFromSession = false;

      return { ...state, ...newState };
    }
    case PREVIEW_ACTIONS.OPEN_CHATBOT:
      return { ...state, isOpen: true, showPopupCloseBot: false, isAlreadyOpenFirstTime: true };
    case PREVIEW_ACTIONS.CLOSE_CHATBOT:
      return { ...state, isOpen: false, showPopupCloseBot: true };
    case PREVIEW_ACTIONS.OPEN_POPUP_CLOSE_BOT_MODAL:
      return { ...state, showPopupCloseBot: true };
    case PREVIEW_ACTIONS.SET_CHATBOT_SETTINGS:
      return { ...state, ...action.payload };
  }

  return state;
};

export default PreviewFukushashikiReducer;
