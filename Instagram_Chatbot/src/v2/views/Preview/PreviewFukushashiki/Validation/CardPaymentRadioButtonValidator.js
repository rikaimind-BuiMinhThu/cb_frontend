import {
  ERROR_MESSAGES,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";
import { validateCardNumber, validateExpiryDate } from "./CreditCardPaymentValidator";

const validateCardPaymentRadioButton = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;
  const { type, initial_selection, initial_selection_picture } = contentType;

  // Basic selection validation
  if (contentType.require && !validateBasicSelection(type, initial_selection, initial_selection_picture)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  // Card details validation if card option is selected
  if (isCardOptionSelected(contentType)) {
    if (!validateCardDetails(contentType)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
    }

    if (!validateCardNumber(contentType)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CARD_NUMBER_INVALID);
    }

    if (!validateExpiryDate(contentType)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CARD_EXPIRY_INVALID);
    }

    if (!validateCVC(contentType)) {
      return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CVC_INVALID);
    }
  }

  return true;
};

const validateBasicSelection = (type, initial_selection, initial_selection_picture) => {
  if (type !== "picture_radio") {
    return !stringNullOrEmpty(initial_selection);
  } else {
    return !stringNullOrEmpty(initial_selection_picture);
  }
};

const isCardOptionSelected = (contentType) => {
  const { 
    initial_selection, 
    card_linked_setting, 
    initial_selection_picture, 
    card_linked_setting_picture 
  } = contentType;

  // Check if regular radio button with card option is selected
  const isRegularCardSelected = initial_selection && 
    card_linked_setting?.length > 0 && 
    card_linked_setting.includes(initial_selection);

  // Check if picture radio button with card option is selected
  const isPictureCardSelected = initial_selection_picture && 
    card_linked_setting_picture && 
    initial_selection_picture === card_linked_setting_picture;

  return isRegularCardSelected || isPictureCardSelected;
};

const validateCardDetails = (contentType) => {
  const { 
    is_hide_card_name, 
    separate_name, 
    card_holder, 
    card_holder1, 
    card_holder2,
    is_hide_cvc, 
    cvc, 
    separate_type, 
    card_number1, 
    card_number2, 
    card_number3, 
    card_number4, 
    card_number, 
    year, 
    month 
  } = contentType;

  // Check card holder name validation
  const isCardHolderValid = is_hide_card_name === true || (separate_name === true ? 
    (!stringNullOrEmpty(card_holder1) && !stringNullOrEmpty(card_holder2)) : !stringNullOrEmpty(card_holder));

  // Check CVC validation
  const isCvcValid = is_hide_cvc === true || !stringNullOrEmpty(cvc);

  // Check card number validation
  const isCardNumberValid = separate_type === true ? 
    (!stringNullOrEmpty(card_number1) && !stringNullOrEmpty(card_number2) &&
     !stringNullOrEmpty(card_number3) && !stringNullOrEmpty(card_number4)) :
    !stringNullOrEmpty(card_number);

  // Check expiry date validation
  const isExpiryDateValid = !stringNullOrEmpty(year) && !stringNullOrEmpty(month);

  return isCardHolderValid && isCvcValid && isCardNumberValid && isExpiryDateValid;
};

const validateCVC = (contentType) => {
  const { cvc } = contentType;
  
  // If CVC is empty, let required validation handle it
  if (stringNullOrEmpty(cvc)) {
    return true;
  }

  // CVC should be 3 or 4 digits
  const cvcStr = cvc.toString();
  const isValidLength = cvcStr.length >= 3 && cvcStr.length <= 4;
  const isNumericOnly = /^[0-9]+$/.test(cvcStr);
  
  return isValidLength && isNumericOnly;
};

export { validateCardPaymentRadioButton };
