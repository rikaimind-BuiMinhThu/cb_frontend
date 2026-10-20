import api from 'api/api-management';
import { CHATBOT_SERVER } from '../PreviewComponent/Constants';
import { sendCreateOrderData } from '../PreviewComponent/Utils';

const TOKEN_FAIL_COPY = 'カード情報の認証に失敗しました。カード番号・有効期限・セキュリティコードをご確認のうえ、もう一度お試しください。';
const WAIT_COPY = 'ご注文を処理しています。完了まで30秒ほどお待ちください。';
const BUSY_COPY = 'ただいま混み合っています。順番に処理しますので、このままお待ちください。';
const ACCEPT_COPY = 'ご注文を受け付けました。処理完了後、確認メールをお送りします。';
const DONE_COPY = 'ご注文が完了しました。確認メールをご確認ください。';
const FAIL_COPY = 'ご注文を完了できませんでした。入力内容をご確認いただくか、ショップまでお問い合わせください。';
const ZEUS_CARD_AREA_ID = 'zeus_token_card_info_area';
const ZEUS_CARD_NUMBER_ID = 'zeus_token_card_number';
const ZEUS_EXPIRES_MONTH_ID = 'zeus_token_card_expires_month';
const ZEUS_EXPIRES_YEAR_ID = 'zeus_token_card_expires_year';
const ZEUS_CARD_CVV_ID = 'zeus_token_card_cvv';
const ZEUS_CARD_NAME_ID = 'zeus_token_card_name';
const ZEUS_ACTION_NEW_ID = 'zeus_token_action_type_new';
const ZEUS_RESULT_OK = 1;
const YEAR_CENTURY = '20';
const MONTH_LENGTH = 2;

function maskPan(number) {
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length < 4) return '';
  return `************${digits.slice(-4)}`;
}

function loadScript(src) {
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

export function extractCardFields(card) {
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

export function findCardFromMessage(message) {
  const contents = message?.message_content || [];
  const radio = contents.find((item) => item.type === 'card_payment_radio_button');
  if (radio?.card_payment_radio_button) return radio.card_payment_radio_button;
  const credit = contents.find((item) => item.type === 'credit_card_payment');
  return credit?.credit_card_payment || null;
}

export function isCreditSelection(card) {
  if (!card) return false;
  const selection = String(card.initial_selection || card.initial_selection_picture || '');
  if (['credit_card', 'credit', 'zeus'].includes(selection)) return true;
  if (selection.includes('クレジット') || selection.toLowerCase().includes('zeus')) return true;
  if (card.card_number || card.card_number1 || card.cvc) return true;
  return false;
}

export const findCreditCardMessage = (messages) => {
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

export function findPathFromMessages(messages) {
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

export function stripCardSecrets(card, token) {
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

export async function fetchZeusConfig(scenarioId) {
  const res = await api.get(`${CHATBOT_SERVER.ZEUS_CONFIG_PATH}?scenario_id=${encodeURIComponent(scenarioId)}`);
  if (res?.data?.code !== 1) {
    throw new Error(res?.data?.message || 'zeus not configured');
  }
  return res.data.data;
}

const ensureZeusCardArea = () => {
  if (document.getElementById(ZEUS_CARD_AREA_ID)) return;
  const area = document.createElement('div');
  area.id = ZEUS_CARD_AREA_ID;
  area.hidden = true;
  document.body.appendChild(area);
};

const setZeusFieldValue = (id, value) => {
  const field = document.getElementById(id);
  if (!field) return;
  field.value = value;
};

const writeZeusCardFields = ({ cardNumber, month, yearFull, holder }) => {
  const actionNew = document.getElementById(ZEUS_ACTION_NEW_ID);
  if (actionNew) actionNew.checked = true;
  setZeusFieldValue(ZEUS_CARD_NUMBER_ID, cardNumber);
  setZeusFieldValue(ZEUS_EXPIRES_MONTH_ID, month);
  setZeusFieldValue(ZEUS_EXPIRES_YEAR_ID, yearFull);
  const cvv = document.getElementById(ZEUS_CARD_CVV_ID);
  if (cvv) {
    cvv.value = '';
    cvv.hidden = true;
  }
  setZeusFieldValue(ZEUS_CARD_NAME_ID, holder);
};

const rejectZeus = (reject, errorCode) => {
  const error = new Error(TOKEN_FAIL_COPY);
  error.zeusErrorCode = errorCode || '';
  reject(error);
};

export const tokenizeZeusCard = async ({ tokenJsUrl, ipcode, cardNumber, expiry, holder }) => {
  const expire = String(expiry || '').replace(/\s/g, '');
  const month = expire.slice(0, MONTH_LENGTH);
  const yearTwo = expire.slice(-MONTH_LENGTH);
  const yearFull = yearTwo.length === MONTH_LENGTH ? `${YEAR_CENTURY}${yearTwo}` : '';
  window.zeusTokenIpcode = String(ipcode || '');
  ensureZeusCardArea();
  await loadScript(tokenJsUrl);
  if (window.zeusToken && typeof window.zeusToken.init === 'function') {
    window.zeusToken.init();
  }
  if (window.zeusToken) {
    window.zeusToken.ipcode = window.zeusTokenIpcode;
  }
  writeZeusCardFields({ cardNumber, month, yearFull, holder });

  return new Promise((resolve, reject) => {
    if (!window.zeusToken || typeof window.zeusToken.getToken !== 'function') {
      rejectZeus(reject);
      return;
    }
    try {
      window.zeusToken.getToken((resp) => {
        const tokenKey = resp?.token_key || '';
        if (resp?.result === ZEUS_RESULT_OK && tokenKey) {
          resolve({
            token_key: tokenKey,
            masked_pan: resp.masked_card_number || maskPan(cardNumber),
            expiry: expire,
            holder,
          });
          return;
        }
        rejectZeus(reject, resp?.error_code);
      });
    } catch (error) {
      rejectZeus(reject, error?.zeusErrorCode);
    }
  });
};

export async function reportTokenFailure({ scenarioId, userId, path, maskedPan, message }) {
  return api.post(CHATBOT_SERVER.TOKEN_FAILURES_PATH, {
    scenario_id: scenarioId,
    user_id: userId,
    path,
    masked_pan: maskedPan,
    message,
  });
}

export async function prepareLexicaCreditToken({ scenarioId, userId, messages }) {
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
    const code = error?.zeusErrorCode || '';
    await reportTokenFailure({
      scenarioId,
      userId,
      path: findPathFromMessages(messages),
      maskedPan: maskPan(fields.cardNumber),
      message: code ? `${TOKEN_FAIL_COPY} ${code}` : TOKEN_FAIL_COPY,
    });
    return { ok: false, copy: TOKEN_FAIL_COPY };
  }
}

export async function createLexicaOrder({ scenarioId, userId }) {
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

export async function pollLexicaOrder({ scenarioId, userId, onBusy }) {
  const started = Date.now();
  let lastInProgress = false;
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
      lastInProgress = true;
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      continue;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  if (lastInProgress) return { ok: true, copy: BUSY_COPY };
  return { ok: false, copy: FAIL_COPY };
}

export async function followLexicaOrder({ scenarioId, userId, orderResultMode, onStatus }) {
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
