/* eslint-disable default-case */
import _ from 'lodash';
import { 
  stringNullOrEmpty, 
  checkMessageCondition, 
  checkFaqMessageCondition,
  processMessagesForErrorState, 
  isTempDelay,
  buildConditionParams,
  toNumber,
  findItem,
} from 'v2/views/BotElement/BotSetting/PreviewComponent/Utils';
import { processForBotMessage } from 'v2/views/BotElement/BotSetting/PreviewComponent/BotMessageUtils';
import { processForUserMessage } from 'v2/views/BotElement/BotSetting/PreviewComponent/UserMessageUtils';
import { processForCombineMessage, prepareCombineMessagesForPreview } from 'v2/views/BotElement/BotSetting/PreviewComponent/CombineMessageUtils';
import { isBotMessage, isUserMessage, isCombineMessage, getNextUserMsg } from 'v2/views/BotElement/BotSetting/PreviewComponent/Utils';
import {
  RENDER_CHATBOT_CONFIG,
  PREVIEW_ACTIONS,
  CONVERSTION_RESPONSE_STATUS,
  BOT_MESSAGE_TYPES,
  RENDER_MODES,
  MESSAGE_CONTENT_TYPES,
} from 'v2/views/BotElement/BotSetting/PreviewComponent/Constants.jsx';
import { getDefaultValue } from 'v2/views/BotElement/BotSetting/PreviewComponent/VariablesUtils';
import { parseThemeSettings } from 'v2/views/DesignSetting/utils/designThemeUtils';
import { resolveMainColorContext } from 'v2/views/DesignSetting/utils/designChatbotUtils';

const PreviewFaqReducer = (state, action) => {
  switch (action.type) {
    case PREVIEW_ACTIONS.UPDATE_MULTI_STATE: {
      if (action.payload.removeTempDelay && action.payload.renderMessagesList?.length) {
        action.payload.renderMessagesList = action.payload.renderMessagesList?.filter(m => {
          return !isTempDelay(m, RENDER_CHATBOT_CONFIG.TEMP_DELAY_PREFIX);
        }) || [];
      }
      const { isEditorPreviewDraft, ...editorPreviewPayload } = action.payload || {};
      if (isEditorPreviewDraft) {
        return {
          ...state,
          ...editorPreviewPayload,
          hasEditorPreviewDraftApplied: true,
        };
      }
      return { ...state, ...(!!state.submitErrorMessage ? processMessagesForErrorState(action.payload): action.payload) };
    }

    case PREVIEW_ACTIONS.SET_PROCESSING: 
      return { ...state, isProcessing: action.payload };
    case PREVIEW_ACTIONS.SET_IS_NOT_AUTO_SCROLL:
      return { ...state, isNotAutoScroll: action.payload };
    case PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES:
      if (action.payload.fromCallback) return state;

      const renderBaseState = {
        messagesList: _.cloneDeep(state.messagesList),
        variables: _.cloneDeep(state.variables),
      };
      const updatedState = Array.from(
        { length: action.payload.endIndex - action.payload.startIndex },
        (_, offset) => action.payload.startIndex + offset,
      ).reduce((acc, index) => {
        if (!isBotMessage(acc.messagesList[index])) return acc;
        return {
          ...acc,
          ...processForBotMessage(acc.messagesList, index, acc, false, false),
        };
      }, renderBaseState);

      const currentMsg = updatedState.messagesList[action.payload.endIndex - 1];
      const isNotAutoScroll = currentMsg?.message_content?.[0]?.type === MESSAGE_CONTENT_TYPES.IMAGE
        ? (currentMsg?.message_content?.[0]?.image?.is_not_auto_scroll || false)
        : (state.isNotAutoScroll || false);

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
      const { clickedMsgIndex } = action.payload;
      const isUpdateClicked = clickedMsgIndex < state.renderMessagesList.length - 1;
      const clickAcc = {
        state: {
          errors: {},
          originalMessagesList: _.cloneDeep(state.originalMessagesList),
          messagesList: _.cloneDeep(state.messagesList),
          originalVariables: _.cloneDeep(state.originalVariables),
          variables: _.cloneDeep(state.variables),
          nextStopMsgIndex: state.nextStopMsgIndex,
          currentMsgIndex: state.currentMsgIndex,
          loopCount: state.loopCount,
        },
      };

      if (state.conversionStatus === CONVERSTION_RESPONSE_STATUS.FINISH && isUpdateClicked) {
        clickAcc.state.conversionStatus = undefined;
        clickAcc.state.isProcessing = false;
      }

      clickAcc.state = processMessagesAfterClickNext(clickAcc.state, state, clickedMsgIndex);
      
      const nextStopMsgIndexInitial = clickAcc.state.messagesList.findIndex(getNextUserMsg((_, index) => index > clickedMsgIndex)) + 1;

      if (nextStopMsgIndexInitial < clickAcc.state.currentMsgIndex) {
        clickAcc.state = appendRootMessagesToMessagesList(clickAcc.state);
        clickAcc.state = processMessagesAfterClickNext(clickAcc.state, state, clickedMsgIndex);
      }

      const newState = clickAcc.state;
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
      const isEditorPreview = Boolean(action.payload.isEditorPreview);
      const { apiColorKey, mainColorHex } = resolveMainColorContext(chatbot);

      const newState = {
        ...state,
        botInfor: botInfor,
        objParam: isEditorPreview ? state.objParam : {},
        loadedStateFromSession: true,
        isOpen: isEditorPreview ? true : (isOpenFromState || isOpenFromAmazonPay),
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
        errMsgSettingMode: chatbot?.err_msg_setting_mode || 'js',
        errMsgFieldSelectors: chatbot?.err_msg_field_selectors || '',
        errMsgFormSelectors: chatbot?.err_msg_form_selectors || '',
        launchButtonSelectors: chatbot?.launch_button_selectors || '',
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
        themeSettings: action.payload.themeSettings
          ?? parseThemeSettings(designSetting?.theme, mainColorHex, apiColorKey),
        manuallyClosed: false,
        autoOpenAttempted: false,
      };

      if (isEditorPreview) {
        newState.originalMessagesList = state.originalMessagesList?.length
          ? state.originalMessagesList
          : state.messagesList;
        newState.messagesList = state.messagesList;
        newState.renderMessagesList = state.renderMessagesList;
        newState.currentMsgIndex = state.currentMsgIndex;
        newState.nextStopMsgIndex = state.nextStopMsgIndex;
        newState.renderMode = state.renderMode;
        newState.loopCount = state.loopCount;
        newState.progressBarMaxIndex = state.progressBarMaxIndex;
      } else {
        newState.originalMessagesList = _.cloneDeep(conversation?.messages || []);
        newState.messagesList = conversation?.messages || [];
        newState.currentMsgIndex = 0;
        newState.renderMode = RENDER_MODES.NEXT;
        newState.loopCount = 0;
      }

      if (!(isEditorPreview && state.hasEditorPreviewDraftApplied)) {
        newState.messagesList.filter(isBotMessage).forEach((message) => {
          message.message_content?.forEach((content) => {
            if (content.type === BOT_MESSAGE_TYPES.TEXT_INPUT) {
              content[content.type].originalContent = content[content.type].content;
            }
          });
        });

        prepareCombineMessagesForPreview(newState.messagesList);
      }

      if (variables) {
        newState.variables = [...variables, ...all_variables];
        newState.variables.forEach((item) => {
          newState.objParam[item.variable_name] = item.default_value;
        });

        newState.originalVariables = newState.variables;
      }

      if (isEditorPreview && state.hasEditorPreviewDraftApplied) {
        newState.originalMessagesList = state.originalMessagesList;
        newState.messagesList = state.messagesList;
        newState.renderMessagesList = state.renderMessagesList;
        newState.currentMsgIndex = state.currentMsgIndex;
        newState.nextStopMsgIndex = state.nextStopMsgIndex;
        newState.renderMode = state.renderMode;
        newState.loopCount = state.loopCount;
        newState.progressBarMaxIndex = state.progressBarMaxIndex;
      } else if (isEditorPreview && state.renderMessagesList?.length > 0) {
        newState.originalMessagesList = state.originalMessagesList?.length
          ? state.originalMessagesList
          : state.messagesList;
        newState.messagesList = state.messagesList;
        newState.renderMessagesList = state.renderMessagesList;
        newState.currentMsgIndex = state.currentMsgIndex;
        newState.nextStopMsgIndex = state.nextStopMsgIndex;
        newState.renderMode = state.renderMode;
        newState.loopCount = state.loopCount;
        newState.progressBarMaxIndex = state.progressBarMaxIndex;
      } else if (
        isEditorPreview
        && !state.hasEditorPreviewDraftApplied
        && !(state.renderMessagesList?.length > 0)
        && (conversation?.messages?.length > 0)
      ) {
        const apiMessages = _.cloneDeep(conversation.messages);
        newState.originalMessagesList = apiMessages;
        newState.messagesList = apiMessages;
        newState.renderMessagesList = apiMessages;
        newState.currentMsgIndex = apiMessages.length > 0 ? apiMessages.length - 1 : 0;
        newState.nextStopMsgIndex = apiMessages.length;
        newState.renderMode = RENDER_MODES.LAST;
      } else if (!isEditorPreview && newState.isOpen) {
        newState.nextStopMsgIndex = newState.messagesList.findIndex(getNextUserMsg()) + 1;
        if (newState.nextStopMsgIndex < newState.currentMsgIndex) {
          newState.nextStopMsgIndex = newState.currentMsgIndex + 1;
        }
        newState.renderMessagesList = newState.messagesList.slice(0, newState.currentMsgIndex + 1);
      } else if (!isEditorPreview) {
        newState.currentMsgIndex = -1;
        newState.nextStopMsgIndex = -1;
        newState.renderMessagesList = [];
      }

      const conditionParams = buildConditionParams(newState);
      if (!isEditorPreview) {
        newState.messagesList.forEach((message, index) => {
          const result = checkMessageCondition(message, conditionParams);
          newState.messagesList[index].hidden = !result;
        });
      }

      return { ...state, ...newState };
    }
    case PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SESSION_STORAGE: {
      const newState = {...action.payload.savedState};

      if (action.payload.isUsingAmazonPay) {
        const conditionParams = buildConditionParams(newState);
        newState.messagesList.forEach((message, index) => {
          const clickedMsgLoopNumber = Math.floor(index / newState.originalMessagesList.length);
          const result = checkFaqMessageCondition(message, conditionParams, clickedMsgLoopNumber);
          newState.messagesList[index].hidden = !result;
        });
      }

      if (action.payload.isLoggedIn) {
        newState.messagesList.forEach((x) => x.hidden = x.not_display_when_logged_in);
      }

      Array.from(
        { length: Math.min(newState.nextStopMsgIndex, newState.messagesList.length) },
        (_, index) => index,
      ).forEach((index) => {
        if (isBotMessage(newState.messagesList[index])) {
          const result = processForBotMessage(newState.messagesList, index, newState, false, false);
          Object.assign(newState, result);
        }
      });

      newState.renderMessagesList = newState.messagesList.slice(0, newState.nextStopMsgIndex);
      newState.currentMsgIndex = newState.nextStopMsgIndex - 1;
      newState.loadedStateFromSession = true;
      newState.isExtractFromSession = false;
      newState.manuallyClosed = false;
      newState.autoOpenAttempted = false;
      newState.renderMode = RENDER_MODES.LAST;

      const { apiColorKey, mainColorHex } = resolveMainColorContext(newState.botInfor);
      newState.themeSettings = parseThemeSettings(
        newState.themeSettings,
        mainColorHex,
        apiColorKey,
      );

      return { ...state, ...newState };
    }
    case PREVIEW_ACTIONS.OPEN_CHATBOT: {
      if (state.currentMsgIndex === -1) {
        const openedState = {
          messagesList: _.cloneDeep(state.messagesList),
          currentMsgIndex: 0,
        };
        openedState.nextStopMsgIndex = openedState.messagesList.findIndex(getNextUserMsg()) + 1;
        openedState.renderMessagesList = openedState.messagesList.slice(0, openedState.currentMsgIndex + 1);
        return { ...state, isOpen: true, showPopupCloseBot: false, isAlreadyOpenFirstTime: true, manuallyClosed: false, autoOpenAttempted: true, ...openedState };
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
  const rootMessageIndex = (() => {
    const found = newState.originalMessagesList.findIndex(msg => msg.is_root_faq_msg === true);
    return found === -1 ? 0 : found;
  })();
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
  const conditionParams = buildConditionParams(oldState);
  const acc = { state: newState };
  newState.messagesList.forEach((message, index) => {
    if (message.conditions && message.conditions.length !== 0) {
      const clickedMsgLoopNumber = Math.floor(index / acc.state.originalMessagesList.length);
      const result = checkFaqMessageCondition(message, conditionParams, clickedMsgLoopNumber);
      acc.state.messagesList[index].hidden = !result;
    }

    if (index <= clickedMsgIndex) return;
    if (acc.state.messagesList[index].hidden && !stringNullOrEmpty(acc.state.messagesList[index].hidden)) return;

    if (isBotMessage(acc.state.messagesList[index])) {
      acc.state = {
        ...acc.state,
        ...processForBotMessage(acc.state.messagesList, index, acc.state, false, false),
      };
    } else if (isUserMessage(acc.state.messagesList[index])) {
      acc.state = {
        ...acc.state,
        ...processForUserMessage(acc.state.messagesList, index, acc.state, false),
      };
    } else if (isCombineMessage(acc.state.messagesList[index])) {
      acc.state = {
        ...acc.state,
        ...processForCombineMessage(acc.state.messagesList, index, acc.state, false),
      };
    }
  });
  return acc.state;
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
  const product = subContent.products?.find((item) => item.id === value);
  return {
    valueCode: product?.item_number,
    valueName: product?.title,
    valuePrice: product?.item_price,
  };
};

const getProductDetailsForProductPurchase = (subContent, value) => (
  (subContent.products || []).reduce((acc, product) => {
    value.forEach((val) => {
      if (!product.id !== val) return;

      acc.codesArray.push(product?.item_number);
      acc.namesArray.push(product?.title);
      acc.pricesArray.push(product?.item_price);
      acc.orderQuantitiesArray.push(product?.quantity_select);
    });
    return acc;
  }, {
    codesArray: [],
    namesArray: [],
    pricesArray: [],
    orderQuantitiesArray: [],
  })
);

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
