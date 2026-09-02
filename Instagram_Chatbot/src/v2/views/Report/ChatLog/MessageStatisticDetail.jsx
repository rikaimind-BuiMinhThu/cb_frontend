import {
  PERCENT_SUFFIX,
  STAT_DETAIL_COUNT_SUFFIX,
  STAT_DETAIL_KEY_APPEAR_COUNT,
  STAT_DETAIL_KEY_COMPLETE_COUNT,
  STAT_DETAIL_KEY_COMPLETION_RATE,
  STAT_DETAIL_KEY_ERROR_COUNT,
  STAT_DETAIL_KEY_RETRY_COUNT,
  STAT_DETAIL_LABEL_APPEAR_COUNT,
  STAT_DETAIL_LABEL_COMPLETE_COUNT,
  STAT_DETAIL_LABEL_COMPLETION_RATE,
  STAT_DETAIL_LABEL_ERROR_COUNT,
  STAT_DETAIL_LABEL_RETRY_COUNT,
} from '../constants';

export const CONVERTERS_DETAIL = {
  [STAT_DETAIL_KEY_APPEAR_COUNT]: {
    label: STAT_DETAIL_LABEL_APPEAR_COUNT,
    value: (stats) => `${stats.appear_count || 0}${STAT_DETAIL_COUNT_SUFFIX}`,
  },
  [STAT_DETAIL_KEY_ERROR_COUNT]: {
    label: STAT_DETAIL_LABEL_ERROR_COUNT,
    value: (stats) => `${stats.error_count || 0}${STAT_DETAIL_COUNT_SUFFIX}`,
  },
  [STAT_DETAIL_KEY_COMPLETE_COUNT]: {
    label: STAT_DETAIL_LABEL_COMPLETE_COUNT,
    value: (stats) => `${stats.complete_count || 0}${STAT_DETAIL_COUNT_SUFFIX}`,
  },
  [STAT_DETAIL_KEY_RETRY_COUNT]: {
    label: STAT_DETAIL_LABEL_RETRY_COUNT,
    value: (stats) => `${stats.retry_count || 0}${STAT_DETAIL_COUNT_SUFFIX}`,
  },
  [STAT_DETAIL_KEY_COMPLETION_RATE]: {
    label: STAT_DETAIL_LABEL_COMPLETION_RATE,
    value: (stats) => `${(stats.completion_rate || 0).toFixed(2)}${PERCENT_SUFFIX}`,
  },
};

const MessageStatisticDetail = ({ stats }) => {
  return (
    <div className="chat-log-step-stats">
      {Object.keys(stats).map((key) => (
        <div
          key={key}
          className={`chat-log-stat-row${
            key === STAT_DETAIL_KEY_ERROR_COUNT && stats.error_count > 0
              ? ' chat-log-stat-row--error'
              : ''
          }`}
        >
          <span className="chat-log-stat-label">
            {CONVERTERS_DETAIL[key]?.label}
          </span>
          <span className="chat-log-stat-value">
            {CONVERTERS_DETAIL[key]?.value(stats)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessageStatisticDetail;
