import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { PREVIEW_ACTIONS } from "../Constants";
import { getScenarioPreviewData } from "../Utils";
import { getChatbotSavedState } from "../SessionStorageUtils";
import { setConversionParamToLocalStorage } from "../../PreviewFukushashiki/LPUtils";
import { clearChatbotState } from "../previewSessionUtils";

/**
 * Session restore vs sequential URL-field hydrate → getScenarioPreviewData.
 * @param {Function} onExtractState - (res) => Promise|void — mode-specific extractStateFromPreviewResponse
 */
export const usePreviewScenarioBootstrap = ({
  state,
  dispatch,
  params,
  onExtractState,
  enabled = true,
}) => {
  const onExtractStateRef = useRef(onExtractState);
  onExtractStateRef.current = onExtractState;

  useEffect(() => {
    if (!enabled) return undefined;
    const request = { cancelled: false };

    if (!state.loadedStateFromSession) {
      const savedState = getChatbotSavedState();
      if (savedState) {
        const currentBotId = params.get("bot_id") || Cookies.get("bot_id");
        if (currentBotId && currentBotId !== savedState.botId) {
          clearChatbotState();
          getScenarioPreviewData(
            currentBotId,
            params.get("scenario_id"),
          ).then((res) => {
            if (!request.cancelled) onExtractStateRef.current(res);
          });
          return () => {
            request.cancelled = true;
          };
        }

        setConversionParamToLocalStorage(
          savedState.scenarioId,
          "web",
          savedState.userInputId || params.get("uuid"),
          params.get("env") || "production",
          savedState,
        );

        dispatch({
          type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
          payload: {
            ...savedState,
            loadedStateFromSession: true,
          },
        });
        return undefined;
      }
    }

    if (state.loadedStateFromSession && state.botId) return undefined;

    if (!state.botId) {
      dispatch({
        type: PREVIEW_ACTIONS.SET_BOT_ID,
        payload: params.get("bot_id"),
      });
      return undefined;
    }

    if (!state.urlSend) {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { urlSend: window.location.href },
      });
      return undefined;
    }

    if (!state.urlReceive) {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { urlReceive: params.get("urlReceive") },
      });
      return undefined;
    }

    if (!state.deviceReceive) {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { deviceReceive: params.get("deviceReceive") },
      });
      return undefined;
    }

    if (!state.scenarioId) {
      dispatch({
        type: PREVIEW_ACTIONS.SET_SCENARIO_ID,
        payload: params.get("scenario_id"),
      });
      return undefined;
    }

    getScenarioPreviewData(state.botId, state.scenarioId).then((res) => {
      if (!request.cancelled) onExtractStateRef.current(res);
    });

    return () => {
      request.cancelled = true;
    };
  }, [
    enabled,
    state.botId,
    state.urlSend,
    state.urlReceive,
    state.deviceReceive,
    state.scenarioId,
    state.isDisplayErrorMessage,
    state.loadedStateFromSession,
    params,
    dispatch,
  ]);
};
