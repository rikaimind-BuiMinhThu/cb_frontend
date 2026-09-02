import { DEFAULT_AMAZON_PAY_BUTTON_CONFIG } from 'v2/variables/amazonPayConstants';
import { COMBINE_MESSAGE_DEFAULTS } from 'v2/views/Preview/PreviewComponent/Constants';
import { createDefaultContentItem, getNextContentId } from './scenarioContentDefaults';
import { getDefaultOrderConfirmConfig } from './OrderConfirmLpScriptGenerator';
import { getDefaultCartLoginConfig } from '../constants/cartLoginConstants';
import {
  COMBINE_BOT_TYPE_OPTIONS,
  COMBINE_USER_TYPE_OPTIONS,
} from '../constants/scenarioPanelOptions';

export { COMBINE_BOT_TYPE_OPTIONS, COMBINE_USER_TYPE_OPTIONS };

const COMBINE_TYPE_LABEL_MAP = Object.fromEntries([
  ...COMBINE_BOT_TYPE_OPTIONS,
  ...COMBINE_USER_TYPE_OPTIONS,
]);

export const getCombineContentTypeLabel = (role, type) => {
  if (COMBINE_TYPE_LABEL_MAP[type]) {
    return COMBINE_TYPE_LABEL_MAP[type];
  }
  return type || '';
};

const createBotContentStub = (type) => ({
  type,
  text_input: {
    use_for_confirm_message: false,
    content: '',
  },
  getting_error_notification: {
    use_for_confirm_message: false,
    content: '',
  },
  email: {},
  file: {},
  script: {},
  html_code: {},
  amazon_pay_button: { ...DEFAULT_AMAZON_PAY_BUTTON_CONFIG },
  delay: {},
  api_link_age: {},
  clear_variable: {
    variables: [],
  },
  variable_set: {
    variables: [],
  },
  order_confirm: getDefaultOrderConfirmConfig(),
  cart_login: getDefaultCartLoginConfig(),
});

export const createDefaultCombineBotBlock = (type, idMax) => {
  const block = {
    id: idMax,
    role: 'bot',
    padding: COMBINE_MESSAGE_DEFAULTS.BLOCK_PADDING,
    ...createBotContentStub(type),
  };
  return block;
};

export const createDefaultCombineUserBlock = (type, idMax) => {
  const block = createDefaultContentItem(type, idMax);
  return {
    ...block,
    role: 'user',
    padding: COMBINE_MESSAGE_DEFAULTS.BLOCK_PADDING,
  };
};

export const createDefaultCombineMessage = (dataInputVar = []) => {
  const defaultVarName = dataInputVar[0]?.variable_name;
  const firstBlock = createDefaultCombineBotBlock('text_input', 1);
  if (defaultVarName) {
    firstBlock.clear_variable.variables = [defaultVarName];
    firstBlock.variable_set.variables = [{ key: defaultVarName, value: '' }];
  }

  return {
    id: 1,
    hidden: false,
    belong_to: 'combine',
    conditions: [],
    is_display_button_next: true,
    combine_message: {
      content_gap: COMBINE_MESSAGE_DEFAULTS.CONTENT_GAP,
    },
    message_content: [firstBlock],
  };
};

export const createDefaultCombineBlock = (role, type, messageContentArray) => {
  const idMax = getNextContentId(messageContentArray);
  if (role === 'bot') {
    return createDefaultCombineBotBlock(type, idMax);
  }
  return createDefaultCombineUserBlock(type, idMax);
};
