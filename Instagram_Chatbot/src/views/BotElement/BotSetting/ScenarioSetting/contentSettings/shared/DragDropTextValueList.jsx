import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputDouble from '../../scenarioComon/InputDouble';
import { SETTING_BUTTON_LABELS, SETTING_PLACEHOLDERS } from '../../constants/scenarioSettingLabels';

const DragDropTextValueList = ({
  items,
  droppableId,
  onDragEnd,
  onChangeItem,
  onRemoveItem,
  onAddItem,
  containerClassName = 'ss-user-setting-item-payment-radio-drag',
  itemClassName = 'ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-no-img',
  textValuePlaceholder = SETTING_PLACEHOLDERS.textValue,
  showAddButton = true,
  renderItemExtra,
}) => {
  const renderDragItem = (item, index) => (
    <Draggable draggable key={item.id} draggableId={String(item.id)} index={index}>
      {(provided) => (
        <div
          key={item.id}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className={itemClassName}>
            <div className="ss-drag-option-row">
              <MDBIcon fas icon="grip-horizontal" className="ss-drag-handle-icon" />
              <InputDouble
                placeholder={textValuePlaceholder}
                valueLeft={item.text}
                valueRight={item.value}
                onChange={(value, name) => onChangeItem(index, name === 'left' ? 'text' : 'value', value)}
              />
            </div>
            {renderItemExtra?.(item, index)}
          </div>
        </div>
      )}
    </Draggable>
  );

  const renderAddButton = () => {
    if (!showAddButton) return null;
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
  textValuePlaceholder: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  showAddButton: PropTypes.bool,
  renderItemExtra: PropTypes.func,
};

export default DragDropTextValueList;
