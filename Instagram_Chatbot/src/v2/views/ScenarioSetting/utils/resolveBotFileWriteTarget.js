const DEFAULT_INDEX_CONTENT = 0;
const DEFAULT_FIELD_NAME = 'content';

/**
 * Resolves where a bot/combine-bot file reference should write.
 * Prefer explicit varFileReference fields so combine blocks are not forced to index 0.
 */
export const resolveBotFileWriteTarget = (varFileReference = {}, messageType) => {
  const indexContent = varFileReference.indexContent !== undefined
    ? varFileReference.indexContent
    : DEFAULT_INDEX_CONTENT;
  const contentType = varFileReference.contentType || messageType;
  const fieldName = varFileReference.fieldName || DEFAULT_FIELD_NAME;

  return {
    indexContent,
    contentType,
    fieldName,
  };
};
