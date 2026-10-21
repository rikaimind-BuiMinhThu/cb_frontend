import { useEffect } from "react";
import $ from "jquery";
import { PREVIEW_ACTIONS } from "../Constants";
import { postVisitorTracking } from "../Utils";

const cityName = (city) => {
  if (!city) return "";
  if (typeof city === "string") return city;
  return city.name || "";
};

export const usePreviewIpParams = ({ state, dispatch, enabled = true, reportTracking = false }) => {
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

  useEffect(() => {
    if (!enabled || !reportTracking) return undefined;
    if (!state.scenarioId || !state.uuid) return undefined;

    const request = $.getJSON("https://api.ipregistry.co/?key=tryout", (data) => {
      const browser = data.user_agent?.name || "";
      const country = data.location?.country?.name || "";
      const city = cityName(data.location?.city);
      dispatch({
        type: PREVIEW_ACTIONS.SET_OBJ_PARAM,
        payload: {
          ...state.objParam,
          user_ip_address: data.ip,
          user_country: country,
          user_city: city,
          user_device: data.user_agent?.device?.type,
          user_browser: browser,
          user_agent: data.user_agent?.header,
          start_datetime: new Date(),
        },
      });
      postVisitorTracking(state, { browser, country, city });
    });

    return () => {
      request.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- objParam identity changes after SET_OBJ_PARAM
  }, [enabled, reportTracking, state.scenarioId, state.uuid, dispatch]);
};
