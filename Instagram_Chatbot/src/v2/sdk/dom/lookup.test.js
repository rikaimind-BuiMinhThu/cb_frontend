import { getElementByAddress, removeLeadingZero } from './lookup';
import { SEARCH_MODES } from '../constants';

describe('dom lookup', () => {
  beforeEach(() => {
    document.body.innerHTML = '<input id="email" value="a@b.com" /><div class="target">x</div>';
  });

  describe('getElementByAddress', () => {
    it('finds element by id', () => {
      expect(getElementByAddress(SEARCH_MODES.ID, 'email')?.id).toBe('email');
    });

    it('finds element by css selector', () => {
      expect(getElementByAddress(SEARCH_MODES.CSS_SELECTOR, '.target')?.className).toBe('target');
    });

    it('returns null when mode or address is missing', () => {
      expect(getElementByAddress(null, '#x')).toBeNull();
      expect(getElementByAddress(SEARCH_MODES.ID, '')).toBeNull();
    });

    it('throws for invalid search mode', () => {
      expect(() => getElementByAddress(999, '#x')).toThrow('Invalid search mode');
    });
  });

  describe('removeLeadingZero', () => {
    it('removes leading zeros from strings and numbers', () => {
      expect(removeLeadingZero('0012')).toBe('12');
      expect(removeLeadingZero(8)).toBe(8);
    });
  });
});
