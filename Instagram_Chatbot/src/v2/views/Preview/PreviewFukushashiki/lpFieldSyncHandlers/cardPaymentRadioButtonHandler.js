import { MESSAGE_CONTENT_TYPES } from 'v2/views/Preview/PreviewComponent/Constants.jsx';

const CARD_PAYMENT_RADIO = MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON;

const matchesFukushashikiBinding = (searchMode, searchAddress, mode, address) => {
  if (mode == null || address == null) return false;
  return String(mode) === String(searchMode) && String(address) === String(searchAddress);
};

const cardPaymentRadioButtonHandler = {
  id: CARD_PAYMENT_RADIO,

  matches(content, searchMode, searchAddress) {
    if (content.type !== CARD_PAYMENT_RADIO) return false;
    return matchesFukushashikiBinding(
      searchMode,
      searchAddress,
      content.initial_selection_fukushashiki_search_mode,
      content.initial_selection_fukushashiki_search_value,
    );
  },

  getCurrentValue(content) {
    return content.card_payment_radio_button?.initial_selection ?? '';
  },

  applyValue(content, normalizedValue) {
    const sub = content.card_payment_radio_button;
    if (!sub) return;

    sub.initial_selection = normalizedValue;
    sub.is_display_card_payment = (sub.card_linked_setting || []).includes(normalizedValue);
  },
};

export default cardPaymentRadioButtonHandler;
