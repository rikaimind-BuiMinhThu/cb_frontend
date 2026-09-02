import React from 'react';
import american_express from '../../../../../assets/img/payment-method/american_express.png';
import diner_club from '../../../../../assets/img/payment-method/diner_club.png';
import discover from '../../../../../assets/img/payment-method/discover.png';
import jcb from '../../../../../assets/img/payment-method/jcb.png';
import master_card from '../../../../../assets/img/payment-method/master_card.png';
import visa from '../../../../../assets/img/payment-method/visa.png';
import {
  MESSAGE_CONTENT_TYPES,
  RANGE_TEXT_VALIDATE,
  TIMER_TYPES,
} from '../../PreviewComponent/Constants';

const buildHourFixedOptions = () => {
  const options = [];
  for (let i = 0; i <= 23; i++) {
    options.push({ key: i + '', value: i + '' });
  }
  return options;
};

const buildMinutesFixedOptions = () => {
  const options = [];
  for (let i = 0; i <= 59; i++) {
    options.push({ key: i + '', value: i + '' });
  }
  return options;
};

const buildYearFixedOptions = () => {
  const options = [];
  for (let i = 1935; i <= 2072; i++) {
    options.push({ key: i + '', value: i + '' });
  }
  return options;
};

const buildMonthFixedOptions = () => {
  const options = [];
  for (let i = 1; i <= 12; i++) {
    const value = i < 10 ? `0${i}` : i + '';
    options.push({ key: value, value });
  }
  return options;
};

const buildMaxRangSliderOptions = () => {
  const options = [];
  for (let i = 2; i <= 10; i++) {
    options.push({ key: i + '', value: i + '' });
  }
  return options;
};

const buildDayFixedOptions = () => {
  const options = [];
  for (let i = 1; i <= 31; i++) {
    const value = i < 10 ? `0${i}` : i + '';
    options.push({ key: value, value });
  }
  return options;
};

const buildPaymentMethodOptions = () => [
  { key: 'visa', value: <img src={visa} alt="visa" /> },
  { key: 'jcb', value: <img src={jcb} alt="jcb" /> },
  { key: 'master_card', value: <img src={master_card} alt="master card" /> },
  { key: 'american_express', value: <img src={american_express} alt="american express" /> },
  { key: 'diner_club', value: <img src={diner_club} alt="diner club" /> },
  { key: 'discover', value: <img src={discover} alt="discover" /> },
];

export const dataPaymentMethod = buildPaymentMethodOptions();
export const dataHourFixed = buildHourFixedOptions();
export const dataMinutesFixed = buildMinutesFixedOptions();
export const dataYearFixed = buildYearFixedOptions();
export const dataMonthFixed = buildMonthFixedOptions();
export const dataMaxRangSlider = buildMaxRangSliderOptions();
export const dataDayFixed = buildDayFixedOptions();

export const dataEveryMinuteFixed = [
  { key: '00', value: '00' },
  { key: '05', value: '05' },
  { key: '10', value: '10' },
  { key: '15', value: '15' },
  { key: '30', value: '30' },
];

export const dataConsumeApiResponse = [];

export const agreeTermType = [
  { key: 'detail_content', value: '詳細内容表示' },
  { key: 'post_link_only', value: 'リンクのみ表示' },
];

export const dataTypeFile = [
  { key: 'jpeg', value: 'jpeg' },
  { key: 'jpg', value: 'jpg' },
  { key: 'png', value: 'png' },
  { key: 'gifs', value: 'gifs' },
  { key: 'zip', value: 'zip' },
  { key: 'rar', value: 'rar' },
  { key: 'doc', value: 'doc' },
  { key: 'docx', value: 'docx' },
  { key: 'numbers', value: 'numbers' },
  { key: 'pdf', value: 'pdf' },
  { key: 'mp4', value: 'mp4' },
  { key: 'webm', value: 'webm' },
  { key: 'ogv', value: 'ogv' },
  { key: 'csv', value: 'csv' },
  { key: 'xlsm', value: 'xlsm' },
  { key: 'xlsx', value: 'xlsx' },
  { key: 'xls', value: 'xls' },
  { key: 'TXT', value: 'TXT' },
  { key: 'ppt', value: 'ppt' },
  { key: 'pptx', value: 'pptx' },
  { key: 'pages', value: 'pages' },
  { key: 'key', value: 'key' },
  { key: 'odds', value: 'odds' },
  { key: 'odt', value: 'odt' },
  { key: 'odp', value: 'odp' },
];

export const carouselType = [
  { key: 'default', value: 'デフォルト' },
  { key: 'consume_api_response', value: 'API応答を利用する' },
];

export const typeCalendar = [
  { key: 'date_selection', value: '日付選択' },
  { key: 'embedded', value: '埋め込み' },
  { key: 'start_end_date', value: '開始日～終了日' },
];

export const dropDownTitle = [
  { key: false, value: 'タイトルなし' },
  { key: true, value: 'タイトルあり' },
];

export const convertTextType = [
  { key: 'katakana', value: 'カタカナ' },
  { key: 'hiragana', value: 'ひらがな' },
  { key: 'romaji', value: 'ローマ字' },
];

export const typeTextarea = [
  { key: 'text_input', value: 'テキスト入力' },
  { key: 'invalid_input', value: '入力無効' },
  { key: 'consume_api_response', value: 'API応答を利用する' },
];

export const typeRadio = [
  { key: 'default', value: 'デフォルト' },
  { key: 'radio_button_img', value: '画像付きラジオボタン' },
  { key: 'upsell_button', value: 'アップセールボタン' },
  { key: 'consume_api_response', value: 'API応答を利用する' },
  { key: 'block_style', value: 'ブロックスタイル' },
];

export const rangeText = [
  { key: 'no_input', value: '入力制限なし' },
  { key: 'alphabet', value: 'アルファベットのみ' },
  { key: 'single_byte', value: '半角数字' },
  { key: 'alphanumeric_hyphen', value: '英数字とハイフン' },
  { key: 'alphanumeric', value: "英数字とハイフン ('AZ';'az';0-9')" },
  { key: 'double_byte', value: '全角文字' },
  { key: 'double_byte_hiragana', value: '全角ひらがな' },
  { key: 'full_width_katakana', value: '全角カタカナ' },
  {
    key: RANGE_TEXT_VALIDATE.ONLY_KATAKANA.KEY,
    value: RANGE_TEXT_VALIDATE.ONLY_KATAKANA.MESSAGE,
  },
];

export const hyphenPhoneNumber = [
  { key: false, value: 'ハイフンなし' },
  { key: true, value: 'ハイフンあり' },
];

export const type = [
  { key: 'text', value: 'テキスト' },
  { key: 'urls', value: 'URL' },
  { key: 'email_address', value: 'メールアドレス' },
  { key: 'email_confirmation', value: 'メールアドレス（確認あり）' },
  { key: 'phone_number', value: '電話番号' },
  { key: 'password', value: 'パスワード' },
  { key: 'password_confirmation', value: 'パスワード（確認あり）' },
];

export const typeCheckbox = [
  { key: 'default', value: 'デフォルト' },
  { key: 'checkbox_img', value: '画像付きチェックボックス' },
  { key: 'consume_api_response', value: 'API応答を利用する' },
];

export const dataSelectDateTime = [
  { key: 'today', value: '今日' },
  { key: 'tomorrow', value: '明日' },
  { key: 'day_after_tomorrow', value: '明後日' },
  { key: 'past', value: '過去' },
  { key: 'future', value: '将来' },
  { key: 'moon', value: '月' },
  { key: 'fire', value: '火' },
  { key: 'water', value: '水' },
  { key: 'wood', value: '木' },
  { key: 'money', value: '金' },
  { key: 'soil', value: '土' },
  { key: 'day', value: '日' },
];

export const dataTypePullDown = [
  { key: 'customization', value: 'カスタマイズ' },
  { key: 'time_hm', value: '時間(H:m)' },
  { key: 'date_ymd', value: '日付(Ymd)' },
  { key: 'date_md', value: '日付(Md)' },
  { key: 'date_ym', value: '日付 (Ym)' },
  { key: 'date_ymd_hm', value: '日時 (Ymd H:m)' },
  { key: 'dob_ymd', value: '生年月日(Ymd)' },
  { key: 'dob_ym', value: '生年月日(Ym)' },
  { key: 'timezone_from_to', value: '時間帯 (H:m to H:m)' },
  { key: 'period_from_to', value: '期間(Ymd to Ymd)' },
  { key: 'prefectures', value: '都道府県' },
  { key: 'up_to_municipality', value: '市区町村まで' },
  { key: 'comsume_api_response', value: 'API応答を利用する' },
  { key: 'lp_integration_option', value: 'LP一体型フォームの選択肢を利用する' },
  {
    key: MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS,
    value: 'JSコードを利用する',
  },
];

export const dataConditionFixed = [
  { variable_name: 'current_url', default_value: 'current_url' },
  { variable_name: 'current_url_param', default_value: 'current_url_param' },
  { variable_name: 'current_url_title', default_value: 'current_url_title' },
  { variable_name: 'user_id', default_value: 'user_id' },
  { variable_name: 'bot_id', default_value: 'bot_id' },
  { variable_name: 'preview_flg', default_value: 'preview_flg' },
  { variable_name: 'user_ip_address', default_value: 'user_ip_address' },
  { variable_name: 'user_country', default_value: 'user_country' },
  { variable_name: 'user_city', default_value: 'user_city' },
  { variable_name: 'user_device', default_value: 'user_device' },
  { variable_name: 'user_browser', default_value: 'user_browser' },
  { variable_name: 'user_agent', default_value: 'user_agent' },
  { variable_name: 'cv_flg', default_value: 'cv_flg' },
  { variable_name: 'start_datetime', default_value: 'start_datetime' },
  { variable_name: 'user_referer_firstopen', default_value: 'user_referer_firstopen' },
  { variable_name: 'user_referer_current', default_value: 'user_referer_current' },
  { variable_name: 'churn_block_passed', default_value: 'churn_block_passed' },
  { variable_name: 'prevention_block_passed', default_value: 'prevention_block_passed' },
  { variable_name: 'churn_request_flag', default_value: 'churn_request_flag' },
  { variable_name: 'Phone number_hyphen', default_value: 'Phone number_hyphen' },
  { variable_name: 'Address_zip code 1', default_value: 'Address_zip code 1' },
  { variable_name: 'Address_Building name', default_value: 'Address_Building name' },
  { variable_name: 'address', default_value: 'address' },
  { variable_name: 'email address', default_value: 'email address' },
  { variable_name: 'phone number', default_value: 'phone number' },
  { variable_name: 'sex', default_value: 'sex' },
  { variable_name: 'date of birth', default_value: 'date of birth' },
  { variable_name: 'Address_zip code', default_value: 'Address_zip code' },
  { variable_name: 'Address_postal code with hyphens', default_value: 'Address_postal code with hyphens' },
  { variable_name: 'Address_zip code 1h', default_value: 'Address_zip code 1h' },
  { variable_name: 'Address_zip code 2', default_value: 'Address_zip code 2' },
  { variable_name: 'Address_Prefecture', default_value: 'Address_Prefecture' },
  { variable_name: 'Address_City', default_value: 'Address_City' },
  { variable_name: 'street address', default_value: 'street address' },
];

export const dataSubCondition = [
  { key: 'is', value: '一致する' },
  { key: 'is_not', value: '一致しない' },
  { key: 'include', value: '含む' },
  { key: 'not_include', value: '含まない' },
];

export const dataApiLinkage = [
  { key: 'credit_card_duplication_check', value: 'クレジットカード重複チェック' },
  { key: 'send_value_variable', value: '値を変数に送信' },
  { key: 'get_payment_method_name', value: '支払い方法名を取得' },
  { key: 'valid_phone_number_shipping', value: '配送先電話番号の検証' },
  { key: 'valid_phone_number', value: '電話番号の検証' },
  { key: 'get_new_address', value: '新しい住所を取得' },
  { key: 'get_price', value: '価格を取得' },
  { key: 'check_duplicate_zipcode', value: '郵便番号の重複チェック' },
  { key: 'click_order', value: '注文ボタンをクリック' },
  { key: 'validate_email', value: 'メールアドレスの検証' },
  { key: 'confirm', value: '確認' },
  { key: 'landing', value: 'ランディング' },
];

export const installmentOptions = Array.from({ length: 23 }, (_, i) => ({
  key: i + 2,
  value: `${i + 2}`,
}));

export const initialTimeConfig = {
  type: TIMER_TYPES.COUNTING_DOWN,
  duration: {},
  messages: {
    counting: {
      content: '',
      useHtml: true,
      isShow: true,
    },
    finish: {
      content: '',
      useHtml: true,
      isShow: false,
    },
  },
  isShowMessageFinish: false,
  isRealtimeRemainingTime: false,
};
