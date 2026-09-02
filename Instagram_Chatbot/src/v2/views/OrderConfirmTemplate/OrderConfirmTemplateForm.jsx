import React from 'react';
import { Card, Input } from 'antd';
import CheckboxCustom from './CheckboxCustom';
import OrderConfirmSettingsModalContent from './OrderConfirmSettingsModalContent';
import OrderConfirmAdvancedSettings from './OrderConfirmAdvancedSettings';
import {
  ORDER_CONFIRM_LP_PRESET,
  buildOrderConfirmPresetConfig,
  getDefaultOrderConfirmConfig,
  normalizeOrderConfirmConfig,
} from 'v2/utils/orderConfirmLpScriptGenerator';
import {
  CARD_ADVANCED,
  CARD_BASIC,
  CARD_FIELDS,
  LABEL_LP_TYPE,
  LABEL_NO_AUTO_SCROLL,
  LABEL_TEMPLATE_NAME,
  PRESET_CUSTOM_LABEL,
  PRESET_ECFORCE_LABEL,
} from './constants';
import './orderConfirmTemplateEditor.css';

const LP_PRESET_OPTIONS = [
  [ORDER_CONFIRM_LP_PRESET.ECFORCE, PRESET_ECFORCE_LABEL],
  [ORDER_CONFIRM_LP_PRESET.CUSTOM, PRESET_CUSTOM_LABEL],
];

const OrderConfirmTemplateForm = ({
  templateName,
  nameError,
  onTemplateNameChange,
  config,
  onConfigChange,
}) => {
  const normalizedConfig = normalizeOrderConfirmConfig(config || getDefaultOrderConfirmConfig());

  const handlePresetChange = (preset) => {
    onConfigChange(buildOrderConfirmPresetConfig(normalizedConfig, preset));
  };

  const updateConfigValue = (field, value, nestedKey = null) => {
    const next = { ...normalizedConfig };
    if (nestedKey) {
      next[field] = { ...(next[field] || {}), [nestedKey]: value };
    } else {
      next[field] = value;
    }
    onConfigChange(normalizeOrderConfirmConfig(next));
  };

  return (
    <div className="order-confirm-template-editor">
      <Card title={CARD_BASIC} className="order-confirm-template-editor__card" bordered={false}>
        <div className="order-confirm-template-editor__form-grid">
          <div className="order-confirm-template-editor__form-row order-confirm-template-editor__form-row--top">
            <label className="order-confirm-template-editor__label" htmlFor="order-confirm-template-name">
              {LABEL_TEMPLATE_NAME}
            </label>
            <div className="order-confirm-template-editor__control">
              <Input
                id="order-confirm-template-name"
                value={templateName}
                onChange={(e) => onTemplateNameChange(e.target.value)}
              />
              {nameError && <div className="order-confirm-template-editor__error">{nameError}</div>}
            </div>
          </div>

          <div className="order-confirm-template-editor__form-row">
            <label className="order-confirm-template-editor__label" htmlFor="order-confirm-lp-preset">
              {LABEL_LP_TYPE}
            </label>
            <div className="order-confirm-template-editor__control">
              <select
                id="order-confirm-lp-preset"
                className="ss-input-value"
                value={normalizedConfig.lp_preset || ORDER_CONFIRM_LP_PRESET.ECFORCE}
                onChange={(e) => handlePresetChange(e.target.value)}
              >
                {LP_PRESET_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="order-confirm-template-editor__scroll-row">
            <CheckboxCustom
              label={LABEL_NO_AUTO_SCROLL}
              onChange={(value) => onConfigChange(normalizeOrderConfirmConfig({
                ...normalizedConfig,
                scroll_auto: value,
              }))}
              value={normalizedConfig.scroll_auto || false}
            />
          </div>
        </div>
      </Card>

      <Card title={CARD_FIELDS} className="order-confirm-template-editor__card order-confirm-template-editor__fields-card" bordered={false}>
        <OrderConfirmSettingsModalContent
          config={normalizedConfig}
          onConfigChange={onConfigChange}
          showAdvancedSettings={false}
        />
      </Card>

      <Card title={CARD_ADVANCED} className="order-confirm-template-editor__card" bordered={false}>
        <OrderConfirmAdvancedSettings
          className="order-confirm-template-editor__advanced"
          normalizedConfig={normalizedConfig}
          onUpdateConfigValue={updateConfigValue}
        />
      </Card>
    </div>
  );
};

export default OrderConfirmTemplateForm;
