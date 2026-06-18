import React, { useEffect, useState } from 'react';
import { BOT_MESSAGE_TYPES } from './Constants';
import HtmlCodeMessagePreview from 'components/BotMessages/HtmlCodeMessagePreview';
import AmazonPayButtonMessagePreview from 'components/BotMessages/AmazonPayButtonMessagePreview';
import { replaceVariables } from './VariablesUtils';

const CombineBotBlock = ({
  content,
  contentIndex,
  botInfor,
  previewOrderContent,
  executeLpJsCode,
  variables,
  isBotOpen,
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!content || !content[content.type]?.originalContent) return;
    if (![BOT_MESSAGE_TYPES.TEXT_INPUT, BOT_MESSAGE_TYPES.GETTING_ERROR_NOTIFICATION].includes(content.type)) return;

    if (content.text_input?.use_for_confirm_message && previewOrderContent && isBotOpen) {
      setText(previewOrderContent);
      return;
    }

    setText(replaceVariables(content[content.type]?.originalContent || '', variables));
  }, [content, content?.[content?.type]?.originalContent, variables, previewOrderContent, isBotOpen]);

  useEffect(() => {
    if (content.text_input?.use_for_confirm_message && content.text_input?.jscode?.trim() && isBotOpen) {
      executeLpJsCode?.(content.text_input.jscode);
    }
  }, [
    content.text_input?.use_for_confirm_message,
    content.text_input?.jscode,
    isBotOpen,
    executeLpJsCode,
  ]);

  const handleDownloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = 'file';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const isImageExtension = (fileContent) => ['jpeg', 'png', 'jpg'].some((ext) => fileContent.includes(ext));
  const isPdfExtension = (fileContent) => fileContent.includes('pdf');
  const isMp4Extension = (fileContent) => fileContent.includes('mp4');

  switch (content.type) {
    case BOT_MESSAGE_TYPES.TEXT_INPUT:
    case BOT_MESSAGE_TYPES.GETTING_ERROR_NOTIFICATION:
      return (
        <div
          className={`ss-combine-block-preview ss-combine-block-preview--bot ss-bot-chat-overview-${contentIndex}`}
          style={{
            backgroundColor: botInfor?.message_color,
            color: botInfor?.font_color,
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    case BOT_MESSAGE_TYPES.FILE: {
      const fileContent = content[content.type]?.content;
      if (fileContent && isImageExtension(fileContent)) {
        return <img src={fileContent} alt="" className="ss-combine-block-preview ss-combine-block-preview--bot ss-bot-chat-file-content-image" style={{ width: '100%' }} />;
      }
      if (fileContent && isPdfExtension(fileContent)) {
        return (
          <span className="ss-combine-block-preview ss-combine-block-preview--bot ss-bot-chat-file-content-download" onClick={() => handleDownloadFile(fileContent)}>
            ファイルをダウンロード
          </span>
        );
      }
      if (fileContent && isMp4Extension(fileContent)) {
        return (
          <div className="ss-combine-block-preview ss-combine-block-preview--bot">
            <video src={fileContent} autoPlay controls className="ss-bot-chat-file-content-video" style={{ width: '100%' }} />
          </div>
        );
      }
      return <div className="ss-combine-block-preview ss-combine-block-preview--bot" />;
    }
    case BOT_MESSAGE_TYPES.HTML_CODE:
      return (
        <HtmlCodeMessagePreview
          content={content}
          contentIndex={contentIndex}
          botInfor={botInfor}
        />
      );
    case BOT_MESSAGE_TYPES.AMAZON_PAY_BUTTON:
      return (
        <AmazonPayButtonMessagePreview
          content={content}
          contentIndex={contentIndex}
          botInfor={botInfor}
        />
      );
    default:
      return null;
  }
};

export default CombineBotBlock;
