import React, { useEffect, useState } from "react";
import "assets/css/bot/preview-chat-bot.css";
import messageTypingGif from "assets/img/icons8-dots-loading.gif";
import { EC_CHATBOT_URL } from "variables/constants";
import "moment/locale/zh-cn";
import { BOT_MESSAGE_TYPES } from "./Constants";
import HtmlCodeMessagePreview from "components/BotMessages/HtmlCodeMessagePreview";

const BotMessage = ({
  content,
  index,
  botInfor,
  checkoutUrl,
  previewOrderContent,
  postMessageForExecuteJs
}) => {
  const [textInputContent, setTextInputContent] = useState(""); 

  const isShowAvatar = (content) => {
    if (!content) return false;

    switch(content.type) {
      case 'text_input':
      case 'file':
      case 'delay': 
        return true;
      case BOT_MESSAGE_TYPES.HTML_CODE: 
        return !isUGCUsage(content);
    }
  }

  const isUGCUsage = (content) => {
    if (content.type !== BOT_MESSAGE_TYPES.HTML_CODE) return false;

    return content[content.type]?.use_for_ugc;
  }

  const handleDownloadFile = (file) => {
    let link = document.createElement("a");
    link.href = file;
    link.download = "file";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    if (content.text_input?.use_for_confirm_message &&
      content.text_input?.jscode?.trim() && 
      !previewOrderContent
    ) {
      postMessageForExecuteJs(content.text_input.jscode);
    }
  }, [
    content.text_input?.use_for_confirm_message,
    content.text_input?.jscode?.trim(),
    previewOrderContent
  ]);

  const formatResult = () => {
    const cart = JSON.parse(sessionStorage.getItem("cart") || null)

    const url = cart?.cartCreate?.cart?.checkoutUrl || ""

    const email = cart?.cartCreate?.cart?.buyerIdentity?.email || ""

    const name = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.name || ""
    const formattedArea = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.formattedArea || ""
    const address1 = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.address1 || ""
    const address2 = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.address2 || ""
    const zip = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.zip || ""
    const province = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.province || ""
    const city = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.city || ""
    const phone = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.phone || ""

    const product = cart?.cartCreate?.cart?.lines?.edges[0]?.node?.merchandise?.product?.title || ""
    const variant = cart?.cartCreate?.cart?.lines?.edges[0]?.node?.merchandise?.title || ""

    const totalQuantity = cart?.cartCreate?.cart?.totalQuantity || ""

    const totalAmount = cart?.cartCreate?.cart?.cost?.totalAmount?.amount || ""
    const currencyCode = cart?.cartCreate?.cart?.cost?.totalAmount?.currencyCode || ""

    let result = content[content.type]?.content;

    if (content.text_input?.use_for_confirm_message && previewOrderContent) {
      result = previewOrderContent;
    }

    result = result?.replace("{checkoutUrl}",
      `<a href="${url}" target="_blank" style="color: ${botInfor?.font_color}">${url}</a>`)
    result = result?.replace("{checkoutUrlBtn}",
      `<a href="${url}" target="_blank" class="sp-user-message-button-action underline-none">
          <button
              id="btn-checkout-url"
              style="background-color: ${botInfor?.main_color || botInfor?.font_color}; 
                     color: ${botInfor?.main_color ? botInfor?.font_color : botInfor?.main_color_other};
                     border-radius: 25px;
                     margin: 5px 0;"
              class="ss-user-message__action-btn btn btn-secondary"
          >決済画面へ進む</button>
        </a>`)
    result = result?.replace("{email}", email)
    result = result?.replace("{phone}", phone)
    result = result?.replace("{name}", name)
    result = result?.replace("{totalQuantity}", totalQuantity)
    result = result?.replace("{totalAmount}", Number(totalAmount.toString()) + currencyCode.replace('JPY', '円'))
    result = result?.replace("{product}", product + ' - ' + variant)
    result = result?.replace("{address}", formattedArea + address1 + address2).replace("日本：", "")
    result = result?.replace("{address1}", address1)
    result = result?.replace("{address2}", address2)
    result = result?.replace("{zip}", zip)
    result = result?.replace("{province}", province)
    result = result?.replace("{city}", city)
    result = result?.replace(/\n/g, "<br>");
    return result;
  }

  return (
    <div key={index} className={`sp-body-bot-side slideRight ${!isShowAvatar(content) ? "hide_avatar" : ""} ${isUGCUsage(content) ? "ugc_usage" : ""}`}>
      {(content.type === "text_input" ||
        content.type === "file" ||
        content.type === "delay" ||
        content.type === BOT_MESSAGE_TYPES.HTML_CODE) && (
          <div className="sp-body-bot-side-avatar sp-avatar">
            <img src={EC_CHATBOT_URL + "/" + botInfor?.icon?.url} />
          </div>
        )}
      <div className="sp-body-bot-side-messages">
        {/* <img className="ss-bot-ava" src={icon} alt="" /> */}
        {content && (
          <React.Fragment>
            {/* bot: type == 'text_input' */}
            {/* bot: type == 'getting_error_notification' */}
            {(content.type === "text_input" || content.type === "getting_error_notification") && (
              <div className="position-relative">
                <div
                  className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value position-relative`}
                  style={{
                    overflowWrap: "break-word",
                    backgroundColor: botInfor?.message_color,
                    color: botInfor?.font_color,
                    height: "auto",
                    border: "none",
                    borderRadius: "20px",
                  }}

                  dangerouslySetInnerHTML={{
                    __html: formatResult()
                  }}
                >
                </div>
                <div
                  style={{
                    content: " ",
                    display: "flex",
                    position: "absolute",
                    bottom: 1,
                    left: "-3px",
                    width: "12px",
                    height: "18px",
                    backgroundColor: botInfor?.message_color,
                    background: `url(${botInfor?.icon_mess})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {!botInfor?.icon_mess && (
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="18" viewBox="0 0 37 54">
                      <path
                        d="M0 0 C7.59 0 15.18 0 23 0 C23.18 6.32 23.34 12.63 23.44 18.95 C23.48 21.1 23.53 23.25 23.6 25.4 C23.7 28.49 23.75 31.58 23.78 34.67 C23.82 35.63 23.86 36.58 23.91 37.57 C23.91 40.27 23.83 42.43 23 45 C20.61 47.35 18.05 48.68 15 50 C13.61 50.67 13.61 50.67 12.19 51.36 C3.42 54.53 -4.81 54.39 -14 54 C-14 53.34 -14 52.68 -14 52 C-13.31 51.7 -12.63 51.39 -11.92 51.08 C-11.02 50.66 -10.12 50.24 -9.19 49.81 C-8.29 49.41 -7.4 49 -6.48 48.58 C-3.39 46.61 -2.53 45.34 -1 42 C-0.54 38.78 -0.51 35.58 -0.49 32.32 C-0.47 31.4 -0.45 30.47 -0.43 29.52 C-0.38 26.58 -0.35 23.63 -0.31 20.69 C-0.28 18.69 -0.24 16.69 -0.21 14.69 C-0.12 9.79 -0.06 4.9 0 0 Z "
                        fill={botInfor?.message_color} transform="translate(14,0)" />
                    </svg>
                  )}
                </div>
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
                src={messageTypingGif}
                style={{
                  backgroundColor: "#EBF7FF",
                  height: "40px",
                  borderRadius: "10px",
                }}
              />
            )}
            {/* bot: type == 'html_code' */}
            {content.type === BOT_MESSAGE_TYPES.HTML_CODE && (
              <HtmlCodeMessagePreview
                content={content}
                index={index}
                botInfor={botInfor}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default BotMessage;