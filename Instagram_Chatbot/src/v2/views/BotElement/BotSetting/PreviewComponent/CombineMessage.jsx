import React from 'react';
import CustomButton from '../CustomButton';
import UserMessage from './UserMessage';
import CombineBotBlock from './CombineBotBlock';
import {
  COMBINE_CONTENT_ROLES,
  COMBINE_MESSAGE_DEFAULTS,
} from './Constants';
import { getElementMessageById, isCombineMessage } from './Utils';

export const CombineMessageNextButton = ({
  message,
  messageIndex,
  botInfor,
  onClickNext,
  isUpdate,
  isExtractFromSession,
}) => {
  if (!message || !isCombineMessage(message)) return null;
  if (message.not_use_button) return null;
  if (message.message_content.some((block) => block.type === 'button_submit')) return null;

  const btnText = message.buttonName || '次へ';
  const firstUserBlock = message.message_content.find((block) => block.role === COMBINE_CONTENT_ROLES.USER);
  const isDisplayBtnNext = !firstUserBlock
    || firstUserBlock.type !== 'image'
    || firstUserBlock.image?.displayButtonNext !== false;
  const isAutoClick = !isDisplayBtnNext && isUpdate;

  return (
    <div className="sp-user-message-button-action ss-combine-message__next-button" style={{ display: isDisplayBtnNext ? 'flex' : 'none' }}>
      <CustomButton
        disabled={false}
        className="ss-user-message__action-btn"
        onClick={() => onClickNext(messageIndex, message)}
        autoClick={isAutoClick && !isExtractFromSession}
        messsagetype={firstUserBlock?.type}
      >
        {btnText}
      </CustomButton>
    </div>
  );
};

const CombineMessage = ({
  message,
  messageIndex,
  botInfor,
  themeSettings,
  variables,
  previewOrderContent,
  executeLpJsCode,
  isBotOpen,
  onChangeValue,
  onClickNext,
  errorsProps,
  captcha,
  onChangeErrors,
  prefecturesList,
  lpOptionData,
  submitErrorMessage,
  postMessageToParent,
  botId,
  isProcessing,
  disabled,
  onOpen,
  messageIndexRender,
  cartSystem,
  isUpdate,
  isExtractFromSession,
  skipEntryAnimation = false,
}) => {
  if (!isCombineMessage(message)) return null;

  const contentGap = message.combine_message?.content_gap ?? COMBINE_MESSAGE_DEFAULTS.CONTENT_GAP;

  return (
    <div
      className={skipEntryAnimation ? 'sp-body-user-side' : 'sp-body-user-side slideLeft'}
      id={getElementMessageById(message.id)}
    >
      <div className="sp-body-user-side-messages">
        <div className="ss-user-message__content-wrapper">
          <div className="ss-combine-message__content">
            {message.message_content.map((content, contentIndex) => {
              const padding = content.padding ?? COMBINE_MESSAGE_DEFAULTS.BLOCK_PADDING;
              const blockStyle = {
                padding: `${padding}px`,
                ...(contentIndex > 0 ? { marginTop: `${contentGap}px` } : {}),
              };

              return (
                <div
                  key={content.id ?? contentIndex}
                  className="ss-combine-message__block"
                  style={blockStyle}
                >
                  <div className="ss-combine-message__block-inner">
                    {content.role === COMBINE_CONTENT_ROLES.BOT ? (
                      <CombineBotBlock
                        content={content}
                        contentIndex={contentIndex}
                        botInfor={botInfor}
                        themeSettings={themeSettings}
                        previewOrderContent={previewOrderContent}
                        executeLpJsCode={executeLpJsCode}
                        variables={variables}
                        isBotOpen={isBotOpen}
                      />
                    ) : (
                      <CombineUserBlock
                        content={content}
                        contentIndex={contentIndex}
                        message={message}
                        messageIndex={messageIndex}
                        onChangeValue={onChangeValue}
                        errorsProps={errorsProps}
                        disabled={disabled}
                        captcha={captcha}
                        onChangeErrors={onChangeErrors}
                        prefecturesList={prefecturesList}
                        variables={variables}
                        lpOptionData={lpOptionData}
                        submitErrorMessage={submitErrorMessage}
                        postMessageToParent={postMessageToParent}
                        botId={botId}
                        isProcessing={isProcessing}
                        onClickNext={onClickNext}
                        onOpen={onOpen}
                        messageIndexRender={messageIndexRender}
                        cartSystem={cartSystem}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <CombineMessageNextButton
            message={message}
            messageIndex={messageIndex}
            botInfor={botInfor}
            onClickNext={onClickNext}
            isUpdate={isUpdate}
            isExtractFromSession={isExtractFromSession}
          />
        </div>
      </div>
    </div>
  );
};

const CombineUserBlock = ({
  content,
  contentIndex,
  message,
  messageIndex,
  onChangeValue,
  errorsProps,
  disabled,
  captcha,
  onChangeErrors,
  prefecturesList,
  variables,
  lpOptionData,
  submitErrorMessage,
  postMessageToParent,
  botId,
  isProcessing,
  onClickNext,
  onOpen,
  messageIndexRender,
  cartSystem,
}) => {
  const syntheticMessage = {
    ...message,
    belong_to: 'user',
    message_content: [content],
  };

  return (
    <UserMessage
      message={syntheticMessage}
      messageContentProps={[content]}
      disabled={disabled}
      messageIndexRender={messageIndexRender}
      errorsProps={errorsProps}
      messageIndex={messageIndex}
      captcha={captcha}
      onClickNext={onClickNext}
      onOpen={onOpen}
      onChangeErrors={onChangeErrors}
      prefecturesList={prefecturesList}
      variables={variables}
      lpOptionData={lpOptionData}
      submitErrorMessage={submitErrorMessage}
      postMessageToParent={postMessageToParent}
      botId={botId}
      isProcessing={isProcessing}
      onChangeValue={(idx, contentType, value, field, subField1, subField2) =>
        onChangeValue(contentIndex, contentType, value, field, subField1, subField2)
      }
      cartSystem={cartSystem}
    />
  );
};

export default CombineMessage;
