import {
  ERROR_MESSAGES,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";

const validateRadioButton = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;

  if (contentType.require && stringNullOrEmpty(contentType.initial_selection)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

export { validateRadioButton };