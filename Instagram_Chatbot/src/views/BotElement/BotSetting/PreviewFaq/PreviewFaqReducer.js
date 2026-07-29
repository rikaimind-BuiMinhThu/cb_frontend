/* eslint-disable default-case */
import _ from 'lodash';
import { 
  stringNullOrEmpty, 
  checkMessageCondition, 
  checkFaqMessageCondition,
  processMessagesForErrorState, 
  isTempDelay,
  buildConditionParams,
  toNumber
} from '../PreviewComponent/Utils';
import { processForBotMessage } from '../PreviewComponent/BotMessageUtils';
import { processForUserMessage } from '../PreviewComponent/UserMessageUtils';
import { isBotMessage, isUserMessage, getNextUserMsg } from '../PreviewComponent/Utils';
import {
  RENDER_CHATBOT_CONFIG,
  PREVIEW_ACTIONS,
  CART_SYSTEM,
  CONVERSTION_RESPONSE_STATUS,
  BOT_MESSAGE_TYPES,
  RENDER_MODES,
  MESSAGE_CONTENT_TYPES,
} from '../PreviewComponent/Constants.jsx';
import { getDefaultValue } from '../PreviewComponent/VariablesUtils';

const PreviewFaqReducer = (state, action) => {
  switch (action.type) {
    case PREVIEW_ACTIONS.UPDATE_MULTI_STATE:
      if (action.payload.removeTempDelay && action.payload.renderMessagesList?.length) {
        action.payload.renderMessagesList = action.payload.renderMessagesList?.filter(m => {
          return !isTempDelay(m, RENDER_CHATBOT_CONFIG.TEMP_DELAY_PREFIX);
        }) || [];
      }
      return { ...state, ...(!!state.submitErrorMessage ? processMessagesForErrorState(action.payload): action.payload) };

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

    case PREVIEW_ACTIONS.UPDATE_AFTER_CLICK_NEXT_BUTTON:
      // TODO: Update state after click Next in here
      // In here, default is validation ok
      const { clickedMsgIndex, clickedMsg, isLoggedIn } = action.payload;
      const isUpdateClicked = clickedMsgIndex < state.renderMessagesList.length - 1;
      let newState = {
        errors: {},
        originalMessagesList: _.cloneDeep(state.originalMessagesList),
        messagesList: _.cloneDeep(state.messagesList),
        originalVariables: _.cloneDeep(state.originalVariables),
        variables: _.cloneDeep(state.variables),
        nextStopMsgIndex: state.nextStopMsgIndex,
        currentMsgIndex: state.currentMsgIndex,
        loopCount: state.loopCount,
      };

      if (state.conversionStatus === CONVERSTION_RESPONSE_STATUS.FINISH && isUpdateClicked) {
        newState.conversionStatus = undefined;
        newState.isProcessing = false;
      }

      newState = processMessagesAfterClickNext(newState, state, clickedMsgIndex);
      
      // Calculate next stop message index
      let nextStopMsgIndex = newState.messagesList.findIndex(getNextUserMsg((_, index) => index > clickedMsgIndex)) + 1;

      if (nextStopMsgIndex < newState.currentMsgIndex) {
        // Add more one messageList to messsageList from root message to last message
        newState = appendRootMessagesToMessagesList(newState);
        newState = processMessagesAfterClickNext(newState, state, clickedMsgIndex);
        nextStopMsgIndex = newState.messagesList.findIndex(getNextUserMsg((_, index) => index > clickedMsgIndex)) + 1;
      }

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

      return { ...state, ...newState };
    case PREVIEW_ACTIONS.UPDATE_AFTER_CHANGE_VALUE: {
      const { contentIndex, messageIndex, contentType, value, field, subField1, subField2, message } = action.payload;
      const newState = {
        messagesList: _.cloneDeep(state.messagesList),
        variables: _.cloneDeep(state.variables),
        objParam: _.cloneDeep(state.objParam),
        prefecturesList: _.cloneDeep(state.prefecturesList),
        loopCount: state.loopCount,
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
      if (messageIndex && messageIndex >= 0) {
        newState.messagesList[messageIndex].message_content[contentIndex][contentType] = _.cloneDeep(subContent);
      }

      handleSaveInputContent(newState, subContent, contentType, field, value);

      return { ...state, ...newState };
    }
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
      const resolvedDisplayType = Number(designSetting?.display_type ?? state.displayType ?? 2);
      const isOpenFromState = Boolean(state.isOpen);
      const isOpenFromAmazonPay = Boolean(action.payload.isUsingAmazonPay);

      let newState = {
        ...state,
        botInfor: botInfor,
        objParam: {},
        loadedStateFromSession: true,
        originalMessagesList: _.cloneDeep(conversation?.messages || []),
        messagesList: conversation?.messages || [],
        isOpen: isOpenFromState || isOpenFromAmazonPay,
        activePopupCloseBot: Boolean(designSetting?.popup_close_bot),
        titleBubble: designSetting?.title_bubble || "簡単90秒で注文完了",
        displayType: resolvedDisplayType,
        widthPc: toNumber(designSetting?.width_pc, 450),
        heightPc: toNumber(designSetting?.height_pc, 700),
        widthSp: toNumber(designSetting?.width_sp, 100),
        heightSp: toNumber(designSetting?.height_sp, 100),
        positionPc: designSetting?.position_pc || "1",
        rightPcTitle: designSetting?.right_position_pc_title,
        buttonTypePc: designSetting?.button_type_pc || "1",
        rightMarginPc: toNumber(designSetting?.right_margin_pc, 10),
        bottomMarginPc: toNumber(designSetting?.bottom_margin_pc, 0),
        positionSp: designSetting?.position_sp || "1",
        buttonTypeSp: designSetting?.button_type_sp || "1",
        rightSpTitle: designSetting?.right_position_sp_title,
        rightMarginSp: toNumber(designSetting?.right_margin_sp, 10),
        bottomMarginSp: toNumber(designSetting?.bottom_margin_sp, 10),
        isUsedErrMsgByJs: chatbot?.is_used_err_msg_by_js,
        errMsgJsCode: chatbot?.err_msg_js_code,
        isUsedPastMessageLoaded: !!chatbot?.is_used_message_loaded_past,
        isProcessing: false,
        useFullWidthChatbotMobile: !!chatbot?.use_fullwidth_chatbot_mobile,
        isUsedCustomJsCode: !!chatbot?.is_used_custom_js_code,
        headCustomJsCode: chatbot?.head_custom_js_code,
        topBodyCustomJsCode: chatbot?.top_body_custom_js_code,
        bottomBodyCustomJsCode: chatbot?.bottom_body_custom_js_code,
        isUsedCustomCss: !!chatbot?.is_used_custom_css,
        customCssContent: chatbot?.custom_css_content,
        isUsedHtmlUgc: !!chatbot?.is_used_html_ugc,
        htmlUgcConfigContent: chatbot?.html_ugc_config_content,
        currentMsgIndex: 0, // Start
        manuallyClosed: false,
        autoOpenAttempted: false,
        renderMode: RENDER_MODES.NEXT,
        loopCount: 0,
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

        newState.originalVariables = newState.variables;
      }

      if (state.isOpen) {
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

      return { ...state, ...newState };
    }
    case PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SESSION_STORAGE: {
      let newState = {...action.payload.savedState};

      if (action.payload.isUsingAmazonPay) {
        // Support only for amazon pay and subscstore cart system (torizen san)
        const conditionParams = buildConditionParams(newState);
        for (let i = 0; i < newState.messagesList.length; i++) {
          const clickedMsgLoopNumber = Math.floor(i / newState.originalMessagesList.length);
          const result = checkFaqMessageCondition(newState.messagesList[i], conditionParams, clickedMsgLoopNumber);
          newState.messagesList[i].hidden = !result;
        }
      }

      if (action.payload.isLoggedIn) {
        newState.messagesList.forEach((x) => x.hidden = x.not_display_when_logged_in);
      }

      for (let i = 0; i < newState.nextStopMsgIndex && i < newState.messagesList.length; i++) {
        if (isBotMessage(newState.messagesList[i])) {
          const result = processForBotMessage(newState.messagesList, i, newState, false, false);
          newState = {
            ...newState,
            ...result
          };
        }
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
    case PREVIEW_ACTIONS.SET_SUBMIT_ERROR_MESSAGE:
      return { ...state, submitErrorMessage: action.payload };
    case PREVIEW_ACTIONS.CLEAR_SUBMIT_ERROR_MESSAGE:
      return { ...state, submitErrorMessage: '' };
  }

  return state;
};

const appendRootMessagesToMessagesList = (newState) => {
  let rootMessageIndex = newState.originalMessagesList.findIndex(msg => msg.is_root_faq_msg === true);
  if (rootMessageIndex === -1) rootMessageIndex = 0;
  const lastMessageIndex = newState.originalMessagesList.length - 1;
  newState.loopCount++;

  const additionalMessagesList = newState.originalMessagesList.slice(rootMessageIndex, lastMessageIndex + 1);
  additionalMessagesList.filter(isBotMessage).forEach(msg => {
    msg.message_content.forEach(content => {
      if (content.type === BOT_MESSAGE_TYPES.TEXT_INPUT) {
        content[content.type].originalContent = content[content.type].content;
      }
    });
  });

  newState.messagesList = [...newState.messagesList, ...additionalMessagesList];
  newState = pushNewVariablesToVariablesList(newState);

  return newState;
};

const pushNewVariablesToVariablesList = (newState) => {
  const newVariables = newState.originalVariables.map(item => {
    const prefix = newState.loopCount > 0 ? `${newState.loopCount}_` : '';
    return {
      ...item,
      variable_name: `${prefix}${item.variable_name}`
    };
  });
  newState.variables = [...newState.variables, ...newVariables];

  newState.variables.forEach((item) => {
    const prefix = newState.loopCount > 0 ? `${newState.loopCount}_` : '';
    const variableName = `${prefix}${item.variable_name}`;
    if (item.variable_name !== variableName) {
      return item;
    }

    item.default_value = getDefaultValue(item, item.contentType, item.field, item.value, newState.prefecturesList, newState.variables, item.variable_name);

    newState.objParam[variableName] = item.default_value;
  });
  return newState;
};

const processMessagesAfterClickNext = (newState, oldState, clickedMsgIndex) => {
  const conditionParams = buildConditionParams(oldState); // Build with oldState objParams
  for (let i = 0; i < newState.messagesList.length; i++) {
    if (newState.messagesList[i].conditions && newState.messagesList[i].conditions.length !== 0) {
      const clickedMsgLoopNumber = Math.floor(i / newState.originalMessagesList.length);
      const result = checkFaqMessageCondition(newState.messagesList[i], conditionParams, clickedMsgLoopNumber);
      newState.messagesList[i].hidden = !result;
    }

    if (i <= clickedMsgIndex) continue;
    if (newState.messagesList[i].hidden && !stringNullOrEmpty(newState.messagesList[i].hidden)) continue;

    if (isBotMessage(newState.messagesList[i])) {
      const result = processForBotMessage(newState.messagesList, i, newState, false, false);
      newState = {
        ...newState,
        ...result
      };
    } else if (isUserMessage(newState.messagesList[i])) {
      newState = {
        ...newState,
        ...processForUserMessage(newState.messagesList, i, newState, false)
      };
    }
  }
  return newState;
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

  const prefix = newState.loopCount > 0 ? `${newState.loopCount}_` : '';

  const variableName = `${prefix}${subContent.save_input_content}`;

  newState.variables.forEach((item) => {
    if (item.variable_name !== variableName) {
      return item;
    }

    item.default_value = getDefaultValue(subContent, contentType, field, value, newState.prefecturesList, newState.variables, subContent.save_input_content);

    newState.objParam[variableName] = value;
  });
};

export default PreviewFaqReducer;
