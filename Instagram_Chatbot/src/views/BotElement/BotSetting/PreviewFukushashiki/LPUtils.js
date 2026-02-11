
import { CHATBOT_ACTIONS } from "../PreviewComponent/Constants";
import { isTorizenLpAmazonData, isTorizenLP } from "../PreviewComponent/TorizenUtils";
import { isBlissLpAmazonData, isBlissLP } from "../PreviewComponent/BlissUtils";
import { isPhystechLpAmazonData, isPhystechLP } from "../PreviewComponent/PhysTechUtils";
import { convertToFukushashikiObject } from "./FukushashikiDataConverterUtils";
import { isUserMessage, sendOpenChatbotCountRequest } from "../PreviewComponent/Utils";

const postMessageToParent = (options, state) => {
  if (!window || !window.parent) return;
  
  const defaultOptions = {
    isOpen: state.isOpen,
    source: 'ec-chatbot',
    useMoblieFullwidth: !!state.useFullWidthChatbotMobile,
    isUpsell: !!state.isUpsell,
    widthPc: state.widthPc,
    heightPc: state.heightPc,
    widthSp: state.widthSp,
    heightSp: state.heightSp,
    chatbotRight: state.rightMarginPc,
    chatbotBottom: state.bottomMarginPc,
  };
  
  window.parent.postMessage({
    ...defaultOptions,
    ...options,
  }, state.urlReceive || '*');
}

const fukushashikiToLP = (fukushashikiData, state) => {
  postMessageToParent({
    action: 'fukushashiki',
    actionData: fukushashikiData,
    isOpen: state.isOpen
  }, state);
};

const fukushashikiSavedStateToLp = (savedState, params, state) => {
  return new Promise((resolve) => {
    let fukuDataList = [];

    const userMessagesList = savedState.messagesList.filter(isUserMessage);
    userMessagesList.forEach((message) => {
      // Except some data when fukushashiki for case AmazonPay
      if (params.get('is_using_amazon_pay')) {
        // For Torizen
        if (isTorizenLP(state.urlReceive) && isTorizenLpAmazonData(message)) return;
        // For Bliss
        if (isBlissLP(state.urlReceive) && isBlissLpAmazonData(message)) return;
        // For Phystech
        if (isPhystechLP(state.urlReceive) && isPhystechLpAmazonData(message)) return;
      }
      
      const fukuData = convertToFukushashikiObject({message: message});
      fukuDataList.push(...fukuData);
    });

    fukushashikiToLP(fukuDataList, savedState);
    resolve();
  });
};

const injectCustomJsCode = (hasSentCustomJsRef, state, { head, top_body, bottom_body } = {}) => {
  if (hasSentCustomJsRef.current) return;

  const items = [ head, top_body, bottom_body ].filter(item => !!item?.jsCode?.trim() && !!item?.position?.trim() )
  postMessageToParent({
    action: CHATBOT_ACTIONS.INJECT_CUSTOM_JS,
    actionData: items,
    isOpen: state.isOpen,
  }, state);

  hasSentCustomJsRef.current = true;
};

const setConversionParamToLocalStorage = (scenarioId, botType, userInputId, env, state) => {
  postMessageToParent({
    isOpen: state.isOpen,
    action: CHATBOT_ACTIONS.SET_CHATBOT_CONVERSION_PARAMS_TO_LOCAL_STORAGE,
    actionData: {
      scenarioId, botType, userInputId, env
    }
  }, state);
}

const executeLpJsCode = (jsCode, state) => {
  postMessageToParent({
    action: CHATBOT_ACTIONS.EXCUTE_JS,
    actionData: jsCode,
    is_use_js: true
  }, state);
}

const getErrorMessageFromParent = (searchMode, searchValue, isDisplay) => {
  postMessageToParent({
    action: CHATBOT_ACTIONS.GET_ERROR_MESSAGE,
    actionData: {
      searchMode,
      searchValue,
      isDisplay,
    }
  }, {isOpen: true});
}

export {
  setConversionParamToLocalStorage,
  fukushashikiSavedStateToLp,
  fukushashikiToLP,
  executeLpJsCode,
  injectCustomJsCode,
  postMessageToParent,
  getErrorMessageFromParent,
};