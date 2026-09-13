import {
  LIVE_CSV_HEADERS,
  MESSAGE_GROUP_CSV_HEADERS,
  MESSAGE_GROUP_USER_CSV_HEADERS,
} from '../constants';

function boolLabel(value) {
  return value === 'true' || value === true ? 'はい' : 'いいえ';
}

function usageTypeLabel(usageType) {
  return usageType === 'dm_received' ? '受け' : '送り';
}

function formatTimestamp(value) {
  if (!value) return '';
  return value.slice(0, 19).replaceAll('T', ' ');
}

export function buildLiveCsvRows(item) {
  const rows = [];
  const comments = item.comment_lives || [];

  if (comments.length === 0) {
    rows.push({
      media_start_at: item.media_start_at,
      user_count: item.user_count,
      comment_count: item.comment_count,
      user_comment: '',
      comment_lives: '',
      time_comment: '',
    });
    return rows;
  }

  rows.push({
    media_start_at: item.media_start_at,
    user_count: item.user_count,
    comment_count: item.comment_count,
    user_comment: comments[0].full_name,
    comment_lives: comments[0].content,
    time_comment: comments[0].created_at?.slice(0, 19).replaceAll('-', '/').replaceAll('T', ' '),
  });

  for (let i = 1; i < comments.length; i += 1) {
    const comment = comments[i];
    rows.push({
      media_start_at: '',
      user_count: '',
      comment_count: '',
      user_comment: comment.full_name,
      comment_lives: comment.content,
      time_comment: comment.created_at?.slice(0, 19).replaceAll('-', '/').replaceAll('T', ' '),
    });
  }

  return rows;
}

export function buildMessageGroupChatCsvRows(instagramUsers) {
  const rows = [];

  (instagramUsers || []).forEach((user) => {
    const usages = user.chatbot_usages || [];
    if (usages.length === 0) return;

    rows.push({
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      is_user_follow_business: boolLabel(user.is_user_follow_business),
      is_business_follow_user: boolLabel(user.is_business_follow_user),
      type: usageTypeLabel(usages[0].usage_type),
      conversation: usages[0].content,
      time: formatTimestamp(usages[0].created_at),
    });

    for (let i = 1; i < usages.length; i += 1) {
      const chat = usages[i];
      rows.push({
        username: '',
        full_name: '',
        email: '',
        phone_number: '',
        is_user_follow_business: '',
        is_business_follow_user: '',
        type: usageTypeLabel(chat.usage_type),
        conversation: chat.content,
        time: formatTimestamp(chat.created_at),
      });
    }
  });

  return rows;
}

export function buildMessageGroupUserCsvRows(instagramUsers) {
  return (instagramUsers || []).map((user) => ({
    username: user.username,
    link_account: `https://www.instagram.com/${user.username}`,
    full_name: user.full_name,
    email: user.email,
    phone_number: user.phone_number,
    is_user_follow_business: boolLabel(user.is_user_follow_business),
    is_business_follow_user: boolLabel(user.is_business_follow_user),
  }));
}

export function downloadCsv({ headers, rows, filename }) {
  const headerLine = headers.map((header) => header.label).join(',');
  const keys = headers.map((header) => header.key);
  const body = rows
    .map((row) =>
      keys
        .map((key) => {
          const value = row[key] ?? '';
          const str = String(value);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([`\uFEFF${headerLine}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadLiveCsv(item) {
  downloadCsv({
    headers: LIVE_CSV_HEADERS,
    rows: buildLiveCsvRows(item),
    filename: 'Livestream.csv',
  });
}

export function downloadMessageGroupChatCsv(instagramUsers) {
  downloadCsv({
    headers: MESSAGE_GROUP_CSV_HEADERS,
    rows: buildMessageGroupChatCsvRows(instagramUsers),
    filename: 'message-group.csv',
  });
}

export function downloadMessageGroupUserCsv(instagramUsers) {
  downloadCsv({
    headers: MESSAGE_GROUP_USER_CSV_HEADERS,
    rows: buildMessageGroupUserCsvRows(instagramUsers),
    filename: 'message-group-user.csv',
  });
}
