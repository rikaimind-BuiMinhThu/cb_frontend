import { useEffect } from "react";
import { injectHtmlUgcConfigContent } from "../BotMessageUtils";

/**
 * Injects scenario-level HTML_UGC_CONFIG content into the DOM, mirroring usePreviewThemeCss.
 */
export const usePreviewHtmlUgc = ({ state, enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;
    if (!state.isUsedHtmlUgc || !state.htmlUgcConfigContent) return;

    const cleanup = injectHtmlUgcConfigContent(state.htmlUgcConfigContent);
    return cleanup;
  }, [enabled, state.isUsedHtmlUgc, state.htmlUgcConfigContent]);
};
