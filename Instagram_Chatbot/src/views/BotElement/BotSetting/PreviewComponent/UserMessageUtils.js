import { getCaptcha, scrollToPosition } from "./Utils";
import { PREVIEW_ACTIONS } from "views/BotElement/BotSetting/PreviewComponent/Constants";

const processForUserCaptchaMessage = (messagesList, i, msgContentIndex, newState) => {
  const msgContent = messagesList[i]?.message_content?.[msgContentIndex];
  const msgContentType = msgContent.type;
  if (!msgContent) return newState;

  const size = msgContent[msgContentType].length;
  const color = msgContent[msgContentType].colour ? "true" : "";
  const charPreset = msgContent[msgContentType].type;

  getCaptcha(size, color, charPreset)
    .then((res) => {
      let newCaptcha = [...state.captcha];
      newCaptcha.push({index: i, contentIndex: msgContentIndex, ...res.data});
      dispatch({ type: PREVIEW_ACTIONS.SET_CAPTCHA, payload: [...newCaptcha] });
    });
}

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

  // scrollToPosition({ position: "b", selector: "#sp-body" });

  return newState;
}