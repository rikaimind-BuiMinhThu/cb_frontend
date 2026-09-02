export function validatePickStatus(contract) {
  if (['active', 'pause', 'ended', 'trial'].includes(contract)) {
    return null;
  }
  return 'ステータスを選択してください。';
}

export function validateNameField(value, fieldLabel) {
  if (value === '' || value == null) {
    return `${fieldLabel}は、必ず指定してください。`;
  }
  if (value.length > 35) {
    return '35文字以下にしてください。';
  }
  return null;
}

export function validateField(value, fieldLabel) {
  if (value === '' || value == null) {
    return `${fieldLabel}は、必ず指定してください。`;
  }
  if (value.length > 50) {
    return '50文字以下にしてください。';
  }
  return null;
}

export function validatePasswordField(value, fieldLabel) {
  if (value === '' || value == null) {
    return `${fieldLabel}は、必ず指定してください。`;
  }
  if (value.length > 24) {
    return '24文字以下入力してください。6文字以上入力してください。';
  }
  return null;
}

export function validateZipCode(value) {
  if (value === '' || value == null) {
    return '郵便番号は、必ず指定してください。';
  }
  if (!/^\d+$/.test(String(value))) {
    return '郵便番号 は整数の必要です。';
  }
  if (Number(value) <= 0) {
    return '正数を入力してください。';
  }
  return null;
}

export function validatePrice(value) {
  if (value === '' || value == null) {
    return '正数を入力してください。';
  }
  if (!/^\d+$/.test(String(value))) {
    return 'プラン価格 は整数の必要です。';
  }
  if (Number(value) <= 0) {
    return '正数を入力してください。';
  }
  return null;
}

export function validatePhoneNumber(value) {
  const phoneRe = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/g;
  if (value === '' || value == null) {
    return '電話番号は、必ず指定してください。';
  }
  if (phoneRe.test(value) === false || parseInt(Number(value), 10) !== Number(value)) {
    return '電話番号の形式で入力してください。';
  }
  return null;
}

export function validateStartDate(date) {
  if (!date) {
    return '開始日を入力してください。';
  }
  return null;
}

export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return null;
  }

  const startStr =
    startDate instanceof Date
      ? startDate.toISOString().slice(0, 10)
      : String(startDate).slice(0, 10);
  const endStr =
    endDate instanceof Date ? endDate.toISOString().slice(0, 10) : String(endDate).slice(0, 10);

  const start = parseInt(startStr.replaceAll('-', ''), 10);
  const end = parseInt(endStr.replaceAll('-', ''), 10);

  if (start > end) {
    return '終了日を開始日の前に設定することはできません';
  }
  return null;
}

export function isKatakanaValid(value) {
  if (!value) return false;
  const bytes = encodeURI(value).split(/%..|./).length - 1;
  return bytes === value.length * 3;
}

export function isValidImageFile(file) {
  return Boolean(file && (file.type === 'image/png' || file.type === 'image/jpeg'));
}

export function mergeFieldErrors(...errorMaps) {
  return Object.assign({}, ...errorMaps.filter(Boolean));
}

export function collectFieldErrors(entries) {
  return entries.reduce((errors, [key, message]) => {
    if (message) {
      errors[key] = message;
    }
    return errors;
  }, {});
}
