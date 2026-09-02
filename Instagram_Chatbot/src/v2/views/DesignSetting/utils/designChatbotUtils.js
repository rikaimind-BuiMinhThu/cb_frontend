import IconManDefault from 'v2/assets/img/bot-icon/man1_new.png';
import { EC_CHATBOT_URL } from 'v2/variables/constants';
import {
  CHAT_BODY_VERSION_DEFAULT,
  COLOR_MAP,
  DEFAULT_IMAGES,
  DEFAULT_MAIN_COLOR,
  OPEN_ANIMATION_DURATION_MS_DEFAULT,
  OPEN_ANIMATION_DURATION_MS_MAX,
  OPEN_ANIMATION_DURATION_MS_MIN,
  OPEN_ANIMATION_STYLE_DEFAULT,
  OPEN_ANIMATION_STYLE_EXPAND_FROM_CORNER,
  OPEN_ANIMATION_STYLE_FADE_IN,
  OPEN_ANIMATION_STYLE_SLIDE_FROM_RIGHT,
  OPEN_ANIMATION_STYLE_SLIDE_UP,
  OPEN_ANIMATION_STYLE_ZOOM_IN,
  OPEN_ANIMATION_STYLES,
} from '../constants/designChatbotConstants';
import { buildThemePayload, parseThemeSettings as parseThemeFromRaw } from './designThemeUtils';

export const getIconPath = (iconField) => {
  if (!iconField) return '';
  if (typeof iconField === 'string') return iconField.trim();
  return (iconField.url || '').trim();
};

export const resolveIconUrl = (iconField) => {
  const path = getIconPath(iconField);
  if (!path) return '';
  if (/^data:/.test(path)) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (/^\/\//.test(path)) return `https:${path}`;

  const base = EC_CHATBOT_URL.replace(/\/$/, '');
  if (path.startsWith(base)) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const toDataURL = (url) => fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    return response.blob();
  })
  .then(
    (blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }),
  );

const loadImageViaCanvas = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Canvas is not supported'));
        return;
      }
      context.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    } catch (error) {
      reject(error);
    }
  };
  img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  img.src = src;
});

export const convertImageToDataUrl = async (src) => {
  if (!src) {
    throw new Error('Image source is required');
  }
  if (isTempImage(src)) {
    return src;
  }

  try {
    return await toDataURL(src);
  } catch {
    return loadImageViaCanvas(src);
  }
};

const defaultImageDataUrlCache = { value: null };

export const getDefaultImageDataUrls = async (defaultImages = DEFAULT_IMAGES) => {
  if (!defaultImageDataUrlCache.value) {
    defaultImageDataUrlCache.value = await Promise.all(
      defaultImages.map((image) => convertImageToDataUrl(image)),
    );
  }
  return defaultImageDataUrlCache.value;
};

export const findMatchingPresetIndex = async (resolvedUrl, defaultImages = DEFAULT_IMAGES) => {
  if (!resolvedUrl) return null;

  const directIndex = defaultImages.indexOf(resolvedUrl);
  if (directIndex >= 0) return directIndex;

  try {
    const currentDataUrl = await convertImageToDataUrl(resolvedUrl);
    const presetDataUrls = await getDefaultImageDataUrls(defaultImages);
    const matchedIndex = presetDataUrls.findIndex((preset) => preset === currentDataUrl);
    return matchedIndex >= 0 ? matchedIndex : null;
  } catch {
    return null;
  }
};

export const getIconsFromApiResponse = (data) => ({
  botImage: resolveIconUrl(data?.icon),
  openingBotIcon: resolveIconUrl(data?.opening_bot_icon),
  closingBotIcon: resolveIconUrl(data?.closing_bot_icon),
});

export const applyIconsFromApiResponse = (data, setters) => {
  const icons = getIconsFromApiResponse(data);
  if (icons.botImage) setters.setBotImage(icons.botImage);
  else setters.setBotImage('');
  if (icons.openingBotIcon) setters.setOpeningBotIcon(icons.openingBotIcon);
  else setters.setOpeningBotIcon('');
  if (icons.closingBotIcon) setters.setClosingBotIcon(icons.closingBotIcon);
  else setters.setClosingBotIcon('');
  return icons;
};

export const isTempImage = (image) => !!image && (
  image.includes('image/png;base64')
  || image.includes('image/jpeg;base64')
  || image.includes('image/jpg;base64')
);

export const resolveMainColorKey = (mainColor) => {
  const colorKey = Object.entries(COLOR_MAP).find(([, value]) => value === mainColor)?.[0];
  if (colorKey) {
    return { main_color: colorKey, main_color_other: undefined };
  }
  return { main_color: '', main_color_other: mainColor };
};

export const resolveMainColorFromApi = (apiColor) => {
  if (!apiColor) return null;
  if (COLOR_MAP[apiColor]) return COLOR_MAP[apiColor];
  return apiColor;
};

export const resolveMainColorContext = (chatbot) => {
  const apiColorKey = chatbot?.main_color && !String(chatbot.main_color).startsWith('#')
    ? chatbot.main_color
    : null;
  const mainColorHex = chatbot?.main_color_other
    || resolveMainColorFromApi(chatbot?.main_color)
    || chatbot?.main_color
    || DEFAULT_MAIN_COLOR;

  return { apiColorKey, mainColorHex };
};

export const buildBasicInfoPayload = ({
  title,
  subtitle,
  designType,
  botName,
  mainColor,
  botImage,
  openingBotIcon,
  closingBotIcon,
  chatBodyVersion,
}) => {
  const { main_color, main_color_other } = resolveMainColorKey(mainColor);
  const payload = {
    chatbot: {
      title,
      subtitle,
      design_type: designType,
      bot_name: botName,
      main_color,
      chat_body_version: chatBodyVersion || CHAT_BODY_VERSION_DEFAULT,
      ...(main_color_other ? { main_color_other } : {}),
    },
  };

  if (isTempImage(botImage)) {
    payload.chatbot.icon = botImage || IconManDefault;
  }
  if (isTempImage(openingBotIcon)) {
    payload.chatbot.opening_bot_icon = openingBotIcon;
  }
  if (isTempImage(closingBotIcon)) {
    payload.chatbot.closing_bot_icon = closingBotIcon;
  }
  if (!openingBotIcon) {
    payload.chatbot.remove_opening_bot_icon = true;
  }
  if (!closingBotIcon) {
    payload.chatbot.remove_closing_bot_icon = true;
  }

  return payload;
};

export const clampOpenAnimationDurationMs = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return OPEN_ANIMATION_DURATION_MS_DEFAULT;
  }
  return Math.min(
    OPEN_ANIMATION_DURATION_MS_MAX,
    Math.max(OPEN_ANIMATION_DURATION_MS_MIN, Math.round(parsed)),
  );
};

const OPEN_ANIMATION_STYLE_VALUES = new Set(OPEN_ANIMATION_STYLES.map(({ value }) => value));

export const normalizeOpenAnimationStyle = (value) => {
  if (typeof value !== 'string' || !OPEN_ANIMATION_STYLE_VALUES.has(value)) {
    return OPEN_ANIMATION_STYLE_DEFAULT;
  }
  return value;
};

export const resolveOpenAnimationClassName = (style, isMobileDevice) => {
  const normalized = normalizeOpenAnimationStyle(style);
  switch (normalized) {
    case OPEN_ANIMATION_STYLE_FADE_IN:
      return isMobileDevice ? 'fadeInSp' : 'fadeIn';
    case OPEN_ANIMATION_STYLE_ZOOM_IN:
      return isMobileDevice ? 'zoomInSp' : 'zoomIn';
    case OPEN_ANIMATION_STYLE_SLIDE_FROM_RIGHT:
      return isMobileDevice ? 'slideFromRightSp' : 'slideFromRight';
    case OPEN_ANIMATION_STYLE_EXPAND_FROM_CORNER:
      return isMobileDevice ? 'expandFromCornerSp' : 'expandFromCorner';
    case OPEN_ANIMATION_STYLE_SLIDE_UP:
      return isMobileDevice ? 'slideUpSp' : 'slideUp';
    default: {
      const _exhaustive = normalized;
      void _exhaustive;
      return isMobileDevice ? 'slideUpSp' : 'slideUp';
    }
  }
};

export const buildDesignSettingsPayload = (designSettings) => {
  const payload = {
    display_type: designSettings.displayType,
    width_pc: designSettings.widthPc,
    height_pc: designSettings.heightPc,
    width_sp: designSettings.widthSp,
    height_sp: designSettings.heightSp,
    position_pc: designSettings.positionPc.toString(),
    button_type_pc: designSettings.buttonTypePc.toString(),
    right_position_pc_title: designSettings.rightPcTitle,
    right_margin_pc: designSettings.rightMarginPc,
    bottom_margin_pc: designSettings.bottomMarginPc,
    position_sp: designSettings.positionSp.toString(),
    button_type_sp: designSettings.buttonTypeSp.toString(),
    right_position_sp_title: designSettings.rightSpTitle,
    right_margin_sp: designSettings.rightMarginSp,
    bottom_margin_sp: designSettings.bottomMarginSp,
    popup_close_bot: designSettings.popupCloseBot,
    title_bubble: designSettings.titleBubble?.trim(),
    open_animation_duration_ms: clampOpenAnimationDurationMs(
      designSettings.openAnimationDurationMs,
    ),
    open_animation_style: normalizeOpenAnimationStyle(designSettings.openAnimationStyle),
  };

  if (designSettings.themeSettings) {
    const theme = buildThemePayload(designSettings.themeSettings);
    if (Object.keys(theme).length > 0) {
      payload.theme = theme;
    }
  }

  return { design_settings: payload };
};

const parseNumericSetting = (value, defaultValue) => {
  if (value == null || value === '') {
    return defaultValue;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

export const parseDesignSettings = (rawSettings, mainColorHex, apiColorKey) => {
  const result = typeof rawSettings === 'string' ? JSON.parse(rawSettings || '{}') : (rawSettings || {});

  return {
    displayType: parseNumericSetting(result?.display_type, 1),
    widthPc: parseNumericSetting(result?.width_pc, 380),
    heightPc: parseNumericSetting(result?.height_pc, 620),
    widthSp: parseNumericSetting(result?.width_sp, 100),
    heightSp: parseNumericSetting(result?.height_sp, 100),
    positionPc: parseNumericSetting(result?.position_pc, 1),
    buttonTypePc: parseNumericSetting(result?.button_type_pc, 1),
    rightPcTitle: result?.right_position_pc_title || '',
    rightMarginPc: parseNumericSetting(result?.right_margin_pc, 10),
    bottomMarginPc: parseNumericSetting(result?.bottom_margin_pc, 10),
    positionSp: parseNumericSetting(result?.position_sp, 1),
    buttonTypeSp: parseNumericSetting(result?.button_type_sp, 1),
    rightSpTitle: result?.right_position_sp_title || '',
    rightMarginSp: parseNumericSetting(result?.right_margin_sp, 10),
    bottomMarginSp: parseNumericSetting(result?.bottom_margin_sp, 10),
    popupCloseBot: !!result?.popup_close_bot,
    titleBubble: result?.title_bubble || '',
    openAnimationDurationMs: clampOpenAnimationDurationMs(
      parseNumericSetting(result?.open_animation_duration_ms, OPEN_ANIMATION_DURATION_MS_DEFAULT),
    ),
    openAnimationStyle: normalizeOpenAnimationStyle(result?.open_animation_style),
    themeSettings: parseThemeFromRaw(result?.theme, mainColorHex, apiColorKey),
  };
};
