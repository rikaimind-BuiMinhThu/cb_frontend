export const SETTING_LABELS = {
  hideWhenLoggedIn: 'ログイン済み時に表示しない',
  hideWhenError: 'エラー発生の時に表示しない',
  title: 'タイトル',
  text: 'テキスト',
  type: 'タイプ',
  length: '長さ',
  colour: '色',
  comment: 'コメント',
  defaultOption: 'デフォルトオプション',
  textValue: ['テキスト', '値'],
  add: '追加',
  fileReference: 'ファイル参照',
  require: '必須',
  saveToVariable: '入力された内容を変数に保存する。',
  autoConvertText: '文字を自動変換する',
  customId: 'IDのカスタマイズ',
  splitInput: '分割入力',
  characterLimit: '文字数制限',
  hyphenPhoneNumber: 'ハイフン付き電話番号',
  continueButton: '続行ボタンを表示する',
  fukushashikiModePlaceholder: '複写先要素の取得方法をお選びください',
  fukushashikiModeTooltip: '複写先要素の取得方法をお選びください',
  paymentMethod: '支払い方法',
  dragAdd: '追加',
  address: '番地',
  buildingName: '建物名',
  municipality: '市区町村',
  postCode: '郵便番号',
  prefecture: '都道府県',
  htmlDescriptionCustomize: 'HTMLの説明をカスタマイズする',
  rootFaqMessage: 'Root FAQ Message',
  displayTextOnRight: '文言を右に表示する',
  suffixText: '文言',
  clearEmptyOption: '空なオプション解除',
  jscode: 'jscode',
  selectPlease: '選択してください。',
};

export const SETTING_PLACEHOLDERS = {
  title: 'タイトル',
  text: 'テキスト',
  input: '入力',
  type: 'type',
  colour: '色',
  comment: 'コメント',
  selectConvertTextType: 'Select Convert Text Type',
  convertTextDestination: '受信反射ポイントIDを入力してください',
  convertTextDestination1: 'セル1受信点ID',
  convertTextDestination2: 'セル2受信点ID',
  customId: 'カスタムID',
  customId1: 'カスタムID1',
  customId2: 'カスタムID2',
  placeholder: 'プレースホルダ',
  subtitle: 'サブタイトル',
  urls: 'URLs',
  fileUrl: 'ファイルのURL',
  buttonTitle: 'ボタンタイトル',
  buttonId: 'IDボタン',
  buttonName: 'ボタン名称',
  htmlDescription: 'ここにHTMLを入力してください',
  textarea: 'テキスト',
};

export const SETTING_BUTTON_LABELS = {
  add: '追加',
  fileReference: 'ファイル参照',
  upload: '追加',
};

export const CAPTURE_TYPE_OPTIONS = [
  { key: '0123456789', value: '数字' },
  { key: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', value: '英数字' },
  { key: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', value: 'アルファベットのみ' },
];

export const CAPTURE_COLOUR_OPTIONS = [
  { key: true, value: 'あり' },
  { key: false, value: '無し' },
];

export const AFTEE_PAYMENT_TYPE_OPTIONS = [
  { key: 'aftee', value: 'Aftee' },
  { key: 'atone', value: 'Atone' },
  { key: 'paidy', value: 'Paidy' },
  { key: 'zcom', value: 'ZCom' },
];

export const FUKUSHASHIKI_VARIANTS = {
  DEFAULT: 'default',
  COMPACT: 'compact',
  TEXT_INPUT_ROW: 'textInputRow',
};

export const CALENDAR_SETTING_LABELS = {
  startEndDate: '開始日～終了日',
  previewRelativeRange: '今日を起点にプレビュー範囲を合わせる（設定した開始～終了の内側に収めます）',
  daysFromToday: '今日から（日）',
  businessCalendarSplit: '営業日（店舗による出荷準備）とカレンダーデイ（配送業者の配送期間）の設定にする',
  businessDays: '営業日',
  businessDaysHint: '日（店舗による出荷準備など）',
  calendarDays: 'カレンダーデイ',
  calendarDaysHint: '日（配送業者の配送期間など）',
  cutOffTime: 'カットオフの時間',
  cutOffTimeHint: '設定した時間以降の注文は最短日が+1日になります。',
  cutOffNone: '適用しない',
  closedWeekdays: '営業休業日',
  weekdaySetting: '曜日の設定',
  consecutiveDays: '連続選択日数（開始日を含む／－は前に短縮）',
  nonSelectableDateTime: '選択不可の日時',
  fixedDate: '固定日付',
  nonSelectableDateRange: '選択不可の日付（”今日”を基準にした範囲）',
  nonSelectableDateRangeHint: '※正の数時と負の数字の両方を指定することができます。',
  aggregationPeriod: '集計対象期間',
  useApiValidation: '入力値の検証にAPIを利用する',
  initialSelection: '初期選択（今日から最短の日付）',
  specifiedPeriod: '指定期間',
  specifiedPeriodHint: '※終了日は開始日からN日の指定期間を連動させる。',
  previewRangeLabel: 'プレビュー適用範囲（今日・終了日オフセット）',
};

export const CALENDAR_WEEKDAY_OPTIONS = [
  { dow: 0, label: '日' },
  { dow: 1, label: '月' },
  { dow: 2, label: '火' },
  { dow: 3, label: '水' },
  { dow: 4, label: '木' },
  { dow: 5, label: '金' },
  { dow: 6, label: '土' },
];

export const CREDIT_CARD_SETTING_LABELS = {
  hideCvc: 'CVC非表示',
  hideCardName: 'カード名非表示',
  installment: '分割払い',
  separateType: 'セパレート式',
  validityCheck: '有効性チェックをする',
  expiryFormat: '有効期限',
  cardNumber: 'カード番号',
  cardHolder: 'カード名義',
  expiry: '有効期限',
  cvc: 'CVC非表示',
  installmentCount: 'お支払い回数',
  year: '年',
  month: '月',
  placeholder: 'プレースホルダ',
};

export const CREDIT_CARD_EXPIRY_TYPE_OPTIONS = [
  { key: 'ym', value: 'YM' },
  { key: 'my', value: 'MY' },
];

export const PRODUCT_PURCHASE_TYPE_OPTIONS = [
  { key: 'text_with_thumbnail_image', value: 'サムネイル画像付きテキスト' },
  { key: 'text_with_image', value: '画像付きテキスト' },
  { key: 'consume_api_respone', value: 'API応答を利用する' },
];

export const PRODUCT_PURCHASE_SETTING_LABELS = {
  quantityDesignation: '数量指定',
  productNumberDisplay: '商品番号表示',
  priceDisplay: '値段表示',
  productNameDisplay: '商品名表示',
  multiplePurchase: '複数商品購入',
  quantityLimit: '数量の上限',
  priceDisplayCustom: '値段表示内容（カスタマイズ）',
  initialSelection: '初期選択設定',
  itemNumber: '商品番号',
  price: '値段',
  variantId: 'バリアントID',
};

export const CARD_PAYMENT_RADIO_TYPE_OPTIONS = [
  { key: 'default', value: 'デフォルト' },
  { key: 'customized_style', value: 'カスタマイズスタイル（四角い枠）' },
  { key: 'picture_radio', value: '画像ラジオ' },
];

export const CARD_PAYMENT_RADIO_SETTING_LABELS = {
  cardLinkedSetting: 'カード決済連動設定',
  initialSelection: '初期選択設定',
  htmlDescription: '説明HTML',
  separateName: '姓と名を分けて入力する',
  fileUrl: 'ファイルのURL',
};

export const SHIPPING_ADDRESS_TYPE_OPTIONS = [
  { key: 'default', value: 'デフォルト' },
  { key: 'picture_radio', value: '画像ラジオ' },
];

export const SHIPPING_ADDRESS_SETTING_LABELS = {
  deliveryAddress: '配送先住所',
  enterDeliveryAddress: '配送先を入力する',
  useApiValidation: '入力値の検証にAPIを利用する',
  allItemsRequired: '全項目必須',
  phoneWithHyphen: '電話番号（ハイフン付き）',
  splitPostalCode: '郵便番号を3桁+4桁に分割する',
  compactMunicipalityAddress: '市区町村と番地を１フィールドで利用',
  compactAllAddress: '市区町村・番地・建物名を１フィールドで利用',
  name: 'お名前',
  kanaName: 'フリガナ',
  postalCode: '郵便番号',
  prefecture: '都道府県',
  municipality: '市区町村',
  address: '番地',
  buildingName: '建物名',
  phoneNumber: '電話番号',
  useDropdown: 'プルダウンを利用',
};

export const PULL_DOWN_LABELS = {
  rangeSetting: '範囲設定',
  startHour: '開始時',
  endHour: '終了時',
  startYear: '開始年',
  endYear: '終了年',
  hour: '時',
  minute: '分',
  everyMinute: '分刻み',
  year: '年',
  month: '月',
  day: '日',
  sort: 'ソート',
  sortAsc: '昇順',
  sortDesc: '降順',
  initialDobNote: '※初期選択の生年月日',
  hideDay: '日を非表示にする',
  initialSelection: '初期選択設定',
  selectPrefecture: '都道府県を選択',
  selectCity: '市区町村を選択',
  selectApi: 'Select api',
  selectPlaceholder: '選択してください。',
  rangeSeparator: '~',
  requiredMark: '※必須',
};

export const PULL_DOWN_SORT_OPTIONS = [
  { key: 'asc', value: '昇順' },
  { key: 'desc', value: '降順' },
];

export const TEXTAREA_LABELS = {
  characterLimit: '字数制限',
  placeholder: 'プレースホルダ',
  apiValidationNote: '入力値の検証にAPIを利用する',
};

export const CHECKBOX_LABELS = {
  allItemChecked: '全項目チェック',
  selectionLimit: '選択数制限',
  fileUrl: 'ファイルのURL',
};

export const RADIO_BUTTON_LABELS = {
  initialSelection: '初期選択設定',
  fileUrl: 'ファイルのURL',
  useAsGender: '性別として利用する',
};

export const BUTTON_SUBMIT_LABELS = {
  displayErrorMessage: 'エラーメッセージを表示する',
  useJs: 'JavaScriptの利用',
  confirmOrder: '確認メッセージ用',
  confirmDisplayOnly: '確認するのみに表示',
  errorMessage: 'エラーメッセージ',
  jsCode: 'jscode',
  buttonId: 'IDボタン',
  buttonName: 'ボタン名称',
  buttonImage: 'ボタン画像',
  buttonImageWidth: 'ボタン画像幅',
  clearImage: '削除',
  sampleError: 'エラーが発生しました。もう一度お試しください。',
};

export const CAROUSEL_LABELS = {
  useShortenedUrls: '短縮URLを利用する',
  subtitle: 'サブタイトル',
  urls: 'URLs',
  fileUrl: 'ファイルのURL',
  buttonTitle: 'ボタンタイトル',
  imageHint: '※JPEGまたはPNG/縦横比1.91:1の横向き画像または縦横比1:1の正方形画像',
  jsCode: 'jscode',
  useJs: 'JavaScriptの利用',
};

export const AGREE_TERM_LABELS = {
  termText: 'テキスト',
  urlComment: 'コメント',
  urlTitleUrls: ['タイトル', 'URLs'],
};

export const PREVIEW_LABELS = {
  requiredMark: '※必須',
  placeholderLabel: 'label',
};

export const TEXT_INPUT_LABELS = {
  allowSpecialChars: '特殊文字を許可する',
  disableRemoveLeadingZero: '先頭の0は削除しない（「0000」などもそのままLPへ反映）',
  placeholder: 'プレースホルダ',
};
