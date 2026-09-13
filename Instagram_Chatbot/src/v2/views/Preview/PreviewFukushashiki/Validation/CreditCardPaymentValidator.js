import moment from "moment";
import {
  ERROR_MESSAGES,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";

const validateCreditCardPayment = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;

  // Required field validation
  if (contentType.require && !validateRequiredFields(contentType)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.REQUIRED);
  }

  // Card number validation
  if (!validateCardNumber(contentType)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CARD_NUMBER_INVALID);
  }

  // Expiry date validation
  if (!validateExpiryDate(contentType)) {
    return addErrorMessage(errorsMess, key, ERROR_MESSAGES.CARD_EXPIRY_INVALID);
  }

  return true;
};

const validateRequiredFields = (contentType) => {
  const { is_hide_card_name, card_holder, card_hodler1, card_hodler2, is_hide_cvc, cvc, separate_type, 
          card_number1, card_number2, card_number3, card_number4, 
          card_number, year, month, separate_name} = contentType;

  return !(
    (is_hide_card_name !== true && stringNullOrEmpty(card_holder)) ||
    (is_hide_card_name!== true && separate_name === true && (stringNullOrEmpty(card_hodler1) || (stringNullOrEmpty(card_hodler2)))) ||
    (is_hide_cvc !== true && stringNullOrEmpty(cvc)) ||
    (separate_type === true && (
      stringNullOrEmpty(card_number1) || stringNullOrEmpty(card_number2) ||
      stringNullOrEmpty(card_number3) || stringNullOrEmpty(card_number4)
    )) ||
    (separate_type === false && stringNullOrEmpty(card_number)) ||
    stringNullOrEmpty(year) || stringNullOrEmpty(month)
  );
};

const validateCardNumber = (contentType) => {
  const { card_number, card_number1, card_number2, card_number3, card_number4, separate_type } = contentType;

  const len = (card_number + "").length;
  if (card_number && ((len !== 15 && len !== 16) || /[^0-9]+/.test(card_number))) {
    return false;
  }

  if (separate_type === true && 
      !stringNullOrEmpty(card_number1) && !stringNullOrEmpty(card_number2) &&
      !stringNullOrEmpty(card_number3) && !stringNullOrEmpty(card_number4)) {
    const len1 = (card_number1 + "").length;
    const len2 = (card_number2 + "").length;
    const len3 = (card_number3 + "").length;
    const len4 = (card_number4 + "").length;
    const totalLength = len1 + len2 + len3 + len4;
    
    // Check for 16 digits: 4-4-4-4
    const is16Digits = len1 === 4 && len2 === 4 && len3 === 4 && len4 === 4;
    // Check for 15 digits: 4-4-4-3 (e.g., American Express)
    const is15Digits = len1 === 4 && len2 === 4 && len3 === 4 && len4 === 3;
    
    return (totalLength === 15 || totalLength === 16) && (is15Digits || is16Digits);
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

export { validateCreditCardPayment, validateCardNumber, validateExpiryDate };
