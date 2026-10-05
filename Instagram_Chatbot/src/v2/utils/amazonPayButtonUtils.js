export const buildAmazonPayButtonClickActionData = (config = {}) => {
  const searchValue = (config.button_fukushashiki_search_value || '').trim();
  if (searchValue) {
    return {
      searchMode: config.button_fukushashiki_search_mode,
      searchValue,
    };
  }

  return (config.button_selector || 'amazon_payment_method').replace(/^#/, '');
};
