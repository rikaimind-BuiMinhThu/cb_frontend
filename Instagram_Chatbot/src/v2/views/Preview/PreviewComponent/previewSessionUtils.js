export const clearChatbotState = () => {
  sessionStorage.removeItem("chatbotH");
  sessionStorage.removeItem("chatbotBottom");
  sessionStorage.removeItem("chatbotState");
  sessionStorage.removeItem("prevOpenStatus");
  sessionStorage.removeItem("timerConfig");
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("chatbot") || key.startsWith("messages_bot_")) {
      sessionStorage.removeItem(key);
    }
  });
};
