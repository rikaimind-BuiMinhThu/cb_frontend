import { CHATBOT_ACTIONS } from "v2/views/Preview/PreviewComponent/Constants";
import { buildSdkPostMessageLayout } from "v2/utils/sdkLayoutUtils";
import { isMobile } from "v2/views/Preview/PreviewComponent/Utils";
import { isTorizenLpAmazonData, isTorizenLP } from "v2/views/Preview/PreviewComponent/TorizenUtils";
import { isBlissLpAmazonData, isBlissLP } from "v2/views/Preview/PreviewComponent/BlissUtils";
import { isPhystechLpAmazonData, isPhystechLP } from "v2/views/Preview/PreviewComponent/PhysTechUtils";
import { isRoseMayLpAmazonData, isRoseMayLP } from "v2/views/Preview/PreviewComponent/RoseMayUtils";
import { isYuwaeruLpAmazonData, isYuwaeruLP } from "v2/views/Preview/PreviewComponent/YuwaeruUtils";
import { convertToFukushashikiObject } from "./FukushashikiDataConverterUtils";
import { isUserMessage } from "v2/views/Preview/PreviewComponent/Utils";

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
    chatbotRightPc: state.rightMarginPc,
    chatbotBottomPc: state.bottomMarginPc,
    chatbotRightSp: state.rightMarginSp,
    chatbotBottomSp: state.bottomMarginSp,
    // Keep legacy keys for backward compatibility in old SDK versions.
    chatbotRight: state.rightMarginPc,
    chatbotBottom: state.bottomMarginPc,
    ...buildSdkPostMessageLayout(state, isMobile()),
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
  const lpUrl = state.objParam.current_url_param.urlreceive;
  return new Promise((resolve) => {
    let fukuDataList = [];

    const userMessagesList = savedState.messagesList.filter(isUserMessage);
    userMessagesList.forEach((message) => {
      // Except some data when fukushashiki for case AmazonPay
      if (params.get('is_using_amazon_pay')) {
        // For Torizen
        if (isTorizenLP(lpUrl) && isTorizenLpAmazonData(message)) return;
        // For Bliss
        if (isBlissLP(lpUrl) && isBlissLpAmazonData(message)) return;
        // For Phystech
        if (isPhystechLP(lpUrl) && isPhystechLpAmazonData(message)) return;
        // For RoseMay
        if (isRoseMayLP(lpUrl) && isRoseMayLpAmazonData(message)) return;
        // For Yuwaeru
        if (isYuwaeruLP(lpUrl) && isYuwaeruLpAmazonData(message)) return;
      }

      if (!message.hidden) {
        const fukuData = convertToFukushashikiObject({message: message});
        fukuDataList.push(...fukuData);
      }
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

const findContentsByFukushashikiSearchValue = (userMessages, fukushaKey, fukushaValue) => {
  if (!Array.isArray(userMessages)) userMessages = [userMessages];

  let result = [];
  userMessages.forEach(message => {
    message.message_content.forEach(content => {
      if (content[fukushaKey] === fukushaValue) {
        result.push(content);
      }
    });
  });
  return result;
}

export {
  setConversionParamToLocalStorage,
  fukushashikiSavedStateToLp,
  fukushashikiToLP,
  executeLpJsCode,
  injectCustomJsCode,
  postMessageToParent,
  getErrorMessageFromParent,
  findContentsByFukushashikiSearchValue,
};