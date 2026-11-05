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

export const parseParamSecurityFromApi = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_PARAM_SECURITY, params: [] };
  }

  const mode = Object.values(PARAM_SECURITY_MODES).includes(raw.mode)
    ? raw.mode
    : PARAM_SECURITY_MODES.NONE;
  const params = Array.isArray(raw.params)
    ? raw.params.map(String).filter(Boolean)
    : [];

  let algorithm = null;
  if (mode === PARAM_SECURITY_MODES.HASH) {
    algorithm = PARAM_SECURITY_ALGORITHMS.BCRYPT;
  } else if (mode === PARAM_SECURITY_MODES.ENCRYPT) {
    algorithm = PARAM_SECURITY_ALGORITHMS.AES_256_GCM;
  }

  return {
    mode,
    algorithm,
    params,
    key: raw.key ? String(raw.key) : null,
    salt: raw.salt ? String(raw.salt) : null,
  };
};

export const algorithmForMode = (mode) => {
  if (mode === PARAM_SECURITY_MODES.HASH) {
    return PARAM_SECURITY_ALGORITHMS.BCRYPT;
  }
  if (mode === PARAM_SECURITY_MODES.ENCRYPT) {
    return PARAM_SECURITY_ALGORITHMS.AES_256_GCM;
  }
  return null;
};

export const normalizeParamSecurity = (current) => {
  const parsed = parseParamSecurityFromApi(current);
  if (parsed.mode === PARAM_SECURITY_MODES.NONE) {
    return {
      ...DEFAULT_PARAM_SECURITY,
      params: [],
    };
  }
  return parsed;
};

export const validateParamSecurity = (config) => {
  const normalized = normalizeParamSecurity(config);
  if (normalized.mode === PARAM_SECURITY_MODES.NONE) {
    return { valid: true, message: '' };
  }
  if (
    normalized.mode === PARAM_SECURITY_MODES.ENCRYPT
    && (!normalized.key || normalized.key.length < PARAM_SECURITY_MIN_KEY_LENGTH)
  ) {
    return { valid: false, message: 'keyRequired' };
  }
  return { valid: true, message: '' };
};
