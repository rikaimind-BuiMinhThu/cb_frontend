import {
  ERROR_MESSAGES,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";

const validateCalendar = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;

  if (contentType.require && stringNullOrEmpty(contentType.date_select)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  return true;
};

export { validateCalendar };
