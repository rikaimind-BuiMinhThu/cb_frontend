import React, { useEffect, useState } from "react";
import "assets/css/bot/preview-chat-bot.css";
import messageTypingGif from "assets/img/icons8-dots-loading.gif";
import { EC_CHATBOT_URL } from "variables/constants";
import "moment/locale/zh-cn";
import { BOT_MESSAGE_TYPES, RENDER_CHATBOT_CONFIG } from "./Constants";
import HtmlCodeMessagePreview from "components/BotMessages/HtmlCodeMessagePreview";
import { getElementMessageById } from "./Utils";
import { replaceVariables } from "./VariablesUtils";

const BotMessage = ({
  content,
  contentIndex,
  botInfor,
  previewOrderContent,
  executeLpJsCode,
  messageId,
  variables,
  onRenderCompleted,
  hidden,
  currentMsgIndex,
}) => {
  const [isDelaying, setIsDelaying] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    if (isDelaying) return;
    onRenderCompleted();
  }, [isDelaying]);

  useEffect(() => {
    if (!content || !content[content.type]?.originalContent) return;

    if (![BOT_MESSAGE_TYPES.TEXT_INPUT, BOT_MESSAGE_TYPES.GETTING_ERROR_NOTIFICATION].includes(content.type)) return;

    setText(replaceVariables(content[content.type]?.originalContent || "", variables));
  }, [content, content[content.type]?.originalContent, variables]);

  useEffect(()=>{
    if (content.text_input?.use_for_confirm_message && previewOrderContent) {
      setText(previewOrderContent);
    }
  }, [content, previewOrderContent]);

  const isShowAvatar = () => {
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
    if (!isDelaying) return;

    let timeoutId;

    if (content.type === BOT_MESSAGE_TYPES.DELAY) {
      setIsDelaying(true);
      timeoutId = setTimeout(() => {
        setIsDelaying(false);
      }, content.delay.content * 1000);
      return () => clearTimeout(timeoutId);
    }

    if (isDelaying) {
      timeoutId = setTimeout(() => {
        setIsDelaying(false);
      }, RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE);
      return () => clearTimeout(timeoutId);
    }

  }, [content.type, isDelaying]);

  useEffect(() => {
    // When hidden === undefined, it means the message is not hidden yet
    if (hidden === true) return;

    if (content.text_input?.use_for_confirm_message && content.text_input?.jscode?.trim()) {
      executeLpJsCode(content.text_input.jscode);
    }
  }, [
    currentMsgIndex,
    hidden,
    content.text_input?.use_for_confirm_message,
    content.text_input?.jscode?.trim(),
  ]);

  // const formatResult = () => {
  //   const cart = JSON.parse(sessionStorage.getItem("cart") || null)

  //   const url = cart?.cartCreate?.cart?.checkoutUrl || ""

  //   const email = cart?.cartCreate?.cart?.buyerIdentity?.email || ""

  //   const name = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.name || ""
  //   const formattedArea = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.formattedArea || ""
  //   const address1 = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.address1 || ""
  //   const address2 = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.address2 || ""
  //   const zip = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.zip || ""
  //   const province = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.province || ""
  //   const city = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.city || ""
  //   const phone = cart?.cartCreate?.cart?.buyerIdentity?.deliveryAddressPreferences[0]?.phone || ""

  //   const product = cart?.cartCreate?.cart?.lines?.edges[0]?.node?.merchandise?.product?.title || ""
  //   const variant = cart?.cartCreate?.cart?.lines?.edges[0]?.node?.merchandise?.title || ""

  //   const totalQuantity = cart?.cartCreate?.cart?.totalQuantity || ""

  //   const totalAmount = cart?.cartCreate?.cart?.cost?.totalAmount?.amount || ""
  //   const currencyCode = cart?.cartCreate?.cart?.cost?.totalAmount?.currencyCode || ""

  //   let result = content[content.type]?.content;

  //   if (content.text_input?.use_for_confirm_message && previewOrderContent) {
  //     result = previewOrderContent;
  //   }

  //   result = result?.replace("{checkoutUrl}",
  //     `<a href="${url}" target="_blank" style="color: ${botInfor?.font_color}">${url}</a>`)
  //   result = result?.replace("{checkoutUrlBtn}",
  //     `<a href="${url}" target="_blank" class="sp-user-message-button-action underline-none">
  //         <button
  //             id="btn-checkout-url"
  //             style="background-color: ${botInfor?.main_color || botInfor?.font_color}; 
  //                    color: ${botInfor?.main_color ? botInfor?.font_color : botInfor?.main_color_other};
  //                    border-radius: 25px;
  //                    margin: 5px 0;"
  //             class="ss-user-message__action-btn btn btn-secondary"
  //         >決済画面へ進む</button>
  //       </a>`)
  //   result = result?.replace("{email}", email)
  //   result = result?.replace("{phone}", phone)
  //   result = result?.replace("{name}", name)
  //   result = result?.replace("{totalQuantity}", totalQuantity)
  //   result = result?.replace("{totalAmount}", Number(totalAmount.toString()) + currencyCode.replace('JPY', '円'))
  //   result = result?.replace("{product}", product + ' - ' + variant)
  //   result = result?.replace("{address}", formattedArea + address1 + address2).replace("日本：", "")
  //   result = result?.replace("{address1}", address1)
  //   result = result?.replace("{address2}", address2)
  //   result = result?.replace("{zip}", zip)
  //   result = result?.replace("{province}", province)
  //   result = result?.replace("{city}", city)
  //   result = result?.replace(/\n/g, "<br>");
  //   return content[content.type]?.content;
  // }

  const renderAvatar = () => {
    if (!isShowAvatar()) return null;

    const botAvatar = botInfor?.icon?.url || botInfor?.opening_bot_icon?.url || botInfor?.closing_bot_icon?.url;

    return (
      <div className="sp-body-bot-side-avatar sp-avatar">
        <img src={EC_CHATBOT_URL + "/" + botAvatar} />
      </div>
    )
  }

  const renderTextInputContent = () => {
    return (
      <div className="position-relative">
        <div
          className={`ss-bot-chat-overview-${contentIndex} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value ss-bot-chat-text-input position-relative`}
          style={{
            backgroundColor: botInfor?.message_color,
            color: botInfor?.font_color,
          }}
          dangerouslySetInnerHTML={{__html: text}}
        >
        </div>
        <div
          className="ss-bot-chat-text-input-bot-icon position-absolute"
          style={{
            backgroundColor: botInfor?.message_color,
            background: `url(${botInfor?.icon_mess})`,
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
    )
  }

  const isImageExtension = (fileContent) => {
    const imgExtensions = ["jpeg", "png", "jpg"];
    return imgExtensions.some(extension => fileContent.includes(extension));
  }

  const isPdfExtension = (fileContent) => {
    return fileContent.includes("pdf");
  }

  const isMp4Extension = (fileContent) => {
    return fileContent.includes("mp4");
  }

  const renderFileContentImage = () => {
    return (
      <img src={fileContent} alt="" className="ss-bot-chat-file-content-image" />
    )
  }

  const renderFileContentPdf = () => {
    return (
      <span className="ss-bot-chat-file-content-download" onClick={() => handleDownloadFile(fileContent)}>
        ファイルをダウンロード
      </span>
    )
  }

  const renderFileContentVideo = () => {
    return (
      <div><video src={fileContent} autoPlay controls className="ss-bot-chat-file-content-video" /></div>
    )
  }

  const renderFileContent = () => {
    const fileContent = content[content.type]?.content;

    if (fileContent) {
      if (isImageExtension(fileContent)) return renderFileContentImage();
      if (isPdfExtension(fileContent)) return renderFileContentPdf();
      if (isMp4Extension(fileContent)) return renderFileContentVideo();  
    }

    return (
      <textarea
        className={`ss-bot-chat-overview-${contentIndex} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value`}
        value={""}
        readOnly
        style={{
          backgroundColor: botInfor?.message_color,
          border: "none",
          borderRadius: "20px",
          color: botInfor?.font_color,
        }}
      ></textarea>
    );
  }

  const renderDelayContent = () => {
    if (!isDelaying) return null;
    
    return (
      <img src={messageTypingGif} className="ss-bot-chat-delay" />
    )
  }

  const renderHtmlCodeContent = () => {
    return (
      <HtmlCodeMessagePreview
        content={content}
        contentIndex={contentIndex}
        botInfor={botInfor}
      />
    )
  }

  const renderContent = () => {
    if (!content) return null;

    if (isDelaying) {
      return renderDelayContent();
    }

    switch (content.type) {
      case BOT_MESSAGE_TYPES.TEXT_INPUT:
      case BOT_MESSAGE_TYPES.GETTING_ERROR_NOTIFICATION:
        return renderTextInputContent();
      case BOT_MESSAGE_TYPES.FILE:
        return renderFileContent();
      case BOT_MESSAGE_TYPES.DELAY:
        return renderDelayContent();
      case BOT_MESSAGE_TYPES.HTML_CODE:
        return renderHtmlCodeContent();
    }
  }

  if (!content) return null;
  if (content.type === BOT_MESSAGE_TYPES.DELAY && !isDelaying) return null;

  return (
    <div key={contentIndex} 
      id={getElementMessageById(messageId)}
      className={`sp-body-bot-side slideRight ${!isShowAvatar() ? "hide_avatar" : ""} ${isUGCUsage(content) ? "ugc_usage" : ""}`}>
      { renderAvatar() }
      <div className="sp-body-bot-side-messages">
        {content && (
          <React.Fragment>
            { renderContent() }
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default BotMessage;