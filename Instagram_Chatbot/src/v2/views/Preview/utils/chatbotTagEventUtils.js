import { CHATBOT_ACTIONS } from 'v2/variables/chatbotActions';
import {
  BUTTON_SUBMIT_CONTENT_TYPE,
  TAG_FIRING_KINDS,
  TAG_FIRING_PROVIDERS,
  USER_BELONG_TO,
} from 'v2/variables/tagFiringConstants';
import { isValidGa4MeasurementId } from 'v2/views/ScenarioSetting/utils/tagFiringUtils';
import { postMessageToParent } from 'v2/views/Preview/PreviewFukushashiki/LPUtils';
import { pushIframeGtagEvent } from './iframeGtagUtils';

export const isScenarioCompleteClick = (messagesList, clickedMsgIndex) => {
  const remaining = (messagesList || []).slice(clickedMsgIndex + 1);
  return !remaining.some((message) => message?.belong_to === USER_BELONG_TO);
};

export const fireChatbotTagEvent = ({
  state,
  eventName,
  kind,
  stepId = '',
  buttonName = '',
  label = '',
}) => {
  if (!state?.tagFiring?.enabled) return;
  if (!eventName) return;

  const params = {
    event: eventName,
    chatbot_event: kind,
    chatbot_scenario_id: state.scenarioId,
    chatbot_scenario_name: state.scenarioName || '',
    chatbot_step_id: stepId,
    chatbot_button_name: buttonName,
    chatbot_event_label: label,
  };

  const shouldFireIframeGa4 = state.tagFiring.provider === TAG_FIRING_PROVIDERS.GA4
    && isValidGa4MeasurementId(state.tagFiring.measurement_id);
  if (shouldFireIframeGa4) {
    pushIframeGtagEvent(state.tagFiring.measurement_id, eventName, params);
    return;
  }
  if (state.tagFiring.provider === TAG_FIRING_PROVIDERS.GA4) {
    return;
  }

  postMessageToParent({
    action: CHATBOT_ACTIONS.CHATBOT_TAG_EVENT,
    event: eventName,
    provider: state.tagFiring.provider,
    params,
  }, state);
};

export const fireChatbotLifecycleTagsOnOpen = ({
  state,
  hasFiredStartRef,
}) => {
  if (!state?.tagFiring?.enabled) return;

  fireChatbotTagEvent({
    state,
    eventName: state?.tagFiring?.open_event,
    kind: TAG_FIRING_KINDS.OPEN,
  });
  if (hasFiredStartRef?.current) return;
  fireChatbotTagEvent({
    state,
    eventName: state?.tagFiring?.start_event,
    kind: TAG_FIRING_KINDS.START,
  });
  if (hasFiredStartRef) hasFiredStartRef.current = true;
};

export const fireChatbotButtonTags = (state, clickedMsg) => {
  if (!clickedMsg) return;

  if (clickedMsg.tag_enabled) {
    fireChatbotTagEvent({
      state,
      eventName: clickedMsg.tag_event,
      kind: TAG_FIRING_KINDS.BUTTON_CLICK,
      stepId: clickedMsg.id,
      buttonName: clickedMsg.buttonName || clickedMsg.tag_label || '',
      label: clickedMsg.tag_label || clickedMsg.buttonName || '',
    });
  }

  const submitContent = (clickedMsg.message_content || []).find(
    (content) => content.type === BUTTON_SUBMIT_CONTENT_TYPE,
  );
  if (!submitContent?.button_submit?.tag_enabled) return;

  fireChatbotTagEvent({
    state,
    eventName: submitContent.button_submit.tag_event,
    kind: TAG_FIRING_KINDS.BUTTON_CLICK,
    stepId: clickedMsg.id,
    buttonName: submitContent.button_submit_name || submitContent.button_submit.tag_label || '',
    label: submitContent.button_submit.tag_label || submitContent.button_submit_name || '',
  });
};

export const fireChatbotCompleteTag = (state) => {
  fireChatbotTagEvent({
    state,
    eventName: state?.tagFiring?.complete_event,
    kind: TAG_FIRING_KINDS.COMPLETE,
  });
};
