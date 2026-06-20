import { DEFAULT_AMAZON_PAY_BUTTON_CONFIG } from '../../../../../variables/amazonPayConstants';
import { COMBINE_MESSAGE_DEFAULTS } from '../../PreviewComponent/Constants';
import { createDefaultContentItem, getNextContentId } from './scenarioContentDefaults';
import { getDefaultOrderConfirmConfig } from './OrderConfirmLpScriptGenerator';

export const COMBINE_BOT_TYPE_OPTIONS = [
  ['text_input', 'テキスト'],
  ['getting_error_notification', 'エラー取得の通知'],
  ['file', 'ファイル'],
  ['html_code', 'HTMLコード'],
  ['amazon_pay_button', 'Amazon Payボタン'],
  ['order_confirm', '注文確認'],
];

export const COMBINE_USER_TYPE_OPTIONS = [
  ['text_input', 'テキスト入力'],
  ['image', '画像'],
  ['label', 'ラベル'],
  ['textarea', 'テキストエリア'],
  ['radio_button', 'ラジオボタン'],
  ['checkbox', 'チェックボックス'],
  ['pull_down', 'プルダウン'],
  ['zip_code_address', '郵便番号と住所'],
  ['attaching_file', 'ファイル添付'],
  ['calendar', 'カレンダー'],
  ['agree_term', '規約同意'],
  ['carousel', 'カルーセル'],
  ['credit_card_payment', 'カード決済'],
  ['capture', 'キャプチャ'],
  ['product_purchase', '商品購入'],
  ['product_purchase_radio_button', '商品購入（ラジオボタン型）'],
  ['product_purchase_select_option', '商品購入（プルダウン）'],
  ['slider', 'スライダー'],
  ['card_payment_radio_button', 'ラジオボタン付きカード決済'],
  ['shipping_address', '配送先住所'],
  ['button_submit', '確認する'],
];

const COMBINE_TYPE_LABEL_MAP = Object.fromEntries([
  ...COMBINE_BOT_TYPE_OPTIONS,
  ...COMBINE_USER_TYPE_OPTIONS,
]);

export function getCombineContentTypeLabel(role, type) {
  if (COMBINE_TYPE_LABEL_MAP[type]) {
    return COMBINE_TYPE_LABEL_MAP[type];
  }
  return type || '';
}

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
});

export function createDefaultCombineMessage(dataInputVar = []) {
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
}

export function createDefaultCombineBotBlock(type, idMax) {
  const block = {
    id: idMax,
    role: 'bot',
    padding: COMBINE_MESSAGE_DEFAULTS.BLOCK_PADDING,
    ...createBotContentStub(type),
  };
  return block;
}

export function createDefaultCombineUserBlock(type, idMax) {
  const block = createDefaultContentItem(type, idMax);
  return {
    ...block,
    role: 'user',
    padding: COMBINE_MESSAGE_DEFAULTS.BLOCK_PADDING,
  };
}

export function createDefaultCombineBlock(role, type, messageContentArray) {
  const idMax = getNextContentId(messageContentArray);
  if (role === 'bot') {
    return createDefaultCombineBotBlock(type, idMax);
  }
  return createDefaultCombineUserBlock(type, idMax);
}
