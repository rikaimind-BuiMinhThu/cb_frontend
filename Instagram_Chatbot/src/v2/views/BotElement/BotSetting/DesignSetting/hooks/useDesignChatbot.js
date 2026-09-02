import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  TAB_BASIC,
  OPEN_ANIMATION_DURATION_MS_DEFAULT,
  OPEN_ANIMATION_STYLE_DEFAULT,
  CHAT_BODY_VERSION_DEFAULT,
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
} from '../utils/designChatbotUtils';
import { deriveThemeDefaults } from '../utils/designThemeUtils';
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
  const [designType, setDesignType] = useState('flat');
  const [botImage, setBotImage] = useState('');
  const [openingBotIcon, setOpeningBotIcon] = useState('');
  const [closingBotIcon, setClosingBotIcon] = useState('');
  const [botName, setBotName] = useState('');
  const [chatBodyVersion, setChatBodyVersion] = useState(CHAT_BODY_VERSION_DEFAULT);
  const [mainColor, setMainColor] = useState('#327AED');
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

  const showNotification = useCallback((text, autoCloseMs = 1500) => {
    if (!text) return;
    if (autoCloseMs === 0) {
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
      showNotification('アイコンの読み込みに失敗しました。', 0);
    }
  }, [clearValidationError, setBotIcon, setPresetIndexForType, showNotification]);

  const handleRemoveImage = useCallback((type) => () => {
    setBotIcon(type, null);
    setPresetIndexForType(type, null);
  }, [setBotIcon, setPresetIndexForType]);

  const getBaseUrlAdd = useCallback((iconType) => (e) => {
    const file = e.target.files[0];
    e.target.value = null;

    if (file?.type === 'image/png' || file?.type === 'image/jpeg' || file?.type === 'image/jpg') {
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
      botImage: '画像を選択してください。',
    }));
    return false;
  }, [clearValidationError, setBotIcon, setPresetIndexForType]);

  const loadChatbot = useCallback(async (id, isCancelled = () => false) => {
    if (!id) return;

    try {
      const response = await api.get(`/api/v1/managements/chatbots/${id}`);
      if (isCancelled() || !response.data.data) {
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
      setOpenAnimationDurationMs(designSettings.openAnimationDurationMs);
      setOpenAnimationStyle(designSettings.openAnimationStyle);
      setThemeSettings(designSettings.themeSettings);
      setApiColorKey(colorKey);

      setBotName(data.bot_name || '');
      setChatBodyVersion(data.chat_body_version || CHAT_BODY_VERSION_DEFAULT);
      setTitle(data.title || '');
      setSubtitle(data.subtitle || '');
      setDesignType(data.design_type || 'flat');

      await syncIconsFromChatbotData(data);
      if (isCancelled()) return;

      if (resolvedColor) {
        setMainColor(resolvedColor);
      }
    } catch (error) {
      if (isCancelled()) return;
      if (error.response?.data?.code === 0) {
        tokenExpired();
      }
    } finally {
      if (!isCancelled()) setIsLoaded(true);
    }
  }, [syncIconsFromChatbotData]);

  useEffect(() => {
    let cancelled = false;
    const id = initialBotId || Cookies.get('bot_id');
    setBotId(id);
    loadChatbot(id, () => cancelled);
    return () => {
      cancelled = true;
    };
  }, [initialBotId, loadChatbot]);

  const validateBasicInfo = useCallback(() => {
    const errors = {
      title: title ? '' : 'タイトルは、必ず指定してください。',
      subtitle: subtitle ? '' : 'サブタイトルは、必ず指定してください。',
      botName: botName ? '' : 'ボット名は、必ず指定してください。',
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
      api.put(`api/v1/managements/chatbots/${botId}`, payload),
      api.post(`api/v1/managements/chatbots/${botId}/design_settings`, designPayload),
    ])
      .then(async ([basicRes, designRes]) => {
        const basicOk = basicRes.data.code === 1 || basicRes.data.code === '1';
        const designOk = designRes.data.code === 1 || designRes.data.code === '1';

        if (basicOk && designOk) {
          Cookies.set('bot_id', basicRes.data.data.id);
          Cookies.set('bot_type', 'bot');
          await syncIconsFromChatbotData(basicRes.data.data);
          showNotification('ボットを正常に保存されました！');
          return;
        }

        if (basicRes.data?.code === 2 || basicRes.data?.code === '2') {
          showNotification(basicRes.data.message, 0);
          return;
        }
        if (designRes.data?.code === 2 || designRes.data?.code === '2') {
          showNotification(designRes.data.message, 0);
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
      api.post(`api/v1/managements/chatbots/${botId}/design_settings`, designPayload),
      api.put(`api/v1/managements/chatbots/${botId}`, basicPayload),
    ])
      .then(async ([designRes, basicRes]) => {
        const designOk = designRes.data.code === 1 || designRes.data.code === '1';
        const basicOk = basicRes.data.code === 1 || basicRes.data.code === '1';

        if (designOk && basicOk) {
          if (basicRes.data.data?.id) {
            Cookies.set('bot_id', basicRes.data.data.id);
          }
          await syncIconsFromChatbotData(basicRes.data.data);
          showNotification('ボット設定を正常に保存されました！');
          return;
        }

        const errorMessage = designRes.data?.message || basicRes.data?.message;
        if (errorMessage) {
          showNotification(errorMessage, 0);
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
