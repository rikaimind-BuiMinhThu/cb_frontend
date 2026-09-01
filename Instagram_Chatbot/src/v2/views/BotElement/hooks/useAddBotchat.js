import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { getAdminRoutePath } from 'v2/variables/constants';
import {
  CHAT_BODY_VERSION_DEFAULT,
  DEFAULT_IMAGES,
  OPEN_ANIMATION_DURATION_MS_DEFAULT,
  OPEN_ANIMATION_STYLE_DEFAULT,
  VALIDATION_MESSAGES,
} from '../BotSetting/DesignSetting/constants/designChatbotConstants';
import {
  buildBasicInfoPayload,
  buildDesignSettingsPayload,
  convertImageToDataUrl,
  isTempImage,
  parseDesignSettings,
} from '../BotSetting/DesignSetting/utils/designChatbotUtils';

/**
 * Hook riêng cho màn add-bot-management.
 * Không dùng useDesignChatbot vì hook đó GET bot theo bot_id (bot chưa tồn tại lúc tạo).
 * Chỉ import helper/constant từ DesignSetting, không sửa file nào trong folder đó.
 */
const PRESET_INDEX_BY_ICON_TYPE = {
  bot: 'bot',
  bot_image: 'bot',
  opening: 'opening',
  opening_bot_icon: 'opening',
  closing: 'closing',
  closing_bot_icon: 'closing',
};

const INITIAL_VALIDATION_ERRORS = {
  title: '',
  subtitle: '',
  botName: '',
  botImage: '',
};

const INITIAL_ICON_PRESET_INDICES = {
  bot: 0,
  opening: null,
  closing: null,
};

/** Tab 基本情報 không có color picker; preview dùng màu mặc định giống design-setting. */
const DEFAULT_MAIN_COLOR = '#327AED';

/**
 * POST create chỉ nhận icon dạng base64 (buildBasicInfoPayload chỉ gắn field icon khi isTempImage).
 * Webpack URL / rỗng → convert; đã là data URL thì giữ nguyên.
 */
const resolveIconForCreate = async (image, fallbackToDefault) => {
  if (!image) {
    return fallbackToDefault ? convertImageToDataUrl(DEFAULT_IMAGES[0]) : '';
  }
  if (isTempImage(image)) {
    return image;
  }
  return convertImageToDataUrl(image);
};

const useAddBotchat = () => {
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState('');
  const [validationErrors, setValidationErrors] = useState(INITIAL_VALIDATION_ERRORS);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [designType, setDesignType] = useState('flat');
  const [botImage, setBotImage] = useState(DEFAULT_IMAGES[0]);
  const [openingBotIcon, setOpeningBotIcon] = useState('');
  const [closingBotIcon, setClosingBotIcon] = useState('');
  const [botName, setBotName] = useState('');
  const [chatBodyVersion, setChatBodyVersion] = useState(CHAT_BODY_VERSION_DEFAULT);
  const mainColor = DEFAULT_MAIN_COLOR;
  const [iconPresetIndices, setIconPresetIndices] = useState(INITIAL_ICON_PRESET_INDICES);
  const [openAnimationDurationMs, setOpenAnimationDurationMs] = useState(
    OPEN_ANIMATION_DURATION_MS_DEFAULT,
  );
  const [openAnimationStyle, setOpenAnimationStyle] = useState(OPEN_ANIMATION_STYLE_DEFAULT);

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

  /**
   * Preset mặc định là webpack URL. Convert sang data URL lúc mount
   * để POST create gửi được icon (cùng cách click preset trên design-setting).
   */
  useEffect(() => {
    let cancelled = false;

    convertImageToDataUrl(DEFAULT_IMAGES[0])
      .then((dataUrl) => {
        if (!cancelled) {
          setBotImage(dataUrl);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBotImage(DEFAULT_IMAGES[0]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
      botImage: VALIDATION_MESSAGES.botImage,
    }));
    return false;
  }, [clearValidationError, setBotIcon, setPresetIndexForType]);

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

  /**
   * Animation nằm trong design_settings (API riêng, cần bot_id).
   * Sau POST create: gọi tiếp endpoint này với default layout + giá trị user chọn.
   */
  const getDesignSettingsPayload = useCallback(() => {
    const defaultDesign = parseDesignSettings({}, mainColor, null);
    return buildDesignSettingsPayload({
      ...defaultDesign,
      openAnimationDurationMs,
      openAnimationStyle,
    });
  }, [mainColor, openAnimationDurationMs, openAnimationStyle]);

  const persistDesignSettingsAfterCreate = useCallback(async (createdBotId) => {
    if (!createdBotId) return;

    try {
      await api.post(
        `api/v1/managements/chatbots/${createdBotId}/design_settings`,
        getDesignSettingsPayload(),
      );
    } catch (error) {
      if (error.response?.data?.code === 0) {
        tokenExpired();
      }
    }
  }, [getDesignSettingsPayload]);

  /**
   * Tạo bot mới (khác saveBasicInfo của design-setting: PUT bot đã có).
   * 1) Validate title / subtitle / botName
   * 2) Convert icon sang base64
   * 3) POST /chatbots
   * 4) POST design_settings (animation) vì endpoint này cần bot_id
   * 5) Redirect scenario-list như màn add cũ
   */
  const createBot = useCallback(async () => {
    if (!validateBasicInfo()) return;

    let iconForCreate = botImage;
    let openingIconForCreate = openingBotIcon;
    let closingIconForCreate = closingBotIcon;

    try {
      iconForCreate = await resolveIconForCreate(botImage, true);
      openingIconForCreate = openingBotIcon
        ? await resolveIconForCreate(openingBotIcon, false)
        : '';
      closingIconForCreate = closingBotIcon
        ? await resolveIconForCreate(closingBotIcon, false)
        : '';
    } catch {
      showNotification('アイコンの読み込みに失敗しました。', 0);
      return;
    }

    const payload = buildBasicInfoPayload({
      title,
      subtitle,
      designType,
      botName,
      mainColor,
      botImage: iconForCreate,
      openingBotIcon: openingIconForCreate,
      closingBotIcon: closingIconForCreate,
      chatBodyVersion,
    });

    try {
      const res = await api.post('api/v1/managements/chatbots', payload);
      if (res.data.code === 1 || res.data.code === '1') {
        const createdBotId = res.data.data.id;
        Cookies.set('bot_id', createdBotId);
        Cookies.set('bot_type', 'bot');

        await persistDesignSettingsAfterCreate(createdBotId);

        showNotification('ボットを正常に作成されました！');
        setTimeout(() => {
          window.location.href = getAdminRoutePath('/scenario-list');
        }, 1500);
        return;
      }

      if (res.data?.code === 2 || res.data?.code === '2') {
        showNotification(res.data.message, 0);
      }
    } catch (error) {
      if (error.response?.data?.code === 0) {
        tokenExpired();
      }
    }
  }, [
    botImage,
    botName,
    chatBodyVersion,
    closingBotIcon,
    designType,
    mainColor,
    openingBotIcon,
    persistDesignSettingsAfterCreate,
    showNotification,
    subtitle,
    title,
    validateBasicInfo,
  ]);

  return {
    state: {
      isOpenNoti,
      msgNoti,
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
    },
    actions: {
      setTitle,
      setSubtitle,
      setDesignType,
      setBotName,
      setChatBodyVersion,
      setOpenAnimationDurationMs,
      setOpenAnimationStyle,
      setIsOpenNoti,
      clearValidationError,
      handleIconClickForType,
      handleRemoveImage,
      getBaseUrlAdd,
      createBot,
    },
  };
};

export default useAddBotchat;
