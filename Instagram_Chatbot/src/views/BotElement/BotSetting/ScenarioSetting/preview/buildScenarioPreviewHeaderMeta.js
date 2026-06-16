import {
  parseDesignSettings,
  resolveIconUrl,
  resolveMainColorFromApi,
} from '../../DesignSetting/utils/designChatbotUtils';

const DEFAULT_TITLE = '簡単90秒で注文完了';
const DEFAULT_MAIN_COLOR = '#327AED';

export const buildScenarioPreviewHeaderMeta = (botInfor, { isOpen = true, themeSettings = null } = {}) => ({
  title: botInfor?.titleBubble || DEFAULT_TITLE,
  subtitle: botInfor?.subtitle || '',
  headerIconUrl: isOpen
    ? (resolveIconUrl(botInfor?.opening_bot_icon) || resolveIconUrl(botInfor?.icon))
    : (resolveIconUrl(botInfor?.closing_bot_icon) || resolveIconUrl(botInfor?.icon)),
  mainColor: botInfor?.main_color || botInfor?.main_color_other || DEFAULT_MAIN_COLOR,
  themeSettings: themeSettings ?? null,
});

export const buildScenarioPreviewHeaderMetaFromChatbotApi = (chatbotData) => {
  if (!chatbotData) return null;

  const colorKey = chatbotData.main_color || null;
  const mainColor = resolveMainColorFromApi(colorKey || chatbotData.main_color_other) || DEFAULT_MAIN_COLOR;
  const design = parseDesignSettings(chatbotData.design_settings, mainColor, colorKey);

  return {
    themeSettings: design.themeSettings,
    title: design.titleBubble || DEFAULT_TITLE,
    subtitle: chatbotData.subtitle || '',
    headerIconUrl: resolveIconUrl(chatbotData.opening_bot_icon) || resolveIconUrl(chatbotData.icon),
    mainColor,
  };
};
