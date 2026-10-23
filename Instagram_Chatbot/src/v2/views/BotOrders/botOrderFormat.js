import {
  BIRTH_DATE_DAY_SUFFIX,
  BIRTH_DATE_MONTH_SUFFIX,
  BIRTH_DATE_YEAR_SUFFIX,
  CHROME_SLOT_COUNT_SUFFIX,
  CHROME_SLOT_DEFER_STEP,
  CHROME_SLOT_LIST_RETRY_PREFIX,
  CHROME_SLOT_LIST_SEP,
  CHROME_SLOT_LIST_WAIT_PREFIX,
  CHROME_SLOT_MAX_RETRIES_DISPLAY,
  CHROME_SLOT_RETRY_STEP,
  DASH,
  DURATION_HOUR_SUFFIX,
  DURATION_MINUTE_SUFFIX,
  DURATION_SECOND_SUFFIX,
  EMPTY_VALUE,
  INPUT_LABELS,
  RPA_ATTEMPT_PREFIX,
  RPA_ATTEMPT_SEP,
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
  RPA_ACTION_TYPE_LABELS,
  RPA_ACTIONS_MISSING,
  RPA_ERROR_TRUNCATE,
  RPA_LABEL_ACTIONS,
  RPA_LABEL_CURRENT_URL,
  RPA_LABEL_ID,
  RPA_LABEL_REASON,
  RPA_LABEL_REQUEST,
  RPA_LABEL_RESPONSE,
  RPA_LABEL_RESULT,
  RPA_LABEL_RUN_TIME,
  RPA_LABEL_VALUE,
  RPA_LABEL_WHERE,
  RPA_NG,
  RPA_OK,
  RPA_STEP_FALLBACK,
  RPA_STEP_PREFIX,
  RPA_TOKEN_ARTIFACT,
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

export const formatDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return DASH;
  const startMs = new Date(startTime).getTime();
  const endMs = new Date(endTime).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return DASH;
  const totalSec = Math.max(0, Math.floor((endMs - startMs) / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}${DURATION_HOUR_SUFFIX}${minutes}${DURATION_MINUTE_SUFFIX}`;
    }
    return `${hours}${DURATION_HOUR_SUFFIX}`;
  }
  if (minutes > 0) {
    if (seconds > 0) {
      return `${minutes}${DURATION_MINUTE_SUFFIX}${seconds}${DURATION_SECOND_SUFFIX}`;
    }
    return `${minutes}${DURATION_MINUTE_SUFFIX}`;
  }
  return `${seconds}${DURATION_SECOND_SUFFIX}`;
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

export const stripTokenArtifacts = (text) => {
  if (text == null || text === EMPTY_VALUE) return EMPTY_VALUE;
  return String(text).replace(RPA_TOKEN_ARTIFACT, EMPTY_VALUE);
};

export const cleanErrorMessage = (message) => {
  const cleaned = stripTokenArtifacts(message).trim();
  return cleaned || DASH;
};

export const isChromeSlotDeferStep = (step) => step?.name === CHROME_SLOT_DEFER_STEP;

export const isChromeSlotRetryStep = (step) => step?.name === CHROME_SLOT_RETRY_STEP;

export const countChromeSlotDefers = (steps) => {
  if (!Array.isArray(steps)) return 0;
  return steps.filter((step) => isChromeSlotDeferStep(step)).length;
};

export const countChromeSlotRetries = (steps) => {
  if (!Array.isArray(steps)) return 0;
  return steps.filter((step) => isChromeSlotRetryStep(step)).length;
};

export const formatChromeSlotCount = (count) => `${Number(count) || 0}${CHROME_SLOT_COUNT_SUFFIX}`;

export const formatChromeSlotListCell = (deferCount, retryCount) => {
  const defers = Number(deferCount) || 0;
  const retries = Number(retryCount) || 0;
  if (defers === 0 && retries === 0) return DASH;
  return `${CHROME_SLOT_LIST_WAIT_PREFIX}${defers}${CHROME_SLOT_LIST_SEP}${CHROME_SLOT_LIST_RETRY_PREFIX}${retries}`;
};

export const formatChromeSlotAttemptLabel = (step) => {
  if (!isChromeSlotRetryStep(step)) return EMPTY_VALUE;
  const attempt = step.attempt;
  if (attempt == null || attempt === EMPTY_VALUE) return EMPTY_VALUE;
  return `${RPA_ATTEMPT_PREFIX}${attempt}${RPA_ATTEMPT_SEP}${CHROME_SLOT_MAX_RETRIES_DISPLAY}`;
};

export const completedRpaSteps = (steps) => {
  if (!Array.isArray(steps)) return [];
  return steps.filter((step) => {
    if (!step) return false;
    if (step.ok === true || step.ok === false) return true;
    return isChromeSlotDeferStep(step) || isChromeSlotRetryStep(step);
  });
};

export const truncateText = (text, max = RPA_ERROR_TRUNCATE) => {
  if (text == null || text === EMPTY_VALUE) return DASH;
  const value = String(text);
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
};

export const rpaStepResultLabel = (ok) => {
  if (ok === true) return RPA_OK;
  if (ok === false) return RPA_NG;
  return DASH;
};

const formatActionTypeLabel = (type) => RPA_ACTION_TYPE_LABELS[type] || type || RPA_STEP_FALLBACK;

const parseJsonPayload = (value) => {
  if (value == null) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (_error) {
    return value;
  }
};

const formatPrettyJsonLines = (label, value, indent = '    ') => {
  const parsed = parseJsonPayload(value);
  const pretty =
    typeof parsed === 'string'
      ? parsed
      : JSON.stringify(parsed, null, 2);
  const lines = [`${indent}${label}:`];
  String(pretty)
    .split('\n')
    .forEach((line) => {
      lines.push(`${indent}  ${line}`);
    });
  return lines;
};

const formatRpaActionsBlock = (actions) => {
  if (!Array.isArray(actions) || actions.length === 0) {
    return [`- ${RPA_LABEL_ACTIONS}: ${RPA_ACTIONS_MISSING}`];
  }
  const lines = [`- ${RPA_LABEL_ACTIONS}:`];
  actions.forEach((action) => {
    const typeLabel = formatActionTypeLabel(action.type);
    const label = action.label || EMPTY_VALUE;
    const title = label ? `${typeLabel} ${label}` : typeLabel;
    lines.push(`  - ${title}`);
    lines.push(`    ${RPA_LABEL_WHERE}: ${action.where || DASH}`);
    if (Object.prototype.hasOwnProperty.call(action, 'value')) {
      lines.push(`    ${RPA_LABEL_VALUE}: ${cleanErrorMessage(action.value)}`);
    }
    if (Object.prototype.hasOwnProperty.call(action, 'request')) {
      lines.push(...formatPrettyJsonLines(RPA_LABEL_REQUEST, action.request));
    }
    if (Object.prototype.hasOwnProperty.call(action, 'response')) {
      lines.push(...formatPrettyJsonLines(RPA_LABEL_RESPONSE, action.response));
    }
  });
  return lines;
};

export const formatRpaStepDetail = (step) => {
  if (!step) return DASH;
  const actionLabel = step.description || step.name || RPA_STEP_FALLBACK;
  const stepId = step.name || RPA_STEP_FALLBACK;
  const result = rpaStepResultLabel(step.ok);
  const reason =
    step.ok === false ? cleanErrorMessage(step.error) : DASH;
  return [
    `- ${RPA_LABEL_CURRENT_URL}: ${step.url || DASH}`,
    `- ${RPA_LABEL_RUN_TIME}: ${step.at || DASH}`,
    `- ${RPA_STEP_PREFIX}: ${actionLabel}`,
    `  ${RPA_LABEL_ID}: ${stepId}`,
    ...formatRpaActionsBlock(step.actions),
    `- ${RPA_LABEL_RESULT}: ${result}`,
    `- ${RPA_LABEL_REASON}: ${reason}`,
  ].join('\n');
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
