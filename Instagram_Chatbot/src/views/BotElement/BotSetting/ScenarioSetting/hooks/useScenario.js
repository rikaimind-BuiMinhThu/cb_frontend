import { useCallback, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../../../../api/api-management';
import { tokenExpired } from 'api/tokenExpired';
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

export const useScenario = () => {
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
  const [isUsedCartConfirmPage, setIsUsedCartConfirmPage] = useState(false);
  const [urlCartConfirmPage, setUrlCartConfirmPage] = useState('');
  const [isOpenModalCustomCss, setIsOpenModalCustomCss] = useState(false);
  const [isOpenScenarioSettingsModal, setIsOpenScenarioSettingsModal] = useState(false);

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
  const [useFullwidthChatbotMobile, setUseFullwidthChatbotMobile] = useState(false);
  const [clientCartSystem, setClientCartSystem] = useState(null);

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
    setUseFullwidthChatbotMobile(parsed.useFullwidthChatbotMobile);
    setTimerConfig(parsed.timerConfig);
  }, []);

  const handleGetMessage = useCallback(() => {
    api.get(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/conversation`)
      .then((res) => {
        applyParsedScenario(parseScenarioResponse(res));
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, [applyParsedScenario, botId, scenarioId]);

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

  const getSavePayload = useCallback(() => buildScenarioSavePayload({
    dataMessages,
    urlThanks,
    urlCartConfirmPage,
    isUsedCartConfirmPage,
    coupon,
    isUseBtnUpdateTracking,
    scenarioName,
    scenarioType,
    merchandiseId,
    lpProductUrl,
    isUseOnlyRegularOrder,
    isUseFukushashiki,
    isUseCustomCss,
    customCssContent,
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
  }), [
    autoLogoutConfig,
    coupon,
    customCssContent,
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

    try {
      const res = await api.post(
        `/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/conversation`,
        getSavePayload(),
      );
      setIsOpenNoti(true);
      if (res.data.code === 1) {
        setMessageNoti('シナリオを保存しました。');
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
  }, [botId, getSavePayload, handleGetMessage, scenarioId, validateAutoLogoutConfig, validateScenarioName]);

  const onClickSavePreview = useCallback(() => {
    if (!validateScenarioName()) return;
    if (!validateAutoLogoutConfig()) return;

    api.post(
      `/api/v1/managements/chatbots/${botId}/scenarios/${scenarioId}/conversation`,
      getSavePayload(),
    ).then((res) => {
      setIsOpenNoti(true);
      if (res.data.code === 1) {
        setMessageNoti('シナリオを保存しました。');
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
  }, [botId, getSavePayload, handleGetMessage, scenarioId, validateAutoLogoutConfig, validateScenarioName]);

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
    getListProductVariants(null);
  }, [getListProductVariants]);

  useEffect(() => {
    setBotId(Cookies.get('bot_id'));
    setScenarioId(Cookies.get('scenario_id'));
  }, []);

  useEffect(() => {
    handleGetMessage();
  }, [handleGetMessage]);

  useEffect(() => {
    getListVariable();
  }, [getListVariable]);

  useEffect(() => {
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
    document.title = 'Edit Scenario';
    window.scrollTo(0, 0);
  }, []);

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
      isUsedCartConfirmPage,
      urlCartConfirmPage,
      isOpenModalCustomCss,
      isOpenScenarioSettingsModal,
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
      useFullwidthChatbotMobile,
      clientCartSystem,
      listProductVariants,
      isShopifyPaymentScenario,
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
      setIsUsedCartConfirmPage,
      setUrlCartConfirmPage,
      setIsOpenModalCustomCss,
      setIsOpenScenarioSettingsModal,
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
      setUseFullwidthChatbotMobile,
      setClientCartSystem,
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
