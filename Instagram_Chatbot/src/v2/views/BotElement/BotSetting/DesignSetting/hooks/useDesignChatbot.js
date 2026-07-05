import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { TAB_BASIC } from '../constants/designChatbotConstants';
import {
  buildBasicInfoPayload,
  buildDesignSettingsPayload,
  parseDesignSettings,
  resolveIconUrl,
  resolveMainColorFromApi,
  toDataURL,
} from '../utils/designChatbotUtils';
import { deriveThemeDefaults } from '../utils/designThemeUtils';

const INITIAL_VALIDATION_ERRORS = {
  title: '',
  subtitle: '',
  botName: '',
  botImage: '',
};

export const useDesignChatbot = (initialBotId) => {
  const [tabmenu, setTabmenu] = useState(TAB_BASIC);
  const [isLoaded, setIsLoaded] = useState(false);
  const [botId, setBotId] = useState(initialBotId);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');
  const [validationErrors, setValidationErrors] = useState(INITIAL_VALIDATION_ERRORS);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [designType, setDesignType] = useState('flat');
  const [botImage, setBotImage] = useState('');
  const [openingBotIcon, setOpeningBotIcon] = useState('');
  const [closingBotIcon, setClosingBotIcon] = useState('');
  const [botName, setBotName] = useState('');
  const [mainColor, setMainColor] = useState('#327AED');

  const [displayType, setDisplayType] = useState(1);
  const [widthPc, setWidthPc] = useState(380);
  const [heightPc, setHeightPc] = useState(620);
  const [widthSp, setWidthSp] = useState(100);
  const [heightSp, setHeightSp] = useState(100);
  const [positionPc, setPositionPc] = useState(1);
  const [buttonTypePc, setButtonTypePc] = useState(1);
  const [rightPcTitle, setRightPcTitle] = useState('');
  const [rightMarginPc, setRightMarginPc] = useState(10);
  const [bottomMarginPc, setBottomMarginPc] = useState(10);
  const [positionSp, setPositionSp] = useState(1);
  const [buttonTypeSp, setButtonTypeSp] = useState(1);
  const [rightSpTitle, setRightSpTitle] = useState('');
  const [rightMarginSp, setRightMarginSp] = useState(10);
  const [bottomMarginSp, setBottomMarginSp] = useState(10);
  const [popupCloseBot, setPopupCloseBot] = useState(false);
  const [titleBubble, setTitleBubble] = useState('');
  const [themeSettings, setThemeSettings] = useState(() => deriveThemeDefaults());
  const [apiColorKey, setApiColorKey] = useState(null);

  const clearValidationError = useCallback((field) => {
    setValidationErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);

  const showNotification = useCallback((message, autoCloseMs = 1500) => {
    setMsgNoti(message);
    setIsOpenNoti(true);
    if (autoCloseMs) {
      setTimeout(() => {
        setMsgNoti('');
        setIsOpenNoti(false);
      }, autoCloseMs);
    }
  }, []);

  const setBotIcon = useCallback((type, url) => {
    const methodMap = {
      bot: setBotImage,
      opening: setOpeningBotIcon,
      closing: setClosingBotIcon,
      bot_image: setBotImage,
      opening_bot_icon: setOpeningBotIcon,
      closing_bot_icon: setClosingBotIcon,
    };
    methodMap[type]?.(url);
  }, []);

  const handleIconClickForType = useCallback(async (index, imageDefault, type) => {
    if (!imageDefault.includes('image/png;base64')) {
      const dataUrl = await toDataURL(imageDefault);
      setBotIcon(type, dataUrl);
    } else {
      setBotIcon(type, imageDefault);
    }
  }, [setBotIcon]);

  const handleRemoveImage = useCallback((type) => () => {
    setBotIcon(type, null);
  }, [setBotIcon]);

  const getBaseUrlAdd = useCallback((iconType) => (e) => {
    const file = e.target.files[0];
    e.target.value = null;

    if (file?.type === 'image/png' || file?.type === 'image/jpeg' || file?.type === 'image/jpg') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBotIcon(iconType, reader.result);
        clearValidationError('botImage');
      };
      reader.readAsDataURL(file);
      return true;
    }

    setBotIcon(iconType, '');
    setValidationErrors((prev) => ({
      ...prev,
      botImage: '画像を選択してください。',
    }));
    return false;
  }, [clearValidationError, setBotIcon]);

  const loadChatbot = useCallback(async (id) => {
    if (!id) return;

    try {
      const response = await api.get(`/api/v1/managements/chatbots/${id}`);
      if (!response.data.data) {
        setIsOpenNoti(true);
        setTimeout(() => setIsOpenNoti(false), 2000);
        return;
      }

      const data = response.data.data;
      const colorKey = data.main_color || null;
      const resolvedColor = resolveMainColorFromApi(colorKey || data.main_color_other);
      const mainColorHex = resolvedColor || '#327AED';
      const designSettings = parseDesignSettings(data.design_settings, mainColorHex, colorKey);

      setDisplayType(designSettings.displayType);
      setWidthPc(designSettings.widthPc);
      setHeightPc(designSettings.heightPc);
      setWidthSp(designSettings.widthSp);
      setHeightSp(designSettings.heightSp);
      setPositionPc(designSettings.positionPc);
      setButtonTypePc(designSettings.buttonTypePc);
      setRightPcTitle(designSettings.rightPcTitle);
      setRightMarginPc(designSettings.rightMarginPc);
      setBottomMarginPc(designSettings.bottomMarginPc);
      setPositionSp(designSettings.positionSp);
      setButtonTypeSp(designSettings.buttonTypeSp);
      setRightSpTitle(designSettings.rightSpTitle);
      setRightMarginSp(designSettings.rightMarginSp);
      setBottomMarginSp(designSettings.bottomMarginSp);
      setPopupCloseBot(designSettings.popupCloseBot);
      setTitleBubble(designSettings.titleBubble);
      setThemeSettings(designSettings.themeSettings);
      setApiColorKey(colorKey);

      setBotName(data.bot_name || '');
      setTitle(data.title || '');
      setSubtitle(data.subtitle || '');
      setDesignType(data.design_type || 'flat');

      const botImageUrl = resolveIconUrl(data.icon);
      const openingBotIconUrl = resolveIconUrl(data.opening_bot_icon);
      const closingBotIconUrl = resolveIconUrl(data.closing_bot_icon);

      if (botImageUrl) setBotImage(botImageUrl);
      if (openingBotIconUrl) setOpeningBotIcon(openingBotIconUrl);
      if (closingBotIconUrl) setClosingBotIcon(closingBotIconUrl);

      if (resolvedColor) {
        setMainColor(resolvedColor);
      }
    } catch (error) {
      if (error.response?.data?.code === 0) {
        tokenExpired();
      }
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const id = initialBotId || Cookies.get('bot_id');
    setBotId(id);
    loadChatbot(id);
  }, [initialBotId, loadChatbot]);

  const validateBasicInfo = useCallback(() => {
    const errors = {
      title: title ? '' : 'タイトルは、必ず指定してください。',
      subtitle: subtitle ? '' : 'サブタイトルは、必ず指定ください。',
      botName: botName ? '' : 'ボット名は、必ず指定してください。',
      botImage: '',
    };
    setValidationErrors(errors);
    return errors.title === '' && errors.subtitle === '' && errors.botName === '';
  }, [botName, subtitle, title]);

  const validateForPreview = useCallback(() => {
    const errors = {
      title: title ? '' : 'タイトルは、必ず指定してください。',
      subtitle: subtitle ? '' : 'サブタイトルは、必ず指定ください。',
      botName: validationErrors.botName,
      botImage: validationErrors.botImage,
    };
    setValidationErrors(errors);
    return errors.title === '' && errors.subtitle === '';
  }, [subtitle, title, validationErrors.botImage, validationErrors.botName]);

  const saveBasicInfo = useCallback(() => {
    if (!validateBasicInfo()) return;

    const payload = buildBasicInfoPayload({
      title,
      subtitle,
      designType,
      botName,
      mainColor,
      botImage,
      openingBotIcon,
      closingBotIcon,
    });

    api.put(`api/v1/managements/chatbots/${botId}`, payload)
      .then((res) => {
        if (res.data.code === 1 || res.data.code === '1') {
          Cookies.set('bot_id', res.data.data.id);
          Cookies.set('bot_type', 'bot');
          showNotification('ボットを正常に保存されました！');
        } else if (res.data?.code === 2 || res.data?.code === '2') {
          showNotification(res.data.message, 0);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, [
    botId,
    botImage,
    botName,
    closingBotIcon,
    designType,
    mainColor,
    openingBotIcon,
    showNotification,
    subtitle,
    title,
    validateBasicInfo,
  ]);

  const saveDesignSettings = useCallback(() => {
    const payload = buildDesignSettingsPayload({
      displayType,
      widthPc,
      heightPc,
      widthSp,
      heightSp,
      positionPc,
      buttonTypePc,
      rightPcTitle,
      rightMarginPc,
      bottomMarginPc,
      positionSp,
      buttonTypeSp,
      rightSpTitle,
      rightMarginSp,
      bottomMarginSp,
      popupCloseBot,
      titleBubble,
      themeSettings,
    });

    api.post(`api/v1/managements/chatbots/${botId}/design_settings`, payload)
      .then((res) => {
        if (res.data.code === 1 || res.data.code === '1') {
          showNotification('ボット設定を正常に保存されました！');
        } else if (res.data?.code === 2 || res.data?.code === '2') {
          showNotification(res.data.message, 0);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, [
    botId,
    bottomMarginPc,
    bottomMarginSp,
    buttonTypePc,
    buttonTypeSp,
    displayType,
    heightPc,
    heightSp,
    popupCloseBot,
    positionPc,
    positionSp,
    rightMarginPc,
    rightMarginSp,
    rightPcTitle,
    rightSpTitle,
    showNotification,
    titleBubble,
    themeSettings,
    widthPc,
    widthSp,
  ]);

  const updateThemeField = useCallback((field, value) => {
    setThemeSettings((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateDesignSettingField = useCallback((field, value) => {
    const setters = {
      displayType: setDisplayType,
      widthPc: setWidthPc,
      heightPc: setHeightPc,
      widthSp: setWidthSp,
      heightSp: setHeightSp,
      positionPc: setPositionPc,
      buttonTypePc: setButtonTypePc,
      rightPcTitle: setRightPcTitle,
      rightMarginPc: setRightMarginPc,
      bottomMarginPc: setBottomMarginPc,
      positionSp: setPositionSp,
      buttonTypeSp: setButtonTypeSp,
      rightSpTitle: setRightSpTitle,
      rightMarginSp: setRightMarginSp,
      bottomMarginSp: setBottomMarginSp,
      popupCloseBot: setPopupCloseBot,
      titleBubble: setTitleBubble,
    };
    setters[field]?.(value);
  }, []);

  return {
    state: {
      tabmenu,
      isLoaded,
      botId,
      isOpenNoti,
      msgNoti,
      validationErrors,
      basicInfo: {
        title,
        subtitle,
        designType,
        botImage,
        openingBotIcon,
        closingBotIcon,
        botName,
        mainColor,
      },
      designSettings: {
        displayType,
        widthPc,
        heightPc,
        widthSp,
        heightSp,
        positionPc,
        buttonTypePc,
        rightPcTitle,
        rightMarginPc,
        bottomMarginPc,
        positionSp,
        buttonTypeSp,
        rightSpTitle,
        rightMarginSp,
        bottomMarginSp,
        popupCloseBot,
        titleBubble,
        themeSettings,
      },
    },
    actions: {
      setTabmenu,
      setTitle,
      setSubtitle,
      setDesignType,
      setBotName,
      setMainColor,
      setIsOpenNoti,
      clearValidationError,
      handleIconClickForType,
      handleRemoveImage,
      getBaseUrlAdd,
      saveBasicInfo,
      saveDesignSettings,
      updateDesignSettingField,
      updateThemeField,
      validateForPreview,
    },
  };
};

export default useDesignChatbot;
