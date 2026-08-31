import { useLayoutEffect } from "react";
import { applyPreviewThemeCss } from "v2/utils/chatbotThemeCss";

/**
 * Custom CSS injection + theme CSS (single place; collapses duplicate theme effects).
 *
 * Bug #9: Reload flash màu default rồi mới đúng (FOUC).
 * Dùng useLayoutEffect để biến theme vào DOM trước paint — tránh flash header #327AED rồi mới nhảy sang màu đã lưu.
 *
 * @param {Function} [applyTheme] - defaults to applyPreviewThemeCss; Scenario may pass injectBotThemeCss wrapper
 */
export const usePreviewThemeCss = ({
  state,
  enabled = true,
  applyTheme = applyPreviewThemeCss,
  customCssId = "custom-css",
}) => {
  useLayoutEffect(() => {
    if (!enabled) return;

    const existing = document.getElementById(customCssId);
    if (existing) existing.remove();

    if (state.isUsedCustomCss && state.customCssContent) {
      const style = document.createElement("style");
      style.id = customCssId;
      style.innerHTML = state.customCssContent;
      document.head.appendChild(style);
    }

    applyTheme(state.botInfor, state.themeSettings);
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
