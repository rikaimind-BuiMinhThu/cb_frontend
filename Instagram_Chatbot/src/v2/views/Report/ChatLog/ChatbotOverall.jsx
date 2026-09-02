import IconCheckCircle from 'v2/assets/img/bot-icon/check-circle.svg';
import IconEye from 'v2/assets/img/bot-icon/eye.svg';
import IconPercent from 'v2/assets/img/bot-icon/percent.svg';
import IconTrendingUp from 'v2/assets/img/bot-icon/trending-up.svg';
import IconUserCheck from 'v2/assets/img/bot-icon/user-check.svg';
import IconUserPlus from 'v2/assets/img/bot-icon/user-plus.svg';
import PropTypes from 'prop-types';
import {
  METRIC_KEY_ENTRY_COUNT,
  METRIC_KEY_FORM_COMPLETED_COUNT,
  METRIC_KEY_FORM_COMPLETION_RATE,
  METRIC_KEY_IMPRESSION_COUNT,
  METRIC_KEY_PGS_CV_COUNT,
  METRIC_KEY_PGS_CV_ENTRY_RATE,
  METRIC_LABEL_CV_COUNT,
  METRIC_LABEL_CV_ENTRY_RATE,
  METRIC_LABEL_CV_ENTRY_RATE_DIVIDER,
  METRIC_LABEL_ENTRY_COUNT,
  METRIC_LABEL_FORM_COMPLETED_COUNT,
  METRIC_LABEL_FORM_COMPLETION_RATE,
  METRIC_LABEL_IMPRESSION_COUNT,
  METRIC_PGS_PREFIX,
  METRIC_UNIT_PERCENT,
} from 'v2/views/Report/constants';

export const CONVERTERS_OVERALL = {
  [METRIC_KEY_ENTRY_COUNT]: {
    icon: IconUserPlus,
    label: [METRIC_LABEL_ENTRY_COUNT],
    iconClass: 'chat-log-metric-card__icon--entry',
  },
  [METRIC_KEY_FORM_COMPLETED_COUNT]: {
    icon: IconCheckCircle,
    label: [METRIC_LABEL_FORM_COMPLETED_COUNT],
    iconClass: 'chat-log-metric-card__icon--form-completed',
  },
  [METRIC_KEY_FORM_COMPLETION_RATE]: {
    icon: IconPercent,
    label: [METRIC_LABEL_FORM_COMPLETION_RATE],
    unit: METRIC_UNIT_PERCENT,
    iconClass: 'chat-log-metric-card__icon--form-completion-rate',
  },
  [METRIC_KEY_PGS_CV_COUNT]: {
    icon: IconUserCheck,
    label: [METRIC_LABEL_CV_COUNT],
    iconClass: 'chat-log-metric-card__icon--cv-count',
  },
  [METRIC_KEY_PGS_CV_ENTRY_RATE]: {
    icon: IconTrendingUp,
    label: [METRIC_LABEL_CV_ENTRY_RATE, METRIC_LABEL_CV_ENTRY_RATE_DIVIDER],
    unit: METRIC_UNIT_PERCENT,
    iconClass: 'chat-log-metric-card__icon--cv-entry-rate',
  },
  [METRIC_KEY_IMPRESSION_COUNT]: {
    icon: IconEye,
    label: [METRIC_LABEL_IMPRESSION_COUNT],
    iconClass: 'chat-log-metric-card__icon--impression',
  },
};

const removePGSLabel = (label) => {
  if (label.includes(METRIC_PGS_PREFIX)) {
    return label.replace(METRIC_PGS_PREFIX, '');
  }
  return label;
};

const ChatbotOverall = ({ overall }) => {
  if (!overall.length) {
    return null;
  }

  return (
    <div className="chat-log-metrics-grid">
      {overall.map((item) => (
        <div key={item.key} className="chat-log-metric-card">
          {item.icon && (
            <div
              className={`chat-log-metric-card__icon ${item.iconClass || 'chat-log-metric-card__icon--default'}`}
            >
              <img alt={`icon-${item.key}`} src={item.icon} />
            </div>
          )}
          <div className="chat-log-metric-card__info">
            <div className="chat-log-metric-card__label">
              {item.label.map((labelText) => (
                <span key={labelText}>{removePGSLabel(labelText)}</span>
              ))}
            </div>
            <div className="chat-log-metric-card__value">
              {item.value}
              {item.unit || ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ChatbotOverall.propTypes = {
  overall: PropTypes.array,
};

export default ChatbotOverall;
