import { VALIDATION_MESSAGES } from '../constants';

export function validateRequiredName(value, fieldLabel = '名前') {
  if (!value || !String(value).trim()) {
    return VALIDATION_MESSAGES.REQUIRED_NAME(fieldLabel);
  }
  return '';
}

export function validateImageFile(file) {
  if (!file) return VALIDATION_MESSAGES.IMAGE_REQUIRED;
  const name = file.name.toLowerCase();
  const valid =
    name.includes('img') ||
    name.includes('png') ||
    name.includes('jpeg') ||
    name.includes('jpg') ||
    name.includes('gif');
  return valid ? '' : VALIDATION_MESSAGES.IMAGE_INVALID;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
