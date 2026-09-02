import Cookies from "js-cookie";
import {
  OPEN_ANIMATION_DURATION_MS_DEFAULT,
  OPEN_ANIMATION_STYLE_DEFAULT,
} from "v2/views/DesignSetting/constants/designChatbotConstants";
import { RENDER_MODES } from "./Constants";
import { getAllUrlParams } from "./Utils";

const sharedPreviewInitialState = (params) => ({
  isOpen: false,
  urlSend: "",
  urlReceive: "",
  deviceReceive: "",
  uuid: params.get("uuid"),
  botId: Cookies.get("bot_id"),
  scenarioId: params.get("scenario_id"),
  botInfor: {},
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
  rightSpTitle: "",
  rightMarginSp: 10,
  bottomMarginSp: 10,
  showPopupCloseBot: false,
  activePopupCloseBot: true,
  titleBubble: "",
  styleModal: {},
  scenarioUserResponses: [],
  isDisplayErrorMessage: false,
  submitErrorMessage: "",
  objParam: {
    current_url: window.location.href,
    current_url_param: getAllUrlParams(window.location.href),
    current_url_title: document.title,
    user_id: Cookies.get("user_id"),
    bot_id: Cookies.get("bot_id"),
  },
  loadedStateFromSession: false,
  isProcessing: false,
  conversionStatus: null,
  manuallyClosed: false,
  renderMode: RENDER_MODES.NEXT,
  progressBarMaxIndex: null,
});

const faqExtras = () => ({
  originalMessagesList: [],
  displayType: 1,
  rootMessageIndex: null,
  isInCommonFlow: false,
  commonFlowStartIndex: null,
  loopCount: 0,
});

const fukushashikiExtras = (params) => ({
  isUseGlobalDelay: false,
  globalDelayTime: 1.0,
  urlThanksPage: "",
  urlCartConfirmPage: "",
  merchandiseId: "",
  isUsedCrosssell: false,
  productIdCrossSell: "",
  isUsedCartConfirmPage: false,
  captcha: [],
  withdrawal: {},
  prefecturesList: [],
  dataCities: [],
  dataTowns: [],
  prefectures: "",
  cities: "",
  towns: "",
  zipcode: "",
  zipcodeContentIndex: "",
  zipcodeIndex: -1,
  displayType: null,
  openAnimationDurationMs: OPEN_ANIMATION_DURATION_MS_DEFAULT,
  openAnimationStyle: OPEN_ANIMATION_STYLE_DEFAULT,
  checkoutUrl: "",
  lpOptionData: {},
  previewOrderContent: null,
  isUsedErrMsgByJs: false,
  errMsgJsCode: "",
  errMsgSettingMode: "js",
  errMsgFieldSelectors: "",
  errMsgFormSelectors: "",
  launchButtonSelectors: "",
  isUpsell: false,
  isNotAutoScroll: false,
  cartSystem: params.get("cartSystem") || "",
  isUseBtnUpdateTracking: false,
});

/**
 * @param {'faq' | 'fukushashiki'} mode
 * @param {object} [options]
 * @param {URLSearchParams} [options.params]
 * @param {boolean} [options.includeOpenAnimation] - runtime Fukushashiki includes animation defaults; Scenario twin historically omitted them
 */
export const createPreviewInitialState = (mode, options = {}) => {
  const params =
    options.params || new URLSearchParams(new URL(window.location.href).search);
  const includeOpenAnimation =
    options.includeOpenAnimation !== undefined
      ? options.includeOpenAnimation
      : mode === "fukushashiki";

  const base = sharedPreviewInitialState(params);

  if (mode === "faq") {
    return {
      ...base,
      ...faqExtras(),
    };
  }

  const fuku = fukushashikiExtras(params);
  if (!includeOpenAnimation) {
    delete fuku.openAnimationDurationMs;
    delete fuku.openAnimationStyle;
  }

  return {
    ...base,
    ...fuku,
  };
};
