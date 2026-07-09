import {
  buildBindingsFromSelectorKey,
  extractSelectorBindingsFromMessages,
  isHostnameAllowedForLp,
  normalizeLpDomain,
} from './bindings';

describe('amazon bindings', () => {
  describe('buildBindingsFromSelectorKey', () => {
    it('splits comma-separated selectors', () => {
      expect(buildBindingsFromSelectorKey({
        selectorKeyType: 'fukushashiki_search_value',
        rawValue: '#a, #b',
        valuePath: 'text_input.text.value',
      })).toEqual([
        {
          selectorKeyType: 'fukushashiki_search_value',
          sourceSelector: '#a',
          valuePath: 'text_input.text.value',
        },
        {
          selectorKeyType: 'fukushashiki_search_value',
          sourceSelector: '#b',
          valuePath: 'text_input.text.value',
        },
      ]);
    });

    it('returns empty array when value path is missing', () => {
      expect(buildBindingsFromSelectorKey({
        selectorKeyType: 'fukushashiki_search_value',
        rawValue: '#a',
        valuePath: '',
      })).toEqual([]);
    });
  });

  describe('extractSelectorBindingsFromMessages', () => {
    it('extracts bindings from amazon pay user messages only', () => {
      const messages = [
        {
          id: 1,
          belong_to: 'user',
          is_used_when_amazon_pay: true,
          message_content: [{
            type: 'text_input',
            text_input: { type: 'text' },
            fukushashiki_search_value: '#email',
          }],
        },
        {
          id: 2,
          belong_to: 'bot',
          is_used_when_amazon_pay: true,
          message_content: [{
            type: 'text_input',
            text_input: { type: 'text' },
            fukushashiki_search_value: '#ignored',
          }],
        },
      ];

      const bindings = extractSelectorBindingsFromMessages(messages);
      expect(bindings).toHaveLength(1);
      expect(bindings[0]).toMatchObject({
        messageId: 1,
        contentIndex: 0,
        sourceSelector: '#email',
        valuePath: 'text_input.text.value',
      });
    });
  });

  describe('normalizeLpDomain', () => {
    it('strips protocol and www prefix', () => {
      expect(normalizeLpDomain('https://www.example.com/path')).toBe('example.com');
    });
  });

  describe('isHostnameAllowedForLp', () => {
    it('matches exact and subdomain hosts', () => {
      expect(isHostnameAllowedForLp('shop.example.com', ['example.com'])).toBe(true);
      expect(isHostnameAllowedForLp('other.com', ['example.com'])).toBe(false);
    });
  });
});
