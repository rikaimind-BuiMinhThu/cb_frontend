const ANDROID_USER_AGENT_PATTERN = /android/i;
const IOS_USER_AGENT_PATTERN = /iphone|ipod|ipad/i;

export const isAndroid = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return ANDROID_USER_AGENT_PATTERN.test(userAgent);
};

export const isIOS = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (IOS_USER_AGENT_PATTERN.test(userAgent)) {
    return true;
  }
  // iPadOS 13+ may report as Macintosh with touch.
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};
