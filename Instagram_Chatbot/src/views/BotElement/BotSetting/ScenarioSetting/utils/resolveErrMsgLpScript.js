import { getErrorThemeStyles } from '../../../../../utils/chatbotThemeCss';
import { generateErrMsgLpScript } from './errMsgLpScriptUtils';

export const resolveErrMsgLpScript = (state) => {
  if (!state.isUsedErrMsgByJs) return '';

  if (state.errMsgSettingMode === 'selector') {
    const mainColorHex = state.botInfor?.main_color_other
      || state.botInfor?.main_color
      || '#327AED';
    const apiColorKey = state.botInfor?.main_color && !String(state.botInfor.main_color).startsWith('#')
      ? state.botInfor.main_color
      : null;

    return generateErrMsgLpScript({
      fieldSelectors: state.errMsgFieldSelectors,
      formSelectors: state.errMsgFormSelectors,
      themeStyles: getErrorThemeStyles(state.themeSettings, mainColorHex, apiColorKey),
    });
  }

  return state.errMsgJsCode || '';
};
