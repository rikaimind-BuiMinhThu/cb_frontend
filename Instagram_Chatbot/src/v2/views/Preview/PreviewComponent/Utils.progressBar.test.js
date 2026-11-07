import {
  countProgressBarSteps,
  isProgressBarStep,
} from './Utils';
import {
  COMBINE_CONTENT_ROLES,
  MESSAGE_CONTENT_TYPES,
} from './Constants';

const botText = (id) => ({
  id,
  belong_to: 'bot',
  hidden: false,
  message_content: [{ type: 'text_input', text_input: { content: 'bot' } }],
});

const userInput = (id, overrides = {}) => ({
  id,
  belong_to: 'user',
  hidden: false,
  not_use_button: false,
  message_content: [{ type: 'text_input', text_input: { content: '' } }],
  ...overrides,
});

const userRadio = (id, overrides = {}) => ({
  id,
  belong_to: 'user',
  hidden: false,
  not_use_button: true,
  message_content: [{
    type: MESSAGE_CONTENT_TYPES.RADIO_BUTTON,
    radio_button: { type: 'default' },
  }],
  ...overrides,
});

const botOnlyCombine = (id) => ({
  id,
  belong_to: 'combine',
  hidden: false,
  not_use_button: true,
  message_content: [{
    role: COMBINE_CONTENT_ROLES.BOT,
    type: 'html_code',
    html_code: { content: 'bot only' },
  }],
});

const submitCombine = (id) => ({
  id,
  belong_to: 'combine',
  hidden: false,
  not_use_button: true,
  message_content: [
    {
      role: COMBINE_CONTENT_ROLES.USER,
      type: 'image',
      image: {},
    },
    {
      role: COMBINE_CONTENT_ROLES.USER,
      type: 'agree_term',
      agree_term: {},
    },
    {
      role: COMBINE_CONTENT_ROLES.USER,
      type: MESSAGE_CONTENT_TYPES.SUBMIT_BUTTON,
      button_submit: {},
    },
  ],
});

const buildBot325Messages = ({ creditHidden = true } = {}) => ([
  botText(1),
  userRadio(2),
  botText(3),
  userInput(4),
  botText(5),
  userInput(6),
  botText(7),
  userInput(8),
  botText(9),
  userInput(10),
  botOnlyCombine(26),
  userRadio(13),
  userInput(16, {
    hidden: creditHidden,
    message_content: [{ type: 'credit_card_payment', credit_card_payment: {} }],
  }),
  botOnlyCombine(27),
  userRadio(22),
  submitCombine(28),
]);

describe('isProgressBarStep / countProgressBarSteps', () => {
  it('counts 7 visible answer steps for bot 325 with credit hidden', () => {
    const messages = buildBot325Messages({ creditHidden: true });
    expect(countProgressBarSteps(messages)).toBe(7);
    expect(isProgressBarStep(messages.find((msg) => msg.id === 16))).toBe(false);
    expect(isProgressBarStep(messages.find((msg) => msg.id === 28))).toBe(false);
    expect(isProgressBarStep(messages.find((msg) => msg.id === 26))).toBe(false);
  });

  it('counts 8 after credit card becomes visible', () => {
    const messages = buildBot325Messages({ creditHidden: false });
    expect(countProgressBarSteps(messages)).toBe(8);
    expect(isProgressBarStep(messages.find((msg) => msg.id === 16))).toBe(true);
  });

  it('counts answered steps before the current waiting message', () => {
    const messages = buildBot325Messages({ creditHidden: true });
    const genderIndex = messages.findIndex((msg) => msg.id === 2);
    expect(countProgressBarSteps(messages.slice(0, genderIndex))).toBe(0);
    expect(countProgressBarSteps(messages.slice(0, genderIndex + 1))).toBe(1);
  });

  it('never counts a bot-only combine or an order-submit step', () => {
    expect(isProgressBarStep(botOnlyCombine(99))).toBe(false);
    expect(isProgressBarStep(submitCombine(100))).toBe(false);
  });
});
