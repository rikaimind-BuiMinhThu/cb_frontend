import {
  ERROR_MESSAGES,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";

const validateTextArea = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;
  const data = contentType[contentType.type];
  const { value } = data;
  const limitFrom = data?.character_limit_from || 0;
  const limitTo = data?.character_limit_to || Number.MAX_SAFE_INTEGER;

  if (contentType.type === "text_input" && stringNullOrEmpty(value)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  if (!stringNullOrEmpty(value)) {
    if (value.length < limitFrom) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_FROM(limitFrom));
    }
    if (value.length > limitTo) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CHARACTER_LIMIT_TO(limitTo));
    }
  }

  return true;
};

export { validateTextArea };