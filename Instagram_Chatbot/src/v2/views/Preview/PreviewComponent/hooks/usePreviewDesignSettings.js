import { useEffect } from "react";
import { PREVIEW_ACTIONS } from "../Constants";
import { getChatBotSetting } from "../Utils";
import {
  parseDesignSettings,
  resolveMainColorContext,
} from "v2/views/DesignSetting/utils/designChatbotUtils";
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

      const chatbotData = response.data.data;
      const withDesignTypeOnBotInfor = chatbotData.design_type != null && state.botInfor
        ? {
          botInfor: {
            ...state.botInfor,
            design_type: chatbotData.design_type,
          },
        }
        : {};

      if (designSource === "raw") {
        const raw = chatbotData?.design_settings;
        if (raw == null) return;
        const result = typeof raw === "string" ? JSON.parse(raw) : raw;
        const newState = mapRawDesignSettingsToState(result, {
          includeIsOpen: true,
          currentIsOpen: state.isOpen,
        });
        dispatch({
          type: PREVIEW_ACTIONS.SET_CHATBOT_SETTINGS,
          payload: {
            ...newState,
            ...withDesignTypeOnBotInfor,
          },
        });
        return;
      }

      const { mainColorHex, apiColorKey } = resolveMainColorContext(
        chatbotData,
      );
      const parsedDesign = parseDesignSettings(
        chatbotData?.design_settings,
        mainColorHex,
        apiColorKey,
      );
      const newState = mapParsedDesignToState(parsedDesign, {
        includeIsOpen: true,
        currentIsOpen: state.isOpen,
        includeOpenAnimation,
      });

      dispatch({
        type: PREVIEW_ACTIONS.SET_CHATBOT_SETTINGS,
        payload: {
          ...newState,
          ...withDesignTypeOnBotInfor,
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps mirror legacy preview effects
  }, [enabled, refreshPolicy, designSource, includeOpenAnimation, ...designDeps]);
};
