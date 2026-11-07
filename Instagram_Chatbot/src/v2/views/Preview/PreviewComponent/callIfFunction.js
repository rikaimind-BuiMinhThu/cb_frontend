/**
 * Invoke a callback only when it is a function.
 * Used by preview messages so missing onRenderCompleted cannot crash production.
 */
export const callIfFunction = (maybeFn, ...args) => {
  if (typeof maybeFn !== "function") return false;
  maybeFn(...args);
  return true;
};

/**
 * Combine user blocks are rendered as synthetic single-content UserMessages.
 * An image block must not call renderNextMessage or the chat advances mid-combine.
 */
export const COMBINE_USER_BLOCK_ON_RENDER_COMPLETED = () => {};
