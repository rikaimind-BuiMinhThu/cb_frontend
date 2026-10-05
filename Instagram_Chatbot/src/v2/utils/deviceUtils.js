const ANDROID_USER_AGENT_PATTERN = /android/i;

export const isAndroid = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return ANDROID_USER_AGENT_PATTERN.test(userAgent);
};
