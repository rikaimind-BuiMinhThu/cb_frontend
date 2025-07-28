import { useEffect, useState } from "react";
import "assets/css/bot/timer.css";
import { TIMER_MAP_VARIABLE_METHOD, TIMER_COUNTING_DELAY } from "./PreviewComponent/Constants";

const initialState = {
  duration: 0,
  messages: {
    finish: {
      content: "",
      useHtml: false,
      isShow: false,
    },
    counting: {
      content: "",
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

export default function Timer({
  duration = initialState.duration,
  timeLeft = 0,
  countMsg = initialState.messages.counting,
  finishMsg = initialState.messages.finish,
  variables = initialState.variables,
  startCount = false,
  onCounting = (timer) => {}
}) {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(TIMER_COMPONENT_STATUS.PAUSE);
  const [timer, setTimer] = useState(-1);

  const checkHtmlMessage = (rawHtml) => {
    const temp = document.createElement("div");
    try {
      temp.innerHTML = rawHtml;
      return rawHtml;
    } catch (err) {
      return "Invalid HTML";
    } finally {
      temp.remove();
    }
  };

  const checkTextMessage = (rawText) => {
    return rawText;
  };

  const checkTimerMessage = (message, mappingValues) => {
    if (!message) return "";

    let checkMsgFunc = checkTextMessage;

    if (message.useHtml) {
      checkMsgFunc = checkHtmlMessage;
    }

    return replaceStringVariables(
      checkMsgFunc(message.content),
      mappingValues || {}
    );
  };

  const mapVariableByMethod = (variable, config, state) => {
    switch (variable.method) {
      case TIMER_MAP_VARIABLE_METHOD.CONFIG: {
        return variable.field ? config[variable.field] : undefined;
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

  const getMappingVariables = (variables) => {
    const mappingVariables = [];

    if (!variables) return mappingVariables;
    if (typeof variables !== "object" && !Array.isArray(variables))
      return mappingVariables;

    for (const variable of variables) {
      if (!variable.name) {
        continue;
      }

      let value = mapVariableByMethod(variable, config, { status, timer });

      if (variable.transform && typeof variable.transform === "function") {
        value = variable.transform(value);
      }

      if (value !== undefined) {
        mappingVariables.push({ key: variable.name, value });
      }
    }

    return mappingVariables;
  };

  const replaceStringVariables = (str, variables) => {
    const mappingVariables = getMappingVariables(variables);

    return mappingVariables.reduce(
      (result, { key, value }) =>
        result.replace(new RegExp(`{{${key}}}`, "g"), value),
      str
    );
  };

  const botTimerMessage = (config) => {
    let timerMessage = null;

    if (!!config.messages.counting.isShow) {
      timerMessage = config.messages.counting;
    }

    if (timer <= 0 && !!config.messages.finish.isShow) {
      timerMessage = config.messages.finish;
    }

    return checkTimerMessage(timerMessage, config.variables);
  };

  useEffect(() => {
    if (status === TIMER_COMPONENT_STATUS.FINISH) return;

    setStatus(
      startCount
        ? TIMER_COMPONENT_STATUS.COUNTING
        : TIMER_COMPONENT_STATUS.PAUSE
    );
  }, [startCount]);

  useEffect(() => {
    if (status !== TIMER_COMPONENT_STATUS.COUNTING || timer <= 0) return;

    const timeout = setTimeout(() => {
      const newTimer = Math.round((timer - (TIMER_COUNTING_DELAY/1000)) * 1000) / 1000;
      setTimer(newTimer);

      let newStatus = status;
      if (newTimer <= 0) {
        newStatus = TIMER_COMPONENT_STATUS.FINISH;
        setStatus(newStatus);
      }

      onCounting(newTimer)
    }, TIMER_COUNTING_DELAY);

    return () => clearTimeout(timeout);
  }, [timer, status]);

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

    const timer = timeLeft;
    setTimer(timer);

    if (timer <= 0) {
      setStatus(TIMER_COMPONENT_STATUS.FINISH);
    }
  }, [timeLeft, duration, finishMsg, countMsg, variables]);

  if (!config) return null;

  if (status === TIMER_COMPONENT_STATUS.FINISH && !finishMsg.isShow) return null;

  return (
    <div className="timer" dangerouslySetInnerHTML={{ __html: botTimerMessage(config) }}></div>
  );
}
