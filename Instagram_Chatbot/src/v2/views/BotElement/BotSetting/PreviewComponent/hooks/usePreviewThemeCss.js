import { useEffect } from "react";
import { applyPreviewThemeCss } from "v2/utils/chatbotThemeCss";

/**
 * Custom CSS injection + theme CSS (single place; collapses duplicate theme effects).
 * @param {Function} [applyTheme] - defaults to applyPreviewThemeCss; Scenario may pass injectBotThemeCss wrapper
 */
export const usePreviewThemeCss = ({
  state,
  enabled = true,
  applyTheme = applyPreviewThemeCss,
  customCssId = "custom-css",
}) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const existing = document.getElementById(customCssId);
    if (existing) existing.remove();

    let style;
    if (state.isUsedCustomCss && state.customCssContent) {
      style = document.createElement("style");
      style.id = customCssId;
      style.innerHTML = state.customCssContent;
      document.head.appendChild(style);
    }

    applyTheme(state.botInfor, state.themeSettings);

    return () => {
      if (style) style.remove();
    };
  }, [
    enabled,
    state.isUsedCustomCss,
    state.customCssContent,
    state.botInfor,
    state.themeSettings,
    applyTheme,
    customCssId,
  ]);
};
