import { useEffect, useRef } from "react";
import { MESSAGE_CONTENT_TYPES } from "../Constants";
import { isMobile, scrollToPosition } from "../Utils";
import {
  ALIGN_BEGINNING_SCROLL_DELAY_MS,
  BOTTOM_SCROLL_DELAY_MS,
  SCROLL_AUTO_DELAY_MS,
  SCROLL_BEHAVIOR_AUTO,
  SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX,
  SCROLL_MSG_OFFSET_SCROLL_AUTO_PX,
  SP_BODY_SELECTOR,
  scrollMsgIntoSpBody,
  scrollMsgIntoSpBodyWhenReady,
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
  const alignSessionRef = useRef(null);
  const releaseEpochRef = useRef(state.alignScrollReleaseEpoch ?? 0);
  messagesListRef.current = state.messagesList;
  currentMsgIndexRef.current = state.currentMsgIndex;

  const cancelAlignSession = () => {
    const session = alignSessionRef.current;
    if (!session) {
      return;
    }
    if (session.timeoutId !== null) {
      clearTimeout(session.timeoutId);
    }
    if (session.cancelReady) {
      session.cancelReady();
    }
    alignSessionRef.current = null;
  };

  const startAlignSession = (alignMsgId, scrollBehavior) => {
    if (alignSessionRef.current?.msgId === alignMsgId) {
      return;
    }
    cancelAlignSession();
    lastAlignedIdRef.current = alignMsgId;
    const session = {
      msgId: alignMsgId,
      timeoutId: null,
      cancelReady: null,
    };
    alignSessionRef.current = session;
    session.timeoutId = setTimeout(() => {
      session.timeoutId = null;
      session.cancelReady = scrollMsgIntoSpBodyWhenReady({
        msgId: alignMsgId,
        offsetPx: SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX,
        onResult: (scrolled) => {
          lastAlignedIdRef.current = alignMsgId;
          if (scrolled) {
            return;
          }
          scrollToPosition({
            position: "b",
            selector: SP_BODY_SELECTOR,
            behavior: scrollBehavior,
          });
        },
      });
    }, ALIGN_BEGINNING_SCROLL_DELAY_MS);
  };

  useEffect(() => () => cancelAlignSession(), []);

  useEffect(() => {
    if (!enabled) return;

    const releaseEpoch = state.alignScrollReleaseEpoch ?? 0;
    if (releaseEpoch !== releaseEpochRef.current) {
      releaseEpochRef.current = releaseEpoch;
      cancelAlignSession();
      lastAlignedIdRef.current = null;
    }

    const currentMsgIndex = currentMsgIndexRef.current;
    const currentMsg = messagesListRef.current?.[currentMsgIndex];
    // Smooth scroll on iPhone fights the fixed iframe and reads as flicker.
    const scrollBehavior = isMobile() ? "auto" : "smooth";
    const alignMsgId = state.alignBeginningMsgId;

    if (alignMsgId !== null && alignMsgId !== undefined) {
      if (lastAlignedIdRef.current === alignMsgId) {
        return;
      }
      startAlignSession(alignMsgId, scrollBehavior);
      return;
    }

    // Hold pin after stop-at-top until Next bumps alignScrollReleaseEpoch.
    if (lastAlignedIdRef.current !== null) {
      if (alignSessionRef.current?.msgId === lastAlignedIdRef.current) {
        return;
      }
      scrollMsgIntoSpBody({
        msgId: lastAlignedIdRef.current,
        offsetPx: SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX,
        behavior: SCROLL_BEHAVIOR_AUTO,
      });
      return;
    }

    if (alignSessionRef.current) {
      return;
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
    // startAlignSession is stable over refs; listing it retriggers align sessions.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- align session owned by refs
  }, [
    enabled,
    enableScrollAuto,
    length,
    state.isNotAutoScroll,
    state.alignBeginningMsgId,
    state.alignScrollReleaseEpoch,
  ]);
};
