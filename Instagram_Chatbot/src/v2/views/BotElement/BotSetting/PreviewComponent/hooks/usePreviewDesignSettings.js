import { useEffect } from "react";
import { PREVIEW_ACTIONS } from "../Constants";
import { getChatBotSetting } from "../Utils";
import {
  parseDesignSettings,
  resolveMainColorContext,
} from "../../DesignSetting/utils/designChatbotUtils";
import {
  mapParsedDesignToState,
  mapRawDesignSettingsToState,
} from "../previewDesignStateUtils";

/**
 * @param {'always' | 'untilDisplayTypeSet'} refreshPolicy
 * @param {'parsed' | 'raw'} designSource - runtime uses parseDesignSettings; Scenario maps snake_case
 * @param {boolean} [includeOpenAnimation]
 */
export const usePreviewDesignSettings = ({
  state,
  dispatch,
  params,
  refreshPolicy = "untilDisplayTypeSet",
  designSource = "parsed",
  includeOpenAnimation = false,
  enabled = true,
}) => {
  const designDeps =
    refreshPolicy === "untilDisplayTypeSet"
      ? [state.botId, state.loadedStateFromSession, state.displayType]
      : [state.botId, state.loadedStateFromSession];

  useEffect(() => {
    if (!enabled) return;
    if (!state.loadedStateFromSession) return;
    if (!state.botId && params.get("bot_id")) {
      dispatch({
        type: PREVIEW_ACTIONS.SET_BOT_ID,
        payload: params.get("bot_id"),
      });
      return;
    }

    if (refreshPolicy === "untilDisplayTypeSet") {
      if (state.displayType !== undefined && state.displayType !== null) return;
    }

    if (refreshPolicy === "always" && !state.botId) return;

    getChatBotSetting(state.botId).then((response) => {
      if (!response.data.data) return;

      let newState;
      if (designSource === "raw") {
        const raw = response.data.data?.design_settings;
        if (raw == null) return;
        const result = typeof raw === "string" ? JSON.parse(raw) : raw;
        newState = mapRawDesignSettingsToState(result, {
          includeIsOpen: true,
          currentIsOpen: state.isOpen,
        });
      } else {
        const { mainColorHex, apiColorKey } = resolveMainColorContext(
          response.data.data,
        );
        const parsedDesign = parseDesignSettings(
          response.data.data?.design_settings,
          mainColorHex,
          apiColorKey,
        );
        newState = mapParsedDesignToState(parsedDesign, {
          includeIsOpen: true,
          currentIsOpen: state.isOpen,
          includeOpenAnimation,
        });
      }

      dispatch({
        type: PREVIEW_ACTIONS.SET_CHATBOT_SETTINGS,
        payload: newState,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps mirror legacy preview effects
  }, [enabled, refreshPolicy, designSource, includeOpenAnimation, ...designDeps]);
};
