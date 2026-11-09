const GEOJS_URL = "https://get.geojs.io/v1/ip/geo.json";
const SESSION_CACHE_KEY = "v2_visitor_geo_context";
const EMPTY_STRING = "";
const DEVICE_MOBILE = "mobile";
const DEVICE_TABLET = "tablet";
const DEVICE_DESKTOP = "desktop";
const BROWSER_EDGE = "Edge";
const BROWSER_CHROME = "Chrome";
const BROWSER_FIREFOX = "Firefox";
const BROWSER_SAFARI = "Safari";
const TABLET_UA_PATTERN = /iPad|Android(?!.*Mobile)|Tablet/i;
const MOBILE_UA_PATTERN = /Mobile|Android.*Mobile|iPhone|iPod/i;
const EDGE_UA_PATTERN = /Edg\//;
const CHROME_UA_PATTERN = /Chrome\//;
const FIREFOX_UA_PATTERN = /Firefox\//;
const SAFARI_UA_PATTERN = /Safari\//;

const geoRequestState = {
  inFlightPromise: null,
};

const resolveDevice = (userAgent) => {
  if (TABLET_UA_PATTERN.test(userAgent)) return DEVICE_TABLET;
  if (MOBILE_UA_PATTERN.test(userAgent)) return DEVICE_MOBILE;
  return DEVICE_DESKTOP;
};

const resolveBrowser = (userAgent) => {
  if (EDGE_UA_PATTERN.test(userAgent)) return BROWSER_EDGE;
  if (CHROME_UA_PATTERN.test(userAgent)) return BROWSER_CHROME;
  if (FIREFOX_UA_PATTERN.test(userAgent)) return BROWSER_FIREFOX;
  if (SAFARI_UA_PATTERN.test(userAgent)) return BROWSER_SAFARI;
  return EMPTY_STRING;
};

const buildBrowserFields = () => {
  const userAgent = navigator.userAgent || EMPTY_STRING;
  return {
    user_agent: userAgent,
    user_browser: resolveBrowser(userAgent),
    user_device: resolveDevice(userAgent),
  };
};

const emptyGeoFields = () => ({
  user_ip_address: EMPTY_STRING,
  user_country: EMPTY_STRING,
  user_city: EMPTY_STRING,
});

const mapGeoPayload = (data) => ({
  user_ip_address: data?.ip || EMPTY_STRING,
  user_country: data?.country || EMPTY_STRING,
  user_city: data?.city || EMPTY_STRING,
});

const readCachedGeo = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const writeCachedGeo = (geo) => {
  try {
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(geo));
  } catch (error) {
    // sessionStorage may be unavailable or full
  }
};

const fetchGeoFields = () => {
  const cached = readCachedGeo();
  if (cached) {
    return Promise.resolve(cached);
  }
  if (geoRequestState.inFlightPromise) {
    return geoRequestState.inFlightPromise;
  }

  geoRequestState.inFlightPromise = fetch(GEOJS_URL)
    .then((response) => {
      if (!response.ok) {
        return emptyGeoFields();
      }
      return response.json().then(mapGeoPayload);
    })
    .then((geo) => {
      if (geo.user_ip_address) {
        writeCachedGeo(geo);
      }
      return geo;
    })
    .catch(() => emptyGeoFields())
    .finally(() => {
      geoRequestState.inFlightPromise = null;
    });

  return geoRequestState.inFlightPromise;
};

export const fetchVisitorContext = () => {
  const browserFields = buildBrowserFields();
  return fetchGeoFields().then((geo) => ({
    ...geo,
    ...browserFields,
    start_datetime: new Date(),
  }));
};
