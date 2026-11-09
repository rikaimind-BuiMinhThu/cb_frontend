import { useEffect, useRef } from "react";
import { MESSAGE_CONTENT_TYPES } from "../Constants";
import { isMobile, scrollToPosition } from "../Utils";
import {
  ALIGN_BEGINNING_SCROLL_DELAY_MS,
  BOTTOM_SCROLL_DELAY_MS,
  SCROLL_AUTO_DELAY_MS,
  SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX,
  SCROLL_MSG_OFFSET_SCROLL_AUTO_PX,
  SP_BODY_SELECTOR,
  scrollMsgIntoSpBody,
} from "../alignBeginningScroll";

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
  const lastAlignedIdRef = useRef(null);
  messagesListRef.current = state.messagesList;
  currentMsgIndexRef.current = state.currentMsgIndex;

  useEffect(() => {
    if (!enabled) return;

    const currentMsgIndex = currentMsgIndexRef.current;
    const currentMsg = messagesListRef.current?.[currentMsgIndex];
    // Smooth scroll on iPhone fights the fixed iframe and reads as flicker.
    const scrollBehavior = isMobile() ? "auto" : "smooth";
    const alignMsgId = state.alignBeginningMsgId;

    if (alignMsgId === null || alignMsgId === undefined) {
      lastAlignedIdRef.current = null;
    } else if (lastAlignedIdRef.current === alignMsgId) {
      return;
    } else {
      lastAlignedIdRef.current = alignMsgId;
      const alignTimeoutId = setTimeout(() => {
        const scrolled = scrollMsgIntoSpBody({
          msgId: alignMsgId,
          offsetPx: SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX,
          behavior: scrollBehavior,
        });
        if (!scrolled) {
          scrollToPosition({
            position: "b",
            selector: SP_BODY_SELECTOR,
            behavior: scrollBehavior,
          });
        }
      }, ALIGN_BEGINNING_SCROLL_DELAY_MS);
      return () => clearTimeout(alignTimeoutId);
    }

    if (state.isNotAutoScroll) {
      if (
        currentMsg?.message_content?.[0]?.type === MESSAGE_CONTENT_TYPES.IMAGE
      ) {
        const imageTimeoutId = setTimeout(() => {
          document
            .querySelector(`#msg-${currentMsgIndexRef.current}-0`)
            ?.scrollIntoView({ behavior: scrollBehavior });
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
            scrollMsgIntoSpBody({
              msgId,
              offsetPx: SCROLL_MSG_OFFSET_SCROLL_AUTO_PX,
              behavior: scrollBehavior,
            });
          }, SCROLL_AUTO_DELAY_MS);
          return () => clearTimeout(scrollAutoTimeoutId);
        }
      }

      return;
    }

    const timeoutId = setTimeout(() => {
      scrollToPosition({
        position: "b",
        selector: SP_BODY_SELECTOR,
        behavior: scrollBehavior,
      });
    }, BOTTOM_SCROLL_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [
    enabled,
    enableScrollAuto,
    length,
    state.isNotAutoScroll,
    state.alignBeginningMsgId,
  ]);
};
