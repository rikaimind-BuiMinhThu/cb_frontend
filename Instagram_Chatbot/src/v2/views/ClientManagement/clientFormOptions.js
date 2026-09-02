import {
  BOOLEAN_STRING_FALSE,
  BOOLEAN_STRING_TRUE,
  CART_SYSTEM_NONE,
  CART_SYSTEM_SHOPIFY,
  FEATURE_NO,
  FEATURE_YES,
  STATUS_ACTIVE,
  STATUS_ENDED,
  STATUS_ID_ACTIVE,
  STATUS_ID_ENDED,
  STATUS_ID_PAUSE,
  STATUS_ID_TRIAL,
  STATUS_LABEL_ACTIVE,
  STATUS_LABEL_ENDED,
  STATUS_LABEL_PAUSE,
  STATUS_LABEL_TRIAL,
  STATUS_PAUSE,
  STATUS_TRIAL,
} from './constants';

export const ENTERPRISE_TYPE_OPTIONS = [
  '株式会社',
  '有限会社',
  '合名会社',
  '合資会社',
  '合同会社',
  '医療法人',
  '医療法人社団',
  '医療法人財団',
  '社会医療法人',
  '一般財団法人',
  '公益財団法人',
  '一般社団法人',
  '公益社団法人',
  '宗教法人',
  '学校法人',
  '社会福祉法人',
  '更生保護法人',
  '相互社会',
  '特定非営利活動法人',
  '独立行政法人',
  '地方独立行政法人',
  '弁護士法人',
  '有限責任中間法人',
  '無限責任中間法人',
  '行政書士法人',
  '司法書士法人',
  '税理士法人',
  '国立大学法人',
  '公立大学法人',
  '農事組合法人',
  '管理組合法人',
  '社会保険労務士法人',
];

export const ENTERPRISE_TYPE_2_OPTIONS = ['先頭に使う', '末尾に使う', FEATURE_NO];

export const PREFECTURE_OPTIONS = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
];

export const CART_SYSTEM_TAMAGO_REPEAT = 'tamago_repeat';
export const CART_SYSTEM_SUBSC_STORE = 'subsc_store';
export const CART_SYSTEM_EC_FORCE = 'ec_force';
export const CART_SYSTEM_REPEAT_PLUS = 'repeat_plus';

export const CART_LABEL_NONE = FEATURE_NO;
export const CART_LABEL_TAMAGO_REPEAT = 'たまごリピート';
export const CART_LABEL_SUBSC_STORE = 'サブスクストア';
export const CART_LABEL_SHOPIFY = 'Shopify';
export const CART_LABEL_EC_FORCE = 'Ec-Force';
export const CART_LABEL_REPEAT_PLUS = 'リピートPLUS';

export const CART_SYSTEM_OPTIONS = [
  { value: CART_SYSTEM_NONE, label: CART_LABEL_NONE },
  { value: CART_SYSTEM_TAMAGO_REPEAT, label: CART_LABEL_TAMAGO_REPEAT },
  { value: CART_SYSTEM_SUBSC_STORE, label: CART_LABEL_SUBSC_STORE },
  { value: CART_SYSTEM_SHOPIFY, label: CART_LABEL_SHOPIFY },
  { value: CART_SYSTEM_EC_FORCE, label: CART_LABEL_EC_FORCE },
  { value: CART_SYSTEM_REPEAT_PLUS, label: CART_LABEL_REPEAT_PLUS },
];

export const BOT_FEATURE_RADIO_OPTIONS = [
  { value: BOOLEAN_STRING_TRUE, label: FEATURE_YES },
  { value: BOOLEAN_STRING_FALSE, label: FEATURE_NO },
];

export const STATUS_OPTIONS = [
  { value: STATUS_ACTIVE, label: STATUS_LABEL_ACTIVE, id: STATUS_ID_ACTIVE },
  { value: STATUS_PAUSE, label: STATUS_LABEL_PAUSE, id: STATUS_ID_PAUSE },
  { value: STATUS_ENDED, label: STATUS_LABEL_ENDED, id: STATUS_ID_ENDED },
  { value: STATUS_TRIAL, label: STATUS_LABEL_TRIAL, id: STATUS_ID_TRIAL },
];
