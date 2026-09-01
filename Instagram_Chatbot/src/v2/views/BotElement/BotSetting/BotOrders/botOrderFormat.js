export const STATUS_LABELS = {
  running: '処理中',
  done: '完了',
  error: 'エラー',
  open: '未処理',
};

const STATUS_COLORS = {
  done: 'success',
  error: 'error',
  running: 'processing',
  open: 'default',
};

const STEP_LABELS = {
  queued: '待機中',
};

const INPUT_LABELS = {
  user_email: 'メール',
  email: 'メール',
  path: '注文タイプ',
  user_name: '氏名',
  user_name_kana: '氏名（カナ）',
  zip_code_address: '住所',
  phone_number: '電話番号',
  phone: '電話番号',
  birth_date: '生年月日',
};

const PATH_VALUE_LABELS = {
  first_time: 'はじめて',
  new: '新規会員',
  existing: '既存会員',
};

export function statusColor(result) {
  return STATUS_COLORS[result] || 'default';
}

export function statusLabel(result) {
  return STATUS_LABELS[result] || result || '—';
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ja-JP');
}

export function formatStep(value) {
  if (!value) return '—';
  return STEP_LABELS[value] || value;
}

export function formatInputLabel(name) {
  return INPUT_LABELS[name] || name || '—';
}

function parseJsonValue(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function formatSplitName(obj) {
  const left = obj.valueLeft ?? '';
  const right = obj.valueRight ?? '';
  return [left, right].filter(Boolean).join(' ') || obj.value || '';
}

function formatAddress(obj) {
  const zip = obj.zip_code || obj.zipCode || obj.value_post_code || obj.value || '';
  const pref = obj.prefecture || obj.address1 || obj.value_prefecture || '';
  const city = obj.city || obj.address2 || obj.value_municipality || '';
  const town = obj.town || obj.address3 || obj.street || obj.value_address || '';
  const building = obj.building_name || obj.value_building_name || '';
  return [zip, pref, city, town, building].filter(Boolean).join(' ');
}

function formatPhone(obj) {
  if (obj.value) return String(obj.value);
  return [obj.value1, obj.value2, obj.value3].filter(Boolean).join('');
}

function formatBirthDate(obj) {
  const year = obj.valueYear || obj.yyyy || obj.year;
  const month = obj.valueMonth || obj.mm || obj.month;
  const day = obj.valueDay || obj.dd || obj.day;
  if (year == null || month == null || day == null) return '';
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export function formatInputValue(name, value) {
  if (value == null || value === '') return '—';
  if (name === 'path') return PATH_VALUE_LABELS[value] || value;
  const parsed = parseJsonValue(value);
  let formatted = '';
  if (parsed) {
    if (name === 'user_name' || name === 'user_name_kana') formatted = formatSplitName(parsed);
    else if (name === 'zip_code_address') formatted = formatAddress(parsed);
    else if (name === 'phone_number' || name === 'phone') formatted = formatPhone(parsed);
    else if (name === 'birth_date') formatted = formatBirthDate(parsed);
  }
  if (formatted) return formatted;
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

export function formatRpaLog(steps) {
  if (!steps || !steps.length) return '—';
  return steps
    .map((step, index) => {
      const title = step.description || step.name || '—';
      const lines = [`${index + 1}. ${title}`];
      if (step.name) lines.push(`       // ${step.name}`);
      if (step.ok === true) {
        lines.push('         -> OK');
      } else if (step.ok === false) {
        lines.push('         -> NG');
        if (step.error) lines.push(`       例外: ${step.error}`);
      }
      return lines.join('\n');
    })
    .join('\n\n');
}

export function formatCardExpiry(value) {
  if (!value) return '—';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return String(value);
}

export function showCardFields(row) {
  const payment = String(row?.payment || '');
  if (payment === 'credit' || payment === 'zeus') return true;
  return Boolean(row?.masked_pan || row?.card_expiry || row?.card_holder);
}
