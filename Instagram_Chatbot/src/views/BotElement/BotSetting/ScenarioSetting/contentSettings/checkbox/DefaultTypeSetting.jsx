import React from 'react';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputDouble from '../../scenarioComon/InputDouble';
import { SETTING_LABELS } from '../../constants/scenarioSettingLabels';
import { buildCheckboxSettingContext } from './checkboxSettingContext';

const DefaultTypeSetting = (props) => {
  const {
    checkbox,
    handleDragEndRadioCheckbox,
    handleRemoveItemContent,
    handleAddItemRadioCheckbox,
  } = props;
  const { indexMessageSelect, indexContent, content, changeContent } = buildCheckboxSettingContext(props);

  const renderDefaultItem = (itemCheckbox, indexCheckbox, array) => (
    <div className="ss-checkbox-setting__default-item">
      <MDBIcon fas icon="grip-horizontal" className="ss-drag-handle-icon" />
      <InputDouble
        classCustom="ss-user-radio-custom-class"
        icon={array.length >= 2 ? 'times-circle' : ''}
        onChange={(value, name) => changeContent(
          checkbox.type,
          indexCheckbox,
          name === 'left' ? 'text' : 'value',
        )(value)}
        valueLeft={checkbox[checkbox.type][indexCheckbox].text}
        valueRight={checkbox[checkbox.type][indexCheckbox].value}
        placeholder={SETTING_LABELS.textValue}
        classIcon="ss-plus-circle-option-icon-times"
        onClickIcon={() => handleRemoveItemContent(
          indexMessageSelect,
          indexContent,
          content.type,
          checkbox.type,
          indexCheckbox,
        )}
      />
    </div>
  );

  const renderDragList = () => (
    <div className="ss-user-setting__item-bottom">
      <DragDropContext onDragEnd={(result) => handleDragEndRadioCheckbox(
        result,
        content.id,
        content.type,
        checkbox.type,
      )}
      >
        <Droppable droppableId="checkbox-items">
          {(providedChild) => (
            <div
              className="ss-user-setting-item-checkbox-button-drag ss-checkbox-setting__drag-container"
              {...providedChild.droppableProps}
              ref={providedChild.innerRef}
            >
              {Array.isArray(checkbox?.[checkbox.type]) && checkbox[checkbox.type].map((itemCheckbox, indexCheckbox, array) => (
                <Draggable
                  draggable
                  key={itemCheckbox.id}
                  draggableId={`${itemCheckbox.id}`}
                  index={indexCheckbox}
                >
                  {(dragProvided) => (
                    <div
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      ref={dragProvided.innerRef}
                    >
                      {renderDefaultItem(itemCheckbox, indexCheckbox, array)}
                    </div>
                  )}
                </Draggable>
              ))}
              {providedChild.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

  const renderAddButton = () => (
    <div className="ss-user-setting__item-bottom ss-checkbox-setting__add-row">
      <MDBIcon
        fas
        icon="plus-circle"
        className="ss-plus-circle-option-icon"
        onClick={() => handleAddItemRadioCheckbox(
          indexMessageSelect,
          indexContent,
          content.type,
          checkbox.type,
        )}
      />
    </div>
  );

  return (
    <>
      {renderDragList()}
      {renderAddButton()}
    </>
  );
};

export default DefaultTypeSetting;
