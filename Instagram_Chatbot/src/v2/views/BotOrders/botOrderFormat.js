import {
  BIRTH_DATE_DAY_SUFFIX,
  BIRTH_DATE_MONTH_SUFFIX,
  BIRTH_DATE_YEAR_SUFFIX,
  DASH,
  EMPTY_VALUE,
  INPUT_LABELS,
  INPUT_NAME_BIRTH_DATE,
  INPUT_NAME_PATH,
  INPUT_NAME_PHONE,
  INPUT_NAME_PHONE_NUMBER,
  INPUT_NAME_USER_NAME,
  INPUT_NAME_USER_NAME_KANA,
  INPUT_NAME_ZIP,
  LOCALE_JA,
  PATH_VALUE_LABELS,
  PAYMENT_CREDIT,
  PAYMENT_ZEUS,
  RPA_EXCEPTION_PREFIX,
  RPA_NG,
  RPA_OK,
  RPA_STEP_FALLBACK,
  STATUS_COLOR_DEFAULT,
  STATUS_COLORS,
  STATUS_LABELS,
  STEP_LABELS,
} from './constants';

export const statusColor = (result) => STATUS_COLORS[result] || STATUS_COLOR_DEFAULT;

export const statusLabel = (result) => STATUS_LABELS[result] || result || DASH;

export const formatDateTime = (value) => {
  if (!value) return DASH;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return DASH;
  return date.toLocaleString(LOCALE_JA);
};

export const formatStep = (value) => {
  if (!value) return DASH;
  return STEP_LABELS[value] || value;
};

export const formatInputLabel = (name) => INPUT_LABELS[name] || name || DASH;

const parseJsonValue = (value) => {
  if (value == null || value === EMPTY_VALUE) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
};

const formatSplitName = (obj) => {
  const left = obj.valueLeft ?? EMPTY_VALUE;
  const right = obj.valueRight ?? EMPTY_VALUE;
  return [left, right].filter(Boolean).join(' ') || obj.value || EMPTY_VALUE;
};

const formatAddress = (obj) => {
  const zip = obj.zip_code || obj.zipCode || obj.value_post_code || obj.value || EMPTY_VALUE;
  const pref = obj.prefecture || obj.address1 || obj.value_prefecture || EMPTY_VALUE;
  const city = obj.city || obj.address2 || obj.value_municipality || EMPTY_VALUE;
  const town = obj.town || obj.address3 || obj.street || obj.value_address || EMPTY_VALUE;
  const building = obj.building_name || obj.value_building_name || EMPTY_VALUE;
  return [zip, pref, city, town, building].filter(Boolean).join(' ');
};

const formatPhone = (obj) => {
  if (obj.value) return String(obj.value);
  return [obj.value1, obj.value2, obj.value3].filter(Boolean).join('');
};

const formatBirthDate = (obj) => {
  const year = obj.valueYear || obj.yyyy || obj.year;
  const month = obj.valueMonth || obj.mm || obj.month;
  const day = obj.valueDay || obj.dd || obj.day;
  if (year == null || month == null || day == null) return EMPTY_VALUE;
  return `${year}${BIRTH_DATE_YEAR_SUFFIX}${Number(month)}${BIRTH_DATE_MONTH_SUFFIX}${Number(day)}${BIRTH_DATE_DAY_SUFFIX}`;
};

export const formatInputValue = (name, value) => {
  if (value == null || value === EMPTY_VALUE) return DASH;
  if (name === INPUT_NAME_PATH) return PATH_VALUE_LABELS[value] || value;
  const parsed = parseJsonValue(value);
  if (parsed && (name === INPUT_NAME_USER_NAME || name === INPUT_NAME_USER_NAME_KANA)) {
    const formatted = formatSplitName(parsed);
    if (formatted) return formatted;
  }
  if (parsed && name === INPUT_NAME_ZIP) {
    const formatted = formatAddress(parsed);
    if (formatted) return formatted;
  }
  if (parsed && (name === INPUT_NAME_PHONE_NUMBER || name === INPUT_NAME_PHONE)) {
    const formatted = formatPhone(parsed);
    if (formatted) return formatted;
  }
  if (parsed && name === INPUT_NAME_BIRTH_DATE) {
    const formatted = formatBirthDate(parsed);
    if (formatted) return formatted;
  }
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
};

export const formatRpaLog = (steps) => {
  if (!steps || !steps.length) return DASH;
  return steps
    .map((step, index) => {
      const title = step.description || step.name || RPA_STEP_FALLBACK;
      const lines = [`${index + 1}. ${title}`];
      if (step.name) lines.push(`       // ${step.name}`);
      if (step.ok === true) {
        lines.push(`         -> ${RPA_OK}`);
        return lines.join('\n');
      }
      if (step.ok === false) {
        lines.push(`         -> ${RPA_NG}`);
        if (step.error) lines.push(`       ${RPA_EXCEPTION_PREFIX}${step.error}`);
      }
      return lines.join('\n');
    })
    .join('\n\n');
};

export const formatCardExpiry = (value) => {
  if (!value) return DASH;
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return String(value);
};

export const showCardFields = (row) => {
  const payment = String(row?.payment || EMPTY_VALUE);
  if (payment === PAYMENT_CREDIT || payment === PAYMENT_ZEUS) return true;
  return Boolean(row?.masked_pan || row?.card_expiry || row?.card_holder);
};
