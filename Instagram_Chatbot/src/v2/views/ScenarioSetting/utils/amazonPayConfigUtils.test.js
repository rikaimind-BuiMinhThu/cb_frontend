import { AMAZON_PAY_DISPLAY_MODES, AMAZON_PAY_URL_FLAG } from 'v2/variables/amazonPayConstants';
import {
  applyAmazonPayUsageToMessage,
  ensureAmazonPayUsageDisplayCondition,
  getAmazonPayDisplayModeFromConditions,
} from './amazonPayConfigUtils';

const AUDIENCE_CONDITION = {
  linkCondition: 'and',
  condition: 'include',
  nameCondition: 'variable',
  inputCondition: 'vip',
};

const DISPLAY_WHEN_CONDITION = {
  linkCondition: 'and',
  condition: 'include',
  nameCondition: 'current_url',
  inputCondition: AMAZON_PAY_URL_FLAG,
};

const UNDISPLAY_WHEN_CONDITION = {
  linkCondition: 'and',
  condition: 'not_include',
  nameCondition: 'current_url',
  inputCondition: AMAZON_PAY_URL_FLAG,
};

describe('applyAmazonPayUsageToMessage', () => {
  it('adds the display-when URL condition when the usage flag is turned on', () => {
    const nextMessage = applyAmazonPayUsageToMessage({
      id: 1,
      conditions: [AUDIENCE_CONDITION],
    }, true);

    expect(nextMessage.is_used_when_amazon_pay).toBe(true);
    expect(nextMessage.conditions).toEqual([AUDIENCE_CONDITION, DISPLAY_WHEN_CONDITION]);
    expect(getAmazonPayDisplayModeFromConditions(nextMessage.conditions))
      .toBe(AMAZON_PAY_DISPLAY_MODES.DISPLAY_WHEN);
  });

  it('removes only the managed Amazon Pay condition when the usage flag is turned off', () => {
    const nextMessage = applyAmazonPayUsageToMessage({
      id: 1,
      is_used_when_amazon_pay: true,
      conditions: [AUDIENCE_CONDITION, DISPLAY_WHEN_CONDITION],
    }, false);

    expect(nextMessage.is_used_when_amazon_pay).toBe(false);
    expect(nextMessage.conditions).toEqual([AUDIENCE_CONDITION]);
    expect(getAmazonPayDisplayModeFromConditions(nextMessage.conditions))
      .toBe(AMAZON_PAY_DISPLAY_MODES.ALWAYS);
  });

  it('does not overwrite an existing undisplay-when Amazon Pay condition', () => {
    const nextMessage = applyAmazonPayUsageToMessage({
      id: 1,
      conditions: [AUDIENCE_CONDITION, UNDISPLAY_WHEN_CONDITION],
    }, true);

    expect(nextMessage.is_used_when_amazon_pay).toBe(true);
    expect(nextMessage.conditions).toEqual([AUDIENCE_CONDITION, UNDISPLAY_WHEN_CONDITION]);
    expect(getAmazonPayDisplayModeFromConditions(nextMessage.conditions))
      .toBe(AMAZON_PAY_DISPLAY_MODES.UNDISPLAY_WHEN);
  });
});

describe('ensureAmazonPayUsageDisplayCondition', () => {
  it('backfills display-when when the usage flag is set and no managed condition exists', () => {
    const nextMessage = ensureAmazonPayUsageDisplayCondition({
      id: 1,
      is_used_when_amazon_pay: true,
      conditions: [AUDIENCE_CONDITION],
    });

    expect(nextMessage.conditions).toEqual([AUDIENCE_CONDITION, DISPLAY_WHEN_CONDITION]);
  });

  it('does not overwrite undisplay-when on save or load', () => {
    const message = {
      id: 1,
      is_used_when_amazon_pay: true,
      conditions: [UNDISPLAY_WHEN_CONDITION],
    };

    expect(ensureAmazonPayUsageDisplayCondition(message).conditions)
      .toEqual([UNDISPLAY_WHEN_CONDITION]);
  });

  it('leaves messages without the usage flag unchanged', () => {
    const message = {
      id: 1,
      is_used_when_amazon_pay: false,
      conditions: [AUDIENCE_CONDITION],
    };

    expect(ensureAmazonPayUsageDisplayCondition(message)).toBe(message);
  });
});
