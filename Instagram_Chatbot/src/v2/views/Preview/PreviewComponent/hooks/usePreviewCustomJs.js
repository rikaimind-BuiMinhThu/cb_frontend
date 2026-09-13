import { useEffect } from "react";
import { CUSTOM_JS_CODE_POSITION } from "../Constants";
import { injectCustomJsCode } from "v2/views/Preview/PreviewFukushashiki/LPUtils";

export const usePreviewCustomJs = ({ state, hasSentCustomJs, enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;
    if (!state.isUsedCustomJsCode) return;

    injectCustomJsCode(hasSentCustomJs, state, {
      head: {
        jsCode: state.headCustomJsCode,
        position: CUSTOM_JS_CODE_POSITION.HEAD,
      },
      top_body: {
        jsCode: state.topBodyCustomJsCode,
        position: CUSTOM_JS_CODE_POSITION.TOP_BODY,
      },
      bottom_body: {
        jsCode: state.bottomBodyCustomJsCode,
        position: CUSTOM_JS_CODE_POSITION.BOTTOM_BODY,
      },
    });
  }, [
    enabled,
    state.isUsedCustomJsCode,
    state.headCustomJsCode,
    state.topBodyCustomJsCode,
    state.bottomBodyCustomJsCode,
    hasSentCustomJs,
    state,
  ]);
};
