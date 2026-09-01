export function boolLabel(value) {
  return value === true || value === 'true' ? 'あり' : 'なし';
}

export function formatDateTime(value) {
  if (!value) return '-';
  return value.slice(0, 16).replace('T', ' ').replaceAll('-', '/');
}

export function formatHistoryDate(value) {
  if (!value) return '-';
  return value.slice(5, 16).replace('T', ' ').replace('-', '/');
}

export function messageDirectionLabel(usageType) {
  return usageType === 'dm_received' ? '送り' : '受け';
}
