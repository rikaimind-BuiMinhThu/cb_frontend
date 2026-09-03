const DESIGN_TYPE_POP = 'pop';
const DESIGN_TYPE_FLAT = 'flat';
const DESIGN_TYPE_MATERIAL = 'material';
const DESIGN_TYPE_DEFAULT = DESIGN_TYPE_FLAT;
const DESIGN_TYPE_CLASS_PREFIX = 'design-type-';

const DESIGN_TYPE_CHROME = {
  [DESIGN_TYPE_FLAT]: {
    windowRadius: '5px',
    headerRadius: '5px',
    windowShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    bubbleRadius: '16px',
    launcherRadius: '25px',
    launcherShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  [DESIGN_TYPE_POP]: {
    windowRadius: '18px',
    headerRadius: '18px',
    windowShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
    bubbleRadius: '24px',
    launcherRadius: '28px',
    launcherShadow: '0 8px 20px rgba(0, 0, 0, 0.16)',
  },
  [DESIGN_TYPE_MATERIAL]: {
    windowRadius: '12px',
    headerRadius: '12px',
    windowShadow: '0 2px 4px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.12)',
    bubbleRadius: '12px',
    launcherRadius: '16px',
    launcherShadow: '0 2px 4px rgba(0, 0, 0, 0.14), 0 4px 10px rgba(0, 0, 0, 0.12)',
  },
};

export const normalizeDesignType = (designType) => {
  if (designType === DESIGN_TYPE_POP || designType === DESIGN_TYPE_MATERIAL) {
    return designType;
  }
  if (designType === DESIGN_TYPE_FLAT) {
    return DESIGN_TYPE_FLAT;
  }
  return DESIGN_TYPE_DEFAULT;
};

export const getDesignTypeClassName = (designType) => (
  `${DESIGN_TYPE_CLASS_PREFIX}${normalizeDesignType(designType)}`
);

export const getDesignTypeChromeVars = (designType) => {
  const chrome = DESIGN_TYPE_CHROME[normalizeDesignType(designType)];
  return {
    '--dt-window-radius': chrome.windowRadius,
    '--dt-header-radius': chrome.headerRadius,
    '--dt-window-shadow': chrome.windowShadow,
    '--dt-bubble-radius': chrome.bubbleRadius,
    '--dt-launcher-radius': chrome.launcherRadius,
    '--dt-launcher-shadow': chrome.launcherShadow,
  };
};

const toScopeIs = (scopeSelector) => {
  const roots = scopeSelector.split(',').map((part) => part.trim()).filter(Boolean);
  if (roots.length <= 1) {
    return roots[0] || '';
  }
  return `:is(${roots.join(', ')})`;
};

const scoped = (scopeSelector, suffix) => {
  if (!scopeSelector) {
    return suffix;
  }
  return `${toScopeIs(scopeSelector)} ${suffix}`;
};

const formatChromeDeclarations = (chromeVars) => (
  Object.entries(chromeVars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')
);

const buildChromeVariablesBlock = (scopeSelector, designTypeClass, chromeVars) => {
  const declarations = formatChromeDeclarations(chromeVars);
  const liveRoots = '#sp-container1, .sp-container1, #sp-container, .sp-container';
  const typeSelector = `.${designTypeClass}`;
  const root = scopeSelector
    ? `${scopeSelector},\n${typeSelector}`
    : `${liveRoots},\n${typeSelector}`;
  return `${root} {\n${declarations}\n}`;
};

export const buildDesignTypeChromeCss = (designType, scopeSelector = '') => {
  const normalizedType = normalizeDesignType(designType);
  const designTypeClass = getDesignTypeClassName(normalizedType);
  const chromeVars = getDesignTypeChromeVars(normalizedType);
  const variablesBlock = buildChromeVariablesBlock(
    scopeSelector,
    designTypeClass,
    chromeVars,
  );
  const windowSelector = scopeSelector
    ? toScopeIs(scopeSelector)
    : '#sp-container1, .sp-container1, #sp-container, .sp-container';
  const headerSelector = scoped(scopeSelector, '.sp-header');
  const bodySelector = scoped(scopeSelector, '.sp-body');
  const botBubbleSelector = [
    scoped(scopeSelector, '.ss-bot-message__content-wrapper'),
    scoped(scopeSelector, '.ss-bot-message .ss-bot-message__content'),
    scoped(scopeSelector, '.ss-bot-chat-detail-content'),
    scoped(scopeSelector, '.ss-bot-chat-text-input.ss-bot-chat-detail-content'),
  ].join(',\n');
  const userBubbleSelector = [
    scoped(scopeSelector, '.sp-body-user-side-messages'),
    scoped(scopeSelector, '.sp-body-user-side-messages > .ss-user-message__content-wrapper'),
    scoped(scopeSelector, '.ss-user-message__content-wrapper'),
  ].join(',\n');
  const launcherSelector = [
    `.preview-closed-launcher.${designTypeClass}`,
    `.preview-closed-launcher.${designTypeClass} .preview-closed-launcher__icon-img`,
  ].join(',\n');

  return `${variablesBlock}

${windowSelector} {
  border-top-left-radius: var(--dt-window-radius) !important;
  border-top-right-radius: var(--dt-window-radius) !important;
  box-shadow: var(--dt-window-shadow) !important;
}

${headerSelector} {
  border-top-left-radius: var(--dt-header-radius) !important;
  border-top-right-radius: var(--dt-header-radius) !important;
}

${bodySelector} {
  border-bottom-left-radius: var(--dt-window-radius) !important;
  border-bottom-right-radius: var(--dt-window-radius) !important;
}

${botBubbleSelector} {
  border-radius: var(--dt-bubble-radius) !important;
}

${userBubbleSelector} {
  border-radius: var(--dt-bubble-radius) !important;
}

.${designTypeClass}.preview-closed-launcher {
  border-radius: var(--dt-launcher-radius) !important;
  box-shadow: var(--dt-launcher-shadow) !important;
}

${launcherSelector} {
  border-radius: var(--dt-launcher-radius) !important;
}`.trim();
};
