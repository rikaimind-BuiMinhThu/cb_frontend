import React from 'react';
import { Button } from 'reactstrap';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import HtmlCodeConfig from '../scenarioComon/HtmlCodeConfig';
import AmazonPayButtonConfig from '../scenarioComon/AmazonPayButtonConfig';
import { BOT_MESSAGE_TYPES } from '../../PreviewComponent/Constants';
import OrderConfirmConfig from '../scenarioComon/OrderConfirmConfig';

const CombineBotBlockSetting = ({
  content,
  indexContent,
  indexMessageSelect,
  onChangeValueMessageContent,
  renderRootFaqOption,
  getBaseUrl,
  fileError,
  setIsOpenFileReference,
  botUploadFile,
  dataMessages,
  setDataMessages,
}) => {
  const messageType = content.type;
  const typeContent = content[messageType];

  return (
    <div className="ss-combine-bot-block-setting">
      {(messageType === 'text_input' || messageType === 'getting_error_notification') && (
        <div className="ss-bot-statement-wrapper">
          <textarea
            className="ss-bot-statement-type-text-content ss-input-value"
            rows={5}
            placeholder="入力"
            value={typeContent?.content || ''}
            onChange={(e) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, e.target.value, 'content')}
          />
          <CheckboxCustom
            label="自動でスクロールさせない"
            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, value, 'scroll_auto')}
            value={typeContent?.scroll_auto || ''}
          />
          <CheckboxCustom
            label="確認メッセージに使用"
            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, value, 'use_for_confirm_message')}
            value={typeContent?.use_for_confirm_message || ''}
          />
          {renderRootFaqOption?.('ss-bot-checkbox-scroll-auto')}
          {typeContent?.use_for_confirm_message && (
            <textarea
              className="ss-bot-statement-type-text-content ss-input-value"
              rows={5}
              placeholder="JavaScript"
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
            placeholder="ファイルのURL"
            value={typeContent?.content || ''}
            onChange={(e) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, e.target.value, 'content')}
          />
          <input type="file" id="ss-bot-file-upload" name="bot-file-upload" hidden onChange={(e) => getBaseUrl(e)} />
          {fileError && <div style={{ color: '#FF7E00', fontSize: '12px' }}>{fileError}</div>}
          <CheckboxCustom
            label="自動でスクロールさせない"
            value={typeContent?.scroll_auto || false}
            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, messageType, value, 'scroll_auto')}
          />
          <div className="ss-file-upload-wrapper">
            <Button className="ss-bot-file-reference-btn" onClick={() => setIsOpenFileReference(true)}>ファイル参照</Button>
            <Button className="ss-bot-file-upload-btn" onClick={botUploadFile}>追加</Button>
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
