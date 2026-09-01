import api from 'api/api-management';
import { CHATBOT_SERVER } from '../PreviewComponent/Constants';
import { sendCreateOrderData } from '../PreviewComponent/Utils';

const TOKEN_FAIL_COPY = 'カード情報の認証に失敗しました。カード番号・有効期限・セキュリティコードをご確認のうえ、もう一度お試しください。';
const WAIT_COPY = 'ご注文を処理しています。完了まで30秒ほどお待ちください。';
const BUSY_COPY = 'ただいま混み合っています。順番に処理しますので、このままお待ちください。';
const ACCEPT_COPY = 'ご注文を受け付けました。処理完了後、確認メールをお送りします。';
const DONE_COPY = 'ご注文が完了しました。確認メールをご確認ください。';
const FAIL_COPY = 'ご注文を完了できませんでした。入力内容をご確認いただくか、ショップまでお問い合わせください。';

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

export function findCreditCardPayload(messages) {
  for (const message of messages || []) {
    const card = findCardFromMessage(message);
    if (card && isCreditSelection(card)) return card;
  }
  return null;
}

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

export async function tokenizeZeusCard({ tokenJsUrl, clientIp, ipcode, cardNumber, expiry, cvc, holder }) {
  await loadScript(tokenJsUrl);
  const expire = String(expiry || '').replace(/\s/g, '');
  const month = expire.slice(0, 2);
  const year = expire.length >= 4 ? expire.slice(-2) : '';

  return new Promise((resolve, reject) => {
    const callback = (resp) => {
      const tokenKey = resp?.token_key || resp?.tokenKey || resp?.zeus_token_key;
      if (resp?.result === 'ok' || resp?.status === 'success' || tokenKey) {
        resolve({
          token_key: tokenKey,
          masked_pan: maskPan(cardNumber),
          expiry: expire,
          holder,
        });
        return;
      }
      reject(new Error(TOKEN_FAIL_COPY));
    };

    if (typeof window.zeusToken === 'function') {
      window.zeusToken({
        cardNumber,
        cardExpiresYear: year,
        cardExpiresMonth: month,
        cardCvv: cvc,
        cardName: holder,
        clientip: clientIp,
        ipcode,
      }, callback);
      return;
    }
    if (window.zeusToken && typeof window.zeusToken.getToken === 'function') {
      window.zeusToken.getToken({
        card_number: cardNumber,
        card_expire: `${year}${month}`,
        security_code: cvc,
        cardholder: holder,
        clientip: clientIp,
        ipcode,
      }, callback);
      return;
    }
    reject(new Error(TOKEN_FAIL_COPY));
  });
}

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
    await reportTokenFailure({
      scenarioId,
      userId,
      path: findPathFromMessages(messages),
      maskedPan: maskPan(fields.cardNumber),
      message: TOKEN_FAIL_COPY,
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

export async function pollLexicaOrder({ scenarioId, userId, onBusy }) {
  const started = Date.now();
  while (Date.now() - started < 180000) {
    const res = await api.get(
      `${CHATBOT_SERVER.SELENIUM_RESULTS_PATH}?scenario_id=${encodeURIComponent(scenarioId)}&user_id=${encodeURIComponent(userId)}`
    );
    const data = res?.data?.data || {};
    if (data.queued || data.busy) {
      onBusy?.(BUSY_COPY);
    }
    if (data.result === 'done') return { ok: true, copy: DONE_COPY };
    if (data.result === 'error') return { ok: false, copy: FAIL_COPY };
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
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
