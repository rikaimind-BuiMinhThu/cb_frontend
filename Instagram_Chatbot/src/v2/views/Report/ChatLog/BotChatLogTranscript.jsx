import React from 'react';
import PropTypes from 'prop-types';
import { DownCircleOutlined } from '@ant-design/icons';
import UserMessageTailIcon from 'v2/components/BotMessages/UserMessageTailIcon';
import { EC_CHATBOT_URL } from 'v2/variables/constants';
import {
  CHAT_LOG_BELONG_BOT,
  CHAT_LOG_BELONG_COMBINE,
  CHAT_LOG_BELONG_USER,
  CHAT_LOG_BUTTON_SUBMIT_TYPE,
  CHAT_LOG_COMBINE_ROLE_BOT,
  CHAT_LOG_HEADER_ICON_ALT,
  CHAT_LOG_NEXT_BUTTON,
  CHAT_LOG_TRACKING_LABEL_BROWSER,
  CHAT_LOG_TRACKING_LABEL_DEVICE_CLASS,
  CHAT_LOG_TRACKING_LABEL_IP,
  CHAT_LOG_TRACKING_LABEL_PAGE,
  CHAT_LOG_TRACKING_LABEL_REFERER,
  CHAT_LOG_TRACKING_LABEL_REGION,
  CHAT_LOG_TRACKING_LABEL_USER_AGENT,
  CHAT_LOG_USER_TAIL_COLOR,
  formatChatLogDeviceLabel,
  formatChatLogRegion,
  formatChatLogTrackingValue,
} from 'v2/views/Report/constants';
import BotMessage from './BotMessage';
import UserMessage from './UserMessage';

const buildHeaderIconSrc = (botInfor) => {
  const rawPath = botInfor?.opening_bot_icon?.url || botInfor?.icon?.url || '';
  if (!rawPath) return '';
  if (rawPath.startsWith('http')) return rawPath;
  const path = rawPath.replace(/^\/+/, '');
  return `${EC_CHATBOT_URL}/${path}`;
};

const buildFrameStyle = (botInfor) => ({
  ...(botInfor?.main_color
    ? {
      '--pof-header-bg': botInfor.main_color,
      '--chat-log-action-bg': botInfor.main_color,
    }
    : {}),
  ...(botInfor?.opacity_color ? { '--pof-body-bg': botInfor.opacity_color } : {}),
  ...(botInfor?.message_color ? { '--bot-message-bg': botInfor.message_color } : {}),
  ...(botInfor?.font_color ? { '--bot-message-color': botInfor.font_color } : {}),
});

const isNextVisible = (messageItem, indexMessage, dataMessages) => {
  if (messageItem.not_use_button) return false;
  if (messageItem.message_content?.[0]?.type === CHAT_LOG_BUTTON_SUBMIT_TYPE) return false;
  const flag = dataMessages[indexMessage]?.is_display_button_next;
  if (flag === undefined) return true;
  return Boolean(flag);
};

const TrackingLine = ({ label, value }) => (
  <div className="chat-log-tracking-line">
    <p className="chat-log-tracking-label">{label}</p>
    <p className="chat-log-tracking-value">{value}</p>
  </div>
);

TrackingLine.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const BotChatLogTracking = ({ tracking }) => {
  const region = formatChatLogRegion(tracking?.country, tracking?.city);

  return (
    <div className="chat-log-tracking">
      <TrackingLine
        label={CHAT_LOG_TRACKING_LABEL_DEVICE_CLASS}
        value={formatChatLogDeviceLabel(tracking?.device)}
      />
      <TrackingLine
        label={CHAT_LOG_TRACKING_LABEL_USER_AGENT}
        value={formatChatLogTrackingValue(tracking?.user_agent)}
      />
      <TrackingLine
        label={CHAT_LOG_TRACKING_LABEL_IP}
        value={formatChatLogTrackingValue(tracking?.ip_address)}
      />
      <TrackingLine
        label={CHAT_LOG_TRACKING_LABEL_BROWSER}
        value={formatChatLogTrackingValue(tracking?.browser)}
      />
      <TrackingLine
        label={CHAT_LOG_TRACKING_LABEL_REGION}
        value={region}
      />
      <TrackingLine
        label={CHAT_LOG_TRACKING_LABEL_REFERER}
        value={formatChatLogTrackingValue(tracking?.referer)}
      />
      <TrackingLine
        label={CHAT_LOG_TRACKING_LABEL_PAGE}
        value={formatChatLogTrackingValue(tracking?.page_url)}
      />
    </div>
  );
};

BotChatLogTracking.propTypes = {
  tracking: PropTypes.object,
};

const NextButton = ({ label }) => (
  <div className="sp-user-message-button-action">
    <button type="button" disabled className="ss-user-message__action-btn chat-log-action-btn">
      {label || CHAT_LOG_NEXT_BUTTON}
    </button>
  </div>
);

NextButton.propTypes = {
  label: PropTypes.string,
};

const UserBubble = ({
  messageItem,
  indexMessage,
  captcha,
  dataMessages,
  setDataMessages,
  indexMessageRender,
  dataPrefectures,
  variables,
  contents,
}) => (
  <div className="sp-body-user-side slideLeft">
    <div className="sp-body-user-side-messages position-relative">
      <UserMessage
        captcha={captcha}
        messageContentProps={contents}
        disabled
        onChangeValue={() => {}}
        indexMessageRender={indexMessageRender}
        indexMessage={indexMessage}
        displayButtonNext={(value) => {
          setDataMessages((prev) => prev.map((msg, idx) => (
            idx === indexMessage
              ? { ...msg, is_display_button_next: value }
              : msg
          )));
        }}
        dataPrefectures={[...dataPrefectures]}
        variables={variables}
      />
      {isNextVisible(messageItem, indexMessage, dataMessages) && (
        <NextButton label={messageItem.buttonName} />
      )}
      <UserMessageTailIcon fillColor={CHAT_LOG_USER_TAIL_COLOR} showTail />
    </div>
  </div>
);

UserBubble.propTypes = {
  messageItem: PropTypes.object.isRequired,
  indexMessage: PropTypes.number.isRequired,
  captcha: PropTypes.array,
  dataMessages: PropTypes.array,
  setDataMessages: PropTypes.func.isRequired,
  indexMessageRender: PropTypes.number,
  dataPrefectures: PropTypes.array,
  variables: PropTypes.array,
  contents: PropTypes.array,
};

const BotChatLogTranscript = ({
  messages,
  botInfor,
  captcha,
  dataMessages,
  setDataMessages,
  indexMessageRender,
  dataPrefectures,
  variables,
  tracking,
}) => {
  const headerIconSrc = buildHeaderIconSrc(botInfor);
  const subtitle = botInfor?.subtitle || '';
  const title = botInfor?.title || botInfor?.titleBubble || '';
  const bubbleProps = {
    captcha,
    dataMessages,
    setDataMessages,
    indexMessageRender,
    dataPrefectures,
    variables,
  };

  return (
    <>
      <BotChatLogTracking tracking={tracking} />
      <div className="chat-log-preview">
        <div
          id="sp-container1"
          className="sp-container1 preview-open-frame preview-open-frame--embedded preview-open-frame--editor preview-open-frame--no-exit-popup chat-log-open-frame"
          style={buildFrameStyle(botInfor)}
        >
          <div id="sp-header" className="sp-header preview-open-frame__header">
            <div className="sp-header-left">
              <div className="sp-body-bot-side-avatar sp-avatar-bt">
                {headerIconSrc ? (
                  <img src={headerIconSrc} alt={CHAT_LOG_HEADER_ICON_ALT} />
                ) : null}
              </div>
              <div className="sp-header-left-label">
                <div className="sp-header-left-label-sub-title">{subtitle}</div>
                <div className="sp-header-left-label-title">{title}</div>
              </div>
            </div>
            <div className="sp-header-right">
              <div className="sp-header-right-arrow">
                <DownCircleOutlined />
              </div>
            </div>
          </div>
          <div id="sp-body" className="sp-body preview-open-frame__body">
            {messages.map((messageItem, indexMessage) => (
              <React.Fragment key={messageItem.id ?? indexMessage}>
                {messageItem.belong_to === CHAT_LOG_BELONG_BOT &&
                  messageItem.message_content?.map((content, index) => (
                    <BotMessage
                      key={content.id ?? index}
                      content={content}
                      index={index}
                      botInfor={botInfor}
                    />
                  ))}
                {messageItem.belong_to === CHAT_LOG_BELONG_USER && (
                  <UserBubble
                    messageItem={messageItem}
                    indexMessage={indexMessage}
                    contents={messageItem.message_content}
                    {...bubbleProps}
                  />
                )}
                {messageItem.belong_to === CHAT_LOG_BELONG_COMBINE &&
                  messageItem.message_content?.map((content, index) => (
                    content.role === CHAT_LOG_COMBINE_ROLE_BOT ? (
                      <BotMessage
                        key={content.id ?? index}
                        content={content}
                        index={index}
                        botInfor={botInfor}
                      />
                    ) : (
                      <UserBubble
                        key={content.id ?? index}
                        messageItem={messageItem}
                        indexMessage={indexMessage}
                        contents={[content]}
                        {...bubbleProps}
                      />
                    )
                  ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

BotChatLogTranscript.propTypes = {
  messages: PropTypes.array,
  botInfor: PropTypes.object,
  captcha: PropTypes.array,
  dataMessages: PropTypes.array,
  setDataMessages: PropTypes.func.isRequired,
  indexMessageRender: PropTypes.number,
  dataPrefectures: PropTypes.array,
  variables: PropTypes.array,
  tracking: PropTypes.object,
};

BotChatLogTranscript.defaultProps = {
  messages: [],
  captcha: [],
  dataMessages: [],
  dataPrefectures: [],
  variables: [],
  tracking: null,
};

export default BotChatLogTranscript;
