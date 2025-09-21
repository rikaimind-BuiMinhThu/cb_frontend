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
import { isButtonSubmitMessage, isBotMessage, isUserMessage, getNextUserMsg, scrollToPosition } from '../PreviewComponent/Utils';
import { mapAmazonPayDataToMessagesList } from '../PreviewComponent/TorizenUtils';
import { RENDER_CHATBOT_CONFIG, GETTING_ERROR_NOTIFICATION, PREVIEW_ACTIONS } from '../PreviewComponent/Constants.jsx';

const PreviewFukushashikiReducer = (state, action) => {
  console.log("action", action);
  console.log("state.renderMessagesList inside reducer", state.renderMessagesList);
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
    case PREVIEW_ACTIONS.UPDATE_AFTER_CLICK_NEXT_BUTTON:
      // TODO: Update state after click Next in here
      // In here, default is validation ok
      const { clickedMsgIndex, clickedMsg, isLoggedIn } = action.payload;
      const newState = {
        errors: {},
        messagesList: _.cloneDeep(state.messagesList),
      };

      if (isLoggedIn) {
        newState.messagesList = newState.messagesList.map(x => ({...x, hidden: x.not_display_when_logged_in}));
      }

      const isClickedButtonSubmit = isButtonSubmitMessage(state.messagesList[clickedMsgIndex]);
      const isClickedLastMessage = state.messagesList.length - 1 === clickedMsgIndex;
      const nextOrCurrentUserMessage = state.messagesList.findIndex(getNextUserMsg((_, index) => index >= clickedMsgIndex));
      const isBtnUpdateClick = clickedMsgIndex < state.currentUserMsgIndex || (state.currentUserMsgIndex === -1 && clickedMsgIndex === nextOrCurrentUserMessage);

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
      newState.nextStopMsgIndex = newState.messagesList.findIndex(getNextUserMsg((_, index) => index >= clickedMsgIndex));
      newState.currentMsgIndex = clickedMsgIndex + 1;
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
  }

  return state;
};

export default PreviewFukushashikiReducer;
