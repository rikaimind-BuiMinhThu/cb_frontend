import { BOT_MESSAGE_TYPES } from 'v2/views/Preview/PreviewComponent/Constants';

export const USER_CONTENT_TYPE_OPTIONS = [
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
  ['sms_verify', 'SMS Verify'],
  ['AFTEE_payment_module', 'AFTEE決済モジュール'],
  ['slider', 'スライダー'],
  ['card_payment_radio_button', 'ラジオボタン付きカード決済'],
  ['shipping_address', '配送先住所'],
  ['button_submit', '確認する'],
  ['contact_form', 'お問い合わせフォーム'],
];

export const USER_CONTENT_TYPE_VARIABLE_SET = ['variable_set', '変数セット'];
export const USER_CONTENT_TYPE_LABEL_NO_TRANSITION = ['label_no_transition', 'ラベル（推移記録なし）'];

export const BOT_STATEMENT_TYPE_OPTIONS = [
  ['text_input', 'テキスト'],
  ['getting_error_notification', 'エラー取得の通知'],
  ['file', 'ファイル'],
  ['email', 'メール'],
  ['api_linkage', 'API連携'],
  ['script', 'スクリプト'],
  ['delay', '遅延'],
  ['clear_variable', '変数クリア'],
  ['variable_set', '変数セット'],
  ['pause', '一時停止'],
  ['html_code', 'HTMLコード'],
  ['amazon_pay_button', 'Amazon Payボタン'],
  [BOT_MESSAGE_TYPES.ORDER_CONFIRM, '注文確認'],
  [BOT_MESSAGE_TYPES.CART_LOGIN, 'カートログイン'],
];

export const COMBINE_BOT_TYPE_OPTIONS = [
  ['text_input', 'テキスト'],
  ['getting_error_notification', 'エラー取得の通知'],
  ['file', 'ファイル'],
  ['html_code', 'HTMLコード'],
  ['amazon_pay_button', 'Amazon Payボタン'],
  [BOT_MESSAGE_TYPES.ORDER_CONFIRM, '注文確認'],
  [BOT_MESSAGE_TYPES.CART_LOGIN, 'カートログイン'],
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
  ['contact_form', 'お問い合わせフォーム'],
];
