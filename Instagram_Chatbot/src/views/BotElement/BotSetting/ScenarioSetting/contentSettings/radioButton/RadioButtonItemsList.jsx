import React from 'react';
import PropTypes from 'prop-types';
import DragDropTextValueList from '../shared/DragDropTextValueList';
import { SETTING_LABELS } from '../../constants/scenarioSettingLabels';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';
import RadioButtonAddButton from './RadioButtonAddButton';

const RadioButtonItemsList = (props) => {
  const {
    radioButton,
    handleDragEndRadioCheckbox,
    handleRemoveItemContent,
    handleAddItemRadioCheckbox,
    editorSelectedRadioOption,
    setEditorSelectedRadioOption,
    renderItemGrip,
    itemBodyClassName,
    renderItemPrefix,
    renderItemExtra,
    showGripOnInputRow = true,
    droppableId = 'radio-items',
    showTextInput = true,
  } = props;

  const { indexMessageSelect, indexContent, content, changeContent } = buildRadioButtonSettingContext(props);
  const items = radioButton?.[radioButton.type] ?? [];

  const selectedOptionId = (
    editorSelectedRadioOption?.indexMessageSelect === indexMessageSelect
    && editorSelectedRadioOption?.indexContent === indexContent
    && editorSelectedRadioOption?.subContentType === radioButton.type
  ) ? editorSelectedRadioOption.optionId : null;

  const handleSelectOption = (item) => {
    setEditorSelectedRadioOption?.({
      indexMessageSelect,
      indexContent,
      subContentType: radioButton.type,
      optionId: item.id,
    });
  };

  const handleDragEnd = (result) => handleDragEndRadioCheckbox(
    result,
    content.id,
    content.type,
    radioButton.type,
  );

  const handleChangeItem = (index, field, value) => {
    changeContent(radioButton.type, index, field)(value);
  };

  const handleRemoveItem = (index) => {
    handleRemoveItemContent(
      indexMessageSelect,
      indexContent,
      content.type,
      radioButton.type,
      index,
    );
  };

  return (
    <>
      <div className="ss-user-setting__item-bottom">
        <DragDropTextValueList
          items={items}
          droppableId={droppableId}
          onDragEnd={handleDragEnd}
          onChangeItem={handleChangeItem}
          onRemoveItem={handleRemoveItem}
          containerClassName="ss-user-setting-item-radio-button-drag ss-radio-button-setting__drag-container"
          itemClassName="ss-radio-button-setting__item-panel"
          dragRowClassName="ss-radio-button-setting__default-row"
          textValuePlaceholder={showTextInput ? SETTING_LABELS.textValue : ['値']}
          inputDoubleClassCustom="ss-user-radio-custom-class"
          inputDoubleClassIcon="ss-plus-circle-option-icon-times"
          showAddButton={false}
          addButtonPlacement="outside"
          showGripOnInputRow={showGripOnInputRow}
          showTextInput={showTextInput}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
          inputDoubleWrapperClassName={
            showGripOnInputRow
              ? ''
              : (showTextInput ? 'ss-radio-button-setting__img-text-row' : 'ss-radio-button-setting__img-value-row')
          }
          renderItemGrip={renderItemGrip}
          itemBodyClassName={itemBodyClassName}
          renderItemPrefix={renderItemPrefix}
          renderItemExtra={renderItemExtra}
        />
      </div>
      <RadioButtonAddButton
        indexMessageSelect={indexMessageSelect}
        indexContent={indexContent}
        content={content}
        radioButton={radioButton}
        handleAddItemRadioCheckbox={handleAddItemRadioCheckbox}
      />
    </>
  );
};

RadioButtonItemsList.propTypes = {
  radioButton: PropTypes.object.isRequired,
  handleDragEndRadioCheckbox: PropTypes.func.isRequired,
  handleRemoveItemContent: PropTypes.func.isRequired,
  handleAddItemRadioCheckbox: PropTypes.func.isRequired,
  editorSelectedRadioOption: PropTypes.object,
  setEditorSelectedRadioOption: PropTypes.func,
  renderItemGrip: PropTypes.func,
  itemBodyClassName: PropTypes.string,
  renderItemPrefix: PropTypes.func,
  renderItemExtra: PropTypes.func,
  showGripOnInputRow: PropTypes.bool,
  droppableId: PropTypes.string,
  showTextInput: PropTypes.bool,
};

export default RadioButtonItemsList;
