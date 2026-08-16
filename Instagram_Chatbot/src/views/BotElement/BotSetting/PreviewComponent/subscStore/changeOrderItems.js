import api from "api/api-management";
import { CHATBOT_SERVER } from "../Constants";

const ACCEPT_VALUES = ["1", "true", "yes", "はい", "変更する", "アップセル", "accept"];

export const isUpsellAcceptMessage = (message) => {
  const contents = message?.message_content || [];
  return contents.some((content) => {
    const type = content?.type;
    if (type !== "radio_button" && type !== "checkbox") return false;
    const dataInputName = content?.data_input_name || content?.radio_button?.data_input_name;
    if (dataInputName === "upsell_accept") return true;

    const value = content?.radio_button?.value || content?.checkedValue || content?.value;
    return ACCEPT_VALUES.includes(String(value || "").trim());
  });
};

export const sendChangeOrderItems = ({ scenarioId, userId }) => {
  return api.post(CHATBOT_SERVER.SCENARIO_CHANGE_ORDER_ITEMS_PATH, {
    scenario_id: scenarioId,
    user_id: userId,
  });
};
