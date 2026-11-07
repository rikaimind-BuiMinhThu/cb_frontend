import React from 'react';
import { Button } from 'reactstrap';
import CheckboxCustom from '../scenarioCommon/CheckboxCustom';
import HtmlCodeConfig from '../scenarioCommon/HtmlCodeConfig';
import AmazonPayButtonConfig from '../scenarioCommon/AmazonPayButtonConfig';
import { BOT_MESSAGE_TYPES } from 'v2/views/Preview/PreviewComponent/Constants';
import OrderConfirmConfig from '../scenarioCommon/OrderConfirmConfig';
import { SETTING_BUTTON_LABELS, SETTING_LABELS } from '../constants/scenarioSettingLabels';

const COMBINE_BOT_LABELS = {
  inputPlaceholder: SETTING_LABELS.input,
  noAutoScroll: '自動でスクロールさせない',
  useForConfirmMessage: '確認メッセージに使用',
  javascriptCodePlaceholder: 'JavaScriptコード',
  fileUrlPlaceholder: SETTING_LABELS.fileUrl,
};

const FILE_CONTENT_FIELD = 'content';
const FAQ_SCROLL_AUTO_CLASS = 'ss-bot-checkbox-scroll-auto';
const BOT_FILE_UPLOAD_INPUT_ID = 'ss-bot-file-upload';

const CombineBotBlockSetting = ({
  content,
  indexContent,
  indexMessageSelect,
  onChangeValueMessageContent,
  renderRootFaqOption,
  getBaseUrl,
  fileError,
  setIsOpenFileReference,
  setVarFileReference,
  botUploadFile,
  dataMessages,
  setDataMessages,
  isUseFukushashiki,
}) => {
  const messageType = content.type;
  const typeContent = content[messageType];

  const openFileReference = (fieldName = FILE_CONTENT_FIELD) => {
    setVarFileReference({
      indexContent,
      contentType: messageType,
      fieldName,
    });
    setIsOpenFileReference(true);
  };

  return (
    <div className="ss-combine-bot-block-setting">
      {(messageType === 'text_input' || messageType === 'getting_error_notification') && (
        <div className="ss-bot-statement-wrapper">
          <textarea
            className="ss-bot-statement-type-text-content ss-input-value"
            rows={5}
            placeholder={COMBINE_BOT_LABELS.inputPlaceholder}
            value={typeContent?.content || ''}
            onChange={(e) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, e.target.value, 'content')}
          />
          <CheckboxCustom
            label={COMBINE_BOT_LABELS.noAutoScroll}
            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, value, 'scroll_auto')}
            value={typeContent?.scroll_auto || ''}
          />
          <CheckboxCustom
            label={COMBINE_BOT_LABELS.useForConfirmMessage}
            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, value, 'use_for_confirm_message')}
            value={typeContent?.use_for_confirm_message || ''}
          />
          {renderRootFaqOption?.(FAQ_SCROLL_AUTO_CLASS)}
          {typeContent?.use_for_confirm_message && (
            <textarea
              className="ss-bot-statement-type-text-content ss-input-value"
              rows={5}
              placeholder={COMBINE_BOT_LABELS.javascriptCodePlaceholder}
              value={typeContent?.jscode || ''}
              onChange={(e) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, e.target.value, 'jscode')}
            />
          )}
        </div>
      )}

      {messageType === 'file' && (
        <div className="ss-bot-statement-wrapper">
          <textarea
            className="ss-bot-statement-type-file-content ss-input-value"
            rows={5}
            placeholder={COMBINE_BOT_LABELS.fileUrlPlaceholder}
            value={typeContent?.content || ''}
            onChange={(e) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, e.target.value, 'content')}
          />
          <input
            type="file"
            id={BOT_FILE_UPLOAD_INPUT_ID}
            name="bot-file-upload"
            hidden
            onChange={(e) => getBaseUrl(e)}
          />
          {fileError && <div className="ss-file-error">{fileError}</div>}
          <CheckboxCustom
            label={COMBINE_BOT_LABELS.noAutoScroll}
            value={typeContent?.scroll_auto || false}
            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, value, 'scroll_auto')}
          />
          <div className="ss-file-upload-wrapper">
            <Button
              className="ss-bot-file-reference-btn"
              onClick={() => openFileReference(FILE_CONTENT_FIELD)}
            >
              {SETTING_BUTTON_LABELS.fileReference}
            </Button>
            <Button className="ss-bot-file-upload-btn" onClick={botUploadFile}>
              {SETTING_BUTTON_LABELS.upload}
            </Button>
          </div>
        </div>
      )}

      {messageType === BOT_MESSAGE_TYPES.HTML_CODE && (
        <HtmlCodeConfig
          config={typeContent}
          onChangeValue={onChangeValueMessageContent}
          indexMessageSelect={indexMessageSelect}
          indexContent={indexContent}
        />
      )}

      {messageType === BOT_MESSAGE_TYPES.AMAZON_PAY_BUTTON && (
        <AmazonPayButtonConfig
          config={typeContent}
          onChangeValue={onChangeValueMessageContent}
          indexMessageSelect={indexMessageSelect}
          indexContent={indexContent}
          isUseFukushashiki={isUseFukushashiki}
          setIsOpenFileReference={setIsOpenFileReference}
          setVarFileReference={setVarFileReference}
        />
      )}

      {messageType === BOT_MESSAGE_TYPES.ORDER_CONFIRM && (
        <OrderConfirmConfig
          indexMessageSelect={indexMessageSelect}
          indexContent={indexContent}
          typeContent={typeContent}
          onChangeValueMessageContent={onChangeValueMessageContent}
          dataMessages={dataMessages}
          setDataMessages={setDataMessages}
          messageContent={content}
        />
      )}
    </div>
  );
};

export default CombineBotBlockSetting;
