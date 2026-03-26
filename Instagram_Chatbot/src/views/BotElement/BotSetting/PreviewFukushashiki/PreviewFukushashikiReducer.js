/* eslint-disable default-case */
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
import { isBotMessage, isUserMessage, getNextUserMsg } from '../PreviewComponent/Utils';
import { mapAmazonPayDataToMessagesList } from '../PreviewComponent/TorizenUtils';
import { mapAmazonPayDataToMessagesListForBliss } from '../PreviewComponent/BlissUtils';
import { mapAmazonPayDataToMessagesListForPhystech } from '../PreviewComponent/PhysTechUtils';
import { mapAmazonPayDataToMessagesListForYuwaeru } from '../PreviewComponent/YuwaeruUtils';
import {
  RENDER_CHATBOT_CONFIG,
  GETTING_ERROR_NOTIFICATION,
  PREVIEW_ACTIONS,
  CART_SYSTEM,
  CONVERSTION_RESPONSE_STATUS,
  BOT_MESSAGE_TYPES,
  RENDER_MODES,
  MESSAGE_CONTENT_TYPES,
} from '../PreviewComponent/Constants.jsx';
import { getDefaultValue } from '../PreviewComponent/VariablesUtils';

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
    case PREVIEW_ACTIONS.SET_PROCESSING: 
      return { ...state, isProcessing: action.payload };
    case PREVIEW_ACTIONS.SET_IS_NOT_AUTO_SCROLL:
      return { ...state, isNotAutoScroll: action.payload };
    case PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES:
      if (action.payload.fromCallback) return state;

      let updatedState = {
        messagesList: _.cloneDeep(state.messagesList),
        variables: _.cloneDeep(state.variables),
      };

      for (let i = action.payload.startIndex; i < action.payload.endIndex; i++) {
        if (isBotMessage(updatedState.messagesList[i])) {
          const result = processForBotMessage(updatedState.messagesList, i, updatedState, false, false);
          updatedState = {
            ...updatedState,
            ...result
          };
        }
      }

      const currentMsg = updatedState.messagesList[action.payload.endIndex - 1];
      let isNotAutoScroll = state.isNotAutoScroll || false;

      if (currentMsg?.message_content?.[0]?.type === MESSAGE_CONTENT_TYPES.IMAGE) {
        isNotAutoScroll = currentMsg?.message_content?.[0]?.image?.is_not_auto_scroll || false;
      }

      return {
        ...state,
        ...updatedState,
        renderMessagesList: updatedState.messagesList.slice(action.payload.startIndex, action.payload.endIndex),
        currentMsgIndex: action.payload.endIndex - 1,
        isNotAutoScroll: isNotAutoScroll,
      };
    case PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE: {
      let messagesList = _.cloneDeep(state.messagesList);

      if (action.payload === GETTING_ERROR_NOTIFICATION) {
        return {
          ...state,
          submitErrorMessage: action.payload,
          isProcessing: false,
        };
      }

      if (stringNullOrEmpty(action.payload)) {
        const conditionParams = buildConditionParams(state);

        messagesList = messagesList.map((message) => {
          if ((message.hidden || message.hidden === undefined) && message.not_display_when_have_error) {
            message.hidden = !checkMessageCondition(message, conditionParams);
          }
          return message;
        });

        let nextStopMsgIndex = state.nextStopMsgIndex;

        if (!nextStopMsgIndex || (nextStopMsgIndex < messagesList.length && nextStopMsgIndex > 0 && messagesList[nextStopMsgIndex - 1].hidden) || (nextStopMsgIndex <= state.currentMsgIndex)){
          nextStopMsgIndex = messagesList.findIndex(getNextUserMsg((_, index) => index > state.currentMsgIndex)) + 1;
        }

        return {
          ...state,
          messagesList: messagesList,
          renderMessagesList: messagesList.slice(0, state.currentMsgIndex + 1),
          submitErrorMessage: action.payload,
          isProcessing: false,
          nextStopMsgIndex: nextStopMsgIndex,
        };
      }

      messagesList = messagesList.map((message) => {
        if (!message.hidden) {
          message.hidden = message.not_display_when_have_error;
        }
        return message;
      });

      const renderMessagesList = messagesList.slice(0, state.currentMsgIndex + 1);
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
      const isUpdateClicked = clickedMsgIndex < state.renderMessagesList.length - 1;
      let newState = {
        errors: {},
        messagesList: _.cloneDeep(state.messagesList),
        variables: _.cloneDeep(state.variables),
        nextStopMsgIndex: state.nextStopMsgIndex,
        currentMsgIndex: state.currentMsgIndex,
      };

      if (state.conversionStatus === CONVERSTION_RESPONSE_STATUS.FINISH && isUpdateClicked) {
        newState.conversionStatus = undefined;
        newState.isProcessing = false;
      }
      
      if (isLoggedIn) {
        newState.messagesList = newState.messagesList.map(x => ({...x, hidden: x.not_display_when_logged_in}));
      }

      const isClickedLastMessage = state.messagesList.length - 1 === clickedMsgIndex;

      if (isClickedLastMessage) {
        newState.conversionStatus = CONVERSTION_RESPONSE_STATUS.FINISH;
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

      // Calculate next stop message index
      const nextStopMsgIndex = newState.messagesList.findIndex(getNextUserMsg((_, index) => index > clickedMsgIndex)) + 1;

      newState.renderMode = (isUpdateClicked && state.isUsedPastMessageLoaded) ? RENDER_MODES.LAST : RENDER_MODES.NEXT;
      if (newState.renderMode === RENDER_MODES.LAST) {
        // LAST mode: render all messages up to the next user message
        if (!isUpdateClicked) {
          newState.nextStopMsgIndex = nextStopMsgIndex;
          if (newState.nextStopMsgIndex <= 0) {
            // If click to last message -> render message from 1 to last message
            // currentMsgIndex is not changed
            newState.nextStopMsgIndex = newState.messagesList.length;
          } else {
            newState.currentMsgIndex = newState.nextStopMsgIndex - 1;
          }
        }
      } else {
        // NEXT mode: render messages one by one
        newState.currentMsgIndex = clickedMsgIndex; 
        newState.nextStopMsgIndex = nextStopMsgIndex;
      }
      
      // Ensure nextStopMsgIndex is not less than currentMsgIndex (common validation)
      if (newState.nextStopMsgIndex < newState.currentMsgIndex) {
        newState.nextStopMsgIndex = newState.currentMsgIndex;
      }

      newState.renderMessagesList = newState.messagesList.slice(0, newState.currentMsgIndex + 1);
      newState.isUpdateClicked = isUpdateClicked;
      if (isUpdateClicked) {
        if (newState.renderMode === RENDER_MODES.NEXT) {
          newState.passedUserMsgCount = newState.renderMessagesList.filter(m => isUserMessage(m)).length - 1;
        }
      } else {
          newState.passedUserMsgCount = state.passedUserMsgCount + 1;
      }
      return { ...state, ...newState };
    case PREVIEW_ACTIONS.UPDATE_PREFECTURES_LIST:
      return { ...state, prefecturesList: action.payload.prefecturesList };
    case PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA:
      // Support only for amazon pay and subscstore cart system
      const newMessagesList = mapAmazonPayDataToMessagesList(action.payload, state.messagesList, state.prefecturesList);
      const renderMessagesList = newMessagesList.slice(0, state.currentMsgIndex + 1);
      return { ...state, messagesList: newMessagesList, renderMessagesList: renderMessagesList };
    case PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_BLISS:
      const newMessagesListForBliss = mapAmazonPayDataToMessagesListForBliss(action.payload, state.messagesList, state.prefecturesList);
      const renderMessagesListForBliss = newMessagesListForBliss.slice(0, state.currentMsgIndex + 1);
      return { ...state, messagesList: newMessagesListForBliss, renderMessagesList: renderMessagesListForBliss};
    case PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_PHYSTECH:
      const newMessagesListForPhystech = mapAmazonPayDataToMessagesListForPhystech(action.payload, state.messagesList, state.prefecturesList);
      const renderMessagesListForPhystech = newMessagesListForPhystech.slice(0, state.currentMsgIndex + 1);
      return { ...state, messagesList: newMessagesListForPhystech, renderMessagesList: renderMessagesListForPhystech};
    case PREVIEW_ACTIONS.UPDATE_AMAZON_PAY_DATA_FOR_YUWAERU:
      const newMessagesListForYuwaeru = mapAmazonPayDataToMessagesListForYuwaeru(action.payload, state.messagesList, state.prefecturesList);
      const renderMessagesListForYuwaeru = newMessagesListForYuwaeru.slice(0, state.currentMsgIndex + 1);
      return { ...state, messagesList: newMessagesListForYuwaeru, renderMessagesList: renderMessagesListForYuwaeru};
    case PREVIEW_ACTIONS.UPDATE_AFTER_CHANGE_VALUE: {
      const { contentIndex, contentType, value, field, subField1, subField2, message } = action.payload;
      const newState = {
        messagesList: _.cloneDeep(state.messagesList),
        variables: _.cloneDeep(state.variables),
        objParam: _.cloneDeep(state.objParam),
        prefecturesList: _.cloneDeep(state.prefecturesList),
      };

      const subContent = message.message_content[contentIndex][contentType];

      switch (contentType) {
        case 'zip_code_address':
          changeZipCodeAddress(subContent, value, field, state.prefecturesList);
          break;
        case 'product_purchase':
          changeProductPurchase(newState, subContent, value, field);
          break;
        case 'product_purchase_radio_button':
          changeProductPurchaseRadioButton(newState, subContent, field, value);
          break;
        default:
          changeContentValue(subContent, value, field, subField1, subField2);
          break;
      }

      // Update value of message
      const messageIndex = newState.messagesList.findIndex(x => x.id === message.id);
      if (messageIndex === -1) {
        throw new Error(`${PREVIEW_ACTIONS.UPDATE_AFTER_CHANGE_VALUE}: Message with id ${message.id} not found`);
      }
      newState.messagesList[messageIndex].message_content[contentIndex][contentType] = _.cloneDeep(subContent);

      handleSaveInputContent(newState, subContent, contentType, field, value);

      return { ...state, ...newState };
    }
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
    case PREVIEW_ACTIONS.SET_UPSELL_BOT_ID:
      return {...state, botId: action.payload, isUpsell: true};
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
        isOpen: state.isOpen || action.payload.isUsingAmazonPay,
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
        manuallyClosed: false,
        autoOpenAttempted: false,
        renderMode: RENDER_MODES.NEXT,
      };

      // Update originalContent for replace variables when after getPreviewResponse
      newState.messagesList.filter(isBotMessage).forEach((message) => {
        message.message_content.forEach((content) => {
          if (content.type === BOT_MESSAGE_TYPES.TEXT_INPUT) {
            content[content.type].originalContent = content[content.type].content;
          }
        });
      });

      if (variables) {
        newState.variables = [...variables, ...all_variables];
        newState.variables.forEach((item) => {
          newState.objParam[item.variable_name] = item.default_value;
        });
      }

      if (action.payload.isLoggedIn) {
        newState.messagesList.forEach((x) => x.hidden = x.not_display_when_logged_in);
      }

      if (state.isOpen || action.payload.isUsingAmazonPay) {
        newState.nextStopMsgIndex = newState.messagesList.findIndex(getNextUserMsg()) + 1;
        if (newState.nextStopMsgIndex < newState.currentMsgIndex) {
          newState.nextStopMsgIndex = newState.currentMsgIndex + 1;
        }
        newState.renderMessagesList = newState.messagesList.slice(0, newState.currentMsgIndex + 1);
      } else {
        newState.currentMsgIndex = -1;
        newState.nextStopMsgIndex = -1;
        newState.renderMessagesList = [];
      }

      const conditionParams = buildConditionParams(newState);
      for (let i = 0; i < newState.messagesList.length; i++) {
        const result = checkMessageCondition(newState.messagesList[i], conditionParams);
        newState.messagesList[i].hidden = !result;
      }

      const progressBarTargetCountMessagesList = newState.messagesList.filter(msg => {
        if (!isUserMessage(msg)) return false;

        const contentCount = msg?.message_content?.length;
        const firstMsgContent = msg?.message_content?.[0];
        const isDisplayBtnNext = firstMsgContent?.type !== MESSAGE_CONTENT_TYPES.IMAGE || firstMsgContent?.image?.displayButtonNext !== false;
        if (!isDisplayBtnNext) return false;
        if (firstMsgContent?.type === MESSAGE_CONTENT_TYPES.SUBMIT_BUTTON && contentCount === 1) return false;

        return true;
      });

      newState.progressBarMaxIndex = progressBarTargetCountMessagesList.length;

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

      newState.renderMessagesList = newState.messagesList.slice(0, newState.nextStopMsgIndex);
      newState.currentMsgIndex = newState.nextStopMsgIndex - 1;
      newState.loadedStateFromSession = true;
      newState.isExtractFromSession = false;
      newState.manuallyClosed = false;
      newState.autoOpenAttempted = false;
      newState.renderMode = RENDER_MODES.LAST;

      return { ...state, ...newState };
    }
    case PREVIEW_ACTIONS.OPEN_CHATBOT: {
      if (state.currentMsgIndex === -1) {
        // First time open chatbot
        let newState = {
          messagesList: _.cloneDeep(state.messagesList),
        };
        newState.currentMsgIndex = 0;
        newState.nextStopMsgIndex = newState.messagesList.findIndex(getNextUserMsg()) + 1;
        newState.renderMessagesList = newState.messagesList.slice(0, newState.currentMsgIndex + 1);
        return { ...state, isOpen: true, showPopupCloseBot: false, isAlreadyOpenFirstTime: true, manuallyClosed: false, autoOpenAttempted: true, ...newState };
      }

      return { ...state, isOpen: true, showPopupCloseBot: false, isAlreadyOpenFirstTime: true, manuallyClosed: false, autoOpenAttempted: true };
    }
    case PREVIEW_ACTIONS.CLOSE_CHATBOT:
      return { ...state, isOpen: false, showPopupCloseBot: true, autoOpenAttempted: false, manuallyClosed: true };
    case PREVIEW_ACTIONS.OPEN_POPUP_CLOSE_BOT_MODAL:
      return { ...state, showPopupCloseBot: true };
    case PREVIEW_ACTIONS.SET_CHATBOT_SETTINGS:
      return { ...state, ...action.payload };
    case PREVIEW_ACTIONS.SET_MANUALLY_CLOSED:
      return { ...state, manuallyClosed: action.payload };
    case PREVIEW_ACTIONS.UPDATE_NUMBER_ORDER_TO_UPSELL:
      const {variables, objParam} = action.payload;
      let newVariables = [...state.variables];
      
      if (variables) {
        const entries = Array.isArray(variables) 
          ? variables.filter(v => v?.variable_name).map(v => [v.variable_name, v])
          : Object.entries(variables).map(([k, v]) => [k, {variable_name: k, default_value: String(v)}])

        entries.forEach(([name, data]) => {
          const idx = newVariables.findIndex(v => v.variable_name === name);
          idx >= 0 
          ? newVariables[idx] = {...newVariables[idx] = {...newVariables[idx], ...data}}
          : newVariables.push(data);
        })
      }
      return {
        ...state,
        variables: newVariables,
        objParam: objParam ? {...state.objParam, ...objParam} : state.objParam
      };

  }

  return state;
};

const changeContentValue = (subContent, value, field, subField1 = null, subField2 = null) => {
  if (!field) return;

  if (subField2) {
    subContent[field] = subContent[field] || {};
    subContent[field][subField1] = subContent[field][subField1] || {};
    subContent[field][subField1][subField2] = value;
  } else if (subField1) {
    subContent[field] = subContent[field] || {};
    subContent[field][subField1] = value;
  } else {
    subContent[field] = value;
  }
};

const changeZipCodeAddress = (subContent, value, field, prefecturesList) => {
  subContent.value_prefecture_type = subContent.is_use_dropdown ? "id" : "name";

  if (typeof value === "object") {
    const transformField = {
      value_prefecture: (value) => {
        if (subContent.value_prefecture_type === "id") {
          return value;
        }
        return findItem(prefecturesList, { 
          keys: 'id', 
          value: value, 
          callbackValue: value,
          onSuccess: (item) => item.name,
        });
      }
    };
    
    Object.keys(value).forEach((key) => {
      subContent[key] = transformField[key] ? transformField[key](value[key]) : value[key];
    });
  } else {
    subContent[field] = value;
  }
}

const changeProductPurchase = (newState, subContent, value, field) => {
  if (field !== "initial_selection" || !value.length) return;

  const { codesArray, namesArray, pricesArray, orderQuantitiesArray } = getProductDetailsForProductPurchase(subContent, value);

  const productVariables = [
    { variable_name: "product_code", default_value: codesArray.join(",") },
    { variable_name: "product_name", default_value: namesArray.join(",") },
    { variable_name: "product_unit_price", default_value: pricesArray.join(",") },
    { variable_name: "order_quantity", default_value: orderQuantitiesArray.join(",") }
  ];

  newState.variables.push(...productVariables);
  newState.objParam = {
    ...newState.objParam,
    product_code: codesArray.join(","),
    product_name: namesArray.join(","),
    product_unit_price: pricesArray.join(","),
    order_quantity: orderQuantitiesArray.join(","),
  };
}

const changeProductPurchaseRadioButton = (newState, subContent, field, value) => {
  if (field !== "initial_selection") return;

  const { valueCode, valueName, valuePrice } = getProductDetailsForProductPurchaseRadioButton(subContent, value);

  const productVariables = [
    { variable_name: "product_code", default_value: valueCode },
    { variable_name: "product_name", default_value: valueName },
    { variable_name: "product_unit_price", default_value: valuePrice }
  ];

  newState.variables.push(...productVariables);
  newState.objParam = {
    ...newState.objParam,
    product_code: valueCode,
    product_name: valueName,
    product_unit_price: valuePrice,
  };
};

const getProductDetailsForProductPurchaseRadioButton = (subContent, value) => {
  let valueCode, valueName, valuePrice;

  const product = subContent.products?.find(product => product.id === value);
  if (product) {
    valueCode = product.item_number;
    valueName = product.title;
    valuePrice = product.item_price;
  }

  return { valueCode, valueName, valuePrice };
}

const getProductDetailsForProductPurchase = (subContent, value) => {
  let codesArray = [];
  let namesArray = [];
  let pricesArray = [];
  let orderQuantitiesArray = [];

  subContent.products?.forEach((product) => {
    value.forEach((val) => {
      if (!product.id !== val) return;

      codesArray.push(product?.item_number);
      namesArray.push(product?.title);
      pricesArray.push(product?.item_price);
      orderQuantitiesArray.push(product?.quantity_select);
    });
  });

  return { codesArray, namesArray, pricesArray, orderQuantitiesArray };
}

const handleSaveInputContent = (newState, subContent, contentType, field, value) => {
  if (!subContent.is_save_input_content) return;
  if (contentType === 'card_payment_radio_button' && !['initial_selection', 'initial_selection_picture'].includes(field)) {
    return;
  }

  const variableName = subContent.save_input_content;

  newState.variables.forEach((item) => {
    if (item.variable_name !== variableName) {
      return item;
    }

    item.default_value = getDefaultValue(subContent, contentType, field, value, newState.prefecturesList, newState.variables, variableName);

    newState.objParam[variableName] = value;
  });
};

export default PreviewFukushashikiReducer;
