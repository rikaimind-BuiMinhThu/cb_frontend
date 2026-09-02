import React from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import 'react-datepicker/dist/react-datepicker.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioCommon/InputCustom';
import { CONTENT_SETTING_MAP } from '../contentSettings';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import ScenarioMessageSettingsAccordion from './ScenarioMessageSettingsAccordion';
import { SETTING_LABELS, SETTING_PLACEHOLDERS, SETTING_BUTTON_LABELS } from '../constants/scenarioSettingLabels';
import {
  USER_CONTENT_TYPE_OPTIONS,
  USER_CONTENT_TYPE_VARIABLE_SET,
  USER_CONTENT_TYPE_LABEL_NO_TRANSITION,
} from '../constants/scenarioPanelOptions';

const AddContentSelect = ({ messageType, setMessageType, hasContent, onAdd }) => (
  <div className="ss-user-setting__select-wrapper">
    <select
      name="ss-user-setting__select-type"
      id="ss-user-setting__select-type"
      onChange={(e) => setMessageType(e.target.value)}
      className="ss-input-value"
      value={messageType}
    >
      {USER_CONTENT_TYPE_OPTIONS.map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
      <option value={USER_CONTENT_TYPE_VARIABLE_SET[0]} className="ss-option--hidden">{USER_CONTENT_TYPE_VARIABLE_SET[1]}</option>
      <option
        className={hasContent && messageType !== USER_CONTENT_TYPE_LABEL_NO_TRANSITION[0] ? 'ss-option--hidden' : ''}
        value={USER_CONTENT_TYPE_LABEL_NO_TRANSITION[0]}>
        {USER_CONTENT_TYPE_LABEL_NO_TRANSITION[1]}
      </option>
    </select>
    <Button className="ss-user-setting__select-btn-add ss-user-setting__select-btn-add--padded" onClick={onAdd}>{SETTING_BUTTON_LABELS.add}</Button>
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
            <span>{SETTING_LABELS.name}</span>
            <span className="ss-user-setting__name-error">{SETTING_LABELS.requiredMark}</span>
          </div>
          <InputCustom
            placeholder={SETTING_PLACEHOLDERS.messageName}
            className={selectedMessage.message_name ? '' : 'ss-input--invalid'}
            onChange={value => onChangeValueNameMessage(indexMessageSelect, 'message_name', value)}
            value={selectedMessage.message_name}
          />
          {!selectedMessage.message_name &&
            <div className="ss-field-required-error">
              {SETTING_LABELS.requiredFieldError}
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
        <ScenarioMessageSettingsAccordion
          variant="user"
          selectedMessage={selectedMessage}
          dataMessages={dataMessages}
          setDataMessages={setDataMessages}
          indexMessageSelect={indexMessageSelect}
        />
      </div>
    </div>
  );
};

export default ScenarioUserSettingsPanel;
