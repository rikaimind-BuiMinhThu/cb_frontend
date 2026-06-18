import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import 'react-datepicker/dist/react-datepicker.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioComon/InputCustom';
import { CONTENT_SETTING_MAP } from '../contentSettings';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import ScenarioConditionsPanel from './ScenarioConditionsPanel';
import ScenarioModalCheckbox from './modals/shared/ScenarioModalCheckbox';
import ScenarioFormRow from './modals/shared/ScenarioFormRow';
import ScenarioInfoTooltip from './modals/shared/ScenarioInfoTooltip';
import ScenarioCodeTextarea from './modals/shared/ScenarioCodeTextarea';
import {
  SCENARIO_MODAL_TOOLTIPS,
  REGISTER_BUTTON_LABELS,
} from './modals/shared/scenarioModalTooltips';

const CONTENT_TYPE_OPTIONS = [
  ['text_input', 'テキスト入力'],
  ['image', '画像'],
  ['label', 'ラベル'],
  ['textarea', 'テキストエリア'],
  ['radio_button', 'ラジオボタン'],
  ['checkbox', 'チェックボックス'],
  ['pull_down', 'プルダウン'],
  ['zip_code_address', '郵便番号と住所'],
  ['attaching_file', 'ファイル添付'],
  ['calendar', 'カレンダー'],
  ['agree_term', '規約同意'],
  ['carousel', 'カルーセル'],
  ['credit_card_payment', 'カード決済'],
  ['capture', 'キャプチャ'],
  ['product_purchase', '商品購入'],
  ['product_purchase_radio_button', '商品購入（ラジオボタン型）'],
  ['product_purchase_select_option', '商品購入（プルダウン）'],
  ['sms_verify', 'SMS Verify'],
  ['AFTEE_payment_module', 'AFTEE決済モジュール'],
  ['slider', 'スライダー'],
  ['card_payment_radio_button', 'ラジオボタン付きカード決済'],
  ['shipping_address', '配送先住所'],
  ['button_submit', '確認する'],
];

const labelWithTooltip = (text, tooltipKey) => (
  <>
    {text}
    <ScenarioInfoTooltip text={SCENARIO_MODAL_TOOLTIPS[tooltipKey]} />
  </>
);

const AddContentSelect = ({ messageType, setMessageType, hasContent, onAdd }) => (
  <div className="ss-user-setting__select-wrapper">
    <select
      name="ss-user-setting__select-type"
      id="ss-user-setting__select-type"
      onChange={(e) => setMessageType(e.target.value)}
      className="ss-input-value"
      value={messageType}
    >
      {CONTENT_TYPE_OPTIONS.map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
      <option value="variable_set" style={{ display: 'none' }}>変数セット</option>
      <option
        style={hasContent && messageType !== 'label_no_transition' ? { display: 'none' } : {}}
        value="label_no_transition">
        ラベル（推移記録なし）
      </option>
    </select>
    <Button className="ss-user-setting__select-btn-add" style={{ padding: '9px 23px' }} onClick={onAdd}>追加</Button>
  </div>
);

const RegisterButtonConfig = ({ selectedMessage, dataMessages, setDataMessages }) => {
  const [alignBeginningStop, setAlignBeginningStop] = useState(false);

  const updateMessage = (updates) => {
    Object.assign(selectedMessage, updates);
    setDataMessages([...dataMessages]);
  };

  const showCodeEditor = !!selectedMessage.button_jscode;

  return (
    <div
      className={`ss-user-register-button-settings${
        showCodeEditor ? ' ss-user-register-button-settings--code-open' : ''
      }`}
    >
      <div className="ss-user-register-button-settings__main">
        <ScenarioModalCheckbox
          checked={alignBeginningStop}
          onChange={setAlignBeginningStop}
          label={labelWithTooltip(
            REGISTER_BUTTON_LABELS.alignBeginningStop,
            'alignBeginningStop',
          )}
        />
        <ScenarioModalCheckbox
          checked={!!selectedMessage.not_use_button}
          onChange={(checked) => updateMessage({ not_use_button: checked })}
          label={labelWithTooltip(
            REGISTER_BUTTON_LABELS.notUseButton,
            'notUseButton',
          )}
        />
        {!selectedMessage.not_use_button && (
          <ScenarioFormRow
            label={REGISTER_BUTTON_LABELS.registerButtonName}
            tooltip={SCENARIO_MODAL_TOOLTIPS.registerButtonName}
          >
            <InputCustom
              style={{ width: '100%' }}
              placeholder="例：次へ、登録する"
              value={selectedMessage.buttonName}
              maxLength={30}
              onChange={(value) => updateMessage({ buttonName: value })}
            />
          </ScenarioFormRow>
        )}
        <ScenarioModalCheckbox
          checked={showCodeEditor}
          onChange={(checked) => updateMessage({ button_jscode: checked })}
          label={labelWithTooltip(
            REGISTER_BUTTON_LABELS.useButtonJavascript,
            'useButtonJavascript',
          )}
        />
      </div>
      {showCodeEditor && (
        <div className="ss-user-register-button-settings__code-flyout">
          <ScenarioFormRow
            label={REGISTER_BUTTON_LABELS.registerButtonJscode}
            tooltip={SCENARIO_MODAL_TOOLTIPS.registerButtonJscode}
            alignTop
          >
            <ScenarioCodeTextarea
              id="ss-register-button-jscode"
              value={selectedMessage.jscode || ''}
              onChange={(value) => updateMessage({ jscode: value })}
              placeholder="JavaScriptコードを入力"
              language="javascript"
              height={120}
            />
          </ScenarioFormRow>
        </div>
      )}
    </div>
  );
};

const ScenarioUserSettingsPanel = () => {
  const {
    belongTo, messageType, setMessageType, indexMessageSelect, dataMessages, setDataMessages,
    onChangeValueNameMessage, handleDragEnd, handleSelectContentMessage,
    handleDeleteMessageContent, handleAddItemSetting,
  } = useScenarioPanelDestructuring();

  const selectedMessage = dataMessages?.[indexMessageSelect];

  if (!selectedMessage || belongTo !== 'user') {
    return null;
  }

  return (
    <div id="user-chat" className="ss-user-chat-detail-setting ss-user-setting ss-layout-user-setting">
      <div className="ss-user-setting__top">
        <div className="ss-user-setting__name-wrapper">
          <div>
            <span>名称</span>
            <span className="ss-user-setting__name-error" style={{ marginLeft: '5px' }}>※必須</span>
          </div>
          <InputCustom
            placeholder="名称を入力"
            style={selectedMessage.message_name ? {} : { borderColor: 'red' }}
            onChange={value => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
            value={selectedMessage.message_name}
          />
          {!selectedMessage.message_name &&
            <div style={{ color: 'rgb(185, 74, 72)' }}>
              必ず指定してください。
            </div>
          }
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="messages">
          {(provided) => {
            const messageUserSelect = dataMessages && dataMessages.filter((message, index) => (message.belong_to === 'user' && index === indexMessageSelect))[0]?.message_content;
            return (
              <div className="ss-user-setting__main" {...provided.droppableProps} ref={provided.innerRef}>
                {messageUserSelect &&
                  messageUserSelect.map((content, indexContent, arr) => (
                    <Draggable key={content.id} draggableId={content.id?.toString()} index={indexContent}>
                      {(dragProvided) => (
                        <div {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} ref={dragProvided.innerRef}>
                          <div
                            id={indexContent === (arr.length - 1) ? 'last-element' : ''}
                            className={`ss-user-setting__item ss-user-setting__item-${indexContent} ${indexContent === (arr.length - 1) ? 'ss-user-setting__item--active' : ''}`}
                            onClick={() => handleSelectContentMessage(indexContent, content.type)}
                          >
                            <MDBIcon
                              fas
                              icon="times-circle"
                              className="ss-user-setting__item-delete-btn"
                              onClick={(e) => handleDeleteMessageContent(indexMessageSelect, indexContent, e)}
                            />
                            {CONTENT_SETTING_MAP[content.type] ? React.createElement(CONTENT_SETTING_MAP[content.type], {
                              indexMessageSelect,
                              indexContent,
                              content,
                            }) : null}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                }
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
      <div className="ss-user-setting__bottom">
        {selectedMessage.message_content[0]?.type !== 'label_no_transition' &&
          <AddContentSelect
            messageType={messageType}
            setMessageType={setMessageType}
            hasContent={selectedMessage.message_content.length > 0}
            onAdd={() => handleAddItemSetting(messageType || 'text_input')}
          />
        }
        <RegisterButtonConfig
          selectedMessage={selectedMessage}
          dataMessages={dataMessages}
          setDataMessages={setDataMessages}
        />
        <ScenarioConditionsPanel variant="user" />
      </div>
    </div>
  );
};

export default ScenarioUserSettingsPanel;
