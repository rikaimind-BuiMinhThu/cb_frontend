export const LEXICA_ORDER_RESULT_MODE_WAIT = 'wait';
export const LEXICA_ORDER_RESULT_MODE_ASYNC = 'async';

const REMOVED_LEXICA_SKU = '';
const REMOVED_LEXICA_THANKS_OFFER = false;
const PINNED_LEXICA_OFFER_CONFIRM_UPSELL = true;
const PINNED_LEXICA_OFFER_CONFIRM_CROSS_SELL = false;

const hasSavedCartSettings = (data = {}) =>
  Boolean(data.lexica_cart_url || data.merchandise_id);

export const LEXICA_SCENARIO_DEFAULTS = {
  orderResultMode: LEXICA_ORDER_RESULT_MODE_WAIT,
  lexicaCartUrl: '',
  useCartSettings: false,
};

const LEXICA_FIELD_KEYS = Object.keys(LEXICA_SCENARIO_DEFAULTS);

export const parseLexicaScenario = (data = {}) => ({
  orderResultMode: data.order_result_mode || LEXICA_ORDER_RESULT_MODE_WAIT,
  lexicaCartUrl: data.lexica_cart_url || '',
  useCartSettings: hasSavedCartSettings(data),
});

export const lexicaStateFromParsed = (parsed = {}) =>
  LEXICA_FIELD_KEYS.reduce(
    (fields, key) => ({
      ...fields,
      [key]:
        parsed[key] === undefined ? LEXICA_SCENARIO_DEFAULTS[key] : parsed[key],
    }),
    { ...LEXICA_SCENARIO_DEFAULTS }
  );

export const lexicaScenarioToApi = (lexica = LEXICA_SCENARIO_DEFAULTS) => ({
  order_result_mode: lexica.orderResultMode || LEXICA_ORDER_RESULT_MODE_WAIT,
  lexica_cart_url: lexica.lexicaCartUrl || '',
  lexica_upsell_sku: REMOVED_LEXICA_SKU,
  lexica_cross_sell_sku: REMOVED_LEXICA_SKU,
  lexica_offer_confirm_upsell: PINNED_LEXICA_OFFER_CONFIRM_UPSELL,
  lexica_offer_confirm_cross_sell: PINNED_LEXICA_OFFER_CONFIRM_CROSS_SELL,
  lexica_offer_thanks_upsell: REMOVED_LEXICA_THANKS_OFFER,
  lexica_offer_thanks_cross_sell: REMOVED_LEXICA_THANKS_OFFER,
});
