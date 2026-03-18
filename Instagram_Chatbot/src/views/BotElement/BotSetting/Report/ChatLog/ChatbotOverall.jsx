import IconCheckCircle from "../../../../../assets/img/bot-icon/check-circle.svg";
import IconEye from "../../../../../assets/img/bot-icon/eye.svg";
import IconPercent from "../../../../../assets/img/bot-icon/percent.svg";
import IconTrendingUp from "../../../../../assets/img/bot-icon/trending-up.svg";
import IconUserCheck from "../../../../../assets/img/bot-icon/user-check.svg";
import IconUserPlus from "../../../../../assets/img/bot-icon/user-plus.svg";

export const CONVERTERS_OVERALL = {
  entry_count: {
    icon: IconUserPlus,
    label: ["エントリー数"],
  },
  form_completed_count: {
    icon: IconCheckCircle,
    label: ["入力完了数"],
  },
  form_completion_rate: {
    icon: IconPercent,
    label: ["入力完了率"],
    unit: "%",
  },
  pgs_cv_count: {
    icon: IconUserCheck,
    label: ["CV数"],
  },
  pgs_cv_entry_rate: {
    icon: IconTrendingUp,
    label: ["CV数", "/ エントリー数"],
    unit: "%",
  },
  impression_count: {
    icon: IconEye,
    label: ["インプレッション数"],
  },
};

const ChatbotOverall = ({ overall }) => {
  if (!overall.length) return null;

  const removePGSLabel = (label) => {
    if(label.includes("PGS-")) {
      return label.replace("PGS-", "");
    }
    return label;
  };

  return (
    <div className="statistic_overall">
      <div className="statistic_overall_content">
        {overall.map((item) => (
          <div key={item.key} className={`statistic_item ${item.key}`}>
            {item.icon && (
              <div className={`icon_box`}>
                <img alt={`icon-${item.key}`} src={item.icon} />
              </div>
            )}

            <div className="info">
              <div className="label">
                {item.label.map((l) => (
                  <span key={l}>{removePGSLabel(l)}</span>
                ))}
              </div>
              <div className="value">{item.value}{item.unit ||""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatbotOverall;
