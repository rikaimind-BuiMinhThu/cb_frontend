import { sendEmailRequest } from "./Utils";
import { BOT_MESSAGE_TYPES } from "./Constants";

const processBotEmailMessage = (messagesList, i, newState) => {
  const msgContent = messagesList[i]?.message_content?.[0];
  const emailId = msgContent[msgContent.type].contentId;
  const variablesData = newState.variablesList.reduce((acc, item) => {
    acc[item.variable_name] = item.default_value;
    return acc;
  }, {});

  sendEmailRequest(emailId, {variables: variablesData})
    .then((res) => {console.log(res)});

  newState.renderMessagesList.push({});
  newState.currentMsgIndex = i;
  return newState;
}

const processBotPauseMessage = (messagesList, i, newState) => {
  newState.renderMessagesList.push({});
  newState.currentMsgIndex = i;
}

const processForBotVariableSetMessage = (messagesList, i, newState, options = {forceEmpty: false}) => {
  const msgContent = messagesList[i]?.message_content?.[0];
  if (!msgContent) return newState;

  if (newState.variables.length !== 0) {
    const msgVariables = msgContent[msgContent.type].variables;

    newState.variables.forEach((item) => {
      const matchingVariable = msgVariables.find(variable => item.variable_name === variable.key);
      if (matchingVariable) {
        item.default_value = options.forceEmpty ? "" : matchingVariable.value;
      }
    });
  }

  newState.renderMessagesList.push({});
  newState.currentMsgIndex = i;
  return newState;
}

const processForBotDefaultMessage = async (messagesList, i, newState, isUpdateSourceContent, assignToState = true) => {
  const msgContent = messagesList[i]?.message_content?.[0];
  if (!msgContent) return newState;

  // await sleep(1000);
  const applyVariables = (section) => {
    if (!section?.content || newState.variables?.length === 0) return false;

    if (isUpdateSourceContent) section.sourceContent = section.content;

    section.content = newState.variables.reduce(
      (s, { variable_name, default_value }) =>
        s.replaceAll(`{{${variable_name}}}`, default_value),
      section.sourceContent ?? section.content
    );
    return true;
  };

  const updated =
    (msgContent.type === "text_input" &&
      applyVariables(msgContent.text_input)) ||
    (msgContent.type === BOT_MESSAGE_TYPES.HTML_CODE &&
      applyVariables(msgContent.html_code));

  if (updated) messagesList[i].message_content[0] = msgContent;
  
  if (assignToState) {
    newState.renderMessagesList.push(messagesList[i]);
    newState.currentMsgIndex = i;
  }
  
  // scrollToPosition({ position: "b", selector: "#sp-body" });

  // if (newState.currentMsgIndex === newState.messagesList.length - 1)
  //   return redirectToCartPage();

  return newState;
}

const processBotScriptMessage = (messagesList, i, newState) => {
  const script = messagesList[i]?.message_content[0]?.script?.content;
  if (!script) return newState;

  try {
    // eslint-disable-next-line no-new-func -- intentional LP custom JS evaluation
    const func = new Function(script);
    func();
  } catch {
    console.error('Script run failed!')
  } finally {
    return newState;
  }
}

const processBotUgcMessage = async (messagesList, i, newState) => {
  const content = messagesList[i]?.message_content[0]?.use_html_ugc_config?.content;
  if (!content) return newState;
  if(/^\s*<\w+|<\w+[^>]*>/i.test(content)){
    try {
      const doc = new DOMParser().parseFromString(content, "text/html");
      [...doc.querySelectorAll("link")].forEach(el => 
        document.head.appendChild(el.cloneNode(true)));
      [...doc.body.children].filter(el => !["script", "link"]
        .includes(el.tagName.toLowerCase())).forEach(el => document.body.appendChild(el.cloneNode(true)));
      for (const script of doc.querySelectorAll("script")) {
        const s = document.createElement("script");
        [...script.attributes].forEach(attr => s.setAttribute(attr.name, attr.value));
        s.text = script.textContent || '';
        if (s.src) await new Promise(r => { s.onload = s.onerror = r; document.body.appendChild(s); });
        else document.body.appendChild(s);
      }
    } catch (error) {
      console.error("Hello !, you have one bug",error)
    }
  } else {
    try {
      // eslint-disable-next-line no-new-func -- intentional LP custom JS evaluation
      const func = new Function(content);
      func();
    } catch (error) {
      console.error("Ồ là lá Fail rồi", error);
    }
  }
  return newState;
}

/**
 * Injects scenario-level HTML_UGC_CONFIG content (scripts/hidden inputs) into the
 * live DOM, mirroring how a <style> tag is injected for scenario-level Custom CSS.
 * Returns a cleanup function that removes everything it appended.
 */
export const injectHtmlUgcConfigContent = (content) => {
  if (!content) return () => {};

  const doc = new DOMParser().parseFromString(content, "text/html");
  const injectedNodes = [];

  doc.querySelectorAll("link").forEach((link) => {
    const node = link.cloneNode(true);
    document.head.appendChild(node);
    injectedNodes.push(node);
  });

  [...doc.body.children]
    .filter((el) => !["script", "link"].includes(el.tagName.toLowerCase()))
    .forEach((el) => {
      const node = el.cloneNode(true);
      document.body.appendChild(node);
      injectedNodes.push(node);
    });

  doc.querySelectorAll("script").forEach((script) => {
    const node = document.createElement("script");
    [...script.attributes].forEach((attr) => node.setAttribute(attr.name, attr.value));
    node.text = script.textContent || "";
    document.body.appendChild(node);
    injectedNodes.push(node);
  });

  return () => {
    injectedNodes.forEach((node) => node.remove());
  };
};

export const processForBotMessage = async (messagesList, i, newState, isUpdateSourceContent = false, assignToState = true) => {
  const firstMsgType = messagesList[i]?.message_content[0]?.type;

  switch (firstMsgType) {
    case 'script':
      return processBotScriptMessage(messagesList, i, newState);
    case BOT_MESSAGE_TYPES.UGC:
      return await processBotUgcMessage(messagesList, i, newState);
    case "delay":
      return newState;
    case "email":
      return processBotEmailMessage(messagesList, i, newState);
    case "variable_set":
      return processForBotVariableSetMessage(messagesList, i, newState);
    case "clear_variable":
      return processForBotVariableSetMessage(messagesList, i, newState, {forceEmpty: ""});
    case "pause":
      return processBotPauseMessage(messagesList, i, newState);
    default:
      return processForBotDefaultMessage(messagesList, i, newState, isUpdateSourceContent, assignToState);
  }
}