import React from 'react';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from './InputCustom';
import InputNum from './InputNum';
import { BOT_MESSAGE_TYPES } from '../../PreviewComponent/Constants';
import {
  ORDER_CONFIRM_GROUP_KEYS,
  ORDER_CONFIRM_GROUP_META,
  ORDER_CONFIRM_LP_PRESET,
  addOrderConfirmField,
  normalizeOrderConfirmConfig,
  removeOrderConfirmField,
  reorderOrderConfirmFields,
  syncLegacySelectorsLabelsFromFields,
  updateOrderConfirmField,
} from '../utils/OrderConfirmLpScriptGenerator';
import '../styles/contentSettings/orderConfirmSettings.css';

const fieldLabelStyle = { fontSize: '12px', marginBottom: '4px', display: 'block' };
const sectionLabelStyle = { fontWeight: 600, marginTop: '12px', marginBottom: '6px', display: 'block', fontSize: '12px' };

export default function OrderConfirmSettingsModalContent({
  config,
  indexMessageSelect,
  indexContent = 0,
  messageType = BOT_MESSAGE_TYPES.ORDER_CONFIRM,
  onChangeValueMessageContent,
  dataMessages,
  setDataMessages,
}) {
  const normalizedConfig = normalizeOrderConfirmConfig(config);
  const fieldsByGroup = normalizedConfig.fields_by_group;
  const isCustomPreset = normalizedConfig.lp_preset === ORDER_CONFIRM_LP_PRESET.CUSTOM;

  const persistFieldsByGroup = (nextFieldsByGroup) => {
    const nextMessages = [...dataMessages];
    const content = nextMessages[indexMessageSelect]?.message_content?.[indexContent];
    if (!content) return;

    const current = content[messageType] || {};
    const legacy = syncLegacySelectorsLabelsFromFields(nextFieldsByGroup);
    const isCustom = (current.lp_preset || ORDER_CONFIRM_LP_PRESET.ECFORCE) === ORDER_CONFIRM_LP_PRESET.CUSTOM;

    content[messageType] = normalizeOrderConfirmConfig({
      ...current,
      fields_by_group: nextFieldsByGroup,
      labels: { ...current.labels, ...legacy.labels },
      selectors: isCustom ? legacy.selectors : current.selectors,
    });

    setDataMessages(nextMessages);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.droppableId !== result.destination.droppableId) return;
    if (result.source.index === result.destination.index) return;

    const groupKey = result.source.droppableId.replace('order-confirm-', '');

    persistFieldsByGroup(
      reorderOrderConfirmFields(
        fieldsByGroup,
        groupKey,
        result.source.index,
        result.destination.index,
      ),
    );
  };

  const handleAddField = (groupKey) => {
    persistFieldsByGroup(addOrderConfirmField(fieldsByGroup, groupKey));
  };

  const handleRemoveField = (groupKey, fieldId) => {
    persistFieldsByGroup(removeOrderConfirmField(fieldsByGroup, groupKey, fieldId));
  };

  const handleUpdateField = (groupKey, fieldId, patch) => {
    persistFieldsByGroup(updateOrderConfirmField(fieldsByGroup, groupKey, fieldId, patch));
  };

  const handleLabelChange = (groupKey, field, value) => {
    const patch = { label: value };
    if (!field.preset_key) {
      patch.rowLabel = value;
    }
    handleUpdateField(groupKey, field.id, patch);
  };

  const isSelectorReadOnly = (field) => !isCustomPreset && Boolean(field.preset_key);

  const renderFieldRow = (field, groupKey) => {
    const selectorInput = (field.type === 'paired' || field.type === 'selector_only') ? (
      <InputCustom
        placeholder=".qa-example"
        value={field.selector || ''}
        readOnly={isSelectorReadOnly(field)}
        onChange={(value) => handleUpdateField(groupKey, field.id, { selector: value })}
      />
    ) : null;

    const labelInput = (field.type === 'label_only' || field.type === 'paired') ? (
      <InputCustom
        value={field.label || ''}
        onChange={(value) => handleLabelChange(groupKey, field, value)}
      />
    ) : null;

    return (
      <>
        <span className="ss-order-confirm-field-row__grip">
          <MDBIcon fas icon="grip-vertical" />
        </span>
        <span className="ss-order-confirm-field-row__name">{field.rowLabel || ''}</span>
        <div className="ss-order-confirm-field-row__cell">
          {selectorInput ?? <span className="ss-order-confirm-field-row__empty">—</span>}
        </div>
        <div className="ss-order-confirm-field-row__cell">
          {labelInput ?? <span className="ss-order-confirm-field-row__empty">—</span>}
        </div>
        <span
          className="ss-order-confirm-field-row__remove"
          role="button"
          tabIndex={0}
          onClick={() => handleRemoveField(groupKey, field.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') handleRemoveField(groupKey, field.id);
          }}
        >
          <MDBIcon fas icon="times-circle" />
        </span>
      </>
    );
  };

  return (
    <div className="ss-order-confirm-settings-modal__body">
      <div className="ss-order-confirm-fields-grid ss-order-confirm-fields-grid--header">
        <span />
        <span>項目</span>
        <span>セレクター</span>
        <span>ラベル</span>
        <span />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {ORDER_CONFIRM_GROUP_KEYS.map((groupKey) => (
          <div key={groupKey} className="ss-order-confirm-field-group">
            <span className="ss-order-confirm-field-group__title">
              {ORDER_CONFIRM_GROUP_META[groupKey].title}
            </span>
            <Droppable droppableId={`order-confirm-${groupKey}`}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {(fieldsByGroup[groupKey] || []).map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(draggableProvided) => (
                        <div
                          className="ss-order-confirm-field-row"
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          {renderFieldRow(field, groupKey)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <span
              role="button"
              tabIndex={0}
              className="ss-order-confirm-field-group__add"
              onClick={() => handleAddField(groupKey)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') handleAddField(groupKey);
              }}
            >
              + 項目を追加
            </span>
          </div>
        ))}
      </DragDropContext>

      <span style={sectionLabelStyle}>リトライ</span>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
        <div>
          <span style={fieldLabelStyle}>最大回数</span>
          <InputNum
            min={1}
            max={50}
            value={normalizedConfig.retry?.maxRetry ?? 20}
            onChange={(value) => onChangeValueMessageContent(
              indexMessageSelect,
              indexContent,
              messageType,
              value,
              'retry',
              'maxRetry',
            )}
          />
        </div>
        <div>
          <span style={fieldLabelStyle}>間隔 (ms)</span>
          <InputNum
            min={100}
            max={5000}
            step={100}
            value={normalizedConfig.retry?.delay ?? 500}
            onChange={(value) => onChangeValueMessageContent(
              indexMessageSelect,
              indexContent,
              messageType,
              value,
              'retry',
              'delay',
            )}
          />
        </div>
      </div>

      <span style={sectionLabelStyle}>エラーメッセージ</span>
      <textarea
        className="ss-bot-statement-type-text-content ss-input-value"
        rows={3}
        value={normalizedConfig.error_message || ''}
        onChange={(e) => onChangeValueMessageContent(
          indexMessageSelect,
          indexContent,
          messageType,
          e.target.value,
          'error_message',
        )}
      />
    </div>
  );
}
