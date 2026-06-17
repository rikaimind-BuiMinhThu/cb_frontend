import React from 'react';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../../scenarioComon/InputCustom';
import InputDouble from '../../scenarioComon/InputDouble';
import { CHECKBOX_LABELS, SETTING_LABELS } from '../../constants/scenarioSettingLabels';
import { buildCheckboxSettingContext } from './checkboxSettingContext';

const CheckboxImgTypeSetting = (props) => {
  const {
    checkbox,
    dataMessages,
    setDataMessages,
    handleDragEndRadioCheckbox,
    handleRemoveItemContent,
    handleAddItemRadioCheckbox,
    setIsOpenFileReference,
    setVarFileReference,
    setAcceptFile,
  } = props;
  const { indexMessageSelect, indexContent, content, changeContent } = buildCheckboxSettingContext(props);

  const addImgContent = (indexCheckbox) => {
    const arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].checkbox_img[indexCheckbox].contents];
    const idMax = arrMess.length !== 0
      ? Math.max(...arrMess.map((item) => item.id)) + 1
      : 1;
    dataMessages[indexMessageSelect].message_content[indexContent][content.type].checkbox_img[indexCheckbox].contents.push({ id: idMax });
    setDataMessages([...dataMessages]);
  };

  const removeImgContent = (indexCheckbox) => {
    dataMessages[indexMessageSelect].message_content[indexContent][content.type].checkbox_img[indexCheckbox].contents.pop();
    setDataMessages([...dataMessages]);
  };

  const renderImgContent = (itemCheckbox, indexCheckbox, array) => (
    <div className="ss-checkbox-setting__img-row">
      <MDBIcon fas icon="grip-horizontal" className="ss-checkbox-setting__img-grip" />
      <div className="ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-img">
        {itemCheckbox.contents.map((itemContentCheckbox, indexContentCheckbox, arrContent) => (
          <div
            key={indexContentCheckbox}
            className={`ss-checkbox-setting__img-content ${arrContent.length > 1 ? 'ss-checkbox-setting__img-content--multi' : ''}`}
          >
            <div className="ss-user-setting__item-bottom ss-checkbox-setting__img-file-row">
              <InputCustom
                className="ss-checkbox-setting__img-file-input"
                placeholder={CHECKBOX_LABELS.fileUrl}
                onChange={changeContent(
                  'checkbox_img',
                  indexCheckbox,
                  'contents',
                  indexContentCheckbox,
                  'file_url',
                )}
                value={itemContentCheckbox.file_url}
              />
              <MDBIcon
                onClick={() => {
                  setIsOpenFileReference(true);
                  setAcceptFile(['image']);
                  setVarFileReference({
                    indexContent,
                    contentType: content.type,
                    subContentType: 'checkbox_img',
                    indexSubContentType: indexCheckbox,
                    childSubContentType: 'contents',
                    indexChildSubContentType: indexContentCheckbox,
                    img: 'file_url',
                  });
                }}
                fas
                icon="paperclip"
                className="ss-checkbox-setting__paperclip"
              />
            </div>
            <div className="ss-checkbox-setting__img-text-row">
              <InputDouble
                placeholder={SETTING_LABELS.textValue}
                valueLeft={itemContentCheckbox.text}
                valueRight={itemContentCheckbox.value}
                onChange={(value, name) => changeContent(
                  'checkbox_img',
                  indexCheckbox,
                  'contents',
                  indexContentCheckbox,
                  name === 'left' ? 'text' : 'value',
                )(value)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="ss-user-setting-plus-minus-icon ss-checkbox-setting__plus-minus">
        <div>
          {itemCheckbox.contents.length < 3 && (
            <div className="ss-checkbox-setting__plus" onClick={() => addImgContent(indexCheckbox)}>+</div>
          )}
          {itemCheckbox.contents.length > 1 && (
            <div className="ss-checkbox-setting__minus" onClick={() => removeImgContent(indexCheckbox)}>-</div>
          )}
        </div>
      </div>
      {array.length > 1 && (
        <div className="ss-user-setting-payment-radio-times-icons">
          <MDBIcon
            fas
            icon="times-circle"
            onClick={() => handleRemoveItemContent(
              indexMessageSelect,
              indexContent,
              content.type,
              checkbox.type,
              indexCheckbox,
            )}
          />
        </div>
      )}
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
                      {renderImgContent(itemCheckbox, indexCheckbox, array)}
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

export default CheckboxImgTypeSetting;
