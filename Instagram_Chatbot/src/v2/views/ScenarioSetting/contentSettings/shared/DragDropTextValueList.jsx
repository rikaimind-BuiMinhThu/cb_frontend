import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputDouble from '../../scenarioCommon/InputDouble';
import { SETTING_BUTTON_LABELS, SETTING_PLACEHOLDERS } from '../../constants/scenarioSettingLabels';

const INTERACTIVE_ITEM_SELECTOR = 'input, textarea, select, button, .ant-checkbox, .ant-checkbox-wrapper, .ss-plus-circle-option-icon-times, .ss-radio-button-setting__paperclip, .ss-radio-button-setting__initial-selection, .ss-checkbox-setting__paperclip, .ss-checkbox-setting__initial-selection';

const DragDropTextValueList = ({
  items,
  droppableId,
  onDragEnd,
  onChangeItem,
  onRemoveItem,
  onAddItem,
  containerClassName = 'ss-user-setting-item-payment-radio-drag',
  itemClassName = 'ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-no-img',
  dragRowClassName = 'ss-drag-option-row',
  textValuePlaceholder = SETTING_PLACEHOLDERS.textValue,
  inputDoubleClassCustom = '',
  inputDoubleClassIcon = '',
  showAddButton = true,
  addButtonPlacement = 'inside',
  showGripOnInputRow = true,
  inputDoubleWrapperClassName = '',
  showTextInput = true,
  selectedOptionId,
  onSelectOption,
  renderItemGrip,
  itemBodyClassName = '',
  renderItemPrefix,
  renderItemExtra,
  minOptions = 1,
}) => {
  const getItemPanelClassName = (item) => [
    itemClassName,
    selectedOptionId != null && item.id === selectedOptionId ? `${itemClassName}--selected` : '',
  ].filter(Boolean).join(' ');

  const handleItemPanelClick = (event, item, index) => {
    if (!onSelectOption) return;
    if (event.target.closest(INTERACTIVE_ITEM_SELECTOR)) return;
    onSelectOption(item, index);
  };

  const renderInputDouble = (item, index) => {
    const inputDouble = (
      <InputDouble
        classCustom={inputDoubleClassCustom}
        placeholder={textValuePlaceholder}
        valueLeft={item.text}
        valueRight={item.value}
        icon={items.length > minOptions && onRemoveItem ? 'times-circle' : ''}
        classIcon={inputDoubleClassIcon}
        onClickIcon={onRemoveItem ? () => onRemoveItem(index) : undefined}
        onChange={(value, name) => onChangeItem(index, name === 'left' ? 'text' : 'value', value)}
        valueOnly={!showTextInput}
      />
    );

    if (!showGripOnInputRow && inputDoubleWrapperClassName) {
      return <div className={inputDoubleWrapperClassName}>{inputDouble}</div>;
    }

    return inputDouble;
  };

  const renderItemContent = (item, index) => (
    <>
      {renderItemPrefix?.(item, index)}
      {showGripOnInputRow ? (
        <div className={dragRowClassName}>
          <MDBIcon fas icon="grip-horizontal" className="ss-drag-handle-icon" />
          {renderInputDouble(item, index)}
        </div>
      ) : (
        renderInputDouble(item, index)
      )}
      {renderItemExtra?.(item, index)}
    </>
  );

  const renderDragItem = (item, index) => (
    <Draggable draggable key={item.id} draggableId={String(item.id)} index={index}>
      {(provided) => (
        <div
          key={item.id}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div
            className={getItemPanelClassName(item)}
            onClick={(event) => handleItemPanelClick(event, item, index)}
            onKeyDown={() => {}}
            role="presentation"
          >
            {renderItemGrip ? (
              <>
                {renderItemGrip(item, index)}
                <div className={itemBodyClassName}>
                  {renderItemContent(item, index)}
                </div>
              </>
            ) : (
              renderItemContent(item, index)
            )}
          </div>
        </div>
      )}
    </Draggable>
  );

  const renderAddButton = () => {
    if (!showAddButton || addButtonPlacement !== 'inside') return null;
    return (
      <Button className="ss-user-setting__select-btn-add ss-drag-add-btn" onClick={onAddItem}>
        {SETTING_BUTTON_LABELS.add}
      </Button>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div className={containerClassName} {...provided.droppableProps} ref={provided.innerRef}>
            {Array.isArray(items) && items.map((item, index) => renderDragItem(item, index))}
            {provided.placeholder}
            {renderAddButton()}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

DragDropTextValueList.propTypes = {
  items: PropTypes.array,
  droppableId: PropTypes.string.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onChangeItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func,
  onAddItem: PropTypes.func,
  containerClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  dragRowClassName: PropTypes.string,
  textValuePlaceholder: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  inputDoubleClassCustom: PropTypes.string,
  inputDoubleClassIcon: PropTypes.string,
  showAddButton: PropTypes.bool,
  addButtonPlacement: PropTypes.oneOf(['inside', 'outside']),
  showGripOnInputRow: PropTypes.bool,
  inputDoubleWrapperClassName: PropTypes.string,
  showTextInput: PropTypes.bool,
  selectedOptionId: PropTypes.number,
  onSelectOption: PropTypes.func,
  renderItemGrip: PropTypes.func,
  itemBodyClassName: PropTypes.string,
  renderItemPrefix: PropTypes.func,
  renderItemExtra: PropTypes.func,
  minOptions: PropTypes.number,
};

export default DragDropTextValueList;
