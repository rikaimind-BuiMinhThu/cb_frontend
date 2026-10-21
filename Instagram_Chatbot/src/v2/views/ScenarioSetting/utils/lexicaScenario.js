const ORDER_RESULT_MODE_WAIT = 'wait';

export const LEXICA_SCENARIO_DEFAULTS = {
  orderResultMode: ORDER_RESULT_MODE_WAIT,
  lexicaCartUrl: '',
  lexicaUpsellProductUrl: '',
  lexicaUpsellSku: '',
  lexicaCrossSellProductUrl: '',
  lexicaCrossSellSku: '',
  lexicaOfferChat: true,
  lexicaOfferConfirmUpsell: true,
  lexicaOfferConfirmCrossSell: false,
  lexicaOfferThanksUpsell: true,
  lexicaOfferThanksCrossSell: true,
};

const LEXICA_FIELD_KEYS = Object.keys(LEXICA_SCENARIO_DEFAULTS);

export const parseLexicaScenario = (data = {}) => ({
  orderResultMode: data.order_result_mode || ORDER_RESULT_MODE_WAIT,
  lexicaCartUrl: data.lexica_cart_url || '',
  lexicaUpsellProductUrl: data.lexica_upsell_product_url || '',
  lexicaUpsellSku: data.lexica_upsell_sku || '',
  lexicaCrossSellProductUrl: data.lexica_cross_sell_product_url || '',
  lexicaCrossSellSku: data.lexica_cross_sell_sku || '',
  lexicaOfferChat: data.lexica_offer_chat !== false,
  lexicaOfferConfirmUpsell: data.lexica_offer_confirm_upsell !== false,
  lexicaOfferConfirmCrossSell: data.lexica_offer_confirm_cross_sell === true,
  lexicaOfferThanksUpsell: data.lexica_offer_thanks_upsell !== false,
  lexicaOfferThanksCrossSell: data.lexica_offer_thanks_cross_sell !== false,
});

export const lexicaStateFromParsed = (parsed = {}) => (
  LEXICA_FIELD_KEYS.reduce((fields, key) => ({
    ...fields,
    [key]: parsed[key] === undefined ? LEXICA_SCENARIO_DEFAULTS[key] : parsed[key],
  }), { ...LEXICA_SCENARIO_DEFAULTS })
);

export const lexicaScenarioToApi = (lexica = LEXICA_SCENARIO_DEFAULTS) => ({
  order_result_mode: lexica.orderResultMode || ORDER_RESULT_MODE_WAIT,
  lexica_cart_url: lexica.lexicaCartUrl || '',
  lexica_upsell_product_url: lexica.lexicaUpsellProductUrl || '',
  lexica_upsell_sku: lexica.lexicaUpsellSku || '',
  lexica_cross_sell_product_url: lexica.lexicaCrossSellProductUrl || '',
  lexica_cross_sell_sku: lexica.lexicaCrossSellSku || '',
  lexica_offer_chat: lexica.lexicaOfferChat !== false,
  lexica_offer_confirm_upsell: lexica.lexicaOfferConfirmUpsell !== false,
  lexica_offer_confirm_cross_sell: lexica.lexicaOfferConfirmCrossSell === true,
  lexica_offer_thanks_upsell: lexica.lexicaOfferThanksUpsell !== false,
  lexica_offer_thanks_cross_sell: lexica.lexicaOfferThanksCrossSell !== false,
});
