export const isBlissLp = (url) => {
  const domains = [
    'skull-shaver.jp',
  ];

  return domains.some((domain) => url.includes(domain));
};

export const isRoseMayLp = (url) => {
  const domains = [
    'rosemay.net',
    'rosemay.jp',
  ];

  return domains.some((domain) => url.includes(domain));
};

export const isPhystechLp = (url) => {
  const domains = [
    'livseed.jp',
  ];

  return domains.some((domain) => url.includes(domain));
};

export const isTorizenLP = (url) => {
  const torizenDomains = [
    'hana.inuneko-sukoyaka.jp',
    'sb.inuneko-sukoyaka.jp',
  ];

  return torizenDomains.some((domain) => url.includes(domain));
};

export const isYuwaeruLP = (url) => {
  const domains = [
    'store.nekase-genmai.com',
  ];

  return domains.some((domain) => url.includes(domain));
};
