import moment from "moment";
import {
  ERROR_MESSAGES,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";

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
  const isCardHolderValid = is_hide_card_name === true || !stringNullOrEmpty(card_holder);

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

const validateCardNumber = (contentType) => {
  const { 
    card_number, 
    card_number1, 
    card_number2, 
    card_number3, 
    card_number4, 
    separate_type 
  } = contentType;

  // Validate single card number (16 digits, numbers only)
  if (card_number) {
    const cardNumberStr = card_number.toString();
    const isValidLength = cardNumberStr.length === 16;
    const isNumericOnly = /^[0-9]+$/.test(cardNumberStr);
    
    if (!isValidLength || !isNumericOnly) {
      return false;
    }
  }

  // Validate separate card number parts (4 digits each)
  if (separate_type === true) {
    const cardParts = [card_number1, card_number2, card_number3, card_number4];
    const allPartsFilled = cardParts.every(part => !stringNullOrEmpty(part));
    
    if (allPartsFilled) {
      const allPartsValid = cardParts.every(part => {
        const partStr = part.toString();
        return partStr.length === 4 && /^[0-9]+$/.test(partStr);
      });
      
      return allPartsValid;
    }
  }

  return true;
};

const validateExpiryDate = (contentType) => {
  const { year, month } = contentType;
  
  if (stringNullOrEmpty(year) || stringNullOrEmpty(month)) {
    return true; // Let required validation handle this
  }

  return !moment(`${year}-${month}`, "YYYY-MM").isBefore(moment().format("YYYY-MM"));
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
