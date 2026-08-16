import api from "api/api-management";
import { CHATBOT_SERVER, CONFIRM_DISPLAY_FIELDS, defaultConfirmDisplayFields } from "../Constants";

export const sendConfirmOrderData = (data) => {
  return api.post(CHATBOT_SERVER.SCENARIO_CONFIRM_ORDER_PATH, data);
};

export const isConfirmMessage = (message) => {
  return (message?.message_content || []).some(
    (content) => content?.type === "text_input" && content?.text_input?.use_for_confirm_message
  );
};

export const isConfirmOrderSubmit = (message) => {
  return (message?.message_content || []).some(
    (content) => content?.type === "button_submit" && content?.button_submit?.use_for_confirm_order
  );
};

export const findUpcomingConfirmMessage = (messages = [], fromIndex) => {
  for (let i = fromIndex + 1; i < messages.length; i += 1) {
    const message = messages[i];
    if (message?.hidden) continue;
    if (isConfirmMessage(message)) return message;
    if (message?.belong_to === "user") return null;
  }
  return null;
};

const fieldLabel = (key) => CONFIRM_DISPLAY_FIELDS.find((field) => field.key === key)?.label || key;

export const formatConfirmOrderHtml = (display = {}, confirmDisplayFields) => {
  const fields = Array.isArray(confirmDisplayFields) && confirmDisplayFields.length
    ? confirmDisplayFields
    : defaultConfirmDisplayFields();

  const rows = fields
    .filter((field) => field.visible !== false)
    .map((field) => {
      const value = display[field.key];
      if (value === undefined || value === null || String(value).trim() === "") return null;
      return `<div style="margin: 4px 0;"><span style="font-weight: 600;">${fieldLabel(field.key)}</span><br/>${String(value)}</div>`;
    })
    .filter(Boolean);

  return rows.join("");
};
