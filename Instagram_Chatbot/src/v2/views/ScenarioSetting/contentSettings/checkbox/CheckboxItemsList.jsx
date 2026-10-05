import React from 'react';
import PropTypes from 'prop-types';
import DragDropTextValueList from '../shared/DragDropTextValueList';
import { SETTING_LABELS } from '../../constants/scenarioSettingLabels';
import { buildCheckboxSettingContext } from './checkboxSettingContext';
import CheckboxAddButton from './CheckboxAddButton';

const CheckboxItemsList = (props) => {
  const {
    checkbox,
    handleDragEndRadioCheckbox,
    handleRemoveItemContent,
    handleAddItemRadioCheckbox,
    editorSelectedCheckboxOption,
    setEditorSelectedCheckboxOption,
    renderItemGrip,
    itemBodyClassName,
    renderItemPrefix,
    renderItemExtra,
    showGripOnInputRow = true,
    droppableId = 'checkbox-items',
    showTextInput = true,
  } = props;

  const { indexMessageSelect, indexContent, content, changeContent } = buildCheckboxSettingContext(props);
  const items = checkbox?.[checkbox.type] ?? [];

  const selectedOptionId = (
    editorSelectedCheckboxOption?.indexMessageSelect === indexMessageSelect
    && editorSelectedCheckboxOption?.indexContent === indexContent
    && editorSelectedCheckboxOption?.subContentType === checkbox.type
  ) ? editorSelectedCheckboxOption.optionId : null;

  const handleSelectOption = (item) => {
    setEditorSelectedCheckboxOption?.({
      indexMessageSelect,
      indexContent,
      subContentType: checkbox.type,
      optionId: item.id,
    });
  };

  const handleDragEnd = (result) => handleDragEndRadioCheckbox(
    result,
    content.id,
    content.type,
    checkbox.type,
  );

  const handleChangeItem = (index, field, value) => {
    changeContent(checkbox.type, index, field)(value);
  };

  const handleRemoveItem = (index) => {
    handleRemoveItemContent(
      indexMessageSelect,
      indexContent,
      content.type,
      checkbox.type,
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
          containerClassName="ss-user-setting-item-checkbox-button-drag ss-checkbox-setting__drag-container"
          itemClassName="ss-checkbox-setting__item-panel"
          dragRowClassName="ss-checkbox-setting__default-row"
          textValuePlaceholder={showTextInput ? SETTING_LABELS.textValue : SETTING_LABELS.valueOnly}
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
              : (showTextInput ? 'ss-checkbox-setting__img-text-row' : 'ss-checkbox-setting__img-value-row')
          }
          renderItemGrip={renderItemGrip}
          itemBodyClassName={itemBodyClassName}
          renderItemPrefix={renderItemPrefix}
          renderItemExtra={renderItemExtra}
        />
      </div>
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

CheckboxItemsList.propTypes = {
  checkbox: PropTypes.object.isRequired,
  handleDragEndRadioCheckbox: PropTypes.func.isRequired,
  handleRemoveItemContent: PropTypes.func.isRequired,
  handleAddItemRadioCheckbox: PropTypes.func.isRequired,
  editorSelectedCheckboxOption: PropTypes.object,
  setEditorSelectedCheckboxOption: PropTypes.func,
  renderItemGrip: PropTypes.func,
  itemBodyClassName: PropTypes.string,
  renderItemPrefix: PropTypes.func,
  renderItemExtra: PropTypes.func,
  showGripOnInputRow: PropTypes.bool,
  droppableId: PropTypes.string,
  showTextInput: PropTypes.bool,
};

export default CheckboxItemsList;
