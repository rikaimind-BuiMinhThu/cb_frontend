
import { CHATBOT_ACTIONS } from "../PreviewComponent/Constants";
import { isTorizenLpAmazonData } from "../PreviewComponent/TorizenUtils";
import { convertToFukushashikiObject } from "./FukushashikiDataConverterUtils";
import { isUserMessage, sendOpenChatbotCountRequest } from "../PreviewComponent/Utils";

const postMessageToParent = (options, state) => {
  if (!window || !window.parent) return;
  
  const defaultOptions = {
    isOpen: state.isOpen,
    source: 'ec-chatbot',
    useMoblieFullwidth: !!state.useFullWidthChatbotMobile,
    // widthPc: state.widthPc,
    // heightPc: state.heightPc,
    // widthSp: state.widthSp,
    // heightSp: state.heightSp,
    // chatbotRight: state.rightMarginPc,
    // chatbotBottom: state.bottomMarginPc,
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
    isOpen: true
  }, state);
};

const fukushashikiSavedStateToLp = (savedState, params, state) => {
  return new Promise((resolve) => {
    let fukuDataList = [];

    const userMessagesList = savedState.messagesList.filter(isUserMessage);
    userMessagesList.forEach((message) => {
      // Except some data when fukushashiki torizen san
      if (params.get('is_using_amazon_pay') && isTorizenLpAmazonData(message)) return;
      
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
    isOpen: true
  }, state);

  hasSentCustomJsRef.current = true;
};

const setConversionParamToLocalStorage = (scenarioId, botType, userInputId, env, state) => {
  postMessageToParent({
    isOpen: true,
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

export {
  setConversionParamToLocalStorage,
  fukushashikiSavedStateToLp,
  fukushashikiToLP,
  executeLpJsCode,
  injectCustomJsCode,
  postMessageToParent
};