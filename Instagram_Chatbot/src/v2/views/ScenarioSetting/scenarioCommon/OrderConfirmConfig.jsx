import React, { useState } from 'react';
import CheckboxCustom from './CheckboxCustom';
import InputNum from './InputNum';
import { BOT_MESSAGE_TYPES } from 'v2/views/Preview/PreviewComponent/Constants';
import {
  getDefaultOrderConfirmConfig,
  normalizeOrderConfirmConfig,
} from 'v2/views/ScenarioSetting/utils/OrderConfirmLpScriptGenerator';
import OrderConfirmSettingsModal from './OrderConfirmSettingsModal';
import useOrderConfirmMessageTemplates from 'v2/views/OrderConfirmTemplate/useOrderConfirmMessageTemplates';

const OrderConfirmConfig = ({
  indexMessageSelect,
  indexContent = 0,
  typeContent,
  messageType = BOT_MESSAGE_TYPES.ORDER_CONFIRM,
  onChangeValueMessageContent,
  dataMessages,
  setDataMessages,
  messageContent,
}) => {
  const config = normalizeOrderConfirmConfig(typeContent || getDefaultOrderConfirmConfig());
  const { templates, applySelection, presetOptions, confirmModal } = useOrderConfirmMessageTemplates();
  const [selectedTemplateValue, setSelectedTemplateValue] = useState('');

  const applyConfig = (nextConfig) => {
    const nextMessages = [...dataMessages];
    const content = nextMessages[indexMessageSelect]?.message_content?.[indexContent];
    if (!content) return;

    content[messageType] = nextConfig;
    setDataMessages(nextMessages);
  };

  const handleTemplateSelect = async (event) => {
    const value = event.target.value;
    setSelectedTemplateValue(value);
    if (!value) return;

    try {
      await applySelection(value, typeContent || {}, applyConfig);
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedTemplateValue('');
    }
  };

  return (
    <div className="ss-bot-statement-wrapper">
      {confirmModal}
      <span className="ss-config-section-label">注文確認メッセージテンプレート</span>
      <select
        className="ss-input-value"
        value={selectedTemplateValue}
        onChange={handleTemplateSelect}
      >
        <option value="">選択なし</option>
        <optgroup label="プリセット">
          <option value={presetOptions.ECFORCE}>EC Force</option>
          <option value={presetOptions.CUSTOM}>カスタム</option>
        </optgroup>
        {templates.length > 0 && (
          <optgroup label="保存済みテンプレート">
            {templates.map((template) => (
              <option key={template.id} value={String(template.id)}>{template.name}</option>
            ))}
          </optgroup>
        )}
      </select>

      <div className="ss-config-field--mt12">
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

      <div className="ss-bot-checkbox-scroll-auto ss-config-field">
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
            <div className="ss-user-setting__item-bottom-flex-start ss-delay-setting">
              <span className="ss-delay-setting__label">待ち時間 (秒)</span>
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
};

export default OrderConfirmConfig;
