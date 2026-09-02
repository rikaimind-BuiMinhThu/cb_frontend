import React from 'react';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../../scenarioCommon/InputCustom';
import InputDouble from '../../scenarioCommon/InputDouble';
import { CHECKBOX_LABELS, SETTING_LABELS } from '../../constants/scenarioSettingLabels';
import { getCheckboxImgSelectionKey } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/checkboxSelectionUtils';
import { buildCheckboxSettingContext } from './checkboxSettingContext';
import { InitialCheckedCheckbox } from './checkboxShared';
import CheckboxImgLayoutSection from './CheckboxImgLayoutSection';
import CheckboxAddButton from './CheckboxAddButton';

const INTERACTIVE_SELECTOR = 'input, textarea, select, button, .ant-checkbox, .ant-checkbox-wrapper, .ss-plus-circle-option-icon-times, .ss-checkbox-setting__paperclip, .ss-checkbox-setting__initial-selection, .ss-checkbox-setting__plus, .ss-checkbox-setting__minus';

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
    editorSelectedCheckboxOption,
    setEditorSelectedCheckboxOption,
  } = props;
  const {
    indexMessageSelect,
    indexContent,
    content,
    changeContent,
    toggleInitialSelectionPicture,
  } = buildCheckboxSettingContext(props);

  const selectedOptionId = (
    editorSelectedCheckboxOption?.indexMessageSelect === indexMessageSelect
    && editorSelectedCheckboxOption?.indexContent === indexContent
    && editorSelectedCheckboxOption?.subContentType === checkbox.type
  ) ? editorSelectedCheckboxOption.optionId : null;

  const handleSelectOption = (optionId) => {
    setEditorSelectedCheckboxOption?.({
      indexMessageSelect,
      indexContent,
      subContentType: checkbox.type,
      optionId,
    });
  };

  const handleGroupClick = (event, group) => {
    if (event.target.closest(INTERACTIVE_SELECTOR)) return;
    handleSelectOption(group.id);
  };

  const handleContentClick = (event, group, contentItem) => {
    if (event.target.closest(INTERACTIVE_SELECTOR)) return;
    handleSelectOption(getCheckboxImgSelectionKey(group, contentItem));
  };

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

  const getGroupClassName = (group) => [
    'ss-checkbox-setting__img-row',
    selectedOptionId != null && String(selectedOptionId) === String(group.id)
      ? 'ss-checkbox-setting__img-row--selected'
      : '',
  ].filter(Boolean).join(' ');

  const getContentClassName = (group, contentItem) => {
    const compositeKey = getCheckboxImgSelectionKey(group, contentItem);
    return [
      'ss-checkbox-setting__img-content',
      group.contents.length > 1 ? 'ss-checkbox-setting__img-content--multi' : '',
      selectedOptionId != null && String(selectedOptionId) === String(compositeKey)
        ? 'ss-checkbox-setting__img-content--selected'
        : '',
    ].filter(Boolean).join(' ');
  };

  const renderImgContent = (itemCheckbox, indexCheckbox, array) => (
    <div
      className={getGroupClassName(itemCheckbox)}
      onClick={(event) => handleGroupClick(event, itemCheckbox)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelectOption(itemCheckbox.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <MDBIcon fas icon="grip-horizontal" className="ss-checkbox-setting__img-grip" />
      <div className="ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-img">
        {itemCheckbox.contents.map((itemContentCheckbox, indexContentCheckbox, arrContent) => (
          <div
            key={indexContentCheckbox}
            className={getContentClassName(itemCheckbox, itemContentCheckbox)}
            onClick={(event) => handleContentClick(event, itemCheckbox, itemContentCheckbox)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleSelectOption(getCheckboxImgSelectionKey(itemCheckbox, itemContentCheckbox));
              }
            }}
            role="button"
            tabIndex={0}
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
            <InitialCheckedCheckbox
              item={itemContentCheckbox}
              group={itemCheckbox}
              checkbox={checkbox}
              toggleInitialSelectionPicture={toggleInitialSelectionPicture}
              isImgType
            />
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
        <Droppable droppableId="checkbox-img-items">
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

  return (
    <>
      <CheckboxImgLayoutSection
        checkbox={checkbox}
        changeContent={changeContent}
      />
      {renderDragList()}
      <CheckboxAddButton
        indexMessageSelect={indexMessageSelect}
        indexContent={indexContent}
        content={content}
        checkbox={checkbox}
        handleAddItemRadioCheckbox={handleAddItemRadioCheckbox}
      />
    </>
  );
};

export default CheckboxImgTypeSetting;
