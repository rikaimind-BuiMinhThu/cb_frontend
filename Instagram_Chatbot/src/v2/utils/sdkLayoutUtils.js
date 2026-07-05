export const toLayoutNumber = (value, defaultValue) => {
  if (value == null || value === '') {
    return defaultValue;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

export const computeClosedContentSize = ({
  isMobile,
  position,
  buttonType,
  useFullWidthMobile = false,
}) => {
  const positionValue = toLayoutNumber(position, 1);
  const buttonTypeValue = toLayoutNumber(buttonType, 1);

  if (isMobile) {
    if (positionValue === 2) {
      return { width: 420, height: 300 };
    }
    if (positionValue === 1 && buttonTypeValue === 2) {
      return { width: 56, height: 56 };
    }
    if (positionValue === 1 && buttonTypeValue === 1) {
      if (useFullWidthMobile) {
        return { width: '100%', height: 75 };
      }
      return { width: 240, height: 48 };
    }
    return { width: 56, height: 56 };
  }

  if (positionValue === 2) {
    return { width: 420, height: 300 };
  }
  if (positionValue === 1 && buttonTypeValue === 2) {
    return { width: 56, height: 56 };
  }
  if (positionValue === 1 && buttonTypeValue === 1) {
    return { width: 360, height: 66 };
  }
  return { width: 56, height: 56 };
};

export const computeOpenIframeSize = ({
  isMobile,
  widthPc,
  heightPc,
  widthSp,
  heightSp,
}) => {
  if (isMobile) {
    const widthValue = toLayoutNumber(widthSp, 100);
    const heightValue = toLayoutNumber(heightSp, 100);
    return {
      width: widthValue >= 100 ? '100%' : `${widthValue}%`,
      height: heightValue >= 100 ? '100%' : `${heightValue}%`,
    };
  }

  return {
    width: toLayoutNumber(widthPc, 450),
    height: toLayoutNumber(heightPc, 700),
  };
};

export const buildSdkPostMessageLayout = (state, isMobile) => {
  const position = isMobile ? state.positionSp : state.positionPc;
  const buttonType = isMobile ? state.buttonTypeSp : state.buttonTypePc;
  const closedContentSize = computeClosedContentSize({
    isMobile,
    position,
    buttonType,
    useFullWidthMobile: !!state.useFullWidthChatbotMobile,
  });

  return {
    positionPc: state.positionPc,
    positionSp: state.positionSp,
    buttonTypePc: state.buttonTypePc,
    buttonTypeSp: state.buttonTypeSp,
    closedContentWidth: closedContentSize.width,
    closedContentHeight: closedContentSize.height,
  };
};

export const parseClosedDimension = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  if (typeof value === 'string' && value.endsWith('%')) {
    return value;
  }
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getClosedIframeDimensions = ({
  closedContentWidth,
  closedContentHeight,
  isMobile,
  useFullWidthMobile,
}) => {
  const hasCustomWidth = closedContentWidth !== undefined && closedContentWidth !== null && closedContentWidth !== '';
  const hasCustomHeight = closedContentHeight !== undefined && closedContentHeight !== null && closedContentHeight !== '';

  if (hasCustomWidth && hasCustomHeight) {
    return {
      width: closedContentWidth,
      height: closedContentHeight,
    };
  }

  if (isMobile) {
    if (useFullWidthMobile) {
      return { width: '100%', height: 85 };
    }
    return { width: 250, height: 58 };
  }

  return { width: 400, height: 85 };
};

export const getHorizontalOffsetPx = (rule) => {
  if (!rule) return 0;
  if (rule.mode === 'left') return rule.leftPx || 0;
  return rule.rightPx || 0;
};

export const formatClosedIframeSize = (contentDimensions, horizontalRule, bottomPx = 0) => {
  if (typeof contentDimensions.width === 'string') {
    return {
      width: contentDimensions.width,
      height: typeof contentDimensions.height === 'number'
        ? `${contentDimensions.height}px`
        : contentDimensions.height,
    };
  }

  const horizontalOffset = getHorizontalOffsetPx(horizontalRule);
  return {
    width: `${horizontalOffset + contentDimensions.width}px`,
    height: `${bottomPx + contentDimensions.height}px`,
  };
};

export const getClosedBarWidth = (state, isMobile) => {
  if (isMobile) {
    if (state?.useFullWidthChatbotMobile) {
      return state?.urlReceive ? 'calc(100% - 30px)' : 'calc(100vw - 30px)';
    }
    return '240px';
  }
  return '360px';
};

export const getClosedLauncherPosition = (state, options = {}) => {
  const isEmbedded = Boolean(state?.urlReceive);
  const { variant = 'default', isMobile = false } = options;

  if (variant === 'vertical') {
    if (isEmbedded) {
      if (isMobile) {
        return {
          bottom: '0px',
          right: '-120px',
          left: 'auto',
        };
      }
      const widthPc = toLayoutNumber(state?.widthPc, 450);
      return {
        bottom: `${widthPc / 2}px`,
        right: '-120px',
        left: 'auto',
      };
    }

    if (isMobile) {
      const widthSp = toLayoutNumber(state?.widthSp, 100);
      const bottomMargin = toLayoutNumber(state?.bottomMarginSp, 0);
      return {
        bottom: bottomMargin
          ? `${bottomMargin + widthSp / 2}px`
          : '20px',
        right: '-120px',
        left: 'auto',
      };
    }

    const widthPc = toLayoutNumber(state?.widthPc, 450);
    const bottomMargin = toLayoutNumber(state?.bottomMarginPc, 0);
    return {
      bottom: bottomMargin
        ? `${bottomMargin + widthPc / 2}px`
        : '20px',
      right: '-120px',
      left: 'auto',
    };
  }

  if (isEmbedded) {
    if (isMobile && state?.useFullWidthChatbotMobile) {
      return { bottom: '0px', left: '15px', right: 'auto' };
    }
    return { bottom: '0px', right: '0px', left: 'auto' };
  }

  if (isMobile) {
    if (state?.useFullWidthChatbotMobile) {
      return {
        bottom: state?.bottomMarginSp ? `${state.bottomMarginSp}px` : '10px',
        right: '15px',
        left: 'auto',
      };
    }
    return {
      bottom: state?.bottomMarginSp ? `${state.bottomMarginSp}px` : '10px',
      right: state?.rightMarginSp ? `${state.rightMarginSp}px` : '10px',
      left: 'auto',
    };
  }

  return {
    bottom: state?.bottomMarginPc ? `${state.bottomMarginPc}px` : '10px',
    right: state?.rightMarginPc ? `${state.rightMarginPc}px` : '0px',
    left: 'auto',
  };
};

export const formatOpenIframeSize = ({
  openDimensions,
  horizontalRule,
  bottomPx = 0,
  isMobile,
}) => {
  if (isMobile) {
    return {
      width: openDimensions.width,
      height: openDimensions.height,
    };
  }

  const horizontalOffset = getHorizontalOffsetPx(horizontalRule);
  return {
    width: `${horizontalOffset + openDimensions.width}px`,
    height: `${bottomPx + openDimensions.height}px`,
  };
};
