import { CHANNELS } from '../constants';

function formatRate(numerator, denominator) {
  if (!denominator) {
    return '0.00';
  }
  return ((numerator / denominator) * 100).toFixed(2);
}

function formatAverage(total, count) {
  if (!count) {
    return '0';
  }
  return (total / count).toFixed(2);
}

const METRIC_KEYS = {
  dm: {
    userCount: 'dm_instagram_user_count',
    messageCount: 'dm_instagram_message_count',
    conversionCount: 'dm_conversion_count',
  },
  story: {
    userCount: 'story_instagram_user_count',
    messageCount: 'story_instagram_message_count',
    conversionCount: 'story_conversion_count',
  },
  live: {
    userCount: 'live_instagram_user_count',
    messageCount: 'live_instagram_message_count',
    conversionCount: 'live_conversion_count',
  },
};

export function buildInflowPieSeries(metrics) {
  return CHANNELS.map(({ key }) => metrics[METRIC_KEYS[key].userCount] || 0);
}

export function buildConversionTableRows(metrics) {
  return CHANNELS.map(({ key, label }) => {
    const fields = METRIC_KEYS[key];
    const userCount = metrics[fields.userCount] || 0;
    const messageCount = metrics[fields.messageCount] || 0;
    const conversionCount = metrics[fields.conversionCount] || 0;

    return {
      key,
      title: label,
      userCount,
      messageCount,
      averageMessages: formatAverage(messageCount, userCount),
      conversionCount,
      conversionRate: `${formatRate(conversionCount, messageCount)}%`,
    };
  });
}
