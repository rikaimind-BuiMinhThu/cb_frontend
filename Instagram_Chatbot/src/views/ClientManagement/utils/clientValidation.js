import {
  collectFieldErrors,
  isKatakanaValid,
  isValidImageFile,
  mergeFieldErrors,
  validateDateRange,
  validateField,
  validateNameField,
  validatePasswordField,
  validatePhoneNumber,
  validatePickStatus,
  validatePrice,
  validateZipCode,
} from './clientFormHelpers';

const MAIL_FORMAT =
  /^[a-zA-Z0-9]+[a-zA-Z0-9]+([._+-])*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

export function formatDateValue(date) {
  if (!date) return '';
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }
  return String(date);
}

function validateCommonFields(values) {
  const errors = collectFieldErrors([
    ['name', validateNameField(values.name, '名称')],
    ['name_katakana', validateNameField(values.name_katakana, '名称カナ')],
    ['enterprise_type', validateField(values.enterprise_type, 'CompanyType')],
    ['enterprise_type_2', validateField(values.enterprise_type_2, 'CompanyType2')],
    ['cart_system', validateField(values.cart_system, 'CartSystem')],
    ['department_name', validateNameField(values.department_name, '部署名')],
    ['title', validateField(values.title, 'タイトル')],
    ['responsible_person', validateNameField(values.responsible_person, '担当者')],
    ['responsible_person_katakana', validateNameField(values.responsible_person_katakana, '担当者カナ')],
    ['url', validateField(values.url, 'URL')],
    ['address', validateField(values.address, '住所')],
    ['municipality', validateField(values.municipality, '都道府県')],
    ['zip_code', validateZipCode(values.zip_code)],
    ['prefecture', validateField(values.prefecture, 'Prefectures')],
    ['building_name', validateField(values.building_name, '建物名')],
    ['email', validateNameField(values.email, 'メールアドレス')],
    ['phone_number', validatePhoneNumber(values.phone_number)],
    ['price', validatePrice(values.price)],
  ]);

  if (values.name_katakana && !isKatakanaValid(values.name_katakana)) {
    errors.name_katakana = '名称カナを入力してください。';
  }
  if (values.responsible_person_katakana && !isKatakanaValid(values.responsible_person_katakana)) {
    errors.responsible_person_katakana = '名称カナを入力してください。';
  }

  return errors;
}

function validateEmailAdd(email) {
  if (!email) {
    return 'メールを入力してください(例:abc＠abc.com)';
  }
  if (email.length > 35) {
    return '35文字以下入力してください。';
  }
  if (!email.match(MAIL_FORMAT)) {
    return 'メールを入力してください(例:abc＠abc.com)';
  }
  return null;
}

function validateEmailUpdate(email) {
  if (!email) {
    return 'メールアドレス 入力してください。';
  }
  if (email.length >= 35) {
    return '35文字以下入力してください。';
  }
  if (!email.match(MAIL_FORMAT)) {
    return 'メールを入力してください(例:abc＠abc.com)';
  }
  return null;
}

function validateShopifyFields(values, context) {
  if (values.cart_system !== 'shopify') {
    return {};
  }
  if (context.shopUrl && context.clientId && context.clientSecret) {
    return {};
  }
  return { cart_system: 'Shopify連携情報を入力してください。' };
}

export function validateAddClient(values, context) {
  const fieldErrors = mergeFieldErrors(
    validateCommonFields(values),
    collectFieldErrors([
      ['status', validatePickStatus(context.contract)],
      ['password', validatePasswordField(values.password, 'パスワード')],
      ['password_confirmation', validateField(values.password_confirmation, 'パスワード(確認用)')],
      ['email', validateEmailAdd(values.email)],
    ]),
    validateShopifyFields(values, context),
  );

  const password = values.password || '';
  const cfPassword = values.password_confirmation || '';
  if (password.length >= 6 && password.length <= 24 && cfPassword !== password) {
    fieldErrors.password_confirmation = '確認用パスワードが一致しません';
  } else if (password && (password.length < 6 || password.length > 24)) {
    fieldErrors.password = '24文字以下入力してください。6文字以上入力してください。';
  }

  if (!context.avatarFile) {
    fieldErrors.logo = '画像を選択してください。';
  } else if (!isValidImageFile(context.avatarFile)) {
    fieldErrors.logo = '画像を選択してください。';
  }

  const dateRangeError = validateDateRange(context.startDate, context.endDate);
  if (dateRangeError) {
    fieldErrors.subscription_end_at = dateRangeError;
  }

  return { valid: Object.keys(fieldErrors).length === 0, fieldErrors };
}

export function validateUpdateClient(values, context) {
  const fieldErrors = mergeFieldErrors(
    validateCommonFields(values),
    collectFieldErrors([['email', validateEmailUpdate(values.email)]]),
    validateShopifyFields(values, context),
  );

  if (context.updateImageChange && context.avatarFile && !isValidImageFile(context.avatarFile)) {
    fieldErrors.logo = '画像を選択してください。';
  }

  const dateRangeError = validateDateRange(context.startDate, context.endDate);
  if (dateRangeError) {
    fieldErrors.subscription_end_at = dateRangeError;
  }

  return { valid: Object.keys(fieldErrors).length === 0, fieldErrors };
}

export function buildClientPayload(values, context) {
  const payload = {
    plan: values.plan,
    price: values.price,
    is_instagram: values.is_instagram,
    is_line: values.is_line,
    is_tiktok: values.is_tiktok,
    is_web: values.is_web,
    note: values.note || '',
    name: values.name,
    name_katakana: values.name_katakana,
    enterprise_type: values.enterprise_type,
    enterprise_type_2: values.enterprise_type_2,
    department_name: values.department_name,
    title: values.title,
    responsible_person: values.responsible_person,
    responsible_person_katakana: values.responsible_person_katakana,
    url: values.url,
    zip_code: values.zip_code,
    prefecture: values.prefecture,
    municipality: values.municipality,
    address: values.address,
    building_name: values.building_name,
    email: values.email,
    phone_number: values.phone_number,
    cart_system: values.cart_system,
    status: context.contract,
    subscription_start_at: formatDateValue(context.startDate),
    subscription_end_at: formatDateValue(context.endDate),
  };

  if (values.cart_system === 'shopify') {
    payload.shop_url = context.shopUrl;
    payload.client_id = context.clientId;
    payload.client_secret = context.clientSecret;
  }

  return payload;
}
