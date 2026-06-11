import IconManDefault from '../../../../../assets/img/bot-icon/man1_new.png';
import { EC_CHATBOT_URL } from 'variables/constants';
import { COLOR_MAP } from '../constants/designChatbotConstants';
import { buildThemePayload, parseThemeSettings as parseThemeFromRaw } from './designThemeUtils';

export const getIconPath = (iconField) => {
  if (!iconField) return '';
  if (typeof iconField === 'string') return iconField;
  return iconField.url || '';
};

export const resolveIconUrl = (iconField) => {
  const path = getIconPath(iconField);
  if (!path) return '';
  if (/^(https?:|data:)/.test(path)) return path;

  const base = EC_CHATBOT_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const toDataURL = (url) => fetch(url)
  .then((response) => response.blob())
  .then(
    (blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }),
  );

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

export const buildBasicInfoPayload = ({
  title,
  subtitle,
  designType,
  botName,
  mainColor,
  botImage,
  openingBotIcon,
  closingBotIcon,
}) => {
  const { main_color, main_color_other } = resolveMainColorKey(mainColor);
  const payload = {
    chatbot: {
      title,
      subtitle,
      design_type: designType,
      bot_name: botName,
      main_color,
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
  };

  if (designSettings.themeSettings) {
    const theme = buildThemePayload(designSettings.themeSettings);
    if (Object.keys(theme).length > 0) {
      payload.theme = theme;
    }
  }

  return { design_settings: payload };
};

export const parseDesignSettings = (rawSettings, mainColorHex, apiColorKey) => {
  const result = typeof rawSettings === 'string' ? JSON.parse(rawSettings || '{}') : (rawSettings || {});

  return {
    displayType: result?.display_type,
    widthPc: result?.width_pc,
    heightPc: result?.height_pc,
    widthSp: result?.width_sp,
    heightSp: result?.height_sp,
    positionPc: result?.position_pc ? Number(result.position_pc) : 1,
    buttonTypePc: result?.button_type_pc ? Number(result.button_type_pc) : 1,
    rightPcTitle: result?.right_position_pc_title || '',
    rightMarginPc: result?.right_margin_pc,
    bottomMarginPc: result?.bottom_margin_pc,
    positionSp: result?.position_sp ? Number(result.position_sp) : 1,
    buttonTypeSp: result?.button_type_sp ? Number(result.button_type_sp) : 1,
    rightSpTitle: result?.right_position_sp_title || '',
    rightMarginSp: result?.right_margin_sp,
    bottomMarginSp: result?.bottom_margin_sp,
    popupCloseBot: !!result?.popup_close_bot,
    titleBubble: result?.title_bubble || '',
    themeSettings: parseThemeFromRaw(result?.theme, mainColorHex, apiColorKey),
  };
};
