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

const transformLeafString = async (value, config) => {
  if (value == null) return value;
  if (typeof value !== 'string' && typeof value !== 'number') {
    return value;
  }
  const asString = String(value);
  if (!asString) {
    return value;
  }
  if (config.mode === PARAM_SECURITY_MODES.ENCRYPT) {
    return encryptValue(asString, config.key);
  }
  if (config.mode === PARAM_SECURITY_MODES.HASH) {
    return hashValue(asString, config.salt);
  }
  return value;
};

/** When mode is on, encrypt/hash every user-input `value` leaf (all parameters). */
const transformValueLeaves = async (node, config) => {
  if (Array.isArray(node)) {
    const items = [];
    for (let i = 0; i < node.length; i += 1) {
      items.push(await transformValueLeaves(node[i], config));
    }
    return items;
  }
  if (node && typeof node === 'object') {
    const result = {};
    const keys = Object.keys(node);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const child = node[key];
      if (
        key === 'value'
        && (typeof child === 'string' || typeof child === 'number')
      ) {
        result[key] = await transformLeafString(child, config);
      } else {
        result[key] = await transformValueLeaves(child, config);
      }
    }
    return result;
  }
  return node;
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
    nextContents.push(await transformValueLeaves(contents[i], security));
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
