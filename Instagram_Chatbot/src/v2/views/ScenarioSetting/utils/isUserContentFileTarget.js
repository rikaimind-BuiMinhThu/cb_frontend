import { COMBINE_CONTENT_ROLES } from 'v2/views/Preview/PreviewComponent/Constants';

const BELONG_TO_USER = 'user';
const BELONG_TO_COMBINE = 'combine';

/**
 * True when ファイル参照 should write onto a user content block
 * (standalone user message, or a user-role block inside 結合メッセージ).
 */
export const isUserContentFileTarget = (message, varFileReference = {}) => {
  if (!message) return false;
  if (message.belong_to === BELONG_TO_USER) return true;
  if (message.belong_to !== BELONG_TO_COMBINE) return false;
  if (varFileReference.contentType === undefined) return false;

  const contentItem = message.message_content?.[varFileReference.indexContent];
  return contentItem?.role === COMBINE_CONTENT_ROLES.USER;
};
