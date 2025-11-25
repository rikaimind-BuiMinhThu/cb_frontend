import { stringNullOrEmpty } from '../PreviewComponent/Utils';
import { MESSAGE_CONTENT_TYPES, PREVIEW_ACTIONS } from '../PreviewComponent/Constants';
import { validateTextInput } from './Validation/TextInputValidator';
import { validateTextArea } from './Validation/TextAreaValidator';
import { validateRadioButton } from './Validation/RadioButtonValidator';
import { validatePullDown } from './Validation/PullDownValidator';
import { validateCheckbox } from './Validation/CheckboxValidator';
import { validateZipCodeAddress, validateShippingAddress } from './Validation/ZipCodeAddressValidator';
import { validateProductPurchaseSelectOption } from './Validation/ProductPurchaseSelectOptionValidator';
import { validateAttachment } from './Validation/AttachmentValidator';
import { validateCalendar } from './Validation/CalendarValidator';
import { validateAgreeTerm } from './Validation/AgreeTermValidator';
import { validateCreditCardPayment } from './Validation/CreditCardPaymentValidator';
import { validateCardPaymentRadioButton } from './Validation/CardPaymentRadioButtonValidator';

// Regex Patterns
export const REGEX_PATTERNS = {
  PASSWORD: /^[A-Za-z0-9 ]+$/,
  EMAIL: /^[\w-]+([\.-]?[\w-]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  PHONE: /^0\d{9}$|^0\d{10}$/,
  URLS: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  ALPHABET: /[^A-Za-z ]+/,
  SINGLE_BYTE: /[^0-9 ]+/,
  ALPHANUMERIC_HYPHEN: /[^A-Za-z0-9-_ ]+/,
  ALPHANUMERIC: /[^A-Za-z0-9 ]+/,
  DOUBLE_BYTE_HIRAGANA: /[^ぁ-ん]+/,
  FULL_WIDTH_KATAKANA: /[^ァ-ン\s]+/,
  DOUBLE_BYTE: /[^ァ-ンぁ-ん一-龥]+$/,
  ONLY_KATAKANA: /[^\u30A0-\u30FF\uFF66-\uFF9Fー]+/
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: "この項目は必須です。",
  CHARACTER_LIMIT_FROM: (limit) => `${limit}文字以上入力してください。`,
  CHARACTER_LIMIT_TO: (limit) => `${limit}文字以下入力してください。`,
  PASSWORD_PATTERN: "英数字('A-Z','a-z','0-9')が使用できます。",
  EMAIL_INVALID: "有効なメールアドレス形式で指定してください。",
  PHONE_INVALID: "入力形式が正しくありません。",
  URL_INVALID: "有効なURL形式で指定してください。",
  EMAIL_MISMATCH: "メールアドレスとメールアドレス確認が一致しません。",
  PASSWORD_MISMATCH: "パスワードとパスワード確認が一致しません。",
  ALPHABET_ONLY: "アルファベッドのみ使用できます。",
  SINGLE_BYTE_NUMBER: "半角数字で入力してください",
  ALPHANUMERIC_HYPHEN: "英数字('A-Z','a-z','0-9')とハイフンと下線('-','_')が使用できます。",
  ALPHANUMERIC: "英数字('A-Z','a-z','0-9')が使用できます。",
  HIRAGANA_ONLY: "全角ひらがなを入力してください。",
  KATAKANA_ONLY: "全角カタカナを入力してください。",
  DOUBLE_BYTE_ONLY: "全角文字を入力してください。",
  ONLY_KATAKANA: "カタカナ（全角・半角）を入力してください。",
  CARD_NUMBER_INVALID: "クレジットカード番号は無効です。",
  CARD_EXPIRY_INVALID: "有効期限に誤りがあるために、決済を完了できませんでした。",
  CVC_INVALID: "CVCは3桁か4桁で入力してください。"
};

// Range Validation Messages
export const RANGE_VALIDATION_MESSAGES = {
  alphabet: ERROR_MESSAGES.ALPHABET_ONLY,
  single_byte: ERROR_MESSAGES.SINGLE_BYTE_NUMBER,
  alphanumeric_hyphen: ERROR_MESSAGES.ALPHANUMERIC_HYPHEN,
  alphanumeric: ERROR_MESSAGES.ALPHANUMERIC,
  double_byte_hiragana: ERROR_MESSAGES.HIRAGANA_ONLY,
  full_width_katakana: ERROR_MESSAGES.KATAKANA_ONLY,
  double_byte: ERROR_MESSAGES.DOUBLE_BYTE_ONLY,
  ONLY_KATAKANA: ERROR_MESSAGES.KATAKANA_ONLY
};

// Range Validation Patterns
export const RANGE_VALIDATION_PATTERNS = {
  alphabet: REGEX_PATTERNS.ALPHABET,
  single_byte: REGEX_PATTERNS.SINGLE_BYTE,
  alphanumeric_hyphen: REGEX_PATTERNS.ALPHANUMERIC_HYPHEN,
  alphanumeric: REGEX_PATTERNS.ALPHANUMERIC,
  double_byte_hiragana: REGEX_PATTERNS.DOUBLE_BYTE_HIRAGANA,
  full_width_katakana: REGEX_PATTERNS.FULL_WIDTH_KATAKANA,
  double_byte: REGEX_PATTERNS.DOUBLE_BYTE,
  ONLY_KATAKANA: REGEX_PATTERNS.ONLY_KATAKANA,
};

// Helper function to add error messages
export const addErrorMessage = (errorsMess, key, message) => {
  errorsMess[key] = message;
  return false;
};

const getValidator = (messageType) => {
  switch (messageType) {
    case MESSAGE_CONTENT_TYPES.IMAGE:
      // Validator is unnecessary
      return null;
    case MESSAGE_CONTENT_TYPES.TEXT_INPUT:
      return validateTextInput;
    case MESSAGE_CONTENT_TYPES.LABEL:
      // No validation needed
      return null;
    case MESSAGE_CONTENT_TYPES.TEXT_AREA:
      return validateTextArea;
    case MESSAGE_CONTENT_TYPES.RADIO_BUTTON:
      return validateRadioButton;
    case MESSAGE_CONTENT_TYPES.CHECKBOX:
      return validateCheckbox;
    case MESSAGE_CONTENT_TYPES.PULL_DOWN:
      return validatePullDown;
    case MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS:
      return validateZipCodeAddress;
    case MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS:
      return validateShippingAddress;
    case MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE_SELECT_OPTION:
      return validateProductPurchaseSelectOption;
    case MESSAGE_CONTENT_TYPES.ATTACHMENT:
      return validateAttachment;
    case MESSAGE_CONTENT_TYPES.CALENDAR:
      return validateCalendar;
    case MESSAGE_CONTENT_TYPES.AGREE_TERM:
      return validateAgreeTerm;
    case MESSAGE_CONTENT_TYPES.CREDIT_CARD_PAYMENT:
      return validateCreditCardPayment;
    case MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON:
      return validateCardPaymentRadioButton;
    case MESSAGE_CONTENT_TYPES.SUBMIT_BUTTON:
      // No validation needed
      return null;
    case MESSAGE_CONTENT_TYPES.LABEL_NO_TRANSITION:
      // No validation needed
      return null;
    default:
      return null;
  }
};

export const handleValidateField = (message, messageIndex) => {
  const messageContents = [...message.message_content];

  let isValid = true;
  let errorsMess = {};

  for (let i = 0; i < messageContents.length; i++) {
    const contentType = messageContents[i][messageContents[i].type];
    const messageType = messageContents[i].type;

    // Get the appropriate validator for this message type
    const validator = getValidator(messageType);
    
    if (validator) {
      isValid = validator(contentType, messageContents, i, messageIndex, errorsMess) && isValid;
    }
  }
  
  // Return validation result and errors
  return {
    isValid,
    errors: isValid ? {} : errorsMess
  };
};

export { stringNullOrEmpty };