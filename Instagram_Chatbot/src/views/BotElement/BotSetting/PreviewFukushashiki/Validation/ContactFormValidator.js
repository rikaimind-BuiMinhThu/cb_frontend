import {
  ERROR_MESSAGES,
  REGEX_PATTERNS,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";
import { CONTACT_FORM_TEMPLATES } from "../../PreviewComponent/Constants";
import {
  EMAIL_DOMAIN_SUGGESTION_MODES,
  isEmailDomainAllowed,
} from "../../PreviewComponent/emailDomainDefaults";

const validateContactForm = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;
  const fields = contentType?.fields || {};
  const template = contentType?.form_template || CONTACT_FORM_TEMPLATES.BASIC;
  let isValid = true;

  if (stringNullOrEmpty(fields.name)) {
    isValid = addErrorMessage(errorsMess, `${key}_name`, ERROR_MESSAGES.REQUIRED);
  }

  if (stringNullOrEmpty(fields.email)) {
    isValid = addErrorMessage(errorsMess, `${key}_email`, ERROR_MESSAGES.REQUIRED);
  } else if (!REGEX_PATTERNS.EMAIL.test(fields.email)) {
    isValid = addErrorMessage(errorsMess, `${key}_email`, ERROR_MESSAGES.EMAIL_INVALID);
  } else {
    const domainSuggestion = contentType?.domain_suggestion;
    if (
      domainSuggestion?.enabled &&
      domainSuggestion?.mode === EMAIL_DOMAIN_SUGGESTION_MODES.RESTRICT &&
      !isEmailDomainAllowed(fields.email, domainSuggestion)
    ) {
      isValid = addErrorMessage(errorsMess, `${key}_email`, ERROR_MESSAGES.EMAIL_DOMAIN_RESTRICT);
    }
  }

  if (stringNullOrEmpty(fields.content)) {
    isValid = addErrorMessage(errorsMess, `${key}_content`, ERROR_MESSAGES.REQUIRED);
  }

  if (template === CONTACT_FORM_TEMPLATES.DETAILED) {
    if (stringNullOrEmpty(fields.phone)) {
      isValid = addErrorMessage(errorsMess, `${key}_phone`, ERROR_MESSAGES.REQUIRED);
    }
    if (stringNullOrEmpty(fields.inquiry_type)) {
      isValid = addErrorMessage(errorsMess, `${key}_inquiry_type`, ERROR_MESSAGES.REQUIRED);
    }
  }

  if (template === CONTACT_FORM_TEMPLATES.PRODUCT) {
    if (stringNullOrEmpty(fields.order_number)) {
      isValid = addErrorMessage(errorsMess, `${key}_order_number`, ERROR_MESSAGES.REQUIRED);
    }
    if (stringNullOrEmpty(fields.product_name)) {
      isValid = addErrorMessage(errorsMess, `${key}_product_name`, ERROR_MESSAGES.REQUIRED);
    }
  }

  const emailSettings = contentType?.email_settings || {};
  if (!emailSettings.send_to_user && !emailSettings.send_to_staff) {
    isValid = addErrorMessage(errorsMess, key, "メール送信設定が無効です。");
  }
  if (emailSettings.send_to_user && !emailSettings.user_email_id) {
    isValid = addErrorMessage(errorsMess, key, "ユーザー向けメールテンプレートが設定されていません。");
  }
  if (emailSettings.send_to_staff && !emailSettings.staff_email_id) {
    isValid = addErrorMessage(errorsMess, key, "担当者向けメールテンプレートが設定されていません。");
  }

  return isValid;
};

export { validateContactForm };
