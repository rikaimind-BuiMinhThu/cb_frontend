import {
  CHATBOT_ACTIONS,
  DEFAULT_AMAZON_DETECTION,
  DEFAULT_AMAZON_PAY_CONFIG,
  WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT,
} from '../constants.js';
import { getParam } from '../config/environment.js';
import { setGlobalIframe } from '../state.js';
import { sendMessageToChatbot } from '../messaging/bridge.js';
import {
  buildAmazonSelectorPayload,
  safeGetAmazonPayload,
} from './bindings.js';
import { isAmazonPayActive, isAmazonPayReady } from './detection.js';

export const appendIframeToBody = (iframe) => {
  setGlobalIframe(iframe);
  document.body.appendChild(iframe);
};

const sendAmazonPayDataBySelector = (payload) => {
  if (!payload?.selectorValues?.length) return;
  sendMessageToChatbot(payload, CHATBOT_ACTIONS.UPDATE_AMAZON_PAY_DATA_BY_SELECTOR);
};

export const waitToLoadAmazonGeneric = (iframe, amazonConfig) => {
  const config = { ...DEFAULT_AMAZON_PAY_CONFIG, ...(amazonConfig?.amazon_pay_config || {}) };
  const detection = config.amazon_detection || DEFAULT_AMAZON_DETECTION;
  const cartSystem = amazonConfig?.cart_system;
  const selectorBindings = amazonConfig?.selector_bindings || [];
  const targetMessages = amazonConfig?.target_messages || amazonConfig?.messages || [];
  let count = 0;
  let sent = false;
  let amazonPayFlagSet = false;

  const interval = setInterval(async () => {
    count++;
    if (!amazonPayFlagSet && isAmazonPayActive(detection)) {
      iframe.src += '&is_using_amazon_pay=true';
      amazonPayFlagSet = true;
    }
    if (!isAmazonPayReady(detection)) {
      if (count >= config.max_count) {
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
      return;
    }
    let payload = await safeGetAmazonPayload();
    if (!payload) {
      payload = buildAmazonSelectorPayload({
        selectorBindings,
        scenarioMessages: targetMessages,
        cartSystem,
        domain: window.location.hostname,
      });
    }
    if (payload?.selectorValues?.length) {
      if (!sent) {
        appendIframeToBody(iframe);
        setTimeout(() => sendAmazonPayDataBySelector(payload), 500);
        sent = true;
      }
      clearInterval(interval);
      return;
    }
    if (count >= config.max_count) {
      appendIframeToBody(iframe);
      clearInterval(interval);
    }
  }, config.poll_interval_ms);
};

export const waitToLoadAmazonSubscstore = (iframe) => {
  const amazonCheckSessionId = getParam('amazonCheckoutSessionId');
  if (amazonCheckSessionId) {
    iframe.src += '&is_using_amazon_pay=true';
    let count = 0;
    const interval = setInterval(() => {
      const isTorizenLpAmazonDataFilled = document.querySelector('input#jsUkProfileFamilyName')?.value;
      if (isTorizenLpAmazonDataFilled && count < WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
      count++;
      if (count >= WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
    }, 200);
    return;
  }
  appendIframeToBody(iframe);
};

const waitToLoadAmazonW2Repeat = (iframe) => {
  const injectAmazon = () => {
    iframe.src += '&is_using_amazon_pay=true';
    let count = 0;
    const interval = setInterval(() => {
      const isYuwaeruLpAmazonDataFilled = document.querySelector('input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerName1')?.value;
      if (isYuwaeruLpAmazonDataFilled && count < WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
      count++;

      if (count >= WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
        appendIframeToBody(iframe);
        clearInterval(interval);
      }
    }, 200);
  };

  const amazonCheckSessionId = getParam('amazonCheckoutSessionId');

  if (amazonCheckSessionId) {
    injectAmazon();
    return;
  }

  let try_times = 0;
  const interval = setInterval(() => {
    if (try_times >= WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
      clearInterval(interval);
      appendIframeToBody(iframe);
      return;
    }
    try_times++;

    const isUsingAmazonPay = !!document.querySelector('#ctl00_ContentPlaceHolder1_ucInputForm_lbCancelAmazonPay');
    if (isUsingAmazonPay) {
      injectAmazon();
      clearInterval(interval);
      return;
    }
  }, 200);
};

export const loadIframeForW2Repeat = (iframe) => {
  const isDisplayCoupon = !!document.querySelector('input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbCouponCode');
  if (isDisplayCoupon) {
    iframe.src += '&is_display_coupon=true';
  }
  const isDisplayPasswordInput = !!document.querySelector('input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbUserPassword');
  if (isDisplayPasswordInput) {
    iframe.src += '&is_display_password_input=true';
  }
  const isDisplayCreditCardInput = !!document.querySelector('input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_rPayment_ctl00_tbCreditCardNo1');
  if (!isDisplayCreditCardInput) {
    iframe.src += '&is_display_credit_card_input=false';
  }
  const isDisplayNameInput = !!document.querySelector('input#ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerName1');
  if (!isDisplayNameInput) {
    iframe.src += '&is_display_display_name_input=false';
  }
  waitToLoadAmazonW2Repeat(iframe);
};

export const waitToLoadAmazonEcForce = (iframe) => {
  let count = 0;
  const interval = setInterval(() => {
    const amazonPayMethodElement = document.querySelector('#amazon_payment_method');
    const name1Value = document.querySelector('input#order_shipping_address_attributes_name1')?.value;

    if (amazonPayMethodElement && name1Value && count < WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
      iframe.src += '&is_using_amazon_pay=true';
      const isEnableEmailInput = !document.querySelector('input#email')?.disabled;
      if (isEnableEmailInput) {
        iframe.src += '&is_enable_email_input=true';
      }
      const isDisplayPasswordInput = !!document.querySelector('input#password');
      if (isDisplayPasswordInput) {
        iframe.src += '&is_display_password_input=true';
      }
      appendIframeToBody(iframe);
      clearInterval(interval);
    }
    count++;

    if (count >= WAIT_TO_LOAD_AMAZON_DATA_MAX_COUNT) {
      appendIframeToBody(iframe);
      clearInterval(interval);
    }
  }, 100);
};
