import { MESSAGE_CONTENT_TYPES } from './Constants';
import { scrollToPosition } from './Utils';

export const USER_ALIGN_BEGINNING_STOP = 'user_align_beginning_stop';

export const SP_BODY_SELECTOR = '#sp-body';

export const SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX = 0;

export const SCROLL_MSG_OFFSET_SCROLL_AUTO_PX = 200;

export const ALIGN_BEGINNING_SCROLL_DELAY_MS = 300;

export const SCROLL_AUTO_DELAY_MS = 1000;

export const BOTTOM_SCROLL_DELAY_MS = 300;

export const resolveAlignBeginningMsgId = (message) => {
  if (!message?.[USER_ALIGN_BEGINNING_STOP]) {
    return null;
  }
  if (message.hidden) {
    return null;
  }
  if (message.belong_to !== 'user' && message.belong_to !== 'combine') {
    return null;
  }
  if (message.id === undefined || message.id === null) {
    return null;
  }
  return message.id;
};

export const scrollMsgIntoSpBody = ({
  msgId,
  offsetPx = SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX,
  behavior = 'smooth',
  containerSelector = SP_BODY_SELECTOR,
}) => {
  const container = document.querySelector(containerSelector);
  const element = document.querySelector(`#msg_id_${msgId}`);
  if (!container || !element) {
    return false;
  }
  const targetScrollTop =
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    offsetPx;
  container.scrollTo({
    top: targetScrollTop,
    behavior,
  });
  return true;
};

/**
 * Shared scroll scheduler for legacy preview components.
 * @returns {function|undefined} cleanup
 */
export const scheduleLegacyPreviewAutoScroll = ({
  isUpsell = false,
  alignBeginningMsgId,
  isNotAutoScroll,
  lastAlignedIdRef,
  currentMsg,
  currentMsgIndex,
  enableScrollAuto = true,
  scrollBehavior = 'smooth',
}) => {
  if (isUpsell) {
    return undefined;
  }

  if (alignBeginningMsgId === null || alignBeginningMsgId === undefined) {
    lastAlignedIdRef.current = null;
  } else if (lastAlignedIdRef.current === alignBeginningMsgId) {
    return undefined;
  } else {
    lastAlignedIdRef.current = alignBeginningMsgId;
    const alignTimeoutId = setTimeout(() => {
      const scrolled = scrollMsgIntoSpBody({
        msgId: alignBeginningMsgId,
        offsetPx: SCROLL_MSG_OFFSET_ALIGN_BEGINNING_PX,
        behavior: scrollBehavior,
      });
      if (!scrolled) {
        scrollToPosition({
          position: 'b',
          selector: SP_BODY_SELECTOR,
          behavior: scrollBehavior,
        });
      }
    }, ALIGN_BEGINNING_SCROLL_DELAY_MS);
    return () => clearTimeout(alignTimeoutId);
  }

  if (isNotAutoScroll) {
    if (currentMsg?.message_content?.[0]?.type === MESSAGE_CONTENT_TYPES.IMAGE) {
      const imageTimeoutId = setTimeout(() => {
        document
          .querySelector(`#msg-${currentMsgIndex}-0`)
          ?.scrollIntoView({ behavior: scrollBehavior });
      }, 2000);
      return () => clearTimeout(imageTimeoutId);
    }

    if (enableScrollAuto) {
      const botStatementType = currentMsg?.message_content?.[0]?.type;
      if (
        botStatementType &&
        currentMsg?.message_content?.[0]?.[botStatementType]?.scroll_auto === true
      ) {
        const scrollAutoTimeoutId = setTimeout(() => {
          scrollMsgIntoSpBody({
            msgId: currentMsg.id,
            offsetPx: SCROLL_MSG_OFFSET_SCROLL_AUTO_PX,
            behavior: scrollBehavior,
          });
        }, SCROLL_AUTO_DELAY_MS);
        return () => clearTimeout(scrollAutoTimeoutId);
      }
    }

    return undefined;
  }

  const timeoutId = setTimeout(() => {
    scrollToPosition({
      position: 'b',
      selector: SP_BODY_SELECTOR,
      behavior: scrollBehavior,
    });
  }, BOTTOM_SCROLL_DELAY_MS);

  return () => clearTimeout(timeoutId);
};
