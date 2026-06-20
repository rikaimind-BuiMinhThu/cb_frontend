export const BUTTON_TYPES = {
  MESS: 'mess',
  WEB_URL: 'web_url',
  PURCHASE: 'purchase',
};

export const CHOICE_MODES = {
  NONE: 'none',
  SINGLE: 'single_choice',
  THREE: 'three_choice',
  FREE_INPUT: 'free_input',
};

export const FORMAT_CHECKS = [
  { value: 'no_validate', label: 'バーリデーションなし' },
  { value: 'email', label: 'メールアドレス' },
  { value: 'phone_number', label: '電話番号' },
];

export const PROFILE_FIELDS = [
  { key: 'name', apiKey: 'real_name', label: '名前', placeholder: '名前を入力してください。' },
  { key: 'company', apiKey: 'company_name', label: '企業', placeholder: '企業を入力してください。' },
  { key: 'position', apiKey: 'company_role', label: '役割', placeholder: '役割を入力してください。' },
  { key: 'website', apiKey: 'website', label: 'ウェブサイト', placeholder: 'ウェブサイトを入力してください。' },
  { key: 'reason', apiKey: 'propose', label: '用途（ニーズ）', placeholder: '用途を入力してください。' },
  { key: 'katb', apiKey: 'know_product_in', label: '認知経路', placeholder: '認知経路を入力してください。' },
];
