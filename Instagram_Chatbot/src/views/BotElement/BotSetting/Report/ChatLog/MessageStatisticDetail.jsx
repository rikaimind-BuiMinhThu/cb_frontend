export const CONVERTERS_DETAIL = {
  appear_count: {
    label: "表示回数",
    value: (stats) => `${stats.appear_count || 0}回`,
  },
  error_count: {
    label: "エラー回数",
    value: (stats) => `${stats.error_count || 0}回`,
  },
  complete_count: {
    label: "入力完了数",
    value: (stats) => `${stats.complete_count || 0}回`,
  },
  retry_count: {
    label: "再入力回数",
    value: (stats) => `${stats.retry_count || 0}回`,
  },
  completion_rate: {
    label: "入力完了率",
    value: (stats) => `${(stats.completion_rate || 0).toFixed(2)}%`,
  },
};

const MessageStatisticDetail = ({ stats }) => {
  return (
    <div className="msg_stats">
      {Object.keys(stats).map((key) => (
        <span className="stat">
          <span className="l">{CONVERTERS_DETAIL[key]?.label}</span>
          <span className="v">{CONVERTERS_DETAIL[key]?.value(stats)}</span>
        </span>
      ))}
    </div>
  );
};

export default MessageStatisticDetail;
