export const PAGE_SIZE = 10;

export const BASELINE_MONTHS_BEFORE = 12;

export const LIVE_CSV_HEADERS = [
  { label: 'ライブ開始日', key: 'media_start_at' },
  { label: 'ユーザー数', key: 'user_count' },
  { label: 'コメント数', key: 'comment_count' },
  { label: 'ユーザーコメント', key: 'user_comment' },
  { label: 'ライブコメント', key: 'comment_lives' },
  { label: 'コメント時間', key: 'time_comment' },
];

export const MESSAGE_GROUP_CSV_HEADERS = [
  { label: 'ユーザー名', key: 'username' },
  { label: '名称', key: 'full_name' },
  { label: 'メール', key: 'email' },
  { label: '電話番号', key: 'phone_number' },
  { label: 'フォローしている', key: 'is_user_follow_business' },
  { label: 'フォローされている', key: 'is_business_follow_user' },
  { label: 'タイプ', key: 'type' },
  { label: 'チャット内容', key: 'conversation' },
  { label: '時間', key: 'time' },
];

export const MESSAGE_GROUP_USER_CSV_HEADERS = [
  { label: 'ユーザー名', key: 'username' },
  { label: 'アカウントURL', key: 'link_account' },
  { label: '名称', key: 'full_name' },
  { label: 'メール', key: 'email' },
  { label: '電話番号', key: 'phone_number' },
  { label: 'フォローしている', key: 'is_user_follow_business' },
  { label: 'フォローされている', key: 'is_business_follow_user' },
];
