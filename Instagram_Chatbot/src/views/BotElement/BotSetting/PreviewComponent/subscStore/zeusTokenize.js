import api from "api/api-management";
import { CHATBOT_SERVER } from "../Constants";

const extractCardFromContent = (content) => {
  const card = content?.credit_card_payment || content?.card_payment_radio_button;
  if (!card) return null;

  const cardNumber = String(
    card.card_number ||
      [card.card_number1, card.card_number2, card.card_number3, card.card_number4].filter(Boolean).join("")
  ).replace(/\D/g, "");
  if (!cardNumber) return null;

  return {
    card_number: cardNumber,
    month: card.month,
    year: card.year,
    card_holder: card.card_holder || [card.card_holder1, card.card_holder2].filter(Boolean).join(" "),
    cvc: card.cvc,
  };
};

export const extractCardFromMessages = (messages = []) => {
  for (const message of messages) {
    for (const content of message?.message_content || []) {
      const card = extractCardFromContent(content);
      if (card) return card;
    }
  }
  return null;
};

const maskCard = (number) => {
  const digits = String(number || "").replace(/\D/g, "");
  if (!digits) return "";
  return `${digits.slice(0, 6)}*******${digits.slice(-3)}`;
};

const brandFromPan = (number) => {
  const digits = String(number || "").replace(/\D/g, "");
  if (digits.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (digits.startsWith("35")) return "jcb";
  return "visa";
};

const expireYear = (year) => {
  const value = String(year || "").replace(/\D/g, "");
  return value.length >= 4 ? value.slice(-2) : value.padStart(2, "0");
};

const expireMonth = (month) => String(parseInt(month || "0", 10)).padStart(2, "0");

const loadScript = (src) => {
  if (!src) return Promise.resolve();
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load ZEUS token script"));
    document.head.appendChild(script);
  });
};

const callZeusToken = (card, ipCode) => {
  const zeus = window.zeusToken || window.ZEUS || window.zeus;
  if (!zeus || typeof zeus.getToken !== "function") return null;

  return new Promise((resolve, reject) => {
    try {
      zeus.getToken(
        {
          ipcode: ipCode,
          cardnumber: card.card_number,
          expire_year: expireYear(card.year),
          expire_month: expireMonth(card.month),
          securitycode: card.cvc,
        },
        (result) => {
          const tokenKey = result?.token_key || result?.tokenKey || result?.token;
          if (!tokenKey) {
            reject(new Error("ZEUS tokenize returned no token_key"));
            return;
          }
          resolve(tokenKey);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const fetchSubscStorePaymentConfig = (scenarioId) => {
  return api.get(
    `${CHATBOT_SERVER.SCENARIO_SUBSC_PAYMENT_CONFIG_PATH}?scenario_id=${scenarioId}`
  );
};

export const mockCreditCardFromMessages = (messages = []) => {
  const card = extractCardFromMessages(messages);
  if (!card) {
    return { token_key: "mock_token_key" };
  }

  return {
    token_key: "mock_token_key",
    masked_card_number: maskCard(card.card_number),
    brand: brandFromPan(card.card_number),
    expire_month: expireMonth(card.month),
    expire_year: expireYear(card.year),
    holder_name: card.card_holder,
  };
};

export const tokenizeCreditCard = async ({ scenarioId, messages }) => {
  const card = extractCardFromMessages(messages);
  if (!card) return null;

  let tokenKey = null;
  try {
    const configRes = await fetchSubscStorePaymentConfig(scenarioId);
    const config = configRes?.data?.data || configRes?.data || {};
    await loadScript(config.credit_card_script_path);
    tokenKey = await callZeusToken(card, config.zeus_ip_code);
  } catch (error) {
    console.warn("ZEUS frontend tokenize failed; backend will retry", error);
  }

  return {
    token_key: tokenKey,
    masked_card_number: maskCard(card.card_number),
    brand: brandFromPan(card.card_number),
    expire_month: expireMonth(card.month),
    expire_year: expireYear(card.year),
    holder_name: card.card_holder,
  };
};
