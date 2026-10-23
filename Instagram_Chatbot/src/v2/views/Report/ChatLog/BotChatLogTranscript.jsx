import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UserMessageTailIcon from 'v2/components/BotMessages/UserMessageTailIcon';
import { getDesignTypeChromeVars } from 'v2/utils/designTypeChrome';
import {
  generateScopedThemeCss,
  parseThemeFromDesignSettings,
} from 'v2/utils/chatbotThemeCss';
import { hasExplicitThemeValue, resolveMainColorContext } from 'v2/utils/designThemeCore';
import { parseDesignSettings } from 'v2/views/DesignSetting/utils/designChatbotUtils';
import { resolveUserMessageTheme } from 'v2/views/DesignSetting/utils/designThemeUtils';
import BotMessage from 'v2/views/Preview/PreviewComponent/BotMessage';
import CustomButton from 'v2/views/Preview/PreviewComponent/CustomButton';
import PreviewOpenChatFrame from 'v2/views/Preview/PreviewComponent/PreviewOpenChatFrame';
import UserMessage from 'v2/views/Preview/PreviewComponent/UserMessage';
import { getPrefectures } from 'v2/views/Preview/PreviewComponent/Utils';
import {
  getBotHeaderIconUrl,
  getOpeningBotStyle,
} from 'v2/views/Preview/PreviewComponent/previewOpeningStyles';
import {
  CHAT_LOG_BELONG_BOT,
  CHAT_LOG_BELONG_COMBINE,
  CHAT_LOG_BELONG_USER,
  CHAT_LOG_BUTTON_SUBMIT_TYPE,
  CHAT_LOG_COMBINE_ROLE_BOT,
  CHAT_LOG_NEXT_BUTTON,
  CHAT_LOG_TRACKING_LABEL_BROWSER,
  CHAT_LOG_TRACKING_LABEL_DEVICE_CLASS,
  CHAT_LOG_TRACKING_LABEL_IP,
  CHAT_LOG_TRACKING_LABEL_PAGE,
  CHAT_LOG_TRACKING_LABEL_REFERER,
  CHAT_LOG_TRACKING_LABEL_REGION,
  CHAT_LOG_TRACKING_LABEL_USER_AGENT,
  formatChatLogDeviceLabel,
  formatChatLogRegion,
  formatChatLogTrackingValue,
} from 'v2/views/Report/constants';

const CHAT_LOG_FRAME_WIDTH_FALLBACK = 450;
const CHAT_LOG_FRAME_HEIGHT_FALLBACK = 700;
const CHAT_LOG_FRAME_IS_OPEN = true;
const CHAT_LOG_FRAME_EXTRA_CLASS = 'preview-open-frame--no-exit-popup preview-open-frame--desktop';
const CHAT_LOG_THEME_SCOPE = '#sp-container1, .sp-container1';
const CHAT_LOG_USER_BUBBLE_CLASS = 'sp-body-user-side slideLeft';
const CHAT_LOG_USER_MESSAGES_CLASS = 'sp-body-user-side-messages position-relative';
const CHAT_LOG_NEXT_ACTION_CLASS = 'sp-user-message-button-action';
const CHAT_LOG_NEXT_BUTTON_CLASS = 'ss-user-message__action-btn';
const CHAT_LOG_PREVIEW_CLASS = 'chat-log-preview';
const CHAT_LOG_PREVIEW_STATS_CLASS = 'chat-log-preview--stats';
const CHAT_LOG_STATS_MESSAGE_ROW_CLASS = 'chat-log-stats-message-row';
const CHAT_LOG_STATS_MESSAGE_BODY_CLASS = 'chat-log-stats-message-row__body';

const ignoreChatLogInput = () => {};

const readRawDesign = (designSettings) => {
  if (!designSettings) return {};
  if (typeof designSettings === 'string') {
    try {
      return JSON.parse(designSettings);
    } catch (error) {
      return {};
    }
  }
  return designSettings;
};

const readFramePixels = (value, fallback) => {
  if (value == null || value === '') return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const ensureOriginalContent = (content) => {
  const contentType = content?.type;
  if (!contentType) return content;
  const typed = content[contentType];
  if (!typed || typeof typed !== 'object') return content;
  if (typed.originalContent) return content;
  if (typeof typed.content !== 'string' || typed.content === '') return content;
  return {
    ...content,
    [contentType]: {
      ...typed,
      originalContent: typed.content,
    },
  };
};

const buildUserMessage = (messageItem, contents) => ({
  ...messageItem,
  belong_to: CHAT_LOG_BELONG_USER,
  message_content: contents,
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
        value={formatChatLogTrackingValue(tracking?.ip)}
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

const ReadOnlyNextButton = ({ label, messageType }) => (
  <div className={CHAT_LOG_NEXT_ACTION_CLASS}>
    <CustomButton
      disabled
      className={CHAT_LOG_NEXT_BUTTON_CLASS}
      onClick={ignoreChatLogInput}
      messageType={messageType}
    >
      {label || CHAT_LOG_NEXT_BUTTON}
    </CustomButton>
  </div>
);

ReadOnlyNextButton.propTypes = {
  label: PropTypes.string,
  messageType: PropTypes.string,
};

const UserBubble = ({
  messageItem,
  indexMessage,
  contents,
  captcha,
  dataMessages,
  prefecturesList,
  variables,
  themeSettings,
  botInfor,
}) => {
  if (!contents || contents.length === 0) return null;

  const userMessage = buildUserMessage(messageItem, contents);
  const userMessageTheme = resolveUserMessageTheme(themeSettings, botInfor);

  return (
    <div className={CHAT_LOG_USER_BUBBLE_CLASS}>
      <div className={CHAT_LOG_USER_MESSAGES_CLASS}>
        <UserMessage
          message={userMessage}
          messageContentProps={contents}
          disabled
          onChangeValue={ignoreChatLogInput}
          onClickNext={ignoreChatLogInput}
          onRenderCompleted={ignoreChatLogInput}
          onChangeErrors={ignoreChatLogInput}
          onOpen={ignoreChatLogInput}
          messageIndex={indexMessage}
          captcha={captcha}
          prefecturesList={prefecturesList}
          variables={variables}
          footer={isNextVisible(messageItem, indexMessage, dataMessages) ? (
            <ReadOnlyNextButton
              label={messageItem.buttonName}
              messageType={messageItem.message_content?.[0]?.type}
            />
          ) : null}
        />
        <UserMessageTailIcon
          fillColor={userMessageTheme.bgColor}
          showTail={userMessageTheme.showTail}
        />
      </div>
    </div>
  );
};

UserBubble.propTypes = {
  messageItem: PropTypes.object.isRequired,
  indexMessage: PropTypes.number.isRequired,
  contents: PropTypes.array,
  captcha: PropTypes.array,
  dataMessages: PropTypes.array,
  prefecturesList: PropTypes.array,
  variables: PropTypes.array,
  themeSettings: PropTypes.object,
  botInfor: PropTypes.object,
};

const ReadOnlyBotMessage = ({ content, contentIndex, messageId, botInfor, themeSettings, variables }) => (
  <BotMessage
    messageId={messageId}
    content={ensureOriginalContent(content)}
    contentIndex={contentIndex}
    botInfor={botInfor}
    themeSettings={themeSettings}
    variables={variables}
    skipEntryDelay
    isBotOpen={false}
    hidden={false}
    onRenderCompleted={ignoreChatLogInput}
  />
);

ReadOnlyBotMessage.propTypes = {
  content: PropTypes.object,
  contentIndex: PropTypes.number.isRequired,
  messageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  botInfor: PropTypes.object,
  themeSettings: PropTypes.object,
  variables: PropTypes.array,
};

const BotChatLogTranscript = ({
  messages,
  botInfor,
  captcha,
  dataMessages,
  dataPrefectures,
  variables,
  tracking,
  designSettings,
  showTracking,
  renderMessageAside,
}) => {
  const [prefecturesList, setPrefecturesList] = useState(dataPrefectures);
  const rawDesign = readRawDesign(designSettings);
  const parsedDesign = parseDesignSettings(rawDesign);
  const themeSettings = parsedDesign.themeSettings;
  const frameState = {
    botInfor,
    widthPc: readFramePixels(rawDesign.width_pc, CHAT_LOG_FRAME_WIDTH_FALLBACK),
    heightPc: readFramePixels(rawDesign.height_pc, CHAT_LOG_FRAME_HEIGHT_FALLBACK),
  };
  const opening = getOpeningBotStyle(frameState, {
    embedded: true,
    editorPreview: true,
    mobile: false,
  });
  const frameClassName = `${opening.frameClassName} ${CHAT_LOG_FRAME_EXTRA_CLASS}`;
  const cssVars = {
    ...opening.cssVars,
    ...getDesignTypeChromeVars(botInfor?.design_type),
  };
  const bubbleProps = {
    captcha,
    dataMessages,
    prefecturesList,
    variables,
    themeSettings,
    botInfor,
  };

  useEffect(() => {
    if (dataPrefectures.length > 0) {
      setPrefecturesList(dataPrefectures);
      return undefined;
    }

    const active = { current: true };
    getPrefectures()
      .then((res) => {
        if (!active.current) return;
        setPrefecturesList(res?.data?.data || []);
      })
      .catch(() => {
        if (!active.current) return;
        setPrefecturesList([]);
      });

    return () => {
      active.current = false;
    };
  }, [dataPrefectures]);

  useEffect(() => {
    if (!botInfor) return undefined;

    const raw = readRawDesign(designSettings);
    const parsed = parseDesignSettings(raw);
    const { apiColorKey, mainColorHex } = resolveMainColorContext(botInfor);
    const savedTheme = parseThemeFromDesignSettings(raw);
    const style = document.createElement('style');
    style.innerHTML = generateScopedThemeCss(
      parsed.themeSettings,
      mainColorHex,
      apiColorKey,
      CHAT_LOG_THEME_SCOPE,
      botInfor.design_type,
      { applyChatWindowBg: hasExplicitThemeValue(savedTheme, 'chatWindowBgColor') },
    );
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [botInfor, designSettings]);

  const previewClassName = renderMessageAside
    ? `${CHAT_LOG_PREVIEW_CLASS} ${CHAT_LOG_PREVIEW_STATS_CLASS}`
    : CHAT_LOG_PREVIEW_CLASS;

  return (
    <>
      {showTracking ? <BotChatLogTracking tracking={tracking} /> : null}
      <div className={previewClassName}>
        <PreviewOpenChatFrame
          frameClassName={frameClassName}
          cssVars={cssVars}
          headerIconSrc={getBotHeaderIconUrl(botInfor, CHAT_LOG_FRAME_IS_OPEN) || ''}
          subtitle={botInfor?.subtitle || ''}
          titleBubble={botInfor?.title || botInfor?.titleBubble || ''}
          isOpen={CHAT_LOG_FRAME_IS_OPEN}
          designType={botInfor?.design_type}
          showPopupCloseBot={false}
        >
          {messages.map((messageItem, indexMessage) => {
            const messageKey = messageItem.id ?? indexMessage;
            const messageBlock = (
              <>
                {messageItem.belong_to === CHAT_LOG_BELONG_BOT &&
                  messageItem.message_content?.map((content, contentIndex) => (
                    <ReadOnlyBotMessage
                      key={content.id ?? contentIndex}
                      content={content}
                      contentIndex={contentIndex}
                      messageId={messageItem.id}
                      botInfor={botInfor}
                      themeSettings={themeSettings}
                      variables={variables}
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
                  messageItem.message_content?.map((content, contentIndex) => (
                    content.role === CHAT_LOG_COMBINE_ROLE_BOT ? (
                      <ReadOnlyBotMessage
                        key={content.id ?? contentIndex}
                        content={content}
                        contentIndex={contentIndex}
                        messageId={messageItem.id}
                        botInfor={botInfor}
                        themeSettings={themeSettings}
                        variables={variables}
                      />
                    ) : (
                      <UserBubble
                        key={content.id ?? contentIndex}
                        messageItem={messageItem}
                        indexMessage={indexMessage}
                        contents={[content]}
                        {...bubbleProps}
                      />
                    )
                  ))}
              </>
            );

            if (!renderMessageAside) {
              return (
                <React.Fragment key={messageKey}>
                  {messageBlock}
                </React.Fragment>
              );
            }

            const messageAside = renderMessageAside(messageItem);

            return (
              <div className={CHAT_LOG_STATS_MESSAGE_ROW_CLASS} key={messageKey}>
                <div className={CHAT_LOG_STATS_MESSAGE_BODY_CLASS}>
                  {messageBlock}
                </div>
                {messageAside}
              </div>
            );
          })}
        </PreviewOpenChatFrame>
      </div>
    </>
  );
};

BotChatLogTranscript.propTypes = {
  messages: PropTypes.array,
  botInfor: PropTypes.object,
  captcha: PropTypes.array,
  dataMessages: PropTypes.array,
  dataPrefectures: PropTypes.array,
  variables: PropTypes.array,
  tracking: PropTypes.object,
  designSettings: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  showTracking: PropTypes.bool,
  renderMessageAside: PropTypes.func,
};

BotChatLogTranscript.defaultProps = {
  messages: [],
  captcha: [],
  dataMessages: [],
  dataPrefectures: [],
  variables: [],
  tracking: null,
  designSettings: null,
  showTracking: true,
  renderMessageAside: null,
};

export default BotChatLogTranscript;
