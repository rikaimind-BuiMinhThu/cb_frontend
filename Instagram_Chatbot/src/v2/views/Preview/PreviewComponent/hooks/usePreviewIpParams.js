import { useEffect } from "react";
import $ from "jquery";
import { PREVIEW_ACTIONS } from "../Constants";

export const usePreviewIpParams = ({ state, dispatch, enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;
    if (!state.loadedStateFromSession) return;
    if (!state.objParam?.ip) return;

    $.getJSON("https://api.ipregistry.co/?key=tryout", (data) => {
      const defaultObjParam = {
        user_ip_address: data.ip,
        user_country: data.location.country.name,
        user_city: data.location.city,
        user_device: data.user_agent.device.type,
        user_browser: data.user_agent.name,
        user_agent: data.user_agent.header,
        start_datetime: new Date(),
      };
      dispatch({
        type: PREVIEW_ACTIONS.SET_OBJ_PARAM,
        payload: { ...state.objParam, ...defaultObjParam },
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- adding state.objParam would retrigger IP fetch after SET_OBJ_PARAM
  }, [enabled, state.objParam?.ip, state.loadedStateFromSession, dispatch]);
};
