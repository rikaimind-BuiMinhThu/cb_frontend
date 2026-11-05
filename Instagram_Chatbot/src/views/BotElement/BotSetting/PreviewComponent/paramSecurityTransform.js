import bcrypt from 'bcryptjs';
import {
  DEFAULT_PARAM_SECURITY,
  PARAM_SECURITY_MODES,
  parseParamSecurityFromApi,
} from '../ScenarioSetting/utils/paramSecurityUtils';

const PARAM_SECURITY_CIPHER_PREFIX = 'aes256gcm:v1:';

const BCRYPT_COST = 12;
let cachedParamSecurity = { ...DEFAULT_PARAM_SECURITY, params: [] };

export const setCachedParamSecurity = (raw) => {
  cachedParamSecurity = parseParamSecurityFromApi(raw);
};

export const getCachedParamSecurity = () => cachedParamSecurity;

const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null;

const toBase64 = (bytes) => {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const fromBase64 = (value) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const deriveKeyBytes = async (keyString) => {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(String(keyString)));
  return new Uint8Array(digest);
};

export const encryptValue = async (plaintext, keyString) => {
  const keyBytes = await deriveKeyBytes(keyString);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['encrypt']);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    textEncoder.encode(String(plaintext)),
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  return `${PARAM_SECURITY_CIPHER_PREFIX}${toBase64(combined)}`;
};

export const decryptValue = async (ciphertext, keyString) => {
  if (!String(ciphertext || '').startsWith(PARAM_SECURITY_CIPHER_PREFIX)) {
    return ciphertext;
  }
  const blob = fromBase64(String(ciphertext).slice(PARAM_SECURITY_CIPHER_PREFIX.length));
  if (blob.length < 12 + 16 + 1) {
    throw new Error('param_security_invalid_format');
  }
  const iv = blob.slice(0, 12);
  const data = blob.slice(12);
  const keyBytes = await deriveKeyBytes(keyString);
  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    data,
  );
  return textDecoder.decode(decrypted);
};

export const hashValue = (plaintext, salt) => {
  const peppered = salt ? `${salt}${plaintext}` : String(plaintext);
  return bcrypt.hashSync(peppered, BCRYPT_COST);
};

const SAVE_INPUT_TO_PARAM = {
  password: 'password',
  user_email: 'user_email',
  email: 'user_email',
  phone_number: 'phone_number',
  phone: 'phone_number',
  user_name: 'user_name',
  pin_code: 'pin_code',
  user_password: 'user_password',
};

const resolveParamName = (content) => {
  if (!content || typeof content !== 'object') return null;
  if (content.type === 'text_input' || content.text_input) {
    const textInput = content.text_input || content;
    const saveInput = textInput.save_input_content;
    if (SAVE_INPUT_TO_PARAM[saveInput]) return SAVE_INPUT_TO_PARAM[saveInput];
    if (textInput.type === 'password' || textInput.type === 'password_confirmation') {
      return 'password';
    }
  }
  if (content.type === 'card_payment_radio_button' || content.card_payment_radio_button) {
    const card = content.card_payment_radio_button || content;
    const selection = card.initial_selection;
    if (selection === 'credit_card') return 'credit_card_payment';
    if (selection === 'paypal') return 'paypal_payment';
    if (selection === 'komoju') return 'komoju_payment';
    if (selection === 'paidy') return 'paidy_payment';
  }
  if (content.type === 'credit_card_payment') return 'credit_card_payment';
  if (content.type === 'contact_form') return 'contact_form';
  if (content.type === 'zip_code_address') return 'zip_code_address';
  return null;
};

const transformLeafString = async (value, config) => {
  if (value == null) return value;
  if (typeof value !== 'string' && typeof value !== 'number') {
    return value;
  }
  const asString = String(value);
  if (config.mode === PARAM_SECURITY_MODES.ENCRYPT) {
    return encryptValue(asString, config.key);
  }
  if (config.mode === PARAM_SECURITY_MODES.HASH) {
    return hashValue(asString, config.salt);
  }
  return value;
};

const transformContentItem = async (content, config) => {
  const paramName = resolveParamName(content);
  if (!paramName || !(config.params || []).includes(paramName)) {
    return content;
  }

  const next = { ...content };

  if (paramName === 'password' && next.text_input) {
    const textInput = { ...next.text_input };
    if (textInput.password_confirmation?.value != null) {
      textInput.password_confirmation = {
        ...textInput.password_confirmation,
        value: await transformLeafString(textInput.password_confirmation.value, config),
      };
    }
    if (textInput.password?.value != null) {
      textInput.password = {
        ...textInput.password,
        value: await transformLeafString(textInput.password.value, config),
      };
    }
    next.text_input = textInput;
    return next;
  }

  if ((paramName === 'user_email' || paramName === 'phone_number' || paramName === 'user_name' || paramName === 'pin_code') && next.text_input) {
    const textInput = { ...next.text_input };
    const typeKey = textInput.type;
    if (typeKey && textInput[typeKey]?.value != null) {
      textInput[typeKey] = {
        ...textInput[typeKey],
        value: await transformLeafString(textInput[typeKey].value, config),
      };
    }
    if (textInput.email_address?.value != null) {
      textInput.email_address = {
        ...textInput.email_address,
        value: await transformLeafString(textInput.email_address.value, config),
      };
    }
    if (textInput.phone_number?.value != null) {
      textInput.phone_number = {
        ...textInput.phone_number,
        value: await transformLeafString(textInput.phone_number.value, config),
      };
    }
    if (textInput.text?.value != null) {
      textInput.text = {
        ...textInput.text,
        value: await transformLeafString(textInput.text.value, config),
      };
    }
    next.text_input = textInput;
    return next;
  }

  const transformObjectLeaves = async (value) => {
    if (Array.isArray(value)) {
      const items = [];
      for (let i = 0; i < value.length; i += 1) {
        items.push(await transformObjectLeaves(value[i]));
      }
      return items;
    }
    if (value && typeof value === 'object') {
      const result = {};
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i += 1) {
        result[keys[i]] = await transformObjectLeaves(value[keys[i]]);
      }
      return result;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return transformLeafString(value, config);
    }
    return value;
  };

  if (paramName === 'credit_card_payment' || paramName === 'komoju_payment' || paramName === 'paypal_payment') {
    const key = next.card_payment_radio_button ? 'card_payment_radio_button' : 'credit_card_payment';
    if (next[key] && typeof next[key] === 'object') {
      next[key] = await transformObjectLeaves(next[key]);
    }
    return next;
  }

  if (paramName === 'contact_form' && next.contact_form && typeof next.contact_form === 'object') {
    next.contact_form = await transformObjectLeaves(next.contact_form);
    return next;
  }

  if (paramName === 'zip_code_address' && next.zip_code_address && typeof next.zip_code_address === 'object') {
    next.zip_code_address = await transformObjectLeaves(next.zip_code_address);
    return next;
  }

  return next;
};

export const transformOutboundUserResponse = async (data, config = cachedParamSecurity) => {
  const security = parseParamSecurityFromApi(config);
  if (!security || security.mode === PARAM_SECURITY_MODES.NONE) {
    return data;
  }
  if (!data?.message?.message_content) {
    return data;
  }

  const contents = data.message.message_content;
  const nextContents = [];
  for (let i = 0; i < contents.length; i += 1) {
    nextContents.push(await transformContentItem(contents[i], security));
  }

  return {
    ...data,
    message: {
      ...data.message,
      message_content: nextContents,
    },
  };
};

export const decryptTreeStrings = async (node, keyString) => {
  if (Array.isArray(node)) {
    const next = [];
    for (let i = 0; i < node.length; i += 1) {
      next.push(await decryptTreeStrings(node[i], keyString));
    }
    return next;
  }
  if (node && typeof node === 'object') {
    const next = {};
    const keys = Object.keys(node);
    for (let i = 0; i < keys.length; i += 1) {
      next[keys[i]] = await decryptTreeStrings(node[keys[i]], keyString);
    }
    return next;
  }
  if (typeof node === 'string' && node.startsWith(PARAM_SECURITY_CIPHER_PREFIX)) {
    return decryptValue(node, keyString);
  }
  return node;
};
