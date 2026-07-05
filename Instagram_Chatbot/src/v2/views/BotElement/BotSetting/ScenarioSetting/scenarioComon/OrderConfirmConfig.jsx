import React from 'react';
import CheckboxCustom from './CheckboxCustom';
import InputNum from './InputNum';
import { BOT_MESSAGE_TYPES } from '../../PreviewComponent/Constants';
import {
  ORDER_CONFIRM_LP_PRESET,
  ORDER_CONFIRM_LP_PRESETS,
  applyEcforcePresetToFields,
  getDefaultOrderConfirmConfig,
  normalizeOrderConfirmConfig,
  syncLegacySelectorsLabelsFromFields,
} from '../utils/OrderConfirmLpScriptGenerator';
import OrderConfirmSettingsModal from './OrderConfirmSettingsModal';

const LP_PRESET_OPTIONS = [
  [ORDER_CONFIRM_LP_PRESET.ECFORCE, 'EC Force'],
  [ORDER_CONFIRM_LP_PRESET.CUSTOM, 'Custom'],
];

const sectionLabelStyle = { fontWeight: 600, marginTop: '12px', marginBottom: '6px', display: 'block', fontSize: '12px' };

export default function OrderConfirmConfig({
  indexMessageSelect,
  indexContent = 0,
  typeContent,
  messageType = BOT_MESSAGE_TYPES.ORDER_CONFIRM,
  onChangeValueMessageContent,
  dataMessages,
  setDataMessages,
  messageContent,
}) {
  const config = normalizeOrderConfirmConfig(typeContent || getDefaultOrderConfirmConfig());

  const handlePresetChange = (preset) => {
    const ecforcePreset = ORDER_CONFIRM_LP_PRESETS[ORDER_CONFIRM_LP_PRESET.ECFORCE];
    const nextMessages = [...dataMessages];
    const content = nextMessages[indexMessageSelect]?.message_content?.[indexContent];
    if (!content) return;

    const current = normalizeOrderConfirmConfig(content[messageType] || {});
    let nextFieldsByGroup = current.fields_by_group;

    if (preset === ORDER_CONFIRM_LP_PRESET.ECFORCE) {
      nextFieldsByGroup = applyEcforcePresetToFields(current.fields_by_group);
    }

    const legacy = syncLegacySelectorsLabelsFromFields(nextFieldsByGroup);

    content[messageType] = normalizeOrderConfirmConfig({
      ...current,
      lp_preset: preset,
      preview_root_selector: ecforcePreset.preview_root_selector,
      fields_by_group: nextFieldsByGroup,
      selectors: preset === ORDER_CONFIRM_LP_PRESET.ECFORCE
        ? JSON.parse(JSON.stringify(ecforcePreset.selectors))
        : legacy.selectors,
      labels: { ...current.labels, ...legacy.labels },
    });

    setDataMessages(nextMessages);
  };

  return (
    <div className="ss-bot-statement-wrapper">
      <span style={sectionLabelStyle}>LPテンプレート</span>
      <select
        className="ss-input-value"
        value={config.lp_preset || ORDER_CONFIRM_LP_PRESET.ECFORCE}
        onChange={(e) => handlePresetChange(e.target.value)}
      >
        {LP_PRESET_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <div style={{ marginTop: '12px' }}>
        <OrderConfirmSettingsModal
          config={config}
          indexMessageSelect={indexMessageSelect}
          indexContent={indexContent}
          messageType={messageType}
          onChangeValueMessageContent={onChangeValueMessageContent}
          dataMessages={dataMessages}
          setDataMessages={setDataMessages}
        />
      </div>

      <div className="ss-bot-checkbox-scroll-auto" style={{ marginTop: '10px' }}>
        <CheckboxCustom
          label="自動でスクロールさせない"
          onChange={(value) => onChangeValueMessageContent(
            indexMessageSelect,
            indexContent,
            messageType,
            value,
            'scroll_auto',
          )}
          value={config.scroll_auto || false}
        />
      </div>

      {messageContent && (
        <>
          <div className="ss-bot-checkbox-scroll-auto">
            <CheckboxCustom
              label="表示待ち時間を設定する"
              onChange={(value) => {
                messageContent.is_use_custom_delay = value;
                if (value && !messageContent.custom_delay_time) {
                  messageContent.custom_delay_time = 1.0;
                }
                setDataMessages([...dataMessages]);
              }}
              value={messageContent.is_use_custom_delay || false}
            />
          </div>
          {messageContent.is_use_custom_delay && (
            <div className="ss-user-setting__item-bottom-flex-start" style={{ marginLeft: '25px', marginBottom: '10px' }}>
              <span style={{ marginRight: '10px', fontSize: '12px' }}>待ち時間 (秒)</span>
              <InputNum
                step={0.1}
                min={0}
                max={10}
                placeholder="1.0"
                className="ss-user-setting-input-delay"
                value={messageContent.custom_delay_time}
                onChange={(value) => {
                  messageContent.custom_delay_time = value;
                  setDataMessages([...dataMessages]);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
