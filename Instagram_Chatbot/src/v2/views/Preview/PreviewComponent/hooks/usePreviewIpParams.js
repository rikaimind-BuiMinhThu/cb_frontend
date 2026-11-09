import { useEffect } from "react";
import { PREVIEW_ACTIONS } from "../Constants";
import { postVisitorTracking } from "../Utils";
import { fetchVisitorContext } from "../visitorContext";

export const usePreviewIpParams = ({ state, dispatch, enabled = true, reportTracking = false }) => {
  useEffect(() => {
    if (!enabled) return undefined;
    if (!state.loadedStateFromSession) return undefined;
    if (!state.objParam?.ip) return undefined;

    const requestState = { cancelled: false };
    fetchVisitorContext().then((visitorContext) => {
      if (requestState.cancelled) return;
      dispatch({
        type: PREVIEW_ACTIONS.SET_OBJ_PARAM,
        payload: { ...state.objParam, ...visitorContext },
      });
    });

    return () => {
      requestState.cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- adding state.objParam would retrigger IP fetch after SET_OBJ_PARAM
  }, [enabled, state.objParam?.ip, state.loadedStateFromSession, dispatch]);

  useEffect(() => {
    if (!enabled || !reportTracking) return undefined;
    if (!state.scenarioId || !state.uuid) return undefined;

    const requestState = { cancelled: false };
    fetchVisitorContext().then((visitorContext) => {
      if (requestState.cancelled) return;
      dispatch({
        type: PREVIEW_ACTIONS.SET_OBJ_PARAM,
        payload: {
          ...state.objParam,
          ...visitorContext,
        },
      });
      postVisitorTracking(state, {
        browser: visitorContext.user_browser,
        country: visitorContext.user_country,
        city: visitorContext.user_city,
      });
    });

    return () => {
      requestState.cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- objParam identity changes after SET_OBJ_PARAM
  }, [enabled, reportTracking, state.scenarioId, state.uuid, dispatch]);
};
