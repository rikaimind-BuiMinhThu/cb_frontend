import { useCallback, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { CART_SYSTEM, TIMER_VARIABLES } from '../../PreviewComponent/Constants';
import {
  dataHourFixed,
  dataMinutesFixed,
  dataEveryMinuteFixed,
  dataYearFixed,
  dataMonthFixed,
  dataDayFixed,
  dataConditionFixed,
  initialTimeConfig,
} from '../constants/scenarioFormConstants';
import {
  buildScenarioSavePayload,
  parseScenarioResponse,
} from '../utils/scenarioApiUtils';
import {
  AUTO_LOGOUT_INCOMPLETE_CONFIG_ERROR,
  createEmptyAutoLogoutConfig,
  isAutoLogoutConfigValid,
} from '../utils/autoLogoutUtils';
import { SETTINGS_MODAL_VIEWS } from '../components/modals/shared/scenarioModalTooltips';
import {
  DEFAULT_AMAZON_PAY_CONFIG,
  AMAZON_PAY_DETECTION_MODES,
  AMAZON_PAY_READY_MODES,
} from '../../../../../variables/amazonPayConstants';
import {
  amazonDetectionToForm,
  buildAmazonPayConfigWithDetection,
  inferAmazonPayDetectionMode,
  inferAmazonPayReadyMode,
  normalizeAllowedLpDomains,
  validateAmazonPayConfig,
} from '../utils/amazonPayConfigUtils';

const INITIAL_TIMER_CONFIG = {
  isOpen: false,
  enable: false,
  temp: initialTimeConfig,
  final: initialTimeConfig,
  variables: TIMER_VARIABLES[initialTimeConfig.type],
};

const INITIAL_CUSTOM_CODE = {
  temp: '',
  final: '',
};

export const useScenario = (mode = 'scenario') => {
  const isTemplateMode = mode === 'template';
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioType, setScenarioType] = useState('payment');
  const [urlThanks, setUrlThanks] = useState('');
  const [merchandiseId, setMerchandiseId] = useState('');
  const [lpProductUrl, setLpProductUrl] = useState('');
  const [coupon, setCoupon] = useState('');
  const [isUseOnlyRegularOrder, setIsUseOnlyRegularOrder] = useState(false);
  const [isUseFukushashiki, setIsUseFukushashiki] = useState(false);
  const [isUseCustomCss, setIsUseCustomCss] = useState(false);
  const [customCssContent, setCustomCssContent] = useState(INITIAL_CUSTOM_CODE);
  const [isUseHtmlUgc, setIsUseHtmlUgc] = useState(false);
  const [isUgcInstagram, setIsUgcInstagram] = useState(false);
  const [isUgcTiktok, setIsUgcTiktok] = useState(false);
  const [isUgcReview, setIsUgcReview] = useState(false);
  const [ugcEnv, setUgcEnv] = useState('staging');
  const [htmlUgcConfigContent, setHtmlUgcConfigContent] = useState(INITIAL_CUSTOM_CODE);
  const [isUsedCartConfirmPage, setIsUsedCartConfirmPage] = useState(false);
  const [urlCartConfirmPage, setUrlCartConfirmPage] = useState('');
  const [isOpenModalCustomCss, setIsOpenModalCustomCss] = useState(false);
  const [isOpenScenarioSettingsModal, setIsOpenScenarioSettingsModal] = useState(false);
  const [settingsModalView, setSettingsModalView] = useState(SETTINGS_MODAL_VIEWS.MAIN);

  const [isUseCustomJsCode, setIsUseCustomJsCode] = useState(false);
  const [headCustomJsCode, setHeadCustomJsCode] = useState(INITIAL_CUSTOM_CODE);
  const [topBodyCustomJsCode, setTopBodyCustomJsCode] = useState(INITIAL_CUSTOM_CODE);
  const [bottomBodyCustomJsCode, setBottomBodyCustomJsCode] = useState(INITIAL_CUSTOM_CODE);
  const [isOpenModalCustomJsCode, setIsOpenModalCustomJsCode] = useState(false);
  const [timerConfig, setTimerConfig] = useState(INITIAL_TIMER_CONFIG);

  const [errMsgJsCode, setErrMsgJsCode] = useState('');
  const [errMsgSettingMode, setErrMsgSettingMode] = useState('js');
  const [errMsgFieldSelectors, setErrMsgFieldSelectors] = useState('');
  const [errMsgFormSelectors, setErrMsgFormSelectors] = useState('');
  const [launchButtonSelectors, setLaunchButtonSelectors] = useState('');
  const [isOpenErrMsgByJsSettingModal, setIsOpenErrMsgByJsSettingModal] = useState(false);
  const [isUseErrMsgByJs, setIsUseErrMsgByJs] = useState(false);

  const [errorScenarioName, setErrorScenarioName] = useState('');

  const [belongTo, setBelongTo] = useState('bot');
  const [messageType, setMessageType] = useState('text_input');
  const [indexMessageSelect, setIndexMessageSelect] = useState('');
  const [dataInputVar, setDataInputVar] = useState([]);
  const [isOpenPreview, setIsOpenPreview] = useState(false);

  const [varFileReference, setVarFileReference] = useState({});
  const [isOpenFileReference, setIsOpenFileReference] = useState(false);
  const [indexCarouselSlide, setIndexCarouselSlide] = useState(0);
  const [editorSelectedRadioOption, setEditorSelectedRadioOption] = useState(null);
  const [editorSelectedCheckboxOption, setEditorSelectedCheckboxOption] = useState(null);

  const [varShopifyReference, setVarShopifyReference] = useState({});
  const [isOpenShopifyReference, setIsOpenShopifyReference] = useState(false);

  const [botTextValue, setBotTextValue] = useState('');
  const [isOpenAddVariable, setIsOpenAddVariable] = useState(false);
  const [fileError, setFileError] = useState('');
  const [fileErrorCarousel, setFileErrorCarousel] = useState('');

  const [dataMessages, setDataMessages] = useState([]);

  const [dataPrefectures, setDataPrefectures] = useState([]);
  const [dataCity, setDataCity] = useState([]);

  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [scenarioId, setScenarioId] = useState(Cookies.get('scenario_id'));

  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [messageNoti, setMessageNoti] = useState('');
  const [dataEmail, setDataEmail] = useState([]);

  const [isConditionUp, setIsConditionUp] = useState(false);
  const [conditions, setConditions] = useState([]);

  const [variableName, setVariableName] = useState('');
  const [defaultValue, setDefaultValue] = useState('');

  const [acceptFile, setAcceptFile] = useState();

  const [dataHour, setDataHour] = useState(dataHourFixed);
  const [dataMinutes, setDataMinutes] = useState(dataMinutesFixed);
  const [dataEveryMinute, setDataEveryMinute] = useState(dataEveryMinuteFixed);
  const [dataYear, setDataYear] = useState(dataYearFixed);
  const [dataMonth, setDataMonth] = useState(dataMonthFixed);
  const [dataDay, setDataDay] = useState(dataDayFixed);

  const [errorVariable, setErrorVariable] = useState('');

  const [dataCondition, setDataCondition] = useState([]);
  const [isUsedMessageLoadedPast, setIsUsedMessageLoadedPast] = useState(false);
  const [isUsedCrosssell, setIsUsedCrosssell] = useState(false);
  const [productIdCrossSell, setProductIdCrossSell] = useState('');
  const [isClearLandingPageSession, setIsClearLandingPageSession] = useState(false);
  const [autoLogoutConfig, setAutoLogoutConfig] = useState(createEmptyAutoLogoutConfig);
  const [isOpenAutoLogoutModal, setIsOpenAutoLogoutModal] = useState(false);
  const [isUseBtnUpdateTracking, setIsUseBtnUpdateTracking] = useState(false);
  const [isUseGlobalDelay, setIsUseGlobalDelay] = useState(false);
  const [globalDelayTime, setGlobalDelayTime] = useState(1.0);
  const [useFullwidthChatbotMobile, setUseFullwidthChatbotMobile] = useState(false);
  const [clientCartSystem, setClientCartSystem] = useState(null);
  const [allowedLpDomains, setAllowedLpDomains] = useState([]);
  const [allowedLpDomainsInput, setAllowedLpDomainsInput] = useState('');
  const [amazonPayConfig, setAmazonPayConfig] = useState(DEFAULT_AMAZON_PAY_CONFIG);
  const [amazonPayDetectionMode, setAmazonPayDetectionMode] = useState(AMAZON_PAY_DETECTION_MODES.JS);
  const [amazonPayReadyMode, setAmazonPayReadyMode] = useState(AMAZON_PAY_READY_MODES.NONE);
  const [amazonPayDetectionForm, setAmazonPayDetectionForm] = useState(() => amazonDetectionToForm());
  const [isUseAmazonPay, setIsUseAmazonPay] = useState(false);

  const [listProductVariants, setListProductVariants] = useState([]);

  const isShopifyPaymentScenario = useMemo(
    () => clientCartSystem === CART_SYSTEM.SHOPIFY && scenarioType === 'payment',
    [clientCartSystem, scenarioType],
  );

  const showNotification = useCallback((message, autoCloseMs = 2000) => {
    setMessageNoti(message);
    setIsOpenNoti(true);
    if (autoCloseMs) {
      setTimeout(() => {
        setIsOpenNoti(false);
        setMessageNoti('');
      }, autoCloseMs);
    }
  }, []);

  const openScenarioSettingsModal = useCallback(() => {
    setSettingsModalView(SETTINGS_MODAL_VIEWS.MAIN);
    setIsOpenScenarioSettingsModal(true);
  }, []);

  const closeScenarioSettingsModal = useCallback(() => {
    setIsOpenScenarioSettingsModal(false);
    setSettingsModalView(SETTINGS_MODAL_VIEWS.MAIN);
  }, []);

  const navigateSettingsModalView = useCallback((view) => {
    setSettingsModalView(view);
  }, []);

  const backToSettingsMainView = useCallback(() => {
    setSettingsModalView(SETTINGS_MODAL_VIEWS.MAIN);
  }, []);

  const applyParsedScenario = useCallback((parsed) => {
    setDataMessages(parsed.dataMessages);
    setScenarioName(parsed.scenarioName);
    setScenarioType(parsed.scenarioType);
    setClientCartSystem(parsed.clientCartSystem);
    setUrlThanks(parsed.urlThanks);
    setMerchandiseId(parsed.merchandiseId);
    setIsUsedCartConfirmPage(parsed.isUsedCartConfirmPage);
    setUrlCartConfirmPage(parsed.urlCartConfirmPage);
    setCoupon(parsed.coupon);
    setLpProductUrl(parsed.lpProductUrl);
    setIsUseOnlyRegularOrder(parsed.isUseOnlyRegularOrder);
    setIsUseFukushashiki(parsed.isUseFukushashiki);
    setIsUseCustomCss(parsed.isUseCustomCss);
    setCustomCssContent(parsed.customCssContent);
    setIsUseHtmlUgc(parsed.isUseHtmlUgc);
    setIsUgcInstagram(parsed.isUgcInstagram);
    setIsUgcTiktok(parsed.isUgcTiktok);
    setIsUgcReview(parsed.isUgcReview);
    setUgcEnv(parsed.ugcEnv || 'staging');
    setHtmlUgcConfigContent(parsed.htmlUgcConfigContent);
    setIsUseCustomJsCode(parsed.isUseCustomJsCode);
    setHeadCustomJsCode(parsed.headCustomJsCode);
    setTopBodyCustomJsCode(parsed.topBodyCustomJsCode);
    setBottomBodyCustomJsCode(parsed.bottomBodyCustomJsCode);
    setIsUseErrMsgByJs(parsed.isUseErrMsgByJs);
    setErrMsgJsCode(parsed.errMsgJsCode);
    setErrMsgSettingMode(parsed.errMsgSettingMode || 'js');
    setErrMsgFieldSelectors(parsed.errMsgFieldSelectors || '');
    setErrMsgFormSelectors(parsed.errMsgFormSelectors || '');
    setLaunchButtonSelectors(parsed.launchButtonSelectors || '');
    setIsUsedMessageLoadedPast(parsed.isUsedMessageLoadedPast);
    setIsUsedCrosssell(parsed.isUsedCrosssell);
    setProductIdCrossSell(parsed.productIdCrossSell);
    setIsClearLandingPageSession(parsed.isClearLandingPageSession);
    setAutoLogoutConfig(parsed.autoLogoutConfig || createEmptyAutoLogoutConfig());
    setIsUseBtnUpdateTracking(parsed.isUseBtnUpdateTracking);
    setIsUseGlobalDelay(parsed.isUseGlobalDelay);
    setGlobalDelayTime(parsed.globalDelayTime);
    setUseFullwidthChatbotMobile(parsed.useFullwidthChatbotMobile);
    setTimerConfig(parsed.timerConfig);
    setAllowedLpDomains(parsed.allowedLpDomains || []);
    setAllowedLpDomainsInput((parsed.allowedLpDomains || []).join('\n'));
    const parsedAmazonPayConfig = parsed.amazonPayConfig || DEFAULT_AMAZON_PAY_CONFIG;
    const parsedDetection = parsedAmazonPayConfig.amazon_detection;
    setAmazonPayConfig(parsedAmazonPayConfig);
    setAmazonPayDetectionMode(inferAmazonPayDetectionMode(parsedDetection));
    setAmazonPayReadyMode(inferAmazonPayReadyMode(parsedDetection));
    setAmazonPayDetectionForm(amazonDetectionToForm(parsedDetection));
    setIsUseAmazonPay(parsed.isUseAmazonPay || false);
  }, []);

  const getConversationUrl = useCallback(() => {
    if (isTemplateMode) {
      return `/api/v1/managements/scenario_templates/${scenarioId}/conversation`;
    }
    return `/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/conversation`;
  }, [botId, isTemplateMode, scenarioId]);

  const handleGetMessage = useCallback(() => {
    if (!scenarioId) return;
    api.get(getConversationUrl())
      .then((res) => {
        applyParsedScenario(parseScenarioResponse(res));
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, [applyParsedScenario, getConversationUrl, scenarioId]);

  const getListProductVariants = useCallback((cursor) => {
    const query = cursor ? `cursor=${cursor}` : '';
    api.get(`/api/v1/shopify/product_variants?${query}`)
      .then((res) => {
        setListProductVariants((prev) => prev.concat(
          res?.data?.data?.productVariants?.edges.map((x) => ({
            ...x,
            key: x.node.id,
            value: x.node.displayName,
          })),
        ));

        const next = res?.data?.data?.productVariants?.pageInfo?.hasNextPage;
        const endCursor = res?.data?.data?.productVariants?.pageInfo?.endCursor;
        if (next) {
          setTimeout(() => getListProductVariants(endCursor), 1000);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  const getListVariable = useCallback(() => {
    api.get(`/api/v1/managements/chatbots/${botId}/variables?page=all`)
      .then((res) => {
        if (res.data.code === 1) {
          setDataCondition([
            ...dataConditionFixed,
            ...res.data.data,
          ]);
          setDataInputVar(res.data.data);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, [botId]);

  const validateScenarioName = useCallback(() => {
    if (!scenarioName) {
      setErrorScenarioName('入力してください。');
      return false;
    }
    setErrorScenarioName('');
    return true;
  }, [scenarioName]);

  const validateAutoLogoutConfig = useCallback(() => {
    if (!isClearLandingPageSession) return true;

    if (!isAutoLogoutConfigValid(autoLogoutConfig?.final)) {
      showNotification(AUTO_LOGOUT_INCOMPLETE_CONFIG_ERROR);
      return false;
    }

    return true;
  }, [autoLogoutConfig?.final, isClearLandingPageSession, showNotification]);

  const validateAmazonPaySettings = useCallback(() => {
    if (!isUseAmazonPay) return true;

    const validation = validateAmazonPayConfig({
      detectionMode: amazonPayDetectionMode,
      jsCode: amazonPayDetectionForm.jsCode,
      urlParamsText: amazonPayDetectionForm.urlParamsText,
      domSelectorsText: amazonPayDetectionForm.domSelectorsText,
      readyMode: amazonPayReadyMode,
      readySelectorsText: amazonPayDetectionForm.readySelectorsText,
    }, isUseAmazonPay);

    if (!validation.valid) {
      showNotification(validation.message);
      return false;
    }

    return true;
  }, [
    amazonPayDetectionForm,
    amazonPayDetectionMode,
    amazonPayReadyMode,
    isUseAmazonPay,
    showNotification,
  ]);

  const getSavePayload = useCallback(() => buildScenarioSavePayload({
    dataMessages,
    urlThanks,
    urlCartConfirmPage,
    isUsedCartConfirmPage,
    coupon,
    isUseBtnUpdateTracking,
    isUseGlobalDelay,
    globalDelayTime,
    scenarioName,
    scenarioType,
    merchandiseId,
    lpProductUrl,
    isUseOnlyRegularOrder,
    isUseFukushashiki,
    isUseCustomCss,
    customCssContent,
    isUseHtmlUgc,
    isUgcInstagram,
    isUgcTiktok,
    isUgcReview,
    ugcEnv,
    htmlUgcConfigContent,
    isUseCustomJsCode,
    headCustomJsCode,
    topBodyCustomJsCode,
    bottomBodyCustomJsCode,
    timerConfig,
    isUseErrMsgByJs,
    errMsgJsCode,
    errMsgSettingMode,
    errMsgFieldSelectors,
    errMsgFormSelectors,
    launchButtonSelectors,
    isUsedMessageLoadedPast,
    useFullwidthChatbotMobile,
    isUsedCrosssell,
    productIdCrossSell,
    isClearLandingPageSession,
    autoLogoutConfig,
    allowedLpDomains: normalizeAllowedLpDomains(allowedLpDomainsInput.split(/[\n,]+/)),
    amazonPayConfig: buildAmazonPayConfigWithDetection({
      amazonPayConfig,
      detectionMode: amazonPayDetectionMode,
      jsCode: amazonPayDetectionForm.jsCode,
      urlParamsText: amazonPayDetectionForm.urlParamsText,
      domSelectorsText: amazonPayDetectionForm.domSelectorsText,
      readyMode: amazonPayReadyMode,
      readySelectorsText: amazonPayDetectionForm.readySelectorsText,
    }),
    isUseAmazonPay,
  }), [
    autoLogoutConfig,
    allowedLpDomainsInput,
    amazonPayConfig,
    amazonPayDetectionForm,
    amazonPayDetectionMode,
    amazonPayReadyMode,
    isUseAmazonPay,
    coupon,
    customCssContent,
    isUseHtmlUgc,
    isUgcInstagram,
    isUgcTiktok,
    isUgcReview,
    ugcEnv,
    htmlUgcConfigContent,
    dataMessages,
    bottomBodyCustomJsCode,
    errMsgJsCode,
    errMsgSettingMode,
    errMsgFieldSelectors,
    errMsgFormSelectors,
    launchButtonSelectors,
    headCustomJsCode,
    isClearLandingPageSession,
    isUseBtnUpdateTracking,
    isUseGlobalDelay,
    globalDelayTime,
    isUseCustomCss,
    isUseCustomJsCode,
    isUseErrMsgByJs,
    isUseFukushashiki,
    isUseOnlyRegularOrder,
    isUsedCartConfirmPage,
    isUsedCrosssell,
    isUsedMessageLoadedPast,
    lpProductUrl,
    merchandiseId,
    productIdCrossSell,
    scenarioName,
    scenarioType,
    timerConfig,
    topBodyCustomJsCode,
    urlCartConfirmPage,
    urlThanks,
    useFullwidthChatbotMobile,
  ]);

  const onClickSaveScenario = useCallback(async () => {
    if (!validateScenarioName()) return;
    if (!validateAutoLogoutConfig()) return;
    if (!validateAmazonPaySettings()) return;

    try {
      const res = await api.post(
        getConversationUrl(),
        getSavePayload(),
      );
      setIsOpenNoti(true);
      if (res.data.code === 1) {
        setMessageNoti(isTemplateMode ? 'テンプレートを保存しました。' : 'シナリオを保存しました。');
      } else if (res.data.code === 2) {
        setMessageNoti(res.data.message);
      }
      handleGetMessage();
      setTimeout(() => {
        setIsOpenNoti(false);
        setMessageNoti('');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.code === 0) {
        tokenExpired();
      }
    }
  }, [getConversationUrl, getSavePayload, handleGetMessage, isTemplateMode, validateAmazonPaySettings, validateAutoLogoutConfig, validateScenarioName]);

  const onClickSavePreview = useCallback(() => {
    if (!validateScenarioName()) return;
    if (!validateAutoLogoutConfig()) return;
    if (!validateAmazonPaySettings()) return;

    api.post(
      getConversationUrl(),
      getSavePayload(),
    ).then((res) => {
      setIsOpenNoti(true);
      if (res.data.code === 1) {
        setMessageNoti(isTemplateMode ? 'テンプレートを保存しました。' : 'シナリオを保存しました。');
      } else if (res.data.code === 2) {
        setMessageNoti(res.data.message);
      }
      handleGetMessage();
      setTimeout(() => {
        setIsOpenNoti(false);
        setMessageNoti('');
      }, 2000);
    }).catch((error) => {
      if (error?.response?.data?.code === 0) {
        tokenExpired();
      }
    });
  }, [getConversationUrl, getSavePayload, handleGetMessage, isTemplateMode, validateAmazonPaySettings, validateAutoLogoutConfig, validateScenarioName]);

  const handleOpenPreview = useCallback((isOpen) => {
    if (!isOpenPreview) return;
    const spContainer = document.getElementById('sp-container');
    const spHeader = document.getElementById('sp-header');
    const spProcessBar = document.getElementById('sp-process-bar');
    const spBody = document.getElementById('sp-body');
    if (spContainer && spHeader && spProcessBar && spBody) {
      if (isOpen) {
        spContainer.style.height = '620px';
        spHeader.style.position = 'static';
        spHeader.style.borderBottomLeftRadius = '0px';
        spHeader.style.borderBottomRightRadius = '0px';
        spHeader.style.borderTopLeftRadius = '2px';
        spHeader.style.borderTopRightRadius = '2px';
        spProcessBar.style.display = 'block';
        spBody.style.display = 'block';
      } else {
        spContainer.style.height = '0px';
        spProcessBar.style.display = 'none';
        spBody.style.display = 'none';
        spHeader.style.borderBottomLeftRadius = '25px';
        spHeader.style.borderBottomRightRadius = '25px';
        spHeader.style.borderTopLeftRadius = '25px';
        spHeader.style.borderTopRightRadius = '25px';
        spHeader.style.position = 'absolute';
        spHeader.style.bottom = '0px';
      }
    }
    setIsOpenPreview(!isOpenPreview);
  }, [isOpenPreview]);

  useEffect(() => {
    if (isTemplateMode || !isShopifyPaymentScenario) {
      setListProductVariants([]);
      return;
    }
    getListProductVariants(null);
  }, [getListProductVariants, isShopifyPaymentScenario, isTemplateMode]);

  useEffect(() => {
    if (isTemplateMode) {
      setScenarioId(Cookies.get('scenario_template_id'));
      return;
    }
    setBotId(Cookies.get('bot_id'));
    setScenarioId(Cookies.get('scenario_id'));
  }, [isTemplateMode]);

  useEffect(() => {
    handleGetMessage();
  }, [handleGetMessage]);

  useEffect(() => {
    if (isTemplateMode) return;
    getListVariable();
  }, [getListVariable, isTemplateMode]);

  useEffect(() => {
    if (isTemplateMode || !botId) return;
    api.get(`/api/v1/managements/emails?page=all&chatbot_id=${botId}`)
      .then((res) => {
        setDataEmail(res.data.data);
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, [botId]);

  useEffect(() => {
    api.get('/api/v1/prefectures')
      .then((res) => {
        setDataPrefectures(res.data.data);
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  useEffect(() => {
    document.title = isTemplateMode ? 'Edit Scenario Template' : 'Edit Scenario';
    window.scrollTo(0, 0);
  }, [isTemplateMode]);

  useEffect(() => {
    handleOpenPreview(isOpenPreview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state: {
      scenarioName,
      scenarioType,
      urlThanks,
      merchandiseId,
      lpProductUrl,
      coupon,
      isUseOnlyRegularOrder,
      isUseFukushashiki,
      isUseCustomCss,
      customCssContent,
      isUseHtmlUgc,
      isUgcInstagram,
      isUgcTiktok,
      isUgcReview,
      ugcEnv,
      htmlUgcConfigContent,
      isUsedCartConfirmPage,
      urlCartConfirmPage,
      isOpenModalCustomCss,
      isOpenScenarioSettingsModal,
      settingsModalView,
      isUseCustomJsCode,
      headCustomJsCode,
      topBodyCustomJsCode,
      bottomBodyCustomJsCode,
      isOpenModalCustomJsCode,
      timerConfig,
      errMsgJsCode,
      errMsgSettingMode,
      errMsgFieldSelectors,
      errMsgFormSelectors,
      launchButtonSelectors,
      isOpenErrMsgByJsSettingModal,
      isUseErrMsgByJs,
      errorScenarioName,
      belongTo,
      messageType,
      indexMessageSelect,
      dataInputVar,
      isOpenPreview,
      varFileReference,
      isOpenFileReference,
      indexCarouselSlide,
      editorSelectedRadioOption,
      editorSelectedCheckboxOption,
      varShopifyReference,
      isOpenShopifyReference,
      botTextValue,
      isOpenAddVariable,
      fileError,
      fileErrorCarousel,
      dataMessages,
      dataPrefectures,
      dataCity,
      botId,
      scenarioId,
      isOpenNoti,
      messageNoti,
      dataEmail,
      isConditionUp,
      conditions,
      variableName,
      defaultValue,
      acceptFile,
      dataHour,
      dataMinutes,
      dataEveryMinute,
      dataYear,
      dataMonth,
      dataDay,
      errorVariable,
      dataCondition,
      isUsedMessageLoadedPast,
      isUsedCrosssell,
      productIdCrossSell,
      isClearLandingPageSession,
      autoLogoutConfig,
      isOpenAutoLogoutModal,
      isUseBtnUpdateTracking,
      isUseGlobalDelay,
      globalDelayTime,
      useFullwidthChatbotMobile,
      clientCartSystem,
      allowedLpDomains,
      allowedLpDomainsInput,
      amazonPayConfig,
      amazonPayDetectionMode,
      amazonPayReadyMode,
      amazonPayDetectionForm,
      isUseAmazonPay,
      listProductVariants,
      isShopifyPaymentScenario,
      editorMode: mode,
    },
    actions: {
      setScenarioName,
      setScenarioType,
      setUrlThanks,
      setMerchandiseId,
      setLpProductUrl,
      setCoupon,
      setIsUseOnlyRegularOrder,
      setIsUseFukushashiki,
      setIsUseCustomCss,
      setCustomCssContent,
      setIsUseHtmlUgc,
      setIsUgcInstagram,
      setIsUgcTiktok,
      setIsUgcReview,
      setUgcEnv,
      setHtmlUgcConfigContent,
      setIsUsedCartConfirmPage,
      setUrlCartConfirmPage,
      setIsOpenModalCustomCss,
      setIsOpenScenarioSettingsModal,
      setSettingsModalView,
      openScenarioSettingsModal,
      closeScenarioSettingsModal,
      navigateSettingsModalView,
      backToSettingsMainView,
      setIsUseCustomJsCode,
      setHeadCustomJsCode,
      setTopBodyCustomJsCode,
      setBottomBodyCustomJsCode,
      setIsOpenModalCustomJsCode,
      setTimerConfig,
      setErrMsgJsCode,
      setErrMsgSettingMode,
      setErrMsgFieldSelectors,
      setErrMsgFormSelectors,
      setLaunchButtonSelectors,
      setIsOpenErrMsgByJsSettingModal,
      setIsUseErrMsgByJs,
      setErrorScenarioName,
      setBelongTo,
      setMessageType,
      setIndexMessageSelect,
      setDataInputVar,
      setIsOpenPreview,
      setVarFileReference,
      setIsOpenFileReference,
      setIndexCarouselSlide,
      setEditorSelectedRadioOption,
      setEditorSelectedCheckboxOption,
      setVarShopifyReference,
      setIsOpenShopifyReference,
      setBotTextValue,
      setIsOpenAddVariable,
      setFileError,
      setFileErrorCarousel,
      setDataMessages,
      setDataPrefectures,
      setDataCity,
      setBotId,
      setScenarioId,
      setIsOpenNoti,
      setMessageNoti,
      setDataEmail,
      setIsConditionUp,
      setConditions,
      setVariableName,
      setDefaultValue,
      setAcceptFile,
      setDataHour,
      setDataMinutes,
      setDataEveryMinute,
      setDataYear,
      setDataMonth,
      setDataDay,
      setErrorVariable,
      setDataCondition,
      setIsUsedMessageLoadedPast,
      setIsUsedCrosssell,
      setProductIdCrossSell,
      setIsClearLandingPageSession,
      setAutoLogoutConfig,
      setIsOpenAutoLogoutModal,
      setIsUseBtnUpdateTracking,
      setIsUseGlobalDelay,
      setGlobalDelayTime,
      setUseFullwidthChatbotMobile,
      setClientCartSystem,
      setAllowedLpDomains,
      setAllowedLpDomainsInput,
      setAmazonPayConfig,
      setAmazonPayDetectionMode,
      setAmazonPayReadyMode,
      setAmazonPayDetectionForm,
      setIsUseAmazonPay,
      setListProductVariants,
      handleGetMessage,
      onClickSaveScenario,
      onClickSavePreview,
      getListProductVariants,
      getListVariable,
      handleOpenPreview,
      showNotification,
      validateScenarioName,
    },
  };
};

export default useScenario;
