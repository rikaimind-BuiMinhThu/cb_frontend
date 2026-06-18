import React from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import InputNum from '../scenarioComon/InputNum';
import InputCustom from '../scenarioComon/InputCustom';
import HtmlCodeConfig from '../scenarioComon/HtmlCodeConfig';
import AmazonPayButtonConfig from '../scenarioComon/AmazonPayButtonConfig';
import { BOT_MESSAGE_TYPES } from '../../PreviewComponent/Constants';
import { dataApiLinkage } from '../constants/scenarioFormConstants';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import ScenarioConditionsPanel from './ScenarioConditionsPanel';

const STATEMENT_TYPE_OPTIONS = [
  ['text_input', 'テキスト'],
  ['getting_error_notification', 'エラー取得の通知'],
  ['file', 'ファイル'],
  ['email', 'メール'],
  ['api_linkage', 'API連携'],
  ['script', 'スクリプト'],
  ['delay', '遅延'],
  ['clear_variable', '変数クリア'],
  ['variable_set', '変数セット'],
  ['pause', '一時停止'],
  ['html_code', 'HTMLコード'],
  ['amazon_pay_button', 'Amazon Payボタン'],
  ['use_html_ugc_config', 'HTML_UGC_CONFIG'],
];

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
}) => (
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
        <div style={{ color: '#FF7E00', fontSize: '12px' }}>
          {fileError}
        </div>
      }
      <CheckboxCustom
        label={<span>自動でスクロールさせない<MDBIcon fas icon="question-circle" style={{ color: '#347AED', marginLeft: '5px', fontSize: '13px' }} /></span>}
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
        style={{ width: '100%' }}
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
        style={{ width: '100%' }}
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
        style={{ width: '100%' }}
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
        <span style={{ marginRight: '10px' }}>遅延（秒）</span>
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
  <div className="ss-bot-statement-wrapper" style={{ marginTop: '15px' }}>
    <span style={{ fontWeight: '400' }}>変数</span>
    {typeContent?.variables &&
      typeContent?.variables.map((item, index, arr) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <SelectCustom
            style={{ width: '30%', marginTop: '5px' }}
            data={dataInputVar}
            keyValue="variable_name"
            nameValue="variable_name"
            value={item}
            onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'variables', index)}
          />
          {arr.length > 1 &&
            <MDBIcon style={{ marginLeft: '5px' }} fas icon="times-circle" onClick={() => {
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
  <div className="ss-bot-statement-wrapper" style={{ marginTop: '15px' }}>
    <span>※直後の条件分岐に変数を使用したい場合、ユーザー側の変数セットブロックをご利用ください。</span>
    <span style={{ fontWeight: '400', marginTop: '15px', display: 'block' }}>変数</span>
    {typeContent?.variables &&
      typeContent?.variables.map((item, index, arr) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <SelectCustom
            style={{ width: '30%', marginTop: '5px' }}
            data={dataInputVar}
            keyValue="variable_name"
            nameValue="variable_name"
            value={item.key}
            onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'variables', index, 'key')}
          />
          <InputCustom
            style={{ width: '60%', marginLeft: '10px', marginTop: '5px' }}
            value={item.value}
            onChange={value => onChangeValueMessageContent(indexMessageSelect, 0, messageType, value, 'variables', index, 'value')}
          />
          {arr.length > 1 &&
            <MDBIcon style={{ marginLeft: '5px' }} fas icon="times-circle" onClick={() => {
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
  const typeContent = selectedMessage?.message_content?.[0]?.[messageType];

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
        <div style={{ padding: '10px' }}>
          <div className="ss-user-setting__top">
            <div className="ss-user-setting__name-wrapper" style={{ marginBottom: '10px' }}>
              <div>
                <span>名称</span>
                <span className="ss-user-setting__name-error" style={{ marginLeft: '5px', marginTop: '0px' }}>※必須</span>
              </div>
              <InputCustom
                placeholder="名称"
                style={{ width: '100%' }}
                onChange={value => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
                value={selectedMessage.message_name}
              />
            </div>
          </div>
          <label htmlFor="ss-bot-statement-title" style={{ marginBottom: '1px' }}>タイプ</label>
          <select
            name="bot_statement_type"
            id="ss-bot-statement-type"
            className="ss-input-value"
            value={messageType}
            onChange={e => handleChangeBotStatementType(e.target.value)}
          >
            {STATEMENT_TYPE_OPTIONS.map(([value, label]) => (
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
          {(messageType === 'script' || messageType === BOT_MESSAGE_TYPES.UGC) && <ScriptSection {...sectionProps} />}
          {messageType === 'delay' && <DelaySection {...sectionProps} />}
          {messageType === 'clear_variable' && <ClearVariableSection {...sectionProps} dataInputVar={dataInputVar} />}
          {messageType === 'variable_set' && <VariableSetSection {...sectionProps} dataInputVar={dataInputVar} />}

          {messageType === 'pause' && (
            <div style={{ marginTop: '15px', fontWeight: '700' }}>一時停止</div>
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
        </div>
      </div>
      <ScenarioConditionsPanel variant="bot" />
    </div>
  );
};

export default ScenarioBotSettingsPanel;
