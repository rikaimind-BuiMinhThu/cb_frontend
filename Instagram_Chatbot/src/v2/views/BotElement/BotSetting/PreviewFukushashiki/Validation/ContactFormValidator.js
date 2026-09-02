import {
  ERROR_MESSAGES,
  REGEX_PATTERNS,
  addErrorMessage,
  stringNullOrEmpty
} from "../ValidationUtils";
import {
  CONTACT_FORM_FIELD_KEYS,
  getContactFormFieldSettings,
} from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import {
  EMAIL_DOMAIN_SUGGESTION_MODES,
  isEmailDomainAllowed,
} from "v2/views/BotElement/BotSetting/PreviewComponent/emailDomainDefaults";

const validateContactForm = (contentType, messageContents, i, index, errorsMess) => {
  const key = `message${index}_content${i}_${messageContents[i].type}`;
  const fields = contentType?.fields || {};
  const fieldSettings = getContactFormFieldSettings(contentType);
  let isValid = true;

  CONTACT_FORM_FIELD_KEYS.forEach((fieldName) => {
    const setting = fieldSettings[fieldName];
    if (!setting?.visible) return;

    const value = fields[fieldName];

    if (setting.required && stringNullOrEmpty(value)) {
      isValid = addErrorMessage(errorsMess, `${key}_${fieldName}`, ERROR_MESSAGES.REQUIRED);
      return;
    }

    if (fieldName !== "email" || stringNullOrEmpty(value)) return;

    if (!REGEX_PATTERNS.EMAIL.test(value)) {
      isValid = addErrorMessage(errorsMess, `${key}_email`, ERROR_MESSAGES.EMAIL_INVALID);
      return;
    }

    const domainSuggestion = contentType?.domain_suggestion;
    if (
      domainSuggestion?.enabled &&
      domainSuggestion?.mode === EMAIL_DOMAIN_SUGGESTION_MODES.RESTRICT &&
      !isEmailDomainAllowed(value, domainSuggestion)
    ) {
      isValid = addErrorMessage(errorsMess, `${key}_email`, ERROR_MESSAGES.EMAIL_DOMAIN_RESTRICT);
    }
  });

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
