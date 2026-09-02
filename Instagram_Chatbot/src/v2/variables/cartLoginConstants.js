export const CART_LOGIN_DEFAULT_TEXT = '※ 会員の方はこちらをクリックしてください。';

export const CART_LOGIN_DISPLAY_TYPES = {
  BUTTON: 'button',
  LINK: 'link',
};

export const CART_LOGIN_PROCESS_AFTER_CLICK = {
  NONE: 'none',
  CLOSE_BOT_ONLY: 'close_bot_only',
  CLOSE_SCROLL_CLICK_LOGIN: 'close_scroll_click_login',
  CLOSE_SCROLL_LOGIN: 'close_scroll_login',
};

export const CART_LOGIN_DISPLAY_TYPE_OPTIONS = [
  [CART_LOGIN_DISPLAY_TYPES.BUTTON, 'ボタン'],
  [CART_LOGIN_DISPLAY_TYPES.LINK, 'リンク'],
];

export const CART_LOGIN_FONT_WEIGHT_OPTIONS = [
  ['normal', '通常'],
  ['bold', '太字'],
];

export const CART_LOGIN_BORDER_STYLE_OPTIONS = [
  ['none', 'なし'],
  ['solid', '実線'],
  ['dashed', '破線'],
  ['dotted', '点線'],
];

export const CART_LOGIN_TEXT_ALIGN_OPTIONS = [
  ['left', '左寄せ'],
  ['center', '中央寄せ'],
  ['right', '右寄せ'],
];

export const CART_LOGIN_SCROLL_BEHAVIOR_OPTIONS = [
  ['smooth', 'なめらかにスクロール'],
  ['auto', 'すぐにスクロール'],
];

export const CART_LOGIN_SCROLL_BLOCK_OPTIONS = [
  ['center', '画面の中央'],
  ['start', '画面上部'],
  ['nearest', '最も近い位置'],
];

export const CART_LOGIN_PROCESS_AFTER_CLICK_OPTIONS = [
  [CART_LOGIN_PROCESS_AFTER_CLICK.NONE, 'なし'],
  [CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_BOT_ONLY, 'ボットを閉じる'],
  [
    CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_SCROLL_CLICK_LOGIN,
    'ボットを閉じて、ログインボタンをクリックし、ログインフォームまで移動する（ログインフォームはクリック後に表示される場合）',
  ],
  [
    CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_SCROLL_LOGIN,
    'ボットを閉じて、ログインフォームまで移動する（ログインフォームはすでに表示されている場合）',
  ],
];

export const CART_LOGIN_FIELD_LABELS = {
  text: 'テキスト',
  display_type: '表示形式',
  font_size: 'フォントサイズ',
  font_weight: 'フォントの太さ',
  background_color: '背景色',
  text_color: '文字色',
  border_width: '枠線の太さ',
  border_style: '枠線のスタイル',
  border_color: '枠線の色',
  border_radius: '角の丸み',
  text_align: '文字の配置',
  padding: '余白',
  width: '幅',
  hover_background_color: 'マウスオーバー時の背景色',
  process_after_click: 'クリック後の処理',
  open_login_trigger: 'ログインボタン',
  scroll_target: 'スクロール先',
  action_delay_ms: '実行までの待ち時間（ミリ秒）',
  scroll_behavior: 'スクロールの動き',
  scroll_block: 'スクロール位置',
};

const DEFAULT_SELECTOR = {
  search_mode: 2,
  search_value: '#dvUserContents .login-window-btn',
};

export const DEFAULT_CART_LOGIN_STYLE = {
  font_size: '18px',
  font_weight: 'bold',
  background_color: '#e6f2fb',
  text_color: '#1f6fa9',
  border_width: '2px',
  border_style: 'solid',
  border_color: '#6aa9d8',
  border_radius: '16px',
  text_align: 'left',
  padding: '16px 20px',
  width: '100%',
  hover_background_color: '#d8ebf9',
};

export const DEFAULT_CART_LOGIN_PROCESS_AFTER_CLICK_CONFIG = {
  open_login_trigger: { ...DEFAULT_SELECTOR },
  scroll_target: { ...DEFAULT_SELECTOR },
  scroll_behavior: 'smooth',
  scroll_block: 'center',
  action_delay_ms: 500,
};

export const DEFAULT_CART_LOGIN_CONFIG = {
  text: CART_LOGIN_DEFAULT_TEXT,
  display_type: CART_LOGIN_DISPLAY_TYPES.BUTTON,
  style: { ...DEFAULT_CART_LOGIN_STYLE },
  process_after_click: CART_LOGIN_PROCESS_AFTER_CLICK.NONE,
  process_after_click_config: { ...DEFAULT_CART_LOGIN_PROCESS_AFTER_CLICK_CONFIG },
};

export const getDefaultCartLoginConfig = () => ({
  text: DEFAULT_CART_LOGIN_CONFIG.text,
  display_type: DEFAULT_CART_LOGIN_CONFIG.display_type,
  style: { ...DEFAULT_CART_LOGIN_STYLE },
  process_after_click: DEFAULT_CART_LOGIN_CONFIG.process_after_click,
  process_after_click_config: {
    open_login_trigger: { ...DEFAULT_SELECTOR },
    scroll_target: { ...DEFAULT_SELECTOR },
    scroll_behavior: DEFAULT_CART_LOGIN_PROCESS_AFTER_CLICK_CONFIG.scroll_behavior,
    scroll_block: DEFAULT_CART_LOGIN_PROCESS_AFTER_CLICK_CONFIG.scroll_block,
    action_delay_ms: DEFAULT_CART_LOGIN_PROCESS_AFTER_CLICK_CONFIG.action_delay_ms,
  },
});
