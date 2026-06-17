import React from 'react';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputDouble from '../../scenarioComon/InputDouble';
import InputCustom from '../../scenarioComon/InputCustom';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import {
  PULL_DOWN_LABELS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import { renderCommentInput, renderFukushashikiField } from './pullDownFieldBlocks';

const CustomizationTypeSetting = (props) => {
  const {
    pullDown,
    pullDownType,
    typeConfig,
    changeContent,
    changeTypeField,
    changeMessageField,
    isUseFukushashiki,
    messageContent,
    indexMessageSelect,
    indexContent,
    content,
    handleDragEndPullDown,
    handleRemoveItemCustomizePullDown,
    handleAddItemCustomizePullDown,
    onChangeValueMessageContent,
  } = buildPullDownSettingContext(props);

  const isComment = typeConfig?.is_comment;
  const optionsKey = isComment ? 'options_with_comment' : 'options_without_comment';
  const arrOptions = typeConfig?.[optionsKey];

  const renderTitleCommentInput = () => (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        icon={isComment ? 'times-circle' : 'plus-circle'}
        onClickIcon={() => changeContent(pullDownType, 'is_comment')(!isComment)}
        className="ss-pull-down-setting__input--84"
        placeholder={SETTING_PLACEHOLDERS.comment}
        classIcon="ss-user-times-icon-custom"
        value={typeConfig?.title_comment || ''}
        onChange={changeContent(pullDownType, 'title_comment')}
      />
    </div>
  );

  const renderDefaultOptionInput = () => (
    <InputCustom
      label={SETTING_LABELS.defaultOption}
      className="ss-pull-down-setting__customization-default"
      placeholder={SETTING_PLACEHOLDERS.comment}
      value={typeConfig?.display_unselected}
      onChange={changeContent(pullDownType, 'display_unselected')}
    />
  );

  const renderOptionItem = (itemPullDown, indexPullDown, array) => (
    <Draggable draggable key={itemPullDown.id} draggableId={`${itemPullDown.id}`} index={indexPullDown}>
      {(providedChild) => (
        <div
          {...providedChild.draggableProps}
          {...providedChild.dragHandleProps}
          ref={providedChild.innerRef}
        >
          <div className="ss-pull-down-setting__customization-drag-item">
            <MDBIcon fas icon="grip-horizontal" />
            <InputDouble
              style={array.length === 1 && !isComment ? { width: '95%' } : undefined}
              classCustom={isComment ? 'ss-user-setting-custom-double-input-custom' : ''}
              onChange={(value, name) => onChangeValueMessageContent(
                indexMessageSelect,
                indexContent,
                content.type,
                value,
                pullDownType,
                optionsKey,
                indexPullDown,
                name === 'left' ? 'text' : 'value',
              )}
              valueLeft={itemPullDown.text}
              valueRight={itemPullDown.value}
              placeholder={SETTING_LABELS.textValue}
            />
            {isComment && (
              <>
                <span>{PULL_DOWN_LABELS.rangeSeparator}</span>
                <InputDouble
                  classCustom="ss-user-setting-custom-double-input-custom"
                  onChange={(value, name) => onChangeValueMessageContent(
                    indexMessageSelect,
                    indexContent,
                    content.type,
                    value,
                    pullDownType,
                    optionsKey,
                    indexPullDown,
                    name === 'left' ? 'text2' : 'value2',
                  )}
                  valueLeft={itemPullDown.text2}
                  valueRight={itemPullDown.value2}
                  placeholder={SETTING_LABELS.textValue}
                />
              </>
            )}
            {array.length >= 2 && (
              <MDBIcon
                fas
                className="ss-pull-down-setting__customization-remove-icon"
                icon="times-circle"
                onClick={() => handleRemoveItemCustomizePullDown(
                  indexMessageSelect,
                  indexContent,
                  content.type,
                  pullDownType,
                  optionsKey,
                  indexPullDown,
                )}
              />
            )}
          </div>
          <CheckboxCustom
            label={PULL_DOWN_LABELS.initialSelection}
            onChange={() => {
              if (pullDown.initial_selection !== itemPullDown.value) {
                changeContent('initial_selection')(itemPullDown.value);
              } else {
                changeContent('initial_selection')('');
              }
            }}
            value={pullDown.initial_selection ? pullDown.initial_selection === itemPullDown.value : false}
          />
        </div>
      )}
    </Draggable>
  );

  const renderOptionsDragList = () => (
    <DragDropContext onDragEnd={(result) => handleDragEndPullDown(result, content.id, content.type, pullDownType, optionsKey)}>
      <Droppable droppableId="customize-pull-down">
        {(providedChild) => (
          <div className="ss-user-setting-item-pull-down-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
            {Array.isArray(arrOptions) && arrOptions.map((itemPullDown, indexPullDown, array) =>
              renderOptionItem(itemPullDown, indexPullDown, array))}
            {providedChild.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  const renderAddOptionButton = () => (
    <div className="ss-user-setting__item-bottom ss-pull-down-setting__customization-add-row">
      <MDBIcon
        fas
        icon="plus-circle"
        className="ss-plus-circle-option-icon"
        onClick={() => handleAddItemCustomizePullDown(
          indexMessageSelect,
          indexContent,
          content.type,
          pullDownType,
          optionsKey,
        )}
      />
    </div>
  );

  const renderOptionsPanel = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-pull-down-setting__customization-panel">
        {renderDefaultOptionInput()}
        {renderOptionsDragList()}
        {renderAddOptionButton()}
      </div>
    </div>
  );

  const renderFukushashiki = () => {
    if (!isUseFukushashiki) return null;
    return renderFukushashikiField({
      mode: messageContent?.fukushashiki_search_mode,
      inputValue: messageContent?.fukushashiki_search_value,
      onModeChange: changeMessageField('fukushashiki_search_mode'),
      onInputChange: changeMessageField('fukushashiki_search_value'),
    });
  };

  return (
    <>
      {renderTitleCommentInput()}
      {renderOptionsPanel()}
      {renderCommentInput({ typeConfig, changeTypeField })}
      {renderFukushashiki()}
    </>
  );
};

export default CustomizationTypeSetting;
