import "assets/css/bot/bot-chat-statistic.css";
import UserMessage from "./UserMessage";
import { Fragment, useEffect, useState } from "react";
import BotMessage from "./BotMessage";
import { Button } from "reactstrap";
import { parseQuantity } from "../../PreviewComponent/Utils";
import ChatbotOverall, { CONVERTERS_OVERALL } from "./ChatbotOverall";
import MessageStatisticDetail from "./MessageStatisticDetail";

export default function BotChatStatistic({
  botInfor = null,
  messages = [],
  dataMessages = [],
  statistic = [],
  overall = {},
  display = false,
}) {
  const [msgs, setMsgs] = useState([]);
  const [chatbotOverall, setChatbotOverall] = useState([]);

  const bindStatistic = (messages, statistic, overall) => {
    setMsgs(parseMessageDetail(messages, statistic));
    setChatbotOverall(parseOverall(overall));
  };

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
  }

  const parseOverall = (overall) => {
    return Object.entries(overall).map(([key, value]) => ({
      key,
      value:
        typeof value === "number" ? parseQuantity(value) : String(value || 0),
      ...(CONVERTERS_OVERALL[key] || { label: ["No label"], icon: null }),
    }));
  };

  useEffect(() => {
    bindStatistic(messages, statistic, overall);
  }, [messages, statistic, overall]);

  if (!display) return null;

  if (!messages.length)
    return (
      <div className="statistic_holder">
        <ChatbotOverall overall={chatbotOverall} />
        <div className="statistic_content_empty">
          <p>メッセージが存在しないか、シナリオが未選択です</p>
        </div>
      </div>
    );

  return (
    <div className="statistic_holder">
      <ChatbotOverall overall={chatbotOverall}/>
      <div className="statistic_content">
        {msgs.map((message, indexMessage) => {
          return (
            <Fragment key={indexMessage}>
              {message.belong_to === "bot" &&
                message?.message_content.map((content, index) => {
                  return (
                    <BotMessage
                      key={index}
                      content={content}
                      index={index}
                      botInfor={botInfor}
                    />
                  );
                })}
              {message.belong_to === "user" && (
                <div className="sp-body-user-side csp-body-user-side slideLeft msg_with_stats">
                  <MessageStatisticDetail stats={message.stats}/>
                  <div className="sp-body-user-side-messages csp-body-user-side-messages">
                    <UserMessage
                      captcha={[]}
                      messageContentProps={message.message_content}
                      disabled={message.disabled}
                      onChangeValue={(
                        indexContent,
                        contentType,
                        value,
                        field,
                        subFiled,
                        name
                      ) => {}}
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
                        <Button
                          disabled={true}
                          style={{
                            backgroundColor: botInfor?.main_color,
                            borderRadius: "25px",
                          }}
                          className="ss-user-message__action-btn"
                        >
                          {message.buttonName || "次へ"}
                        </Button>
                      </div>
                      )}
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
