export const LEXICA_ORDER_RESULT_MODE_WAIT = 'wait';
export const LEXICA_ORDER_RESULT_MODE_ASYNC = 'async';

const hasSavedCartSettings = (data = {}) => Boolean(
  data.lexica_cart_url
  || data.merchandise_id
  || data.lexica_upsell_sku
  || data.lexica_cross_sell_sku
);

export const LEXICA_SCENARIO_DEFAULTS = {
  orderResultMode: LEXICA_ORDER_RESULT_MODE_WAIT,
  lexicaCartUrl: '',
  lexicaUpsellSku: '',
  lexicaCrossSellSku: '',
  lexicaOfferConfirmUpsell: true,
  lexicaOfferConfirmCrossSell: false,
  lexicaOfferThanksUpsell: true,
  lexicaOfferThanksCrossSell: true,
  useCartSettings: false,
};

const LEXICA_FIELD_KEYS = Object.keys(LEXICA_SCENARIO_DEFAULTS);

export const parseLexicaScenario = (data = {}) => ({
  orderResultMode: data.order_result_mode || LEXICA_ORDER_RESULT_MODE_WAIT,
  lexicaCartUrl: data.lexica_cart_url || '',
  lexicaUpsellSku: data.lexica_upsell_sku || '',
  lexicaCrossSellSku: data.lexica_cross_sell_sku || '',
  lexicaOfferConfirmUpsell: data.lexica_offer_confirm_upsell !== false,
  lexicaOfferConfirmCrossSell: data.lexica_offer_confirm_cross_sell === true,
  lexicaOfferThanksUpsell: data.lexica_offer_thanks_upsell !== false,
  lexicaOfferThanksCrossSell: data.lexica_offer_thanks_cross_sell !== false,
  useCartSettings: hasSavedCartSettings(data),
});

export const lexicaStateFromParsed = (parsed = {}) => (
  LEXICA_FIELD_KEYS.reduce((fields, key) => ({
    ...fields,
    [key]: parsed[key] === undefined ? LEXICA_SCENARIO_DEFAULTS[key] : parsed[key],
  }), { ...LEXICA_SCENARIO_DEFAULTS })
);

export const lexicaScenarioToApi = (lexica = LEXICA_SCENARIO_DEFAULTS) => ({
  order_result_mode: lexica.orderResultMode || LEXICA_ORDER_RESULT_MODE_WAIT,
  lexica_cart_url: lexica.lexicaCartUrl || '',
  lexica_upsell_sku: lexica.lexicaUpsellSku || '',
  lexica_cross_sell_sku: lexica.lexicaCrossSellSku || '',
  lexica_offer_confirm_upsell: lexica.lexicaOfferConfirmUpsell !== false,
  lexica_offer_confirm_cross_sell: lexica.lexicaOfferConfirmCrossSell === true,
  lexica_offer_thanks_upsell: lexica.lexicaOfferThanksUpsell !== false,
  lexica_offer_thanks_cross_sell: lexica.lexicaOfferThanksCrossSell !== false,
});
