import { useEffect, useState } from "react";

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

export const MAP_VARIABLE_METHOD = {
  CONFIG: 1,
  PARAMS: 2,
  COMP_STATE: 3,
};

const COMPONENT_STATUS = {
  PAUSE: 0,
  COUNTING: 1,
  FINISH: 2,
};

export default function Timer({
  duration = initialState.duration,
  countMsg = initialState.messages.counting,
  finishMsg = initialState.messages.finish,
  variables = initialState.variables,
  startCount = false,
  onCounting = ({ timer, status }) => {}
}) {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(COMPONENT_STATUS.PAUSE);
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
      case MAP_VARIABLE_METHOD.CONFIG: {
        return variable.field ? config[variable.field] : undefined;
      }

      case MAP_VARIABLE_METHOD.PARAMS: {
        return variable.value || undefined;
      }

      case MAP_VARIABLE_METHOD.COMP_STATE: {
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

      const value = mapVariableByMethod(variable, config, { status, timer });

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

    if (config.duration === 0 && !!config.messages.finish.isShow) {
      timerMessage = config.messages.finish;
    }

    return checkTimerMessage(timerMessage, config.variables);
  };

  useEffect(() => {
    if (status === COMPONENT_STATUS.FINISH) return;

    setStatus(
      startCount
        ? COMPONENT_STATUS.COUNTING
        : COMPONENT_STATUS.PAUSE
    );
  }, [startCount]);

  useEffect(() => {
    if (status !== COMPONENT_STATUS.COUNTING || timer <= 0) return;

    const timeout = setTimeout(() => {
      const newTimer = timer - 1;
      setTimer(newTimer);

      let newStatus = status;

      if (newTimer === 0) {
        newStatus = COMPONENT_STATUS.FINISH;
        setStatus(newStatus);
      }

      onCounting({
        timer: newTimer,
        status: newStatus,
      })

    }, 1000);

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
    setTimer(duration);
  }, [duration, finishMsg, countMsg, variables, config]);

  if (!config) return null;

  return (
    <div dangerouslySetInnerHTML={{ __html: botTimerMessage(config) }}></div>
  );
}
