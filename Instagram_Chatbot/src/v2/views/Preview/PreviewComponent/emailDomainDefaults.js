const DEFAULT_EMAIL_DOMAIN_LIST = [
  'gmail.com',
  'yahoo.co.jp',
  'yahoo.com',
  'icloud.com',
  'outlook.com',
  'hotmail.com',
  'live.jp',
  'docomo.ne.jp',
  'au.com',
  'softbank.ne.jp',
  'i.softbank.jp',
  'ezweb.ne.jp',
  'nifty.com',
  'mineo.jp',
  'proton.me',
];

export const EMAIL_DOMAIN_SUGGESTION_MODES = {
  SUGGEST: 'suggest',
  RESTRICT: 'restrict',
};

export const createDefaultDomainList = () =>
  DEFAULT_EMAIL_DOMAIN_LIST.map((domain, index) => ({
    id: index + 1,
    domain,
  }));

export const createDefaultDomainSuggestion = () => ({
  enabled: true,
  mode: EMAIL_DOMAIN_SUGGESTION_MODES.SUGGEST,
  domains: createDefaultDomainList(),
});

export const getEffectiveDomains = (domainSuggestion) => {
  if (!domainSuggestion?.enabled) return [];
  const domains = domainSuggestion?.domains;
  if (Array.isArray(domains) && domains.length > 0) {
    return domains.filter((item) => item?.domain?.trim());
  }
  return createDefaultDomainList();
};

export const normalizeEmailAt = (value = '') => value.replace(/＠/g, '@');

export const getEmailLocalAndDomainParts = (value = '') => {
  const normalized = normalizeEmailAt(value);
  const atIndex = normalized.lastIndexOf('@');
  if (atIndex === -1) {
    return { localPart: normalized, domainPart: '', hasAt: false };
  }
  return {
    localPart: normalized.slice(0, atIndex),
    domainPart: normalized.slice(atIndex + 1),
    hasAt: true,
  };
};

export const getEmailDomain = (value = '') => {
  const { domainPart, hasAt } = getEmailLocalAndDomainParts(value);
  if (!hasAt || !domainPart) return null;
  return domainPart.toLowerCase();
};

export const filterDomainSuggestions = (value, domainSuggestion) => {
  const { domainPart, hasAt } = getEmailLocalAndDomainParts(value);
  if (!hasAt) return [];

  const domains = getEffectiveDomains(domainSuggestion);
  const query = domainPart.toLowerCase();
  return domains.filter((item) =>
    item.domain.toLowerCase().startsWith(query)
  );
};

export const isEmailDomainAllowed = (value, domainSuggestion) => {
  const allowedDomains = getEffectiveDomains(domainSuggestion).map((item) =>
    item.domain.toLowerCase()
  );
  const emailDomain = getEmailDomain(value);
  return Boolean(emailDomain && allowedDomains.includes(emailDomain));
};

export const buildEmailWithDomain = (localPart, domain) =>
  `${localPart}@${domain}`;

export { DEFAULT_EMAIL_DOMAIN_LIST };
