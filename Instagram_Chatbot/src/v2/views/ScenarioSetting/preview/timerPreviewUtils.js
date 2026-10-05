import {
  TIMER_MAP_VARIABLES_FIELD,
  TIMER_TYPES,
} from 'v2/views/Preview/PreviewComponent/Constants';

export const getTimerConfigVariable = (configVariables) => {
  const variables = Object.values(configVariables || {})
    .reduce(
      (acc, key) => (!TIMER_MAP_VARIABLES_FIELD[key]
        ? acc
        : [...acc, { ...TIMER_MAP_VARIABLES_FIELD[key], name: key }]),
      [],
    );

  return variables;
};

export const calculateTimerConfigDuration = (type, duration, options = {}) => {
  const { timerLeft = 0, useTimerLeft = false } = options;

  if (!duration || !type) return 0;

  const durationConfig = duration[type];
  if (!durationConfig) {
    return 0;
  }

  switch (type) {
    case TIMER_TYPES.COUNTING_DOWN: {
      if (useTimerLeft) {
        return timerLeft;
      }

      const { hour = 0, minute = 0, second = 0 } = duration[type];
      return (hour * 60 + minute) * 60 + second;
    }

    default: {
      return 0;
    }
  }
};
