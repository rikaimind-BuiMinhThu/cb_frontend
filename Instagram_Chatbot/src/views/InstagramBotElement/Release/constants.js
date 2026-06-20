export const MAX_ICE_BREAKERS = 4;
export const MAX_PERSISTENT_MENUS = 5;
export const MAX_TITLE_LENGTH = 30;

export const REPLY_MODES = [
  { value: 'direct_message', label: 'すべてのDM/コメント' },
  { value: 'keyword', label: '任意のキーワード' },
];

export const PERSISTENT_MENU_TYPES = [
  { value: 'message', label: 'メッセージ' },
  { value: 'support', label: 'サポート' },
  { value: 'website', label: 'ウェブサイト' },
];

export const TOAST_MESSAGES = {
  SAVED: '保存されました！',
  FAQ_ON: 'FAQ設定をオンにしました。',
  FAQ_OFF: 'FAQ設定をオフにしました。',
  MENU_ON: '固定メッセージ設定をオンにしました。',
  MENU_OFF: '固定メッセージ設定をオフにしました。',
  STORY_SAVED: 'ストーリー設定を保存しました。',
  LIVE_SAVED: 'ライブ設定を保存しました。',
  POST_SAVED: '投稿コメント設定を保存しました。',
  CONNECT_SUCCESS: 'Instagramアカウントを接続しました。',
  LOGOUT_SUCCESS: 'ログアウトしました。',
};

export const COMMENT_SECTIONS = {
  story: {
    title: 'ストーリー設定',
    statusField: 'story_comment_bag_status',
    bagField: 'story_comment_bag_id',
    groupIdField: 'story_comment_group_id',
    groupNameField: 'story_comment_group_name',
    keywordFlag: 'is_story_comment',
    savedMessage: TOAST_MESSAGES.STORY_SAVED,
  },
  live: {
    title: 'ライブ設定',
    statusField: 'live_comment_bag_status',
    bagField: 'live_comment_bag_id',
    groupIdField: 'live_comment_group_id',
    groupNameField: 'live_comment_group_name',
    keywordFlag: 'is_live_comment',
    savedMessage: TOAST_MESSAGES.LIVE_SAVED,
  },
  post: {
    title: '投稿コメント設定',
    statusField: 'post_comment_bag_status',
    bagField: 'post_comment_bag_id',
    groupIdField: 'post_comment_group_id',
    groupNameField: 'post_comment_group_name',
    keywordFlag: 'is_post_comment',
    savedMessage: TOAST_MESSAGES.POST_SAVED,
  },
};
