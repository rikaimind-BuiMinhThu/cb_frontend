import api from 'api/api-management';
import { CHATBOT_SERVER } from '../PreviewComponent/Constants';
import { sendCreateOrderData } from '../PreviewComponent/Utils';
import './zeusTokenHost.css';

const TOKEN_FAIL_COPY = 'カード情報の認証に失敗しました。カード番号・有効期限・セキュリティコードをご確認のうえ、もう一度お試しください。';
const ZEUS_HOST_CLASS = 'zeus-token-host';
const ZEUS_CARD_AREA_ID = 'zeus_token_card_info_area';
const ZEUS_ACTION_NEW_ID = 'zeus_token_action_type_new';
const ZEUS_CARD_NUMBER_ID = 'zeus_token_card_number';
const ZEUS_EXPIRES_MONTH_ID = 'zeus_token_card_expires_month';
const ZEUS_EXPIRES_YEAR_ID = 'zeus_token_card_expires_year';
const ZEUS_CARD_CVV_ID = 'zeus_token_card_cvv';
const ZEUS_CARD_NAME_ID = 'zeus_token_card_name';
const ZEUS_YEAR_PREFIX = '20';
const ZEUS_RESULT_OK = 1;
const ZEUS_CVV_XML_OMIT = 'omit';
const WAIT_COPY = 'ご注文を処理しています。完了まで30秒ほどお待ちください。';
const BUSY_COPY = 'ただいま混み合っています。順番に処理しますので、このままお待ちください。';
const ACCEPT_COPY = 'ご注文を受け付けました。処理完了後、確認メールをお送りします。';
const DONE_COPY = 'ご注文が完了しました。確認メールをご確認ください。';
const FAIL_COPY = 'ご注文を完了できませんでした。入力内容をご確認いただくか、ショップまでお問い合わせください。';
const PAYMENT_METHOD_INPUT = 'payment_method';
const CREDIT_PAYMENT_VALUES = ['credit_card', 'credit', 'zeus'];
const CREDIT_LABEL_MARK = 'クレジット';
const ZEUS_LABEL_MARK = 'zeus';

const maskPan = (number) => {
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length < 4) return '';
  return `************${digits.slice(-4)}`;
}

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('failed to load token.js'));
    document.head.appendChild(script);
  });
}

export const extractCardFields = (card) => {
  const parts = [
    card?.card_number1,
    card?.card_number2,
    card?.card_number3,
    card?.card_number4,
  ].filter(Boolean);
  const cardNumber = String(card?.card_number || parts.join('') || '').replace(/\D/g, '');
  const month = String(card?.month || '').padStart(2, '0');
  const year = String(card?.year || '').replace(/\D/g, '').slice(-2);
  const holder = card?.card_holder
    || [card?.card_holder1, card?.card_holder2].filter(Boolean).join(' ')
    || '';
  return {
    cardNumber,
    expiry: `${month}${year}`,
    cvc: card?.cvc,
    holder,
  };
}

export const findCardFromMessage = (message) => {
  const contents = message?.message_content || [];
  const radio = contents.find((item) => item.type === 'card_payment_radio_button');
  if (radio?.card_payment_radio_button) return radio.card_payment_radio_button;
  const credit = contents.find((item) => item.type === 'credit_card_payment');
  return credit?.credit_card_payment || null;
}

const isCreditPaymentValue = (value) => {
  const selection = String(value || '');
  if (selection === '') return false;
  if (CREDIT_PAYMENT_VALUES.includes(selection)) return true;
  if (selection.includes(CREDIT_LABEL_MARK)) return true;
  if (selection.toLowerCase().includes(ZEUS_LABEL_MARK)) return true;
  return false;
};

const paymentRadio = (content) => {
  const radio = content?.radio_button;
  if (!radio) return null;
  if (String(radio.save_input_content || '') !== PAYMENT_METHOD_INPUT) return null;
  return radio;
};

const findPaymentMethod = (messages) => {
  const list = messages || [];
  const message = list.find((item) => (item?.message_content || []).some(paymentRadio));
  if (!message) return '';
  const content = (message.message_content || []).find(paymentRadio);
  return String(content?.radio_button?.initial_selection || '');
};

export const isCreditSelection = (card) => {
  if (!card) return false;
  const selection = String(card.initial_selection || card.initial_selection_picture || '');
  if (isCreditPaymentValue(selection)) return true;
  if (card.card_number || card.card_number1 || card.cvc) return true;
  return false;
}

export const findCreditCardMessage = (messages) => {
  const payment = findPaymentMethod(messages);
  if (payment !== '' && !isCreditPaymentValue(payment)) return null;

  const list = messages || [];
  const found = list.find((message) => {
    const card = findCardFromMessage(message);
    return Boolean(card && isCreditSelection(card));
  });
  return found || null;
};

export const findCreditCardPayload = (messages) => {
  const message = findCreditCardMessage(messages);
  if (!message) return null;
  return findCardFromMessage(message);
};

export const findPathFromMessages = (messages) => {
  for (const message of messages || []) {
    for (const content of message?.message_content || []) {
      const radio = content.radio_button;
      if (!radio) continue;
      const key = String(radio.save_input_content || '');
      if (key === 'path' || key === 'order_path') {
        return radio.initial_selection;
      }
    }
  }
  return null;
}

export const stripCardSecrets = (card, token) => {
  if (!card) return;
  card.token_key = token.token_key;
  card.masked_pan = token.masked_pan;
  card.expiry = token.expiry;
  card.holder = token.holder;
  card.card_number = token.masked_pan;
  card.card_number1 = '';
  card.card_number2 = '';
  card.card_number3 = '';
  card.card_number4 = '';
  card.cvc = '';
}

export const fetchZeusConfig = async (scenarioId) => {
  const res = await api.get(`${CHATBOT_SERVER.ZEUS_CONFIG_PATH}?scenario_id=${encodeURIComponent(scenarioId)}`);
  if (res?.data?.code !== 1) {
    throw new Error(res?.data?.message || 'zeus not configured');
  }
  return res.data.data;
}

const fullExpiryYear = (year) => {
  const digits = String(year || '').replace(/\D/g, '');
  if (digits.length === 4) return digits;
  if (digits.length === 2) return `${ZEUS_YEAR_PREFIX}${digits}`;
  return '';
};

const tokenAttemptDetail = ({ cardNumber, month, year, cvc, holder, ipcode, clientIp, errorCode }) => {
  const parts = [
    `pan_len=${String(cardNumber || '').length}`,
    `month=${month || ''}`,
    `year=${year || ''}`,
    `cvc_len=${String(cvc || '').length}`,
    `cvv_xml=${ZEUS_CVV_XML_OMIT}`,
    `holder_len=${String(holder || '').length}`,
    `ipcode=${ipcode || ''}`,
    `client_ip=${clientIp || ''}`,
  ];
  if (errorCode) parts.push(`error_code=${errorCode}`);
  return parts.join(' ');
};

const tokenFailure = (detail) => {
  const error = new Error(TOKEN_FAIL_COPY);
  error.detail = detail;
  return error;
};

const ensureZeusCardArea = () => {
  const existing = document.getElementById(ZEUS_CARD_AREA_ID);
  if (existing) return existing;
  const area = document.createElement('div');
  area.id = ZEUS_CARD_AREA_ID;
  area.className = ZEUS_HOST_CLASS;
  document.body.appendChild(area);
  return area;
};

const removeZeusCardArea = () => {
  const area = document.getElementById(ZEUS_CARD_AREA_ID);
  if (!area) return;
  area.remove();
};

const setSelectValue = (select, value) => {
  if (!select) return false;
  const option = [...select.options].find((item) => item.value === value);
  if (!option) return false;
  select.value = value;
  return true;
};

const fillZeusCardForm = ({ cardNumber, month, year, holder }) => {
  const action = document.getElementById(ZEUS_ACTION_NEW_ID);
  const number = document.getElementById(ZEUS_CARD_NUMBER_ID);
  const monthSelect = document.getElementById(ZEUS_EXPIRES_MONTH_ID);
  const yearSelect = document.getElementById(ZEUS_EXPIRES_YEAR_ID);
  const cvv = document.getElementById(ZEUS_CARD_CVV_ID);
  const name = document.getElementById(ZEUS_CARD_NAME_ID);
  if (!action || !number || !monthSelect || !yearSelect || !cvv || !name) return false;
  action.checked = true;
  number.value = cardNumber;
  cvv.value = '';
  name.value = holder || '';
  const monthOk = setSelectValue(monthSelect, month);
  const yearOk = setSelectValue(yearSelect, year);
  return monthOk && yearOk && Boolean(cardNumber);
};

export const tokenizeZeusCard = async ({ tokenJsUrl, clientIp, ipcode, cardNumber, expiry, cvc, holder }) => {
  const expire = String(expiry || '').replace(/\s/g, '');
  const month = expire.slice(0, 2);
  const year = fullExpiryYear(expire.length >= 4 ? expire.slice(-2) : '');
  const detail = tokenAttemptDetail({
    cardNumber,
    month,
    year,
    cvc,
    holder,
    ipcode,
    clientIp,
  });
  window.zeusTokenIpcode = String(ipcode || clientIp || '');
  ensureZeusCardArea();
  try {
    await loadScript(tokenJsUrl);
    if (!window.zeusToken || typeof window.zeusToken.getToken !== 'function') {
      throw tokenFailure(detail);
    }
    try {
      if (typeof window.zeusToken.init === 'function') window.zeusToken.init();
    } catch (initError) {
      throw tokenFailure(`${detail} init=${initError.message || 'failed'}`);
    }
    const filled = fillZeusCardForm({ cardNumber, month, year, holder });
    if (!filled) throw tokenFailure(detail);
    return await new Promise((resolve, reject) => {
      try {
        window.zeusToken.getToken((resp) => {
          const tokenKey = resp?.token_key;
          if (resp?.result === ZEUS_RESULT_OK && tokenKey) {
            resolve({
              token_key: tokenKey,
              masked_pan: resp.masked_card_number || maskPan(cardNumber),
              expiry: expire,
              holder: resp.card_name || holder,
            });
            return;
          }
          reject(tokenFailure(tokenAttemptDetail({
            cardNumber,
            month,
            year,
            cvc,
            holder,
            ipcode,
            clientIp,
            errorCode: resp?.error_code,
          })));
        });
      } catch (tokenError) {
        reject(tokenFailure(`${detail} call=${tokenError.message || 'failed'}`));
      }
    });
  } finally {
    removeZeusCardArea();
  }
};

export const reportTokenFailure = async ({ scenarioId, userId, path, maskedPan, message }) => {
  return api.post(CHATBOT_SERVER.TOKEN_FAILURES_PATH, {
    scenario_id: scenarioId,
    user_id: userId,
    path,
    masked_pan: maskedPan,
    message,
  });
}

export const prepareLexicaCreditToken = async ({ scenarioId, userId, messages }) => {
  const card = findCreditCardPayload(messages);
  if (!card || !isCreditSelection(card)) return { ok: true, card: null };

  const fields = extractCardFields(card);
  try {
    const config = await fetchZeusConfig(scenarioId);
    const token = await tokenizeZeusCard({
      tokenJsUrl: config.token_js_url,
      clientIp: config.client_ip,
      ipcode: config.ipcode,
      ...fields,
    });
    stripCardSecrets(card, token);
    return { ok: true, card, token };
  } catch (error) {
    await reportTokenFailure({
      scenarioId,
      userId,
      path: findPathFromMessages(messages),
      maskedPan: maskPan(fields.cardNumber),
      message: error.detail || TOKEN_FAIL_COPY,
    });
    return { ok: false, copy: TOKEN_FAIL_COPY };
  }
}

export const createLexicaOrder = async ({ scenarioId, userId }) => {
  const res = await sendCreateOrderData({
    scenario_id: scenarioId,
    user_id: userId,
    bot_type: 'web',
  });
  return res?.data;
}

const POLL_TIMEOUT_MS = 600000;
const POLL_INTERVAL_MS = 3000;
const RESULT_DONE = 'done';
const RESULT_ERROR = 'error';
const RESULT_RUNNING = 'running';
const RESULT_OPEN = 'open';

const isLexicaOrderInProgress = (data) => {
  if (data.queued || data.busy) return true;
  if (data.result === RESULT_RUNNING || data.result === RESULT_OPEN) return true;
  return !data.result;
};

export const pollLexicaOrder = async ({ scenarioId, userId, onBusy }) => {
  const started = Date.now();
  const progress = { lastInProgress: false };
  while (Date.now() - started < POLL_TIMEOUT_MS) {
    const res = await api.get(
      `${CHATBOT_SERVER.SELENIUM_RESULTS_PATH}?scenario_id=${encodeURIComponent(scenarioId)}&user_id=${encodeURIComponent(userId)}`
    );
    const data = res?.data?.data || {};
    if (data.queued || data.busy) {
      onBusy?.(BUSY_COPY);
    }
    if (data.result === RESULT_DONE) return { ok: true, copy: DONE_COPY };
    if (data.result === RESULT_ERROR) return { ok: false, copy: FAIL_COPY };
    if (isLexicaOrderInProgress(data)) {
      progress.lastInProgress = true;
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      continue;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  if (progress.lastInProgress) return { ok: true, copy: BUSY_COPY };
  return { ok: false, copy: FAIL_COPY };
}

export const followLexicaOrder = async ({ scenarioId, userId, orderResultMode, onStatus }) => {
  const queued = await createLexicaOrder({ scenarioId, userId });
  const mode = orderResultMode || queued?.order_result_mode || 'wait';
  if (mode === 'async') {
    onStatus(ACCEPT_COPY);
    return { ok: true, async: true };
  }
  onStatus(WAIT_COPY);
  const result = await pollLexicaOrder({
    scenarioId,
    userId,
    onBusy: () => onStatus(BUSY_COPY),
  });
  onStatus(result.copy);
  return result;
}

export const LEXICA_COPY = {
  TOKEN_FAIL_COPY,
  WAIT_COPY,
  BUSY_COPY,
  ACCEPT_COPY,
  DONE_COPY,
  FAIL_COPY,
};
