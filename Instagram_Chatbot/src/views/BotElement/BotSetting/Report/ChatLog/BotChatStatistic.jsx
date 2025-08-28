import "assets/css/bot/bot-chat-statistic.css";
import UserMessage from "./UserMessage";
import { Fragment, useEffect, useState } from "react";
import BotMessage from "./BotMessage";
import { Button } from "reactstrap";

export default function BotChatStatistic({
  botInfor = null,
  messages = [],
  dataMessages = [],
  statistic = [],
  display = false,
}) {
  const [msgs, setMsgs] = useState([]);

  function bindStatistic(messages, statistic) {
    const mapMsgId = new Map();

    statistic.forEach((s) => {
      mapMsgId.set(s.msg_id, s);
    });

    setMsgs(
      messages.map((msg) => {
        const msgStats = mapMsgId.get(msg.id);

        return {
          ...msg,
          stats: {
            pass_count: 0,
            access_count: 0,
            pass_percent: msgStats
              ? Math.round((msgStats.pass_count / msgStats.access_count) * 100)
              : 0,
            msg_id: msg.id,
            ...(msgStats || {}),
          },
        };
      })
    );
  }

  useEffect(() => {
    bindStatistic(messages, statistic);
  }, [messages, statistic]);

  if (!display) return null;

  if (!messages.length)
    return (
      <div className="statistic_holder">
        <div className="statistic_noti">
          <p className="staticstic_noti-detail">
            メッセージが存在しないか、シナリオが未選択です
          </p>
        </div>
      </div>
    );

  return (
    <div className="statistic_holder">
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
                  <div className="msg_stats">
                    <span className="stat">
                      <span className="stat_hover_none">
                        {(message.stats.pass_count || 0)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                      <span className="stat_addition">
                        {message.stats.pass_percent || 0}%
                      </span>
                      <span>通過</span>
                    </span>

                    <div className="seperator_v" />

                    <span className="stat">
                      {(message.stats.access_count || 0)
                        .toString()
                        .padStart(2, "0")}{" "}
                      対応済
                    </span>
                  </div>
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
