import React from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import 'react-datepicker/dist/react-datepicker.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioComon/InputCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import { CONTENT_SETTING_MAP } from '../contentSettings';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import ScenarioConditionsPanel from './ScenarioConditionsPanel';

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

const RegisterButtonConfig = ({ selectedMessage, dataMessages, setDataMessages }) => (
  <div className="ss-user-setting-condition-footer-button">
    <div className="ss-layout-register-button-row">
      <InputCustom
        label="登録ボタン名称"
        value={selectedMessage.buttonName}
        maxLength={30}
        onChange={(value) => {
          selectedMessage.buttonName = value;
          setDataMessages([...dataMessages]);
        }}
      />
      <CheckboxCustom
        label="このボタンを利用しない"
        onChange={(value) => {
          selectedMessage.not_use_button = value;
          setDataMessages([...dataMessages]);
        }}
        value={selectedMessage.not_use_button}
      />
      <CheckboxCustom
        label="JavaScriptの利用"
        onChange={(value) => {
          selectedMessage.button_jscode = value;
          setDataMessages([...dataMessages]);
        }}
        value={selectedMessage.button_jscode}
      />
    </div>
    {selectedMessage.button_jscode && (
      <div className="ss-layout-register-button-jscode">
        <label htmlFor="ss-register-button-jscode">jscode</label>
        <textarea
          id="ss-register-button-jscode"
          className="ss-user-setting-item-textarea-label ss-input-value"
          placeholder="テキスト"
          rows="5"
          value={selectedMessage.jscode}
          onChange={(e) => {
            selectedMessage.jscode = e.target.value;
            setDataMessages([...dataMessages]);
          }}
        />
      </div>
    )}
  </div>
);

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
        <div className="ss-user-setting__checkbox-wrapper">
          <input style={{ width: '15px' }} type="checkbox" name="ss-user-setting__checkbox" />
          <span>先頭に揃えて停止する</span>
          <MDBIcon fas icon="question-circle" style={{ color: '#347AED', fontSize: '12px', marginLeft: '5px' }} />
        </div>
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
