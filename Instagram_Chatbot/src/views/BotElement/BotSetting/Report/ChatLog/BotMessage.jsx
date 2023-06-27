import React from "react";
import { EC_CHATBOT_URL } from "variables/constants";
import messageTypingGif from "assets/img/icons8-dots-loading.gif";

export default function BotMessage({ content, index, botInfor }) {
  const handleDownloadFile = (file) => {
    let link = document.createElement("a");
    link.href = file;
    link.download = "file";
    link.target = "_blank";
    document.body.appendChild(link);

    link.click();
    link.remove();
  };

  return (
    <div key={index} className="sp-body-bot-side csp-body-bot-side slideRight">
      {(content.type === "text_input" ||
        content.type === "file" ||
        content.type === "delay") && (
        <div className="sp-body-bot-side-avatar sp-avatar">
          <img
            src={EC_CHATBOT_URL + "/" + botInfor?.icon?.url}
            alt="icon"
          />
        </div>
      )}
      <div className="sp-body-bot-side-messages csp-body-bot-side-messages">
        {/* <img className="ss-bot-ava" src={icon} alt="" /> */}
        {content && (
          <React.Fragment>
            {/* bot: type == 'text_input' */}
            {content.type === "text_input" && (
              <div
                className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                style={{
                  overflowWrap: "break-word",
                  backgroundColor: botInfor?.message_color,
                  color: botInfor?.font_color,
                  height: "auto",
                  overflowY: "hidden",
                  border: "none",
                  borderRadius: "20px",
                }}
                // value={content[content.type]?.content || ''}
                // onChange={() => onChangeValue(indexMessageSelect, index, content.type, value, 'content')}
              >
                {/* {content[content.type]?.content || ''} */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: content[content.type]?.content,
                  }}
                />
              </div>
            )}
            {content.type === "file" &&
              (content[content.type]?.content ? (
                <React.Fragment>
                  {(content[content.type]?.content.includes("jpeg") ||
                    content[content.type]?.content.includes("png") ||
                    content[content.type]?.content.includes("jpg")) && (
                    <img
                      src={content[content.type]?.content}
                      alt=""
                      style={{ width: "100%" }}
                    />
                  )}
                  {content[content.type]?.content.includes("pdf") && (
                    <span
                      style={{
                        color: "#089BE5",
                        fontSize: "17px",
                        display: "block",
                        height: "50px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleDownloadFile(content[content.type]?.content)
                      }
                    >
                      ファイルをダウンロード
                    </span>
                  )}
                  {content[content.type]?.content.includes("mp4") && (
                    <div>
                      <video
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "2px",
                        }}
                        src={content[content.type]?.content}
                        autoPlay
                        controls
                      />
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <textarea
                  className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
                  value={""}
                  readOnly
                  style={{
                    backgroundColor: botInfor?.message_color,
                    border: "none",
                    borderRadius: "20px",
                    color: botInfor?.font_color,
                  }}
                ></textarea>
              ))}
            {content.type === "delay" && (
              <img
                alt=""
                src={messageTypingGif}
                style={{
                  backgroundColor: "#EBF7FF",
                  height: "40px",
                  borderRadius: "10px",
                }}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
