import "v2/assets/css/bot/bot-chat-log.css";
import UserMessage from "./UserMessage";
import { Fragment, useCallback, useEffect, useState } from "react";
import BotMessage from "./BotMessage";
import { Empty } from "antd";
import { parseQuantity } from "v2/views/BotElement/BotSetting/PreviewComponent/Utils";
import ChatbotOverall, { CONVERTERS_OVERALL } from "./ChatbotOverall";
import MessageStatisticDetail from "./MessageStatisticDetail";

export default function BotChatStatistic({
  botInfor = null,
  messages = [],
  dataMessages = [],
  statistic = [],
  overall = {},
}) {
  const [msgs, setMsgs] = useState([]);
  const [chatbotOverall, setChatbotOverall] = useState([]);

  const parseMessageDetail = (messages, statistic) => {
    const mapMsgId = new Map();

    statistic.forEach((s) => {
      mapMsgId.set(s.msg_id, s);
    });

    return messages.map((msg) => {
      if (msg.belong_to === "bot") return msg;

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

  const parseOverall = (overall) => {
    return Object.entries(overall).map(([key, value]) => ({
      key,
      value:
        typeof value === "number" ? parseQuantity(value) : String(value || 0),
      ...(CONVERTERS_OVERALL[key] || { label: ["No label"], icon: null }),
    }));
  };

  const bindStatistic = useCallback((messages, statistic, overall) => {
    setMsgs(parseMessageDetail(messages, statistic));
    setChatbotOverall(parseOverall(overall));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- parse helpers are pure and recreated each render
  }, []);

  useEffect(() => {
    bindStatistic(messages, statistic, overall);
  }, [messages, statistic, overall, bindStatistic]);

  if (!messages.length) {
    return (
      <div className="chat-log-stats-panel">
        <ChatbotOverall overall={chatbotOverall} />
        <div className="chat-log-stats-empty">
          <Empty description="メッセージが存在しないか、シナリオが未選択です" />
        </div>
      </div>
    );
  }

  return (
    <div className="chat-log-stats-panel">
      <ChatbotOverall overall={chatbotOverall} />
      <div className="chat-log-steps">
        {msgs.map((message, indexMessage) => {
          return (
            <Fragment key={indexMessage}>
              {message.belong_to === "bot" && (
                <div className="chat-log-bot-messages">
                  {message?.message_content.map((content, index) => (
                    <BotMessage
                      key={index}
                      content={content}
                      index={index}
                      botInfor={botInfor}
                    />
                  ))}
                </div>
              )}
              {message.belong_to === "user" && (
                <div className="chat-log-step-card">
                  <MessageStatisticDetail stats={message.stats} />
                  <div className="chat-log-step-preview">
                    <div className="sp-body-user-side-messages csp-body-user-side-messages">
                      <UserMessage
                        captcha={[]}
                        messageContentProps={message.message_content}
                        disabled={message.disabled}
                        onChangeValue={() => {}}
                        indexMessageRender={indexMessage}
                        indexMessage={indexMessage}
                        displayButtonNext={(value) => {
                          dataMessages[indexMessage].is_display_button_next =
                            value;
                        }}
                        dataPrefectures={[]}
                        variables={[]}
                      />
                      {(dataMessages[indexMessage]?.is_display_button_next !==
                      undefined
                        ? dataMessages[indexMessage].is_display_button_next
                        : true) && (
                        <div className="sp-user-message-button-action">
                          <button
                            type="button"
                            disabled
                            className="chat-log-action-btn"
                            style={{
                              backgroundColor: botInfor?.main_color,
                            }}
                          >
                            {message.buttonName || "次へ"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
