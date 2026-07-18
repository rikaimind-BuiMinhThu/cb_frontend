import { useEffect, useRef } from "react";
import { MESSAGE_CONTENT_TYPES } from "../Constants";
import { scrollToPosition } from "../Utils";

/**
 * @param {boolean} [enableScrollAuto] - Fukushashiki: honor statement scroll_auto when isNotAutoScroll
 */
export const usePreviewAutoScroll = ({
  state,
  enabled = true,
  dependencyLength,
  enableScrollAuto = false,
}) => {
  const length =
    dependencyLength !== undefined
      ? dependencyLength
      : state.renderMessagesList?.length;

  const messagesListRef = useRef(state.messagesList);
  const currentMsgIndexRef = useRef(state.currentMsgIndex);
  messagesListRef.current = state.messagesList;
  currentMsgIndexRef.current = state.currentMsgIndex;

  useEffect(() => {
    if (!enabled) return;

    const currentMsgIndex = currentMsgIndexRef.current;
    const currentMsg = messagesListRef.current?.[currentMsgIndex];

    if (state.isNotAutoScroll) {
      if (
        currentMsg?.message_content?.[0]?.type === MESSAGE_CONTENT_TYPES.IMAGE
      ) {
        const imageTimeoutId = setTimeout(() => {
          document
            .querySelector(`#msg-${currentMsgIndexRef.current}-0`)
            ?.scrollIntoView({ behavior: "smooth" });
        }, 2000);
        return () => clearTimeout(imageTimeoutId);
      }

      if (enableScrollAuto) {
        const botStatementType = currentMsg?.message_content?.[0]?.type;
        if (
          botStatementType &&
          currentMsg?.message_content?.[0]?.[botStatementType]?.scroll_auto ===
            true
        ) {
          const msgId = currentMsg.id;
          const scrollAutoTimeoutId = setTimeout(() => {
            const container = document.querySelector("#sp-body");
            const element = document.querySelector(`#msg_id_${msgId}`);
            if (container && element) {
              const targetScrollTop =
                element.getBoundingClientRect().top -
                container.getBoundingClientRect().top +
                container.scrollTop -
                200;
              container.scrollTo({
                top: targetScrollTop,
                behavior: "smooth",
              });
            }
          }, 1000);
          return () => clearTimeout(scrollAutoTimeoutId);
        }
      }

      return;
    }

    const timeoutId = setTimeout(() => {
      scrollToPosition({ position: "b", selector: "#sp-body" });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [enabled, enableScrollAuto, length, state.isNotAutoScroll]);
};
