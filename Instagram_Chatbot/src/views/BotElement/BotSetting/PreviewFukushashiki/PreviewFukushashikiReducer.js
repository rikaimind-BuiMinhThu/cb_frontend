import _ from 'lodash';
import { 
  stringNullOrEmpty, 
  checkMessageCondition, 
  processMessagesForErrorState, 
  isTempDelay,
  buildConditionParams
} from '../PreviewComponent/Utils';
import { mapAmazonPayDataToMessagesList } from '../PreviewComponent/TorizenUtils';
import { RENDER_CHATBOT_CONFIG, GETTING_ERROR_NOTIFICATION } from '../PreviewComponent/Constants.jsx';

export const PREVIEW_ACTIONS = {
  UPDATE_MULTI_STATE: "UPDATE_MULTI_STATE",
  ADD_LP_OPTION_DATA: "ADD_LP_OPTION_DATA",
  UPDATE_PREVIEW_ORDER_CONTENT: "UPDATE_PREVIEW_ORDER_CONTENT",
  UPDATE_OPEN_PREVIEW: "UPDATE_OPEN_PREVIEW",
  SET_PROCESSING: "SET_PROCESSING",
  UPDATE_RENDER_MESSAGES: "UPDATE_RENDER_MESSAGES",
  UPDATE_SUBMIT_ERROR_MESSAGE: "UPDATE_SUBMIT_ERROR_MESSAGE",
  UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG: "UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG",
  UPDATE_PREFECTURES_LIST: "UPDATE_PREFECTURES_LIST",
  UPDATE_AMAZON_PAY_DATA: "UPDATE_AMAZON_PAY_DATA",
  SET_CHECKOUT_URL: "SET_CHECKOUT_URL",
  SET_OBJ_PARAM: "SET_OBJ_PARAM",
  SET_SHOW_POPUP_CLOSE_BOT: "SET_SHOW_POPUP_CLOSE_BOT",
  SET_SCENARIO_USER_RESPONSES: "SET_SCENARIO_USER_RESPONSES",
  SET_BOT_ID: "SET_BOT_ID",
  CLOSE_BOT: "CLOSE_BOT",
  SET_CAPTCHA: "SET_CAPTCHA",
  SET_URL_SEND: "SET_URL_SEND",
  SET_URL_RECEIVE: "SET_URL_RECEIVE",
  SET_DEVICE_RECEIVE: "SET_DEVICE_RECEIVE",
  SET_SCENARIO_ID: "SET_SCENARIO_ID",
  SET_CONVERSION_STATUS: "SET_CONVERSION_STATUS",
  SET_STOP_RENDER: "SET_STOP_RENDER",
  SET_ERRORS: "SET_ERRORS",
  SET_CURRENT_USER_MSG_INDEX: "SET_CURRENT_USER_MSG_INDEX",
  SET_DELAYING: "SET_DELAYING",
};

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
        renderMessagesList: state.messagesList.slice(action.payload.startIndex, action.payload.endIndex)
      };
    case PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE: {
      let messagesList = _.cloneDeep(state.messagesList);

      if (action.payload === GETTING_ERROR_NOTIFICATION) {
        return state;
      }

      if (stringNullOrEmpty(action.payload)) {
        messagesList = messagesList.map((message, index) => {
          if (message.message_content.find(content => content.type === 'getting_error_notification' || content.type === 'delay') && index < state.currentMsgIndex) {
            message.hidden = true;
          } else if (message.not_display_when_have_error) {
            const conditionParams = buildConditionParams(state);
            const result = checkMessageCondition(message, conditionParams);
            message.hidden = !result;;
          }
          return message;
        });
      } else {
        messagesList = messagesList.map((message, index) => {
          if (!message.hidden) {
            message.hidden = action.payload && message.not_display_when_have_error;
          }
          return message;
        });
      }

      const renderMessagesList = messagesList.slice(0, state.currentMsgIndex + 1)
      const userMessagesList = messagesList.filter(message => message.belong_to === 'user' && message.message_content.length > 0);
      return { ...state,
        messagesList: messagesList,
        renderMessagesList: renderMessagesList,
        userMessagesList: userMessagesList,
        submitErrorMessage: action.payload,
        isProcessing: false,
      };
    }

    case PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE_WITH_DISPLAY_MSG: {
      let messagesList = _.cloneDeep(state.messagesList);

      if ((action.payload.displayMsg || []).length > 0) {
        messagesList = messagesList.map((message, index) => {
          if (action.payload.displayMsg.includes(message.name?.trim())) {
            message.hidden = false;
          }
          return message;
        });
      }
      const renderMessagesList = messagesList.slice(0, state.currentMsgIndex + 1)
      const userMessagesList = messagesList.filter(message => message.belong_to === 'user' && message.message_content.length > 0);
      return { ...state,
        messagesList: messagesList,
        renderMessagesList: renderMessagesList,
        userMessagesList: userMessagesList,
        submitErrorMessage: action.payload.error,
        isProcessing: false,
      };
    }
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
  }

  return state;
};

export default PreviewFukushashikiReducer;
