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
