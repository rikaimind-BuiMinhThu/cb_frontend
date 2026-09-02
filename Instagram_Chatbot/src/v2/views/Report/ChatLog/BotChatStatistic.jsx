import 'v2/assets/css/bot/bot-chat-log.css';
import UserMessage from './UserMessage';
import { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BotMessage from './BotMessage';
import { Empty } from 'antd';
import { parseQuantity } from 'v2/views/Report/utils/parseQuantity';
import ChatbotOverall, { CONVERTERS_OVERALL } from './ChatbotOverall';
import MessageStatisticDetail from './MessageStatisticDetail';
import {
  CHAT_LOG_METRIC_NO_LABEL,
  CHAT_LOG_NEXT_BUTTON,
  CHAT_LOG_STATS_EMPTY_DESCRIPTION,
} from 'v2/views/Report/constants';

const BotChatStatistic = ({
  botInfor = null,
  messages = [],
  dataMessages = [],
  statistic = [],
  overall = {},
}) => {
  const [msgs, setMsgs] = useState([]);
  const [chatbotOverall, setChatbotOverall] = useState([]);

  const parseMessageDetail = (messageList, statisticList) => {
    const mapMsgId = new Map();

    statisticList.forEach((statItem) => {
      mapMsgId.set(statItem.msg_id, statItem);
    });

    return messageList.map((msg) => {
      if (msg.belong_to === 'bot') {
        return msg;
      }

      const msgStats = mapMsgId.get(msg.id);

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

  const actionButtonStyle = {
    '--chat-log-action-bg': botInfor?.main_color,
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
      <div className="chat-log-steps">
        {msgs.map((messageItem, indexMessage) => (
          <Fragment key={messageItem.id ?? indexMessage}>
            {messageItem.belong_to === 'bot' && (
              <div className="chat-log-bot-messages">
                {messageItem?.message_content.map((content, index) => (
                  <BotMessage
                    key={content.id ?? index}
                    content={content}
                    index={index}
                    botInfor={botInfor}
                  />
                ))}
              </div>
            )}
            {messageItem.belong_to === 'user' && (
              <div className="chat-log-step-card">
                <MessageStatisticDetail stats={messageItem.stats} />
                <div className="chat-log-step-preview">
                  <div className="sp-body-user-side-messages csp-body-user-side-messages">
                    <UserMessage
                      captcha={[]}
                      messageContentProps={messageItem.message_content}
                      disabled={messageItem.disabled}
                      onChangeValue={() => {}}
                      indexMessageRender={indexMessage}
                      indexMessage={indexMessage}
                      displayButtonNext={() => {}}
                      dataPrefectures={[]}
                      variables={[]}
                    />
                    {(dataMessages[indexMessage]?.is_display_button_next !== undefined
                      ? dataMessages[indexMessage].is_display_button_next
                      : true) && (
                      <div className="sp-user-message-button-action">
                        <button
                          type="button"
                          disabled
                          className="chat-log-action-btn"
                          style={actionButtonStyle}
                        >
                          {messageItem.buttonName || CHAT_LOG_NEXT_BUTTON}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

BotChatStatistic.propTypes = {
  botInfor: PropTypes.object,
  messages: PropTypes.array,
  dataMessages: PropTypes.array,
  statistic: PropTypes.array,
  overall: PropTypes.object,
};

export default BotChatStatistic;
