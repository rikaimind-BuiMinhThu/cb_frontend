import React from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../scenarioCommon/SelectCustom';
import CheckboxCustom from '../scenarioCommon/CheckboxCustom';
import InputNum from '../scenarioCommon/InputNum';
import InputCustom from '../scenarioCommon/InputCustom';
import HtmlCodeConfig from '../scenarioCommon/HtmlCodeConfig';
import AmazonPayButtonConfig from '../scenarioCommon/AmazonPayButtonConfig';
import { BOT_MESSAGE_TYPES } from 'v2/views/BotElement/BotSetting/PreviewComponent/Constants';
import { dataApiLinkage } from '../constants/scenarioFormConstants';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import ScenarioMessageSettingsAccordion from './ScenarioMessageSettingsAccordion';
import OrderConfirmConfig from '../scenarioCommon/OrderConfirmConfig';
import CartLoginConfig from '../scenarioCommon/CartLoginConfig';
import { SETTING_LABELS, SETTING_PLACEHOLDERS } from '../constants/scenarioSettingLabels';
import { BOT_STATEMENT_TYPE_OPTIONS } from '../constants/scenarioPanelOptions';

const removeVariableAt = (message, messageType, index) => {
  const variables = message.message_content[0][messageType].variables;
  message.message_content[0][messageType].variables = [
    ...variables.slice(0, index),
    ...variables.slice(index + 1),
  ];
};

// type: text_input / getting_error_notification
const TextStatementSection = ({
  messageType, typeContent, indexMessageSelect, onChangeValueMessageContent, renderRootFaqOption,
  dataMessages, setDataMessages,
}) => {
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[0];

  return (
  <div className="ss-bot-statement-wrapper">
    <div
      id="ss-bot-statement-type-text"
      className="ss-bot-statement-type-text ss-bot-statement-type"
    >
      <textarea
        name="bot-statement-type-text-content"
        id="bot-statement-type-text-content"
        className="ss-bot-statement-type-text-content ss-input-value"
        rows={5}
        placeholder="入力"
        value={typeContent?.['content'] || ''}
        onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'content')}
      >
      </textarea>
    </div>
    <div className="ss-bot-checkbox-scroll-auto">
      <CheckboxCustom
        label="自動でスクロールさせない"
        onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'scroll_auto')}
        value={typeContent?.['scroll_auto'] || ''}
      />
    </div>
    <div className="ss-bot-checkbox-scroll-auto">
      <CheckboxCustom
        label="確認メッセージに使用"
        onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'use_for_confirm_message')}
        value={typeContent?.['use_for_confirm_message'] || ''}
      />
    </div>
    {renderRootFaqOption('ss-bot-checkbox-scroll-auto')}
    <div className="ss-bot-checkbox-scroll-auto">
      <CheckboxCustom
        label="表示待ち時間を設定する"
        onChange={(value) => {
          if (messageContent) {
            messageContent.is_use_custom_delay = value;
            if (value && !messageContent.custom_delay_time) {
              messageContent.custom_delay_time = 1.0;
            }
          }
          setDataMessages([...dataMessages]);
        }}
        value={messageContent?.is_use_custom_delay || false}
      />
    </div>
    {messageContent?.is_use_custom_delay && (
      <div className="ss-user-setting__item-bottom-flex-start ss-delay-setting">
        <span className="ss-delay-setting__label">待ち時間 (秒)</span>
        <InputNum
          step={0.1}
          min={0}
          max={10}
          placeholder="1.0"
          className="ss-user-setting-input-delay"
          value={messageContent?.custom_delay_time}
          onChange={(value) => {
            messageContent.custom_delay_time = value;
            setDataMessages([...dataMessages]);
          }}
        />
      </div>
    )}
    {typeContent?.['use_for_confirm_message'] && (
      <div
        id="ss-bot-statement-type-text"
        className="ss-bot-statement-type-text ss-bot-statement-type"
      >
        <textarea
          name="bot-statement-type-text-content"
          id="bot-statement-type-text-content"
          className="ss-bot-statement-type-text-content ss-input-value"
          rows={5}
          placeholder="入力"
          value={typeContent?.['jscode'] || ''}
          onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'jscode')}
        >
        </textarea>
      </div>
    )}
  </div>
  );
};

// type: file
const FileStatementSection = ({
  messageType, typeContent, indexMessageSelect, onChangeValueMessageContent,
  getBaseUrl, fileError, setIsOpenFileReference, botUploadFile,
}) => (
  <div className="ss-bot-statement-wrapper">
    <div
      id="ss-bot-statement-type-file"
      className="ss-bot-statement-type-file ss-bot-statement-type"
    >
      <textarea
        name="bot-statement-type-file-content"
        id="ss-bot-statement-type-file-content"
        className="ss-bot-statement-type-file-content ss-input-value"
        rows={5}
        placeholder="ファイルのURL"
        value={typeContent?.content || ''}
        onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'content')}
      ></textarea>
      <input
        type="file"
        id="ss-bot-file-upload"
        name="bot-file-upload"
        hidden
        onChange={(e) => getBaseUrl(e)}
      />
      {fileError &&
        <div className="ss-file-error">
          {fileError}
        </div>
      }
      <CheckboxCustom
        label={<span>自動でスクロールさせない<MDBIcon fas icon="question-circle" className="ss-help-icon" /></span>}
        value={typeContent?.scroll_auto || false}
        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'scroll_auto')}
      />
      <div className="ss-file-upload-wrapper">
        <Button className="ss-bot-file-reference-btn" onClick={() => setIsOpenFileReference(true)}>
          ファイル参照
        </Button>
        <Button className="ss-bot-file-upload-btn" onClick={botUploadFile}>
          追加
        </Button>
      </div>
    </div>
  </div>
);

// type: email
const EmailSection = ({ messageType, typeContent, indexMessageSelect, onChangeValueMessageContent, dataEmail }) => (
  <div className="ss-bot-statement-wrapper">
    <div
      id="ss-bot-statement-type-email"
      className="ss-bot-statement-type-email ss-bot-statement-type"
    >
      <SelectCustom
        className="ss-select--full"
        id="title"
        data={dataEmail}
        keyValue={"id"}
        nameValue={"email_template_name"}
        value={typeContent?.contentId || ''}
        onChange={(value) => {
          onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'contentId');
          onChangeValueMessageContent(indexMessageSelect, 0, messageType, dataEmail.find(item => item.id === value)?.email_template_name || '', 'content');
        }}
      />
    </div>
  </div>
);

// type: api_linkage
const ApiLinkageSection = ({ messageType, typeContent, indexMessageSelect, onChangeValueMessageContent }) => (
  <div className="ss-bot-statement-wrapper">
    <div className="ss-bot-statement-type-email ss-bot-statement-type">
      <SelectCustom
        className="ss-select--full"
        id="title"
        data={dataApiLinkage}
        value={typeContent?.type || ''}
        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'type')}
      />
      <CheckboxCustom
        className={"ss-checkbox-custom-style"}
        label={'「処理中」アイコンを表示する'}
        value={typeContent?.isShowProcessing}
        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'isShowProcessing')}
      />
      <InputCustom
        value={typeContent?.titleProcessing}
        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'titleProcessing')}
      />
      <CheckboxCustom
        className={"ss-checkbox-custom-style"}
        label={'前のブロックを非活性にする'}
        value={typeContent?.isDeactivePreviousBlock}
        onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'isDeactivePreviousBlock')}
      />
    </div>
  </div>
);

// type: script / UGC
const ScriptSection = ({ messageType, typeContent, indexMessageSelect, onChangeValueMessageContent }) => (
  <div className="ss-bot-statement-wrapper">
    <div
      id="ss-bot-statement-type-script"
      className="ss-bot-statement-type-script ss-bot-statement-type"
    >
      <textarea
        name="bot-statement-type-script-content"
        id="bot-statement-type-script-content"
        className="ss-bot-statement-type-script-content ss-input-value"
        rows={5}
        placeholder="スクリプト..."
        value={typeContent?.['content'] || ''}
        onChange={(e) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, e.target.value, 'content')}
      ></textarea>
    </div>
  </div>
);

// type: delay
const DelaySection = ({ messageType, typeContent, indexMessageSelect, onChangeValueMessageContent }) => (
  <div className="ss-bot-statement-wrapper">
    <div
      id="ss-bot-statement-type-delay"
      className="ss-bot-statement-type-delay ss-bot-statement-type"
    >
      <div className="ss-user-setting__item-bottom-flex-start">
        <span className="ss-delay-setting__label">遅延（秒）</span>
        <InputNum
          placeholder="00"
          className="ss-user-setting-input-delay ss-user-setting-input-limit-character"
          min={0}
          max={10}
          value={typeContent?.['content'] || ''}
          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'content')}
        />
      </div>
      <div className="ss-bot-statement-type-delay__checkbox-wrapper">
        <CheckboxCustom
          label="typing_on (入力指標をオンにする)"
          onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'typing_on')}
          value={typeContent?.['typing_on'] || ''}
        />
      </div>
    </div>
  </div>
);

// type: clear_variable
const ClearVariableSection = ({
  messageType, typeContent, indexMessageSelect, selectedMessage,
  dataMessages, setDataMessages, onChangeValueMessageContent, dataInputVar,
}) => (
  <div className="ss-bot-statement-wrapper ss-config-field--mt15">
    <span className="ss-bot-variable-label">変数</span>
    {typeContent?.variables &&
      typeContent?.variables.map((item, index, arr) => (
        <div key={index} className="ss-variable-row">
          <SelectCustom
            className="ss-select--30-mt"
            data={dataInputVar}
            keyValue="variable_name"
            nameValue="variable_name"
            value={item}
            onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'variables', index)}
          />
          {arr.length > 1 &&
            <MDBIcon className="ss-icon-remove" fas icon="times-circle" onClick={() => {
              removeVariableAt(selectedMessage, messageType, index);
              setDataMessages([...dataMessages]);
            }} />
          }
        </div>
      ))
    }
    <Button onClick={() => {
      typeContent?.variables.push(dataInputVar[0]?.variable_name);
      setDataMessages([...dataMessages]);
    }}>追加</Button>
  </div>
);

// type: variable_set
const VariableSetSection = ({
  messageType, typeContent, indexMessageSelect, selectedMessage,
  dataMessages, setDataMessages, onChangeValueMessageContent, dataInputVar,
}) => (
  <div className="ss-bot-statement-wrapper ss-config-field--mt15">
    <span>※直後の条件分岐に変数を使用したい場合、ユーザー側の変数セットブロックをご利用ください。</span>
    <span className="ss-bot-variable-label--block">変数</span>
    {typeContent?.variables &&
      typeContent?.variables.map((item, index, arr) => (
        <div key={index} className="ss-variable-row">
          <SelectCustom
            className="ss-select--30-mt"
            data={dataInputVar}
            keyValue="variable_name"
            nameValue="variable_name"
            value={item.key}
            onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'variables', index, 'key')}
          />
          <InputCustom
            className="ss-input--60-ml"
            value={item.value}
            onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'variables', index, 'value')}
          />
          {arr.length > 1 &&
            <MDBIcon className="ss-icon-remove" fas icon="times-circle" onClick={() => {
              removeVariableAt(selectedMessage, messageType, index);
              setDataMessages([...dataMessages]);
            }} />
          }
        </div>
      ))
    }
    <Button onClick={() => {
      typeContent?.variables.push({ key: dataInputVar[0]?.variable_name, value: '' });
      setDataMessages([...dataMessages]);
    }}>追加</Button>
  </div>
);

const ScenarioBotSettingsPanel = () => {
  const {
    belongTo, messageType, indexMessageSelect, dataMessages, setDataMessages,
    dataEmail, dataInputVar, fileError, setIsOpenFileReference, setVarFileReference,
    botUploadFile, getBaseUrl, onChangeValueMessageContent, onChangeValueNameMessage,
    handleChangeBotStatementType, renderRootFaqOption, isUseFukushashiki,
  } = useScenarioPanelDestructuring();

  const selectedMessage = dataMessages?.[indexMessageSelect];
  const messageContent = selectedMessage?.message_content?.[0];
  const typeContent = messageContent?.[messageType];

  if (!selectedMessage || belongTo !== 'bot' || selectedMessage.message_content?.length === 0) {
    return null;
  }

  const sectionProps = {
    messageType, typeContent, indexMessageSelect, selectedMessage,
    dataMessages, setDataMessages, onChangeValueMessageContent,
  };

  return (
    <div className="ss-bot-setting-container ss-layout-bot-setting">
      <div id="bot-statement" className="ss-bot-statement-detail-setting">
        <div className="ss-bot-statement-pad">
          <div className="ss-user-setting__top">
            <div className="ss-user-setting__name-wrapper ss-name-wrapper--spaced">
              <div>
                <span>{SETTING_LABELS.name}</span>
                <span className="ss-user-setting__name-error ss-name-error--flush">{SETTING_LABELS.requiredMark}</span>
              </div>
              <InputCustom
                placeholder={SETTING_PLACEHOLDERS.messageNameShort}
                onChange={value => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
                value={selectedMessage.message_name}
              />
            </div>
          </div>
          <label htmlFor="ss-bot-statement-type" className="ss-bot-statement-type-label">{SETTING_LABELS.type}</label>
          <select
            name="bot_statement_type"
            id="ss-bot-statement-type"
            className="ss-input-value"
            value={messageType}
            onChange={e => handleChangeBotStatementType(e.target.value)}
          >
            {BOT_STATEMENT_TYPE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {(messageType === 'text_input' || messageType === 'getting_error_notification') &&
            <TextStatementSection {...sectionProps} renderRootFaqOption={renderRootFaqOption} />
          }
          {messageType === 'file' &&
            <FileStatementSection
              {...sectionProps}
              getBaseUrl={getBaseUrl}
              fileError={fileError}
              setIsOpenFileReference={setIsOpenFileReference}
              botUploadFile={botUploadFile}
            />
          }
          {messageType === 'email' && <EmailSection {...sectionProps} dataEmail={dataEmail} />}
          {messageType === 'api_linkage' && <ApiLinkageSection {...sectionProps} />}
          {messageType === 'script' && <ScriptSection {...sectionProps} />}
          {messageType === 'delay' && <DelaySection {...sectionProps} />}
          {messageType === 'clear_variable' && <ClearVariableSection {...sectionProps} dataInputVar={dataInputVar} />}
          {messageType === 'variable_set' && <VariableSetSection {...sectionProps} dataInputVar={dataInputVar} />}

          {messageType === 'pause' && (
            <div className="ss-bot-pause-title">一時停止</div>
          )}
          {messageType === BOT_MESSAGE_TYPES.HTML_CODE && (
            <HtmlCodeConfig
              config={typeContent}
              onChangeValue={onChangeValueMessageContent}
              indexMessageSelect={indexMessageSelect}
            />
          )}
          {messageType === BOT_MESSAGE_TYPES.AMAZON_PAY_BUTTON && (
            <AmazonPayButtonConfig
              config={typeContent}
              onChangeValue={onChangeValueMessageContent}
              indexMessageSelect={indexMessageSelect}
              isUseFukushashiki={isUseFukushashiki}
              setIsOpenFileReference={setIsOpenFileReference}
              setVarFileReference={setVarFileReference}
            />
          )}
          {messageType === BOT_MESSAGE_TYPES.ORDER_CONFIRM && (
            <OrderConfirmConfig
              indexMessageSelect={indexMessageSelect}
              typeContent={typeContent}
              onChangeValueMessageContent={onChangeValueMessageContent}
              dataMessages={dataMessages}
              setDataMessages={setDataMessages}
              messageContent={messageContent}
            />
          )}
          {messageType === BOT_MESSAGE_TYPES.CART_LOGIN && (
            <CartLoginConfig
              config={typeContent}
              onChangeValue={onChangeValueMessageContent}
              indexMessageSelect={indexMessageSelect}
              dataMessages={dataMessages}
              setDataMessages={setDataMessages}
            />
          )}
        </div>
      </div>
      <ScenarioMessageSettingsAccordion
        variant="bot"
        selectedMessage={dataMessages[indexMessageSelect]}
        dataMessages={dataMessages}
        setDataMessages={setDataMessages}
        indexMessageSelect={indexMessageSelect}
      />
    </div>
  );
};

export default ScenarioBotSettingsPanel;
