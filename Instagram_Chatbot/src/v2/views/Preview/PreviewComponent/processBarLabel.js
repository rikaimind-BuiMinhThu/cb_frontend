import {
  PROCESS_BAR_COMPLETE_TEXT,
  formatProcessBarFractionText,
  formatProcessBarRemainingText,
} from './Constants';

export const PROCESS_BAR_LABEL_TYPE_TEXT = 'text';
export const PROCESS_BAR_LABEL_TYPE_HTML = 'html';

export const isProgressBarComplete = (current, maxIndex) => (
  maxIndex > 0 && current >= maxIndex
);

export const resolveProgressBarCompletedHtml = (themeSettings) => {
  const raw = themeSettings?.progressBarCompletedHtml
    || themeSettings?.progress_bar_completed_html
    || '';
  return String(raw).trim();
};

export const resolveProgressBarLabel = ({
  current,
  maxIndex,
  isFractionMode,
  completedHtml,
}) => {
  const isComplete = isProgressBarComplete(current, maxIndex);

  if (isComplete && completedHtml) {
    return {
      type: PROCESS_BAR_LABEL_TYPE_HTML,
      value: completedHtml,
    };
  }

  if (isFractionMode) {
    if (!maxIndex) {
      return {
        type: PROCESS_BAR_LABEL_TYPE_TEXT,
        value: formatProcessBarFractionText(0, 0),
      };
    }
    const fractionStep = current >= maxIndex ? maxIndex : Math.max(current, 1);
    return {
      type: PROCESS_BAR_LABEL_TYPE_TEXT,
      value: formatProcessBarFractionText(fractionStep, maxIndex),
    };
  }

  if (isComplete) {
    return {
      type: PROCESS_BAR_LABEL_TYPE_TEXT,
      value: PROCESS_BAR_COMPLETE_TEXT,
    };
  }

  if (current > 0) {
    return {
      type: PROCESS_BAR_LABEL_TYPE_TEXT,
      value: formatProcessBarRemainingText(maxIndex - current),
    };
  }

  return {
    type: PROCESS_BAR_LABEL_TYPE_TEXT,
    value: formatProcessBarRemainingText(maxIndex),
  };
};
