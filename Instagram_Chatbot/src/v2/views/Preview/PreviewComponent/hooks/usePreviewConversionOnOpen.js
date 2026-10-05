import { useEffect } from "react";
import {
  CONVERSTION_RESPONSE_STATUS,
  PREVIEW_ACTIONS,
} from "../Constants";
import { createStatusConversion } from "../Utils";

export const usePreviewConversionOnOpen = ({ state, dispatch, enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;
    if (state.conversionStatus || !state.uuid || !state.scenarioId || !state.isOpen) {
      return;
    }

    createStatusConversion({
      scenario_id: state.scenarioId,
      user_input_id: state.uuid,
      status: CONVERSTION_RESPONSE_STATUS.UN_FINISH,
    }).then((res) => {
      const status = res?.data?.data?.status;
      if (status) {
        dispatch({
          type: PREVIEW_ACTIONS.SET_CONVERSION_STATUS,
          payload: status,
        });
      }
    });
  }, [
    enabled,
    state.uuid,
    state.scenarioId,
    state.conversionStatus,
    state.isOpen,
    dispatch,
  ]);
};
