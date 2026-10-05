import { INSTAGRAM_USER_CSV_HEADERS } from '../constants';
import { downloadCsv } from '../../DataAnalyst/utils/csvBuilders';

function boolLabel(value) {
  return value === 'true' || value === true ? 'はい' : 'いいえ';
}

function formatCreatedAt(value) {
  if (!value) return '';
  return value.slice(0, 19).replaceAll('-', '/').replaceAll('T', ' ');
}

export function buildInstagramUserCsvRows(instagramUsers) {
  return (instagramUsers || []).map((user) => ({
    username: user.username,
    account: `https://www.instagram.com/${user.username}`,
    full_name: user.full_name,
    follower_count: user.follower_count,
    instagram_id: user.instagram_id,
    is_user_follow_business: boolLabel(user.is_user_follow_business),
    is_business_follow_user: boolLabel(user.is_business_follow_user),
    created_at: formatCreatedAt(user.created_at),
  }));
}

export function downloadInstagramUserCsv(instagramUsers) {
  downloadCsv({
    headers: INSTAGRAM_USER_CSV_HEADERS,
    rows: buildInstagramUserCsvRows(instagramUsers),
    filename: 'Listusers.csv',
  });
}
