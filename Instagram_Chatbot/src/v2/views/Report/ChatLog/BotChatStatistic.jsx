import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Empty } from 'antd';
import { parseQuantity } from 'v2/views/Report/utils/parseQuantity';
import {
  CHAT_LOG_BELONG_USER,
  CHAT_LOG_METRIC_NO_LABEL,
  CHAT_LOG_STATS_EMPTY_DESCRIPTION,
} from 'v2/views/Report/constants';
import BotChatLogTranscript from './BotChatLogTranscript';
import ChatbotOverall, { CONVERTERS_OVERALL } from './ChatbotOverall';
import MessageStatisticDetail from './MessageStatisticDetail';
import 'v2/views/Report/styles/bot-chat-log.css';

const statisticMessageKey = (value) => String(value);

const BotChatStatistic = ({
  botInfor = null,
  messages = [],
  dataMessages = [],
  statistic = [],
  overall = {},
  designSettings = null,
  captcha = [],
  variables = [],
  dataPrefectures = [],
}) => {
  const [msgs, setMsgs] = useState([]);
  const [chatbotOverall, setChatbotOverall] = useState([]);

  const parseMessageDetail = (messageList, statisticList) => {
    const mapMsgId = new Map();

    statisticList.forEach((statItem) => {
      if (statItem.msg_id == null) return;

      mapMsgId.set(statisticMessageKey(statItem.msg_id), statItem);
    });

    return messageList.map((msg) => {
      if (msg.belong_to !== CHAT_LOG_BELONG_USER) {
        return msg;
      }

      const msgStats = mapMsgId.get(statisticMessageKey(msg.id));

      return {
        ...msg,
        stats: {
          appear_count: msgStats?.appear_count || 0,
          error_count: msgStats?.error_count || 0,
          complete_count: msgStats?.complete_count || 0,
          retry_count: msgStats?.retry_count || 0,
          completion_rate: msgStats?.completion_rate || 0,
        },
      };
    });
  };

  const parseOverall = (overallData) =>
    Object.entries(overallData).map(([key, value]) => ({
      key,
      value:
        typeof value === 'number' ? parseQuantity(value) : String(value || 0),
      ...(CONVERTERS_OVERALL[key] || { label: [CHAT_LOG_METRIC_NO_LABEL], icon: null }),
    }));

  const bindStatistic = useCallback((messageList, statisticList, overallData) => {
    setMsgs(parseMessageDetail(messageList, statisticList));
    setChatbotOverall(parseOverall(overallData));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- parse helpers are pure and recreated each render
  }, []);

  useEffect(() => {
    bindStatistic(messages, statistic, overall);
  }, [messages, statistic, overall, bindStatistic]);

  const renderMessageAside = (messageItem) => {
    if (!messageItem.stats) return null;

    return (
      <div className="chat-log-stat-card">
        <MessageStatisticDetail stats={messageItem.stats} />
      </div>
    );
  };

  if (!messages.length) {
    return (
      <div className="chat-log-stats-panel">
        <ChatbotOverall overall={chatbotOverall} />
        <div className="chat-log-stats-empty">
          <Empty description={CHAT_LOG_STATS_EMPTY_DESCRIPTION} />
        </div>
      </div>
    );
  }

  return (
    <div className="chat-log-stats-panel">
      <ChatbotOverall overall={chatbotOverall} />
      <BotChatLogTranscript
        showTracking={false}
        messages={msgs}
        botInfor={botInfor}
        captcha={captcha}
        dataMessages={dataMessages}
        dataPrefectures={dataPrefectures}
        variables={variables}
        designSettings={designSettings}
        renderMessageAside={renderMessageAside}
      />
    </div>
  );
};

BotChatStatistic.propTypes = {
  botInfor: PropTypes.object,
  messages: PropTypes.array,
  dataMessages: PropTypes.array,
  statistic: PropTypes.array,
  overall: PropTypes.object,
  designSettings: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  captcha: PropTypes.array,
  variables: PropTypes.array,
  dataPrefectures: PropTypes.array,
};

export default BotChatStatistic;
