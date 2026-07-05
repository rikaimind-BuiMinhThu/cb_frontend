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

export const ENTERPRISE_TYPE_2_OPTIONS = ['先頭に使う', '末尾に使う', 'なし'];

export const PREFECTURE_OPTIONS = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
];

export const CART_SYSTEM_OPTIONS = [
  { value: 'cart_system_none', label: 'なし' },
  { value: 'tamago_repeat', label: 'たまごリピート' },
  { value: 'subsc_store', label: 'サブスクストア' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'ec_force', label: 'Ec-Force' },
  { value: 'repeat_plus', label: 'リピートPLUS' },
];

export const BOT_FEATURE_RADIO_OPTIONS = [
  { value: 'true', label: 'あり' },
  { value: 'false', label: 'なし' },
];

export const STATUS_OPTIONS = [
  { value: 'active', label: '契約', id: 'in_contract' },
  { value: 'pause', label: '休止', id: 'pause_contract' },
  { value: 'ended', label: '解約', id: 'finished_contract' },
  { value: 'trial', label: 'お試し', id: 'trial_contract' },
];
