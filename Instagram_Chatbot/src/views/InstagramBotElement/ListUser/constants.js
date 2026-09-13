export const PAGE_SIZE = 25;

export const BASELINE_MONTHS_BEFORE = 6;

export const INSTAGRAM_USER_CSV_HEADERS = [
  { label: 'ユーザー名', key: 'username' },
  { label: 'アカウントリンク', key: 'account' },
  { label: '名前', key: 'full_name' },
  { label: 'フォロワー数', key: 'follower_count' },
  { label: 'インスタグラムID', key: 'instagram_id' },
  {
    label: 'インスタグラムアカウントをフォローしているか',
    key: 'is_user_follow_business',
  },
  { label: 'ユーザーをフォローしているか', key: 'is_business_follow_user' },
  { label: '作成日', key: 'created_at' },
];
