import React from 'react';
import InputCustom from './InputCustom';
import InputNum from './InputNum';
import { BOT_MESSAGE_TYPES } from '../../PreviewComponent/Constants';
import { ORDER_CONFIRM_LP_PRESET } from '../utils/OrderConfirmLpScriptGenerator';

const ORDER_CONFIRM_FIELD_GROUPS = [
  {
    title: 'お客様',
    items: [
      { type: 'label_only', labelKey: 'customerSection', rowLabel: 'お客様情報（セクション）' },
      { type: 'paired', group: 'customer', selectorKey: 'name', labelKey: 'name', rowLabel: 'お名前' },
      { type: 'paired', group: 'customer', selectorKey: 'address', labelKey: 'address', rowLabel: 'ご住所' },
    ],
  },
  {
    title: '商品',
    items: [
      { type: 'label_only', labelKey: 'orderSection', rowLabel: 'ご注文内容（セクション）' },
      { type: 'paired', group: 'product', selectorKey: 'name', labelKey: 'productName', rowLabel: '商品名' },
      { type: 'paired', group: 'product', selectorKey: 'price', labelKey: 'unitPrice', rowLabel: '単価' },
      { type: 'paired', group: 'product', selectorKey: 'quantity', labelKey: 'quantity', rowLabel: '個数' },
      { type: 'paired', group: 'product', selectorKey: 'subtotal', labelKey: 'productSubtotal', rowLabel: '商品小計' },
    ],
  },
  {
    title: '合計',
    items: [
      { type: 'paired', group: 'summary', selectorKey: 'subtotal', labelKey: 'subtotal', rowLabel: '小計' },
      { type: 'paired', group: 'summary', selectorKey: 'deliveryFee', labelKey: 'deliveryFee', rowLabel: '送料' },
      { type: 'paired', group: 'summary', selectorKey: 'charge', labelKey: 'charge', rowLabel: '手数料' },
      { type: 'paired', group: 'summary', selectorKey: 'tax', labelKey: 'tax', rowLabel: '消費税' },
      { type: 'paired', group: 'summary', selectorKey: 'total', labelKey: 'total', rowLabel: '合計' },
    ],
  },
  {
    title: '割引',
    items: [
      { type: 'selector_only', group: 'discount', selectorKey: 'subtotal10', rowLabel: '10%対象商品小計' },
      { type: 'selector_only', group: 'discount', selectorKey: 'tax10', rowLabel: '消費税(10%)' },
      { type: 'label_only', labelKey: 'taxNote', rowLabel: '税注記（{subtotal10}、{tax10}）' },
    ],
  },
];

const sectionLabelStyle = { fontWeight: 600, marginTop: '12px', marginBottom: '6px', display: 'block', fontSize: '12px' };
const groupTitleStyle = { fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' };
const fieldLabelStyle = { fontSize: '12px', marginBottom: '4px', display: 'block' };
const combinedRowStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' };
const rowNameStyle = { flex: '0 0 100px', fontSize: '12px' };
const selectorColStyle = { flex: 1 };
const labelColStyle = { flex: 1 };
const columnHeaderStyle = { ...combinedRowStyle, fontWeight: 600, fontSize: '12px', marginBottom: '6px' };
const emptySelectorStyle = { fontSize: '12px', color: '#999' };

const renderCombinedRow = ({ rowLabel, selectorInput, labelInput }) => (
  <div style={combinedRowStyle}>
    <span style={rowNameStyle}>{rowLabel}</span>
    <div style={selectorColStyle}>{selectorInput ?? <span style={emptySelectorStyle}>—</span>}</div>
    <div style={labelColStyle}>{labelInput ?? <span style={emptySelectorStyle}>—</span>}</div>
  </div>
);

export default function OrderConfirmSettingsModalContent({
  config,
  indexMessageSelect,
  indexContent = 0,
  messageType = BOT_MESSAGE_TYPES.ORDER_CONFIRM,
  onChangeValueMessageContent,
}) {
  const isCustomPreset = config.lp_preset === ORDER_CONFIRM_LP_PRESET.CUSTOM;

  const renderSelectorInput = (group, selectorKey) => (
    <InputCustom
      style={{ width: '100%' }}
      placeholder=".qa-example"
      value={config.selectors?.[group]?.[selectorKey] || ''}
      readOnly={!isCustomPreset}
      onChange={(value) => onChangeValueMessageContent(
        indexMessageSelect,
        indexContent,
        messageType,
        value,
        'selectors',
        group,
        selectorKey,
      )}
    />
  );

  const renderLabelInput = (labelKey) => (
    <InputCustom
      style={{ width: '100%' }}
      value={config.labels?.[labelKey] || ''}
      onChange={(value) => onChangeValueMessageContent(
        indexMessageSelect,
        indexContent,
        messageType,
        value,
        'labels',
        labelKey,
      )}
    />
  );

  const renderFieldItem = (item) => {
    if (item.type === 'label_only') {
      return renderCombinedRow({
        rowLabel: item.rowLabel,
        selectorInput: null,
        labelInput: renderLabelInput(item.labelKey),
      });
    }

    if (item.type === 'selector_only') {
      return renderCombinedRow({
        rowLabel: item.rowLabel,
        selectorInput: renderSelectorInput(item.group, item.selectorKey),
        labelInput: null,
      });
    }

    return renderCombinedRow({
      rowLabel: item.rowLabel,
      selectorInput: renderSelectorInput(item.group, item.selectorKey),
      labelInput: renderLabelInput(item.labelKey),
    });
  };

  return (
    <div className="ss-order-confirm-settings-modal__body">
      <span style={sectionLabelStyle}>項目設定</span>
      <div style={columnHeaderStyle}>
        <span style={rowNameStyle}>項目</span>
        <span style={selectorColStyle}>セレクター</span>
        <span style={labelColStyle}>ラベル</span>
      </div>
      {ORDER_CONFIRM_FIELD_GROUPS.map(({ title, items }) => (
        <div key={title} style={{ marginBottom: '10px' }}>
          <span style={groupTitleStyle}>{title}</span>
          {items.map((item) => (
            <React.Fragment key={item.labelKey || `${item.group}.${item.selectorKey}`}>
              {renderFieldItem(item)}
            </React.Fragment>
          ))}
        </div>
      ))}

      <span style={sectionLabelStyle}>リトライ</span>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
        <div>
          <span style={fieldLabelStyle}>最大回数</span>
          <InputNum
            min={1}
            max={50}
            value={config.retry?.maxRetry ?? 20}
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
            value={config.retry?.delay ?? 500}
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
        value={config.error_message || ''}
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
