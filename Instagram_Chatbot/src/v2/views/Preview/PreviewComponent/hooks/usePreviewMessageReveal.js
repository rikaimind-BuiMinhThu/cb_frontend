import { useEffect, useRef } from "react";
import {
  PREVIEW_ACTIONS,
  RENDER_CHATBOT_CONFIG,
} from "../Constants";
import { isUserMessage, sendAppearLogToServer } from "../Utils";

/**
 * Progressive message reveal toward nextStopMsgIndex.
 * @param {number} delayMs - DELAY_EACH_MESSAGE or DELAY_EACH_MESSAGE_FAQ
 * @param {Function} [shouldLogAppear] - (message) => boolean; FAQ: isUserMessage, Fuku: isInteractiveMessage
 */
export const usePreviewMessageReveal = ({
  state,
  dispatch,
  delayMs = RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE,
  enabled = true,
  shouldLogAppear = isUserMessage,
}) => {
  const messagesListRef = useRef(state.messagesList);
  const scenarioIdRef = useRef(state.scenarioId);
  const uuidRef = useRef(state.uuid);
  const shouldLogAppearRef = useRef(shouldLogAppear);

  messagesListRef.current = state.messagesList;
  scenarioIdRef.current = state.scenarioId;
  uuidRef.current = state.uuid;
  shouldLogAppearRef.current = shouldLogAppear;

  useEffect(() => {
    if (!enabled) return;
    if (
      !state.nextStopMsgIndex ||
      state.currentMsgIndex + 1 >= state.nextStopMsgIndex ||
      !state.isOpen
    ) {
      dispatch({
        type: PREVIEW_ACTIONS.SET_IS_NOT_AUTO_SCROLL,
        payload: false,
      });
      return;
    }

    const messagesList = messagesListRef.current || [];
    const currentMsg = messagesList[state.currentMsgIndex];
    if (currentMsg?.hidden) {
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
        payload: {
          startIndex: 0,
          endIndex: state.currentMsgIndex + 1 + 1,
          fromCallback: false,
        },
      });
      return;
    }

    const timeoutId = setTimeout(() => {
      const list = messagesListRef.current || [];
      const newMsgIndex = state.currentMsgIndex + 1;
      dispatch({
        type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
        payload: {
          startIndex: 0,
          endIndex: state.currentMsgIndex + 1 + 1,
          fromCallback: false,
        },
      });
      if (
        newMsgIndex < list.length &&
        shouldLogAppearRef.current(list[newMsgIndex])
      ) {
        sendAppearLogToServer({
          scenario_id: scenarioIdRef.current,
          user_id: uuidRef.current,
          message: list[newMsgIndex],
        });
      }
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [
    enabled,
    delayMs,
    state.currentMsgIndex,
    state.nextStopMsgIndex,
    state.isOpen,
    dispatch,
  ]);
};
