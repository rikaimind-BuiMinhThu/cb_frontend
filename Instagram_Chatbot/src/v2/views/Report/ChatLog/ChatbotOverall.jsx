import IconCheckCircle from "v2/assets/img/bot-icon/check-circle.svg";
import IconEye from "v2/assets/img/bot-icon/eye.svg";
import IconPercent from "v2/assets/img/bot-icon/percent.svg";
import IconTrendingUp from "v2/assets/img/bot-icon/trending-up.svg";
import IconUserCheck from "v2/assets/img/bot-icon/user-check.svg";
import IconUserPlus from "v2/assets/img/bot-icon/user-plus.svg";

export const CONVERTERS_OVERALL = {
  entry_count: {
    icon: IconUserPlus,
    label: ["エントリー数"],
    color: "#1677ff",
  },
  form_completed_count: {
    icon: IconCheckCircle,
    label: ["入力完了数"],
    color: "#52c41a",
  },
  form_completion_rate: {
    icon: IconPercent,
    label: ["入力完了率"],
    unit: "%",
    color: "#f59e0b",
  },
  pgs_cv_count: {
    icon: IconUserCheck,
    label: ["CV数"],
    color: "#6366f1",
  },
  pgs_cv_entry_rate: {
    icon: IconTrendingUp,
    label: ["CV数", "/ エントリー数"],
    unit: "%",
    color: "#ec4899",
  },
  impression_count: {
    icon: IconEye,
    label: ["インプレッション数"],
    color: "#6b7280",
  },
};

const ChatbotOverall = ({ overall }) => {
  if (!overall.length) return null;

  const removePGSLabel = (label) => {
    if (label.includes("PGS-")) {
      return label.replace("PGS-", "");
    }
    return label;
  };

  return (
    <div className="chat-log-metrics-grid">
      {overall.map((item) => (
        <div key={item.key} className="chat-log-metric-card">
          {item.icon && (
            <div
              className="chat-log-metric-card__icon"
              style={{ backgroundColor: item.color || "#6b7280" }}
            >
              <img alt={`icon-${item.key}`} src={item.icon} />
            </div>
          )}
          <div className="chat-log-metric-card__info">
            <div className="chat-log-metric-card__label">
              {item.label.map((l) => (
                <span key={l}>{removePGSLabel(l)}</span>
              ))}
            </div>
            <div className="chat-log-metric-card__value">
              {item.value}
              {item.unit || ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatbotOverall;
