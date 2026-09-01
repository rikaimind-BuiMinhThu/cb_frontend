export function displayKeywords(keyword) {
  if (!keyword) return '';
  return keyword.replaceAll('|', ', ');
}

export function serializeKeywords(input) {
  if (!input || !input.trim()) return '';
  const tokens = input.split(/[, ]+/).filter(Boolean);
  return tokens.join('|');
}

export function getActiveChannels(keyword) {
  if (!keyword) return [];
  return [
    keyword.is_dm && 'is_dm',
    keyword.is_story_comment && 'is_story_comment',
    keyword.is_post_comment && 'is_post_comment',
    keyword.is_live_comment && 'is_live_comment',
  ].filter(Boolean);
}

export function channelsToPayload(channelKeys) {
  return {
    is_dm: channelKeys.includes('is_dm'),
    is_story_comment: channelKeys.includes('is_story_comment'),
    is_post_comment: channelKeys.includes('is_post_comment'),
    is_live_comment: channelKeys.includes('is_live_comment'),
  };
}
