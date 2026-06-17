import React from 'react';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../../scenarioComon/InputCustom';
import InputDouble from '../../scenarioComon/InputDouble';
import { RADIO_BUTTON_LABELS, SETTING_LABELS } from '../../constants/scenarioSettingLabels';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';
import { InitialSelectionCheckbox } from './radioButtonShared';

const RadioButtonImgTypeSetting = (props) => {
  const {
    radioButton,
    handleDragEndRadioCheckbox,
    handleRemoveItemContent,
    handleAddItemRadioCheckbox,
    setIsOpenFileReference,
    setVarFileReference,
    setAcceptFile,
  } = props;
  const {
    indexMessageSelect,
    indexContent,
    content,
    changeContent,
    toggleInitialSelection,
  } = buildRadioButtonSettingContext(props);

  const renderImgItem = (itemRadio, indexRadio, array) => (
    <>
      <div className="ss-user-setting__item-bottom">
        <MDBIcon fas icon="grip-horizontal" className="ss-drag-handle-icon" />
        <InputCustom
          className="ss-radio-button-setting__img-file-input"
          placeholder={RADIO_BUTTON_LABELS.fileUrl}
          onChange={changeContent(radioButton.type, indexRadio, 'img')}
          value={itemRadio.img}
        />
        <MDBIcon
          onClick={() => {
            setIsOpenFileReference(true);
            setVarFileReference({
              indexContent,
              contentType: content.type,
              subContentType: radioButton.type,
              indexSubContent: indexRadio,
              img: 'img',
            });
            setAcceptFile(['image']);
          }}
          fas
          icon="paperclip"
          className="ss-checkbox-setting__paperclip"
        />
      </div>
      <InputDouble
        classCustom="ss-user-radio-custom-class"
        onChange={(value, name) => changeContent(
          radioButton.type,
          indexRadio,
          name === 'left' ? 'text' : 'value',
        )(value)}
        onClickIcon={() => handleRemoveItemContent(
          indexMessageSelect,
          indexContent,
          content.type,
          radioButton.type,
          indexRadio,
        )}
        icon={array.length >= 2 ? 'times-circle' : ''}
        placeholder={SETTING_LABELS.textValue}
        classIcon="ss-plus-circle-option-icon-times"
        valueLeft={itemRadio.text}
        valueRight={itemRadio.value}
      />
      <InitialSelectionCheckbox
        itemValue={itemRadio.value}
        radioButton={radioButton}
        toggleInitialSelection={toggleInitialSelection}
      />
    </>
  );

  const renderDragList = () => (
    <div className="ss-user-setting__item-bottom">
      <DragDropContext onDragEnd={(result) => handleDragEndRadioCheckbox(
        result,
        content.id,
        content.type,
        radioButton.type,
      )}
      >
        <Droppable droppableId="radio-items">
          {(providedChild) => (
            <div
              className="ss-user-setting-item-radio-button-drag ss-radio-button-setting__drag-container"
              {...providedChild.droppableProps}
              ref={providedChild.innerRef}
            >
              {Array.isArray(radioButton?.[radioButton.type]) && radioButton[radioButton.type].map((itemRadio, indexRadio, array) => (
                <Draggable
                  draggable
                  key={itemRadio.id}
                  draggableId={`${itemRadio.id}`}
                  index={indexRadio}
                >
                  {(dragProvided) => (
                    <div
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      ref={dragProvided.innerRef}
                    >
                      <div className="ss-radio-button-setting__item-panel">
                        {renderImgItem(itemRadio, indexRadio, array)}
                      </div>
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
    <div className="ss-user-setting__item-bottom ss-radio-button-setting__add-row">
      <MDBIcon
        fas
        icon="plus-circle"
        className="ss-plus-circle-option-icon"
        onClick={() => handleAddItemRadioCheckbox(
          indexMessageSelect,
          indexContent,
          content.type,
          radioButton.type,
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

export default RadioButtonImgTypeSetting;
