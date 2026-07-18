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
    if (!enabled) return;

    if (!state.loadedStateFromSession) {
      const savedState = getChatbotSavedState();
      if (savedState) {
        const currentBotId = params.get("bot_id") || Cookies.get("bot_id");
        if (currentBotId && currentBotId !== savedState.botId) {
          clearChatbotState();
          return getScenarioPreviewData(
            currentBotId,
            params.get("scenario_id"),
          ).then((res) => onExtractStateRef.current(res));
        }

        setConversionParamToLocalStorage(
          savedState.scenarioId,
          "web",
          savedState.userInputId || params.get("uuid"),
          params.get("env") || "production",
          savedState,
        );

        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
          payload: {
            ...savedState,
            loadedStateFromSession: true,
          },
        });
      }
    }

    if (state.loadedStateFromSession && state.botId) return;

    if (!state.botId) {
      dispatch({
        type: PREVIEW_ACTIONS.SET_BOT_ID,
        payload: params.get("bot_id"),
      });
      return;
    }

    if (!state.urlSend) {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { urlSend: window.location.href },
      });
      return;
    }

    if (!state.urlReceive) {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { urlReceive: params.get("urlReceive") },
      });
      return;
    }

    if (!state.deviceReceive) {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
        payload: { deviceReceive: params.get("deviceReceive") },
      });
      return;
    }

    if (!state.scenarioId) {
      dispatch({
        type: PREVIEW_ACTIONS.SET_SCENARIO_ID,
        payload: params.get("scenario_id"),
      });
      return;
    }

    return getScenarioPreviewData(state.botId, state.scenarioId).then((res) =>
      onExtractStateRef.current(res),
    );
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
