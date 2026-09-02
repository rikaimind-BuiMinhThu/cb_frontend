import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  API_SUCCESS_CODE,
  API_SUCCESS_CODE_STRING,
  API_WARNING_CODE,
  API_WARNING_CODE_STRING,
  BOT_ID_COOKIE_KEY,
  BOT_TYPE_BOT,
  BOT_TYPE_COOKIE_KEY,
  CHAT_BODY_VERSION_DEFAULT,
  CHATBOTS_API_PATH,
  CHATBOTS_API_PATH_RELATIVE,
  DEFAULT_MAIN_COLOR,
  DESIGN_SETTINGS_SUFFIX,
  DESIGN_TYPE_DEFAULT,
  ICON_LOAD_ERROR,
  IMAGE_TYPE_JPEG,
  IMAGE_TYPE_JPG,
  IMAGE_TYPE_PNG,
  NOTIFICATION_SUCCESS_MS,
  NOTIFICATION_WARNING_MS,
  OPEN_ANIMATION_DURATION_MS_DEFAULT,
  OPEN_ANIMATION_STYLE_DEFAULT,
  SAVE_BOT_SUCCESS,
  SAVE_DESIGN_SUCCESS,
  TAB_BASIC,
  TOKEN_EXPIRED_CODE,
  VALIDATION_MESSAGES,
} from '../constants/designChatbotConstants';
import {
  applyIconsFromApiResponse,
  buildBasicInfoPayload,
  buildDesignSettingsPayload,
  clampOpenAnimationDurationMs,
  convertImageToDataUrl,
  findMatchingPresetIndex,
  normalizeOpenAnimationStyle,
  parseDesignSettings,
  resolveMainColorFromApi,
} from 'v2/views/DesignSetting/utils/designChatbotUtils';
import { deriveThemeDefaults } from 'v2/views/DesignSetting/utils/designThemeUtils';
import { THEME_SECTIONS } from '../constants/designThemeConstants';

const INITIAL_VALIDATION_ERRORS = {
  title: '',
  subtitle: '',
  botName: '',
  botImage: '',
};

const INITIAL_ICON_PRESET_INDICES = {
  bot: null,
  opening: null,
  closing: null,
};

const PRESET_INDEX_BY_ICON_TYPE = {
  bot: 'bot',
  bot_image: 'bot',
  opening: 'opening',
  opening_bot_icon: 'opening',
  closing: 'closing',
  closing_bot_icon: 'closing',
};

export const useDesignChatbot = (initialBotId) => {
  const [tabmenu, setTabmenu] = useState(TAB_BASIC);
  const [isLoaded, setIsLoaded] = useState(false);
  const [botId, setBotId] = useState(initialBotId);
  const [validationErrors, setValidationErrors] = useState(INITIAL_VALIDATION_ERRORS);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [designType, setDesignType] = useState(DESIGN_TYPE_DEFAULT);
  const [botImage, setBotImage] = useState('');
  const [openingBotIcon, setOpeningBotIcon] = useState('');
  const [closingBotIcon, setClosingBotIcon] = useState('');
  const [botName, setBotName] = useState('');
  const [chatBodyVersion, setChatBodyVersion] = useState(CHAT_BODY_VERSION_DEFAULT);
  const [mainColor, setMainColor] = useState(DEFAULT_MAIN_COLOR);
  const [iconPresetIndices, setIconPresetIndices] = useState(INITIAL_ICON_PRESET_INDICES);

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
  const [openAnimationDurationMs, setOpenAnimationDurationMs] = useState(
    OPEN_ANIMATION_DURATION_MS_DEFAULT,
  );
  const [openAnimationStyle, setOpenAnimationStyle] = useState(OPEN_ANIMATION_STYLE_DEFAULT);
  const [themeSettings, setThemeSettings] = useState(() => deriveThemeDefaults());
  const [apiColorKey, setApiColorKey] = useState(null);

  const clearValidationError = useCallback((field) => {
    setValidationErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);

  const showNotification = useCallback((text, autoCloseMs = NOTIFICATION_SUCCESS_MS) => {
    if (!text) return;
    if (autoCloseMs === NOTIFICATION_WARNING_MS) {
      message.warning(text);
    } else {
      message.success(text);
    }
  }, []);

  const setPresetIndexForType = useCallback((type, index) => {
    const presetKey = PRESET_INDEX_BY_ICON_TYPE[type];
    if (!presetKey) return;
    setIconPresetIndices((prev) => ({ ...prev, [presetKey]: index }));
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

  const resolvePresetIndicesFromIcons = useCallback(async (icons) => {
    const [bot, opening, closing] = await Promise.all([
      findMatchingPresetIndex(icons.botImage),
      findMatchingPresetIndex(icons.openingBotIcon),
      findMatchingPresetIndex(icons.closingBotIcon),
    ]);
    setIconPresetIndices({ bot, opening, closing });
  }, []);

  const syncIconsFromChatbotData = useCallback(async (data) => {
    const icons = applyIconsFromApiResponse(data, {
      setBotImage,
      setOpeningBotIcon,
      setClosingBotIcon,
    });
    await resolvePresetIndicesFromIcons(icons);
    return icons;
  }, [resolvePresetIndicesFromIcons]);

  const handleIconClickForType = useCallback(async (index, imageDefault, type) => {
    setPresetIndexForType(type, index);
    try {
      const dataUrl = await convertImageToDataUrl(imageDefault);
      setBotIcon(type, dataUrl);
      clearValidationError('botImage');
    } catch {
      setPresetIndexForType(type, null);
      showNotification(ICON_LOAD_ERROR, NOTIFICATION_WARNING_MS);
    }
  }, [clearValidationError, setBotIcon, setPresetIndexForType, showNotification]);

  const handleRemoveImage = useCallback((type) => () => {
    setBotIcon(type, null);
    setPresetIndexForType(type, null);
  }, [setBotIcon, setPresetIndexForType]);

  const getBaseUrlAdd = useCallback((iconType) => (e) => {
    const file = e.target.files[0];
    e.target.value = null;

    if (file?.type === IMAGE_TYPE_PNG || file?.type === IMAGE_TYPE_JPEG || file?.type === IMAGE_TYPE_JPG) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBotIcon(iconType, reader.result);
        setPresetIndexForType(iconType, null);
        clearValidationError('botImage');
      };
      reader.readAsDataURL(file);
      return true;
    }

    setBotIcon(iconType, '');
    setPresetIndexForType(iconType, null);
    setValidationErrors((prev) => ({
      ...prev,
      botImage: VALIDATION_MESSAGES.botImage,
    }));
    return false;
  }, [clearValidationError, setBotIcon, setPresetIndexForType]);

  const loadChatbot = useCallback(async (id, isCancelled = () => false) => {
    if (!id) return;

    try {
      const response = await api.get(`${CHATBOTS_API_PATH}/${id}`);
      if (isCancelled() || !response.data.data) {
        return;
      }

      const data = response.data.data;
      const colorKey = data.main_color || null;
      const resolvedColor = resolveMainColorFromApi(colorKey || data.main_color_other);
      const mainColorHex = resolvedColor || DEFAULT_MAIN_COLOR;
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
      setOpenAnimationDurationMs(designSettings.openAnimationDurationMs);
      setOpenAnimationStyle(designSettings.openAnimationStyle);
      setThemeSettings(designSettings.themeSettings);
      setApiColorKey(colorKey);

      setBotName(data.bot_name || '');
      setChatBodyVersion(data.chat_body_version || CHAT_BODY_VERSION_DEFAULT);
      setTitle(data.title || '');
      setSubtitle(data.subtitle || '');
      setDesignType(data.design_type || DESIGN_TYPE_DEFAULT);

      await syncIconsFromChatbotData(data);
      if (isCancelled()) return;

      if (resolvedColor) {
        setMainColor(resolvedColor);
      }
    } catch (error) {
      if (isCancelled()) return;
      if (error.response?.data?.code === TOKEN_EXPIRED_CODE) {
        tokenExpired();
      }
    } finally {
      if (!isCancelled()) setIsLoaded(true);
    }
  }, [syncIconsFromChatbotData]);

  useEffect(() => {
    const request = { cancelled: false };
    const id = initialBotId || Cookies.get(BOT_ID_COOKIE_KEY);
    setBotId(id);
    loadChatbot(id, () => request.cancelled);
    return () => {
      request.cancelled = true;
    };
  }, [initialBotId, loadChatbot]);

  const validateBasicInfo = useCallback(() => {
    const errors = {
      title: title ? '' : VALIDATION_MESSAGES.title,
      subtitle: subtitle ? '' : VALIDATION_MESSAGES.subtitle,
      botName: botName ? '' : VALIDATION_MESSAGES.botName,
      botImage: '',
    };
    setValidationErrors(errors);
    return errors.title === '' && errors.subtitle === '' && errors.botName === '';
  }, [botName, subtitle, title]);

  const getDesignSettingsPayload = useCallback(() => buildDesignSettingsPayload({
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
    openAnimationDurationMs,
    openAnimationStyle,
    themeSettings,
  }), [
    bottomMarginPc,
    bottomMarginSp,
    buttonTypePc,
    buttonTypeSp,
    displayType,
    heightPc,
    heightSp,
    openAnimationDurationMs,
    openAnimationStyle,
    popupCloseBot,
    positionPc,
    positionSp,
    rightMarginPc,
    rightMarginSp,
    rightPcTitle,
    rightSpTitle,
    themeSettings,
    titleBubble,
    widthPc,
    widthSp,
  ]);

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
      chatBodyVersion,
    });

    const designPayload = getDesignSettingsPayload();

    Promise.all([
      api.put(`${CHATBOTS_API_PATH_RELATIVE}/${botId}`, payload),
      api.post(`${CHATBOTS_API_PATH_RELATIVE}/${botId}/${DESIGN_SETTINGS_SUFFIX}`, designPayload),
    ])
      .then(async ([basicRes, designRes]) => {
        const basicOk = basicRes.data.code === API_SUCCESS_CODE || basicRes.data.code === API_SUCCESS_CODE_STRING;
        const designOk = designRes.data.code === API_SUCCESS_CODE || designRes.data.code === API_SUCCESS_CODE_STRING;

        if (basicOk && designOk) {
          Cookies.set(BOT_ID_COOKIE_KEY, basicRes.data.data.id);
          Cookies.set(BOT_TYPE_COOKIE_KEY, BOT_TYPE_BOT);
          await syncIconsFromChatbotData(basicRes.data.data);
          showNotification(SAVE_BOT_SUCCESS);
          return;
        }

        if (basicRes.data?.code === API_WARNING_CODE || basicRes.data?.code === API_WARNING_CODE_STRING) {
          showNotification(basicRes.data.message, NOTIFICATION_WARNING_MS);
          return;
        }
        if (designRes.data?.code === API_WARNING_CODE || designRes.data?.code === API_WARNING_CODE_STRING) {
          showNotification(designRes.data.message, NOTIFICATION_WARNING_MS);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === TOKEN_EXPIRED_CODE) {
          tokenExpired();
        }
      });
  }, [
    botId,
    botImage,
    botName,
    chatBodyVersion,
    closingBotIcon,
    designType,
    getDesignSettingsPayload,
    mainColor,
    openingBotIcon,
    showNotification,
    subtitle,
    syncIconsFromChatbotData,
    title,
    validateBasicInfo,
  ]);

  const saveDesignSettings = useCallback(() => {
    const payload = getDesignSettingsPayload();

    api.post(`${CHATBOTS_API_PATH_RELATIVE}/${botId}/${DESIGN_SETTINGS_SUFFIX}`, payload)
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE || res.data.code === API_SUCCESS_CODE_STRING) {
          showNotification(SAVE_DESIGN_SUCCESS);
        } else if (res.data?.code === API_WARNING_CODE || res.data?.code === API_WARNING_CODE_STRING) {
          showNotification(res.data.message, NOTIFICATION_WARNING_MS);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === TOKEN_EXPIRED_CODE) {
          tokenExpired();
        }
      });
  }, [
    botId,
    getDesignSettingsPayload,
    showNotification,
  ]);

  const saveThemeCustomize = useCallback(() => {
    const designPayload = getDesignSettingsPayload();

    const basicPayload = buildBasicInfoPayload({
      title,
      subtitle,
      designType,
      botName,
      mainColor,
      botImage,
      openingBotIcon,
      closingBotIcon,
      chatBodyVersion,
    });

    Promise.all([
      api.post(`${CHATBOTS_API_PATH_RELATIVE}/${botId}/${DESIGN_SETTINGS_SUFFIX}`, designPayload),
      api.put(`${CHATBOTS_API_PATH_RELATIVE}/${botId}`, basicPayload),
    ])
      .then(async ([designRes, basicRes]) => {
        const designOk = designRes.data.code === API_SUCCESS_CODE || designRes.data.code === API_SUCCESS_CODE_STRING;
        const basicOk = basicRes.data.code === API_SUCCESS_CODE || basicRes.data.code === API_SUCCESS_CODE_STRING;

        if (designOk && basicOk) {
          if (basicRes.data.data?.id) {
            Cookies.set(BOT_ID_COOKIE_KEY, basicRes.data.data.id);
          }
          await syncIconsFromChatbotData(basicRes.data.data);
          showNotification(SAVE_DESIGN_SUCCESS);
          return;
        }

        const errorMessage = designRes.data?.message || basicRes.data?.message;
        if (errorMessage) {
          showNotification(errorMessage, NOTIFICATION_WARNING_MS);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === TOKEN_EXPIRED_CODE) {
          tokenExpired();
        }
      });
  }, [
    botId,
    botImage,
    botName,
    chatBodyVersion,
    closingBotIcon,
    designType,
    getDesignSettingsPayload,
    mainColor,
    openingBotIcon,
    showNotification,
    subtitle,
    syncIconsFromChatbotData,
    title,
  ]);

  const updateThemeField = useCallback((field, value) => {
    setThemeSettings((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetThemeSection = useCallback((sectionId) => {
    const section = THEME_SECTIONS.find(({ id }) => id === sectionId);
    if (!section) return;

    const defaults = deriveThemeDefaults(mainColor, apiColorKey);
    setThemeSettings((prev) => {
      const next = { ...prev };
      section.fields.forEach(({ key }) => {
        if (!key) return;
        next[key] = defaults[key];
      });
      return next;
    });
  }, [apiColorKey, mainColor]);

  const applyDerivedTheme = useCallback((newMainColor) => {
    setMainColor(newMainColor);
    setThemeSettings(deriveThemeDefaults(newMainColor, apiColorKey));
  }, [apiColorKey]);

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
      openAnimationDurationMs: (nextValue) => {
        setOpenAnimationDurationMs(clampOpenAnimationDurationMs(nextValue));
      },
      openAnimationStyle: (nextValue) => {
        setOpenAnimationStyle(normalizeOpenAnimationStyle(nextValue));
      },
    };
    setters[field]?.(value);
  }, []);

  return {
    state: {
      tabmenu,
      isLoaded,
      botId,
      validationErrors,
      iconPresetIndices,
      basicInfo: {
        title,
        subtitle,
        designType,
        botImage,
        openingBotIcon,
        closingBotIcon,
        botName,
        chatBodyVersion,
        mainColor,
        openAnimationDurationMs,
        openAnimationStyle,
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
        openAnimationDurationMs,
        openAnimationStyle,
        themeSettings,
      },
    },
    actions: {
      setTabmenu,
      setTitle,
      setSubtitle,
      setDesignType,
      setBotName,
      setChatBodyVersion,
      setMainColor,
      clearValidationError,
      handleIconClickForType,
      handleRemoveImage,
      getBaseUrlAdd,
      saveBasicInfo,
      saveDesignSettings,
      saveThemeCustomize,
      updateDesignSettingField,
      updateThemeField,
      resetThemeSection,
      applyDerivedTheme,
    },
  };
};

export default useDesignChatbot;
