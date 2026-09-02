import { getCaptcha } from "./Utils";

const processForUserCaptchaMessage = (messagesList, i, msgContentIndex, newState) => {
  const msgContent = messagesList[i]?.message_content?.[msgContentIndex];
  if (!msgContent) return newState;

  const msgContentType = msgContent.type;
  const size = msgContent[msgContentType].length;
  const color = msgContent[msgContentType].colour ? "true" : "";
  const charPreset = msgContent[msgContentType].type;

  getCaptcha(size, color, charPreset)
    .then((res) => {
      const nextCaptcha = [
        ...(newState.captcha || []),
        { index: i, contentIndex: msgContentIndex, ...res.data },
      ];
      newState.captcha = nextCaptcha;
      if (typeof newState.onCaptchaLoaded === 'function') {
        newState.onCaptchaLoaded(nextCaptcha);
      }
    });

  return newState;
};

export const processForUserMessage = (messagesList, i, newState, assignToState = true) => {
  for (
    let j = 0;
    j < messagesList[i].message_content.length;
    j++
  ) {
    if (messagesList[i].message_content[j].type === "capture") {
      processForUserCaptchaMessage(messagesList, i, j, newState);
    }
  }

  if (assignToState) {
    newState.renderMessagesList.push(messagesList[i]);
    newState.currentMsgIndex = i;
  }

  return newState;
};
