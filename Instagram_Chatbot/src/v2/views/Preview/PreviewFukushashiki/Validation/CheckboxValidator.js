import {
  ERROR_MESSAGES,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";

const validateCheckbox = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;
  const { type, checkedValue, initial_selection_picture, selection_limit_from, selection_limit_to, require } = contentType;

  if (!require) return true;

  if (type !== "checkbox_img") {
    if (stringNullOrEmpty(checkedValue) || checkedValue.length === 0) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
    }
    
    if (selection_limit_from && checkedValue.length < parseInt(selection_limit_from)) {
      return addErrorMessage(errorsMess, key, `この項目は、${selection_limit_from}個以上選択してください。`);
    }
    
    if (selection_limit_to && checkedValue.length > parseInt(selection_limit_to)) {
      return addErrorMessage(errorsMess, key, `この項目は、${selection_limit_to}個以下選択してください。`);
    }
  } else {
    if (stringNullOrEmpty(initial_selection_picture) || initial_selection_picture.length === 0) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
    }
    
    if (selection_limit_from && initial_selection_picture.length < parseInt(selection_limit_from)) {
      return addErrorMessage(errorsMess, key, `この項目は、${selection_limit_from}個以上選択してください。`);
    }
    
    if (selection_limit_to && initial_selection_picture.length > parseInt(selection_limit_to)) {
      return addErrorMessage(errorsMess, key, `この項目は、${selection_limit_to}個以下選択してください。`);
    }
  }

  return true;
};

export { validateCheckbox };