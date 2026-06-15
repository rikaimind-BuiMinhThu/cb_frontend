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
    setIsUsedMessageLoadedPast(parsed.isUsedMessageLoadedPast);
    setIsUsedCrosssell(parsed.isUsedCrosssell);
    setProductIdCrossSell(parsed.productIdCrossSell);
    setIsClearLandingPageSession(parsed.isClearLandingPageSession);
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
    isUsedMessageLoadedPast,
    useFullwidthChatbotMobile,
    isUsedCrosssell,
    productIdCrossSell,
    isClearLandingPageSession,
  }), [
    coupon,
    customCssContent,
    dataMessages,
    bottomBodyCustomJsCode,
    errMsgJsCode,
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
  }, [botId, getSavePayload, handleGetMessage, scenarioId, validateScenarioName]);

  const onClickSavePreview = useCallback(() => {
    if (!validateScenarioName()) return;

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
      setIsOpenPreview(false);
      setTimeout(() => {
        setIsOpenPreview(true);
      }, 200);
      setTimeout(() => {
        setIsOpenNoti(false);
        setMessageNoti('');
      }, 2000);
    }).catch((error) => {
      if (error?.response?.data?.code === 0) {
        tokenExpired();
      }
    });
  }, [botId, getSavePayload, handleGetMessage, scenarioId, validateScenarioName]);

  const handleOpenPreview = useCallback((isOpen) => {
    if (!isOpenPreview) return;
    if (isOpen) {
      document.getElementById('sp-container').style.height = '620px';
      document.getElementById('sp-header').style.position = 'static';
      document.getElementById('sp-header').style.borderBottomLeftRadius = '0px';
      document.getElementById('sp-header').style.borderBottomRightRadius = '0px';
      document.getElementById('sp-header').style.borderTopLeftRadius = '2px';
      document.getElementById('sp-header').style.borderTopRightRadius = '2px';
      document.getElementById('sp-process-bar').style.display = 'block';
      document.getElementById('sp-body').style.display = 'block';
    } else {
      document.getElementById('sp-container').style.height = '0px';
      document.getElementById('sp-process-bar').style.display = 'none';
      document.getElementById('sp-body').style.display = 'none';
      document.getElementById('sp-header').style.borderBottomLeftRadius = '25px';
      document.getElementById('sp-header').style.borderBottomRightRadius = '25px';
      document.getElementById('sp-header').style.borderTopLeftRadius = '25px';
      document.getElementById('sp-header').style.borderTopRightRadius = '25px';
      document.getElementById('sp-header').style.position = 'absolute';
      document.getElementById('sp-header').style.bottom = '0px';
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
