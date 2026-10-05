export const EMPTY_ERROR = '';
export const DEFAULT_MAX_LENGTH = 50;
export const TEL_MAX_LENGTH = 12;
export const IMAGE_MAX_WIDTH = 800;
export const IMAGE_MAX_HEIGHT = 800;

export const EMAIL_REGEX = /^[a-zA-Z0-9]+[a-zA-Z0-9]+([._+-])*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
export const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
export const IMAGE_EXTENSION_PATTERN = /\.(jpg|jpeg|png)$/i;

const REQUIRED_ERROR_SUFFIX = 'は、必ず指定してください。';
const INVALID_EMAIL_ERROR_SUFFIX = '項目は正しくありません。';
const INVALID_URL_ERROR_SUFFIX = 'フォーマとは正しくありません。';
const MAX_LENGTH_ERROR_PREFIX = 'を';
const MAX_LENGTH_ERROR_SUFFIX = '文字以下入力してください。';
const IMAGE_SIZE_ERROR_PREFIX = '画像サイズが';
const IMAGE_SIZE_ERROR_MID = 'ピクセルを超えています。現在のサイズ：';
const IMAGE_SIZE_ERROR_SUFFIX = 'ピクセル';

const requiredError = (label) => `${label}${REQUIRED_ERROR_SUFFIX}`;
const invalidEmailError = (label) => `${label}${INVALID_EMAIL_ERROR_SUFFIX}`;
const invalidUrlError = (label) => `${label}${INVALID_URL_ERROR_SUFFIX}`;
const maxLengthError = (label, length) => `${label}${MAX_LENGTH_ERROR_PREFIX}${length}${MAX_LENGTH_ERROR_SUFFIX}`;

export const IMAGE_FORMAT_ERROR = '画像URLはjpg、jpeg、png形式のみ対応しています';
export const IMAGE_INVALID_URL_ERROR = '画像URLが無効です';

const imageSizeError = (maxWidth, maxHeight, width, height) => (
  `${IMAGE_SIZE_ERROR_PREFIX}${maxWidth}x${maxHeight}${IMAGE_SIZE_ERROR_MID}${width}x${height}${IMAGE_SIZE_ERROR_SUFFIX}`
);

export const getRequiredError = (value, label) => (
  value === '' ? requiredError(label) : EMPTY_ERROR
);

export const getMaxLengthError = (value, label, length) => (
  value.length > length && value !== '' ? maxLengthError(label, length) : EMPTY_ERROR
);

export const getEmailError = (value, label) => (
  value !== '' && !EMAIL_REGEX.test(value) ? invalidEmailError(label) : EMPTY_ERROR
);

export const getEmailRequiredError = (value, label) => (
  getRequiredError(value, label) || getEmailError(value, label)
);

export const getInputError = (value, label, length = DEFAULT_MAX_LENGTH) => (
  getRequiredError(value, label) || getMaxLengthError(value, label, length)
);

export const getTelError = (value, label) => getInputError(value, label, TEL_MAX_LENGTH);

export const getUrlError = (value, label) => (
  value !== '' && !URL_REGEX.test(value) ? invalidUrlError(label) : EMPTY_ERROR
);

export const validateImageURLWithDimension = (url, options = {}) => {
  const maxWidth = options.maxWidth ?? IMAGE_MAX_WIDTH;
  const maxHeight = options.maxHeight ?? IMAGE_MAX_HEIGHT;
  const callback = options.callback ?? (() => {});

  if (!IMAGE_EXTENSION_PATTERN.test(url)) {
    callback({ valid: false, message: IMAGE_FORMAT_ERROR });
    return;
  }

  const img = new Image();
  img.onload = () => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    if (width > maxWidth || height > maxHeight) {
      callback({ valid: false, message: imageSizeError(maxWidth, maxHeight, width, height) });
      return;
    }
    callback({ valid: true });
  };
  img.onerror = () => {
    callback({ valid: false, message: IMAGE_INVALID_URL_ERROR });
  };
  img.src = url;
};
