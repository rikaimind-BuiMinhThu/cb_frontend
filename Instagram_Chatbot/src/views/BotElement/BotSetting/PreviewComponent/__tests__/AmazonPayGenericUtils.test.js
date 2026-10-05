import { mapAmazonPayDataBySelector } from '../AmazonPayGenericUtils';
import { normalizeAllowedLpDomains, hasValidAmazonPaySelectors, buildAmazonPayButtonClickActionData } from '../../ScenarioSetting/utils/amazonPayConfigUtils';
import { LP_INTEGRATION_MODES } from '../../../../../variables/amazonPayConstants';

describe('AmazonPay generic mapping', () => {
  it('fills only messages with is_used_when_amazon_pay', () => {
    const messagesList = [
      {
        id: 1,
        belong_to: 'user',
        is_used_when_amazon_pay: true,
        message_content: [{
          left_fukushashiki_search_value: 'order_shipping_address_attributes_name1',
          text_input: { type: 'text', text: { valueLeft: '' } },
        }],
      },
      {
        id: 2,
        belong_to: 'user',
        is_used_when_amazon_pay: false,
        message_content: [{
          left_fukushashiki_search_value: 'order_shipping_address_attributes_name1',
          text_input: { type: 'text', text: { valueLeft: '' } },
        }],
      },
    ];

    const { messagesList: updated, changed } = mapAmazonPayDataBySelector({
      selectorValues: [{
        selectorKeyType: 'left_fukushashiki_search_value',
        sourceSelector: 'order_shipping_address_attributes_name1',
        valuePath: 'text_input.text.valueLeft',
        value: '山田',
      }],
    }, messagesList);

    expect(changed).toBe(true);
    expect(updated[0].message_content[0].text_input.text.valueLeft).toBe('山田');
    expect(updated[1].message_content[0].text_input.text.valueLeft).toBe('');
  });
});

describe('AmazonPay config utils', () => {
  it('normalizes allowed domains', () => {
    expect(normalizeAllowedLpDomains(['https://WWW.Example.JP/path', 'example.jp']))
      .toEqual(['example.jp']);
  });

  it('detects missing selectors for flagged messages', () => {
    expect(hasValidAmazonPaySelectors({
      message_content: [{ fukushashiki_search_mode: 1 }],
    })).toBe(false);
    expect(hasValidAmazonPaySelectors({
      message_content: [{ fukushashiki_search_value: 'email' }],
    })).toBe(true);
  });

  it('exposes integration modes', () => {
    expect(LP_INTEGRATION_MODES.AUTO).toBe('auto');
  });

  it('builds Fukushashiki click payload when search value is set', () => {
    expect(buildAmazonPayButtonClickActionData({
      button_fukushashiki_search_mode: 2,
      button_fukushashiki_search_value: '#AmazonPayCv2Button',
    })).toEqual({
      searchMode: 2,
      searchValue: '#AmazonPayCv2Button',
    });
  });

  it('falls back to legacy button_selector when Fukushashiki value is empty', () => {
    expect(buildAmazonPayButtonClickActionData({
      button_selector: '#amazon_payment_method',
    })).toBe('amazon_payment_method');
  });
});
