import React from 'react';
import PropTypes from 'prop-types';
import { EC_CHATBOT_URL } from 'v2/variables/constants';
import {
  BOT_MESSAGE_DOWNLOAD_FILE,
  BOT_MESSAGE_FILE_DOWNLOAD_NAME,
  BOT_MESSAGE_ICON_ALT,
} from 'v2/views/Report/constants';
import messageTypingGif from 'assets/img/icons8-dots-loading.gif';

const BotMessage = ({ content, index, botInfor }) => {
  const handleDownloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = BOT_MESSAGE_FILE_DOWNLOAD_NAME;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const fileContent = content[content.type]?.content;
  const botMessageStyle = {
    '--bot-message-bg': botInfor?.message_color,
    '--bot-message-color': botInfor?.font_color,
  };

  return (
    <div key={index} className="sp-body-bot-side csp-body-bot-side slideRight">
      {(content.type === 'text_input' ||
        content.type === 'file' ||
        content.type === 'delay') && (
        <div className="sp-body-bot-side-avatar sp-avatar">
          <img
            src={`${EC_CHATBOT_URL}/${botInfor?.icon?.url}`}
            alt={BOT_MESSAGE_ICON_ALT}
          />
        </div>
      )}
      <div className="sp-body-bot-side-messages csp-body-bot-side-messages">
        {content && (
          <React.Fragment>
            {content.type === 'text_input' && (
              <div
                className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value chat-log-bot-text`}
                style={botMessageStyle}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: content[content.type]?.content,
                  }}
                />
              </div>
            )}
            {content.type === 'file' &&
              (fileContent ? (
                <React.Fragment>
                  {(fileContent.includes('jpeg') ||
                    fileContent.includes('png') ||
                    fileContent.includes('jpg')) && (
                    <img
                      src={fileContent}
                      alt={BOT_MESSAGE_ICON_ALT}
                      className="chat-log-bot-file-image"
                    />
                  )}
                  {fileContent.includes('pdf') && (
                    <span
                      className="chat-log-bot-download"
                      onClick={() => handleDownloadFile(fileContent)}
                    >
                      {BOT_MESSAGE_DOWNLOAD_FILE}
                    </span>
                  )}
                  {fileContent.includes('mp4') && (
                    <div>
                      <video
                        className="chat-log-bot-video"
                        src={fileContent}
                        autoPlay
                        controls
                      />
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <textarea
                  className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value chat-log-bot-text`}
                  value=""
                  readOnly
                  style={botMessageStyle}
                />
              ))}
            {content.type === 'delay' && (
              <img
                alt={BOT_MESSAGE_ICON_ALT}
                src={messageTypingGif}
                className="chat-log-bot-typing"
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

BotMessage.propTypes = {
  content: PropTypes.object,
  index: PropTypes.number,
  botInfor: PropTypes.object,
};

export default BotMessage;
