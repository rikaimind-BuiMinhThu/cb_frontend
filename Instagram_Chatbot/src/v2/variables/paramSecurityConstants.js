export const PARAM_SECURITY_MODES = {
  NONE: 'none',
  HASH: 'hash',
  ENCRYPT: 'encrypt',
};

export const PARAM_SECURITY_ALGORITHMS = {
  BCRYPT: 'bcrypt',
  AES_256_GCM: 'aes-256-gcm',
};

export const DEFAULT_PARAM_SECURITY = {
  mode: PARAM_SECURITY_MODES.NONE,
  algorithm: null,
  params: [],
  key: null,
  salt: null,
};

export const PARAM_SECURITY_MIN_KEY_LENGTH = 8;
export const PARAM_SECURITY_CIPHER_PREFIX = 'aes256gcm:v1:';
