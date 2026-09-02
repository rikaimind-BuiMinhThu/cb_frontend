export const CARD_NUMBER_LABEL = 'Card Number:';
export const CARD_HOLDER_LABEL = 'Card Holder:';
export const CARD_EXPIRY_LABEL = 'Card expiry date:';
export const SECURITY_CODE_LABEL = 'Security code:';
export const YEAR_PLACEHOLDER = 'Year';
export const MONTH_PLACEHOLDER = 'Month';
export const CARD_NUMBER_PLACEHOLDER = 'Please input card number...';
export const CARD_HOLDER_PLACEHOLDER = 'Please input card holder...';
export const SECURITY_CODE_PLACEHOLDER = 'Please input security code...';
export const PURCHASE_BUTTON = 'Purchase';
export const PURCHASE_ERROR = 'Please input all field';
export const EMPTY_VALUE = '';
export const MONTH_PAD_THRESHOLD = 10;
export const YEAR_RANGE_COUNT = 8;
export const GMO_TOKEN_SCRIPT_SRC = 'https://stg.static.mul-pay.jp/ext/js/token.js';
export const GMO_SHOP_ID = 'tshop00058883';
export const GMO_SUCCESS_CODE = '000';
export const EXPIRE_YEAR_PREFIX = '2019';
export const MONTH_PAD_PREFIX = '0';

export const API_WARNING_CODE = 2;
export const DEFAULT_VARIABLE_ID = 1;
export const DEFAULT_AMOUNT = 0;
export const CLIENT_FILTER_DEEL = 'deel';
export const TAB_ORDERS = 'orders';
export const TAB_SETTINGS = 'settings';

export const TAX_INTERNAL = 'internal_tax';
export const TAX_FOREIGN = 'foreign_tax';
export const TAX_RATE_EIGHT = 'eight_percent';
export const TAX_RATE_TEN = 'ten_percent';
export const TAX_TRUNCATION = 'truncation';
export const TAX_ROUNDED_UP = 'rounded_up';

export const SPECIFY_PAYMENT_NO = 'no';
export const SPECIFY_PAYMENT_YES = 'yes';
export const SETTLEMENT_FEE_FREE = 'free';
export const SETTLEMENT_FEE_PAID = 'paid';
export const SHIPPING_FEE_FREE = 'free';
export const SHIPPING_FEE_PAID = 'paid';
export const NP_DEFERRED_NO = 'no';
export const NP_DEFERRED_YES = 'yes';
export const NP_INVOICE_NOT_INCLUDE = 'not_include';
export const NP_INVOICE_ENCLOSED = 'enclosed';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const ORDER_TABLE_SCROLL_X = 1400;

export const VARIABLES_PAGE_ALL_SUFFIX = '/variables?page=all';
export const CHATBOTS_PATH_PREFIX = '/api/v1/managements/chatbots';
export const PAYMENT_GATEWAYS_ALL_PATH = '/api/v1/payment_managements/payment_gateways?page=all';
export const PAYMENT_MANAGEMENT_PATH_PREFIX = '/api/v1/payment_managements/payment_managements';
export const UPDATE_CONSUMPTION_TAX_SUFFIX = '/update_consumption_tax';
export const UPDATE_SPECIFY_GATEWAY_SUFFIX = '/update_specify_payment_gateway';
export const UPDATE_SETTLEMENT_FEE_SUFFIX = '/update_settlement_fee';
export const UPDATE_SHIPPING_FEE_SUFFIX = '/update_shipping_fee';
export const UPDATE_NP_DEFERRED_SUFFIX = '/update_np_deferred_payment';
export const CLIENTS_WITH_NAME_PATH = '/api/v1/managements/get_client_with_name';
export const BOTS_BY_CLIENT_PATH = '/api/v1/managements/get_list_chatbot_by_client?client_id=';

export const TAB_ORDERS_LABEL = '注文履歴';
export const TAB_SETTINGS_LABEL = '設定';
export const UPDATE_SUCCESS_MESSAGE = '正常に更新されました！';
export const DATE_RANGE_ERROR = '開始日の値は、終了日の値より小さいです。';
export const REQUIRED_FIELD_MESSAGE = '必ず指定してください。';
export const VARIABLE_REQUIRED_MESSAGE = '変数は、必ず指定してください。';
export const GATEWAY_REQUIRED_MESSAGE = '決済ゲートウェイは、必ず指定してください。';
export const COMMISSION_REQUIRED_MESSAGE = '手数料を入力してください。';
export const NP_MAX_MIN_ERROR = 'NP 決済の最大値は最小値より大きくなければなりません。';

export const CONSUMPTION_TAX_TITLE = '消費税';
export const TAX_INCLUDED_LABEL = '内税';
export const TAX_EXCLUDED_LABEL = '外税';
export const TAX_RATE_LABEL = '消費税率（％）';
export const TAX_ROUNDING_LABEL = '1円未満';
export const TAX_TRUNCATION_LABEL = '切り捨て';
export const TAX_ROUNDED_UP_LABEL = '切り上げ';
export const TAX_INCLUDED_HINT = '内税の場合は、商品金額小計をそのまま注文金額とします。';
export const TAX_EXCLUDED_HINT = '外税の場合は、商品金額小計に税率を上乗せして注文金額とします。';
export const TAX_RATE_EIGHT_LABEL = '8';
export const TAX_RATE_TEN_LABEL = '10';

export const SPECIFY_GATEWAY_TITLE = '決済ゲートウェイ指定';
export const SETTLEMENT_FEE_TITLE = '決済手数料（税込）';
export const SHIPPING_FEE_TITLE = '送料（税込）';
export const NP_DEFERRED_TITLE = 'NP後払い';
export const NONE_LABEL = '無し';
export const YES_LABEL = 'あり';
export const FREE_LABEL = '無料';
export const PAID_LABEL = '有料';
export const PAYMENT_METHOD_VARIABLE_LABEL = '決済方法の変数名';
export const ADDRESS_VARIABLE_LABEL = '住所の変数名';
export const VARIABLE_VALUE_LABEL = '変数値';
export const REQUIRED_BADGE = '必須';
export const GATEWAY_LABEL = '決済ゲートウェイ';
export const COMMISSION_LABEL = '手数料';
export const YEN_TAX_INCLUDED = '円（税込）';
export const YEN_LABEL = '円';
export const ADD_ROW_LABEL = '行を追加';
export const PREFECTURE_COLUMN = '都道府県';
export const AMOUNT_COLUMN = '金額';
export const INVOICE_INCLUDED_LABEL = '請求書の同梱';
export const INVOICE_NOT_INCLUDED_LABEL = '同梱しない';
export const INVOICE_ENCLOSED_LABEL = '同梱する（NP後払いwiz）';
export const NP_CONTRACT_HINT = '※別途ヤマトクレジットファイナンスとの契約が必要になります。';
export const NP_MAX_AMOUNT_LABEL = '上限金額';
export const NP_SETTLEMENT_FEE_LABEL = '決済手数料（税込）';
export const RANGE_SEPARATOR = '~';
export const ZERO_PLACEHOLDER = '0';

export const ORDER_DATETIME_LABEL = '注文日時';
export const CLIENT_LABEL = 'クライアント';
export const BOT_LABEL = 'ボット';
export const DEEL_LABEL = 'Deel';
export const SELECT_BOT_PLACEHOLDER = 'ボットを選択';
export const EMPTY_ORDERS_DESCRIPTION = '注文データがありません';

export const COL_NO = '番号';
export const COL_USER_ID = 'ユーザID';
export const COL_ORDER_NUMBER = '注文番号';
export const COL_PRODUCT_NAME = '商品名';
export const COL_UNIT_PRICE = '単価';
export const COL_QUANTITY = '数量';
export const COL_PRICE = '価格';
export const COL_TAX = '消費税';
export const COL_SETTLEMENT_FEE = '決済手数料（税込）';
export const COL_SHIPPING_FEE = '送料（税込）';
export const COL_TOTAL = '合計（税込）';
export const COL_MODE = 'モード';
export const COL_STATUS = '状態';
export const COL_ORDERED_AT = '注文日時';

export const PREFECTURES = [
  { prefectur: 'hokkaido', prefectureName: '北海道' },
  { prefectur: 'aomori', prefectureName: '青森県' },
  { prefectur: 'iwate', prefectureName: '岩手県' },
  { prefectur: 'miyagi', prefectureName: '宮城県' },
  { prefectur: 'akita', prefectureName: '秋田県' },
  { prefectur: 'yamagata', prefectureName: '山形県' },
  { prefectur: 'fukushima', prefectureName: '福島県' },
  { prefectur: 'ibaraki', prefectureName: '茨城県' },
  { prefectur: 'tochigi', prefectureName: '栃木県' },
  { prefectur: 'gunma', prefectureName: '群馬県' },
  { prefectur: 'saitama', prefectureName: '埼玉県' },
  { prefectur: 'chiba', prefectureName: '千葉県' },
  { prefectur: 'tokyo', prefectureName: '東京都' },
  { prefectur: 'kanagawa', prefectureName: '神奈川県' },
  { prefectur: 'niigata', prefectureName: '新潟県' },
  { prefectur: 'toyama', prefectureName: '富山県' },
  { prefectur: 'ishikawa', prefectureName: '石川県' },
  { prefectur: 'fukui', prefectureName: '福井県' },
  { prefectur: 'yamanashi', prefectureName: '山梨県' },
  { prefectur: 'nagano', prefectureName: '長野県' },
  { prefectur: 'gifu', prefectureName: '岐阜県' },
  { prefectur: 'shizuoka', prefectureName: '静岡県' },
  { prefectur: 'aichi', prefectureName: '愛知県' },
  { prefectur: 'Mie', prefectureName: '三重県' },
  { prefectur: 'shiga', prefectureName: '滋賀県' },
  { prefectur: 'kyoto', prefectureName: '京都府' },
  { prefectur: 'osaka', prefectureName: '大阪府' },
  { prefectur: 'hyogo', prefectureName: '兵庫県' },
  { prefectur: 'nara', prefectureName: '奈良県' },
  { prefectur: 'wakayama', prefectureName: '和歌山県' },
  { prefectur: 'tottori', prefectureName: '鳥取県' },
  { prefectur: 'shimane', prefectureName: '島根県' },
  { prefectur: 'okayama', prefectureName: '岡山県' },
  { prefectur: 'hiroshima', prefectureName: '広島県' },
  { prefectur: 'yamaguchi', prefectureName: '山口県' },
  { prefectur: 'tokushima', prefectureName: '徳島県' },
  { prefectur: 'kagawa', prefectureName: '香川県' },
  { prefectur: 'ehime', prefectureName: '愛媛県' },
  { prefectur: 'kochi', prefectureName: '高知県' },
  { prefectur: 'kukuoka', prefectureName: '福岡県' },
  { prefectur: 'saga', prefectureName: '佐賀県' },
  { prefectur: 'sagasaki', prefectureName: '長崎県' },
  { prefectur: 'kumamoto', prefectureName: '熊本県' },
  { prefectur: 'oita', prefectureName: '大分県' },
  { prefectur: 'miyazaki', prefectureName: '宮崎県' },
  { prefectur: 'kagoshima', prefectureName: '鹿児島県' },
  { prefectur: 'okinawa', prefectureName: '沖縄県' },
];

export const EMPTY_SPECIFY_ROW = { variableValue: EMPTY_VALUE, gatewayId: EMPTY_VALUE };
export const EMPTY_SETTLEMENT_ROW = { variableValue: EMPTY_VALUE, commission: EMPTY_VALUE };
export const EMPTY_NP_ROW = {
  feeValue: EMPTY_VALUE,
  maxValue: EMPTY_VALUE,
  minValue: EMPTY_VALUE,
};
export const EMPTY_ROW_ERRORS = { variable: EMPTY_VALUE, gateway: EMPTY_VALUE };
export const EMPTY_SETTLEMENT_ERRORS = { variable: EMPTY_VALUE, commission: EMPTY_VALUE };
export const EMPTY_NP_ERRORS = {
  fee: EMPTY_VALUE,
  max: EMPTY_VALUE,
  min: EMPTY_VALUE,
};
