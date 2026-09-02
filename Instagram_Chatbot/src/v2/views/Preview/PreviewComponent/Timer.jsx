import { useEffect, useState } from 'react';
import 'v2/views/Preview/styles/timer.css';
import { TIMER_MAP_VARIABLE_METHOD, TIMER_COUNTING_DELAY } from './Constants';

const INVALID_HTML_MESSAGE = 'Invalid HTML';
const TIMER_START_STORAGE_PREFIX = 'timer_start_time';
const MIDNIGHT_HOUR = 0;
const MIDNIGHT_MINUTE = 0;
const MIDNIGHT_SECOND = 0;
const MIDNIGHT_MILLISECOND = 0;
const TIMER_ROUND_PRECISION = 1000;

const initialState = {
  duration: 0,
  messages: {
    finish: {
      content: '',
      useHtml: false,
      isShow: false,
    },
    counting: {
      content: '',
      useHtml: false,
      isShow: false,
    },
  },
  variables: [],
};

export const TIMER_COMPONENT_STATUS = {
  PAUSE: 0,
  COUNTING: 1,
  FINISH: 2,
};

const Timer = ({
  duration = initialState.duration,
  timeLeft = 0,
  countMsg = initialState.messages.counting,
  finishMsg = initialState.messages.finish,
  variables = initialState.variables,
  startCount = false,
  isRealtimeRemainingTime = false,
  scenarioId = '',
  onCounting = () => {},
}) => {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(TIMER_COMPONENT_STATUS.PAUSE);
  const [timer, setTimer] = useState(-1);

  const checkHtmlMessage = (rawHtml) => {
    const temp = document.createElement('div');
    try {
      temp.innerHTML = rawHtml;
      return rawHtml;
    } catch (err) {
      return INVALID_HTML_MESSAGE;
    } finally {
      temp.remove();
    }
  };

  const checkTextMessage = (rawText) => rawText;

  const checkTimerMessage = (message, mappingValues) => {
    if (!message) return '';

    const checkMsgFunc = message.useHtml ? checkHtmlMessage : checkTextMessage;

    return replaceStringVariables(
      checkMsgFunc(message.content),
      mappingValues || {},
    );
  };

  const mapVariableByMethod = (variable, timerConfig, state) => {
    switch (variable.method) {
      case TIMER_MAP_VARIABLE_METHOD.CONFIG: {
        return variable.field ? timerConfig[variable.field] : undefined;
      }

      case TIMER_MAP_VARIABLE_METHOD.PARAMS: {
        return variable.value || undefined;
      }

      case TIMER_MAP_VARIABLE_METHOD.COMP_STATE: {
        return variable.field ? state[variable.field] : undefined;
      }

      default: {
        return undefined;
      }
    }
  };

  const getMappingVariables = (timerVariables) => {
    const mappingVariables = [];

    if (!timerVariables) return mappingVariables;
    if (typeof timerVariables !== 'object' && !Array.isArray(timerVariables)) {
      return mappingVariables;
    }

    timerVariables.forEach((variable) => {
      if (!variable.name) {
        return;
      }

      const mappedValue = mapVariableByMethod(variable, config, { status, timer });
      const value = variable.transform && typeof variable.transform === 'function'
        ? variable.transform(mappedValue)
        : mappedValue;

      if (value !== undefined) {
        mappingVariables.push({ key: variable.name, value });
      }
    });

    return mappingVariables;
  };

  const replaceStringVariables = (str, timerVariables) => {
    const mappingVariables = getMappingVariables(timerVariables);

    return mappingVariables.reduce(
      (result, { key, value }) => result.replace(new RegExp(`{{${key}}}`, 'g'), value),
      str,
    );
  };

  const botTimerMessage = (timerConfig) => {
    const timerMessage = timer <= 0 && timerConfig.messages.finish.isShow
      ? timerConfig.messages.finish
      : timerConfig.messages.counting.isShow
        ? timerConfig.messages.counting
        : null;

    return checkTimerMessage(timerMessage, timerConfig.variables);
  };

  useEffect(() => {
    if (status === TIMER_COMPONENT_STATUS.FINISH) return;

    setStatus(
      startCount
        ? TIMER_COMPONENT_STATUS.COUNTING
        : TIMER_COMPONENT_STATUS.PAUSE,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps -- timer tick must not reset when status/onCounting/config identity changes
  }, [startCount]);

  useEffect(() => {
    if (status !== TIMER_COMPONENT_STATUS.COUNTING || timer <= 0) return;

    const timeout = setTimeout(() => {
      const newTimer = isRealtimeRemainingTime
        ? (() => {
          const storageKey = scenarioId ? `${TIMER_START_STORAGE_PREFIX}_${scenarioId}` : TIMER_START_STORAGE_PREFIX;
          const startTime = Number(sessionStorage.getItem(storageKey) || new Date().getTime());
          const elapsed = (new Date().getTime() - startTime) / 1000;
          return Math.max(0, duration - elapsed);
        })()
        : Math.round((timer - (TIMER_COUNTING_DELAY / 1000)) * TIMER_ROUND_PRECISION) / TIMER_ROUND_PRECISION;

      setTimer(newTimer);

      if (newTimer <= 0) {
        setStatus(TIMER_COMPONENT_STATUS.FINISH);
      }

      onCounting(newTimer);
    }, TIMER_COUNTING_DELAY);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- timer tick must not reset when status/onCounting/config identity changes
  }, [timer, status, isRealtimeRemainingTime, duration, scenarioId]);

  useEffect(() => {
    const newConfig = {
      duration,
      messages: {
        counting: countMsg,
        finish: finishMsg,
      },
      variables,
    };

    if (JSON.stringify(newConfig) === JSON.stringify(config)) return;

    setConfig(newConfig);

    const nextTimer = isRealtimeRemainingTime
      ? (() => {
        const storageKey = scenarioId ? `${TIMER_START_STORAGE_PREFIX}_${scenarioId}` : TIMER_START_STORAGE_PREFIX;
        const storedStartTime = sessionStorage.getItem(storageKey);

        const midnight = new Date();
        midnight.setHours(MIDNIGHT_HOUR, MIDNIGHT_MINUTE, MIDNIGHT_SECOND, MIDNIGHT_MILLISECOND);
        const currentMidnightTime = midnight.getTime();

        const startTime = !storedStartTime || Number(storedStartTime) !== currentMidnightTime
          ? currentMidnightTime.toString()
          : storedStartTime;

        if (!storedStartTime || Number(storedStartTime) !== currentMidnightTime) {
          sessionStorage.setItem(storageKey, startTime);
        }

        const elapsed = (new Date().getTime() - Number(startTime)) / 1000;
        return Math.max(0, duration - elapsed);
      })()
      : timeLeft;

    setTimer(nextTimer);

    if (nextTimer <= 0) {
      setStatus(TIMER_COMPONENT_STATUS.FINISH);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- timer tick must not reset when status/onCounting/config identity changes
  }, [timeLeft, duration, finishMsg, countMsg, variables, isRealtimeRemainingTime, scenarioId]);

  if (!config) return null;

  if (status === TIMER_COMPONENT_STATUS.FINISH && !finishMsg.isShow) return null;

  return (
    <div className="timer" dangerouslySetInnerHTML={{ __html: botTimerMessage(config) }} />
  );
};

export default Timer;
