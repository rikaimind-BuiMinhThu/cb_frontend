import React from 'react';
import InputCustom from './InputCustom';
import InputNum from './InputNum';
import PaymentColorFieldRow from '../components/paymentDisplayStyle/PaymentColorFieldRow';
import FukushashikiSearchRow from '../contentSettings/shared/FukushashikiSearchRow';
import { FUKUSHASHIKI_VARIANTS } from '../constants/scenarioSettingLabels';
import {
  CART_LOGIN_BORDER_STYLE_OPTIONS,
  CART_LOGIN_DISPLAY_TYPE_OPTIONS,
  CART_LOGIN_FIELD_LABELS,
  CART_LOGIN_FONT_WEIGHT_OPTIONS,
  CART_LOGIN_PROCESS_AFTER_CLICK,
  CART_LOGIN_PROCESS_AFTER_CLICK_OPTIONS,
  CART_LOGIN_SCROLL_BEHAVIOR_OPTIONS,
  CART_LOGIN_SCROLL_BLOCK_OPTIONS,
  CART_LOGIN_TEXT_ALIGN_OPTIONS,
} from '../constants/cartLoginConstants';
import { normalizeCartLoginConfig } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/cartLoginUtils';

const sectionLabelStyle = {
  fontWeight: 600,
  marginTop: '12px',
  marginBottom: '6px',
  display: 'block',
  fontSize: '12px',
};

const fieldLabelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '12px',
};

const toColorPickerValue = (value, fallback) => {
  const normalized = (value || fallback || '#000000').trim();
  return /^#[0-9a-fA-F]{6}$/.test(normalized) ? normalized : fallback;
};

const SelectField = ({ label, value, options, onChange }) => (
  <div style={{ marginTop: '10px' }}>
    <span style={fieldLabelStyle}>{label}</span>
    <select className="ss-input-value" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>{optionLabel}</option>
      ))}
    </select>
  </div>
);

export default function CartLoginConfig({
  indexMessageSelect,
  indexContent = 0,
  config,
  onChangeValue,
  dataMessages,
  setDataMessages,
}) {
  const messageType = 'cart_login';
  const normalizedConfig = normalizeCartLoginConfig(config);
  const processAfterClick = normalizedConfig.process_after_click;
  const processConfig = normalizedConfig.process_after_click_config;

  const applyConfig = (updater) => {
    const nextMessages = [...dataMessages];
    const content = nextMessages[indexMessageSelect]?.message_content?.[indexContent];
    if (!content) return;

    const current = normalizeCartLoginConfig(content[messageType]);
    content[messageType] = updater(current);
    setDataMessages(nextMessages);
  };

  const handleFieldChange = (fieldName) => (value) => {
    onChangeValue(indexMessageSelect, indexContent, messageType, value, fieldName);
  };

  const handleStyleChange = (fieldName) => (value) => {
    applyConfig((current) => ({
      ...current,
      style: {
        ...current.style,
        [fieldName]: value,
      },
    }));
  };

  const handleProcessConfigChange = (fieldName, value) => {
    applyConfig((current) => ({
      ...current,
      process_after_click_config: {
        ...current.process_after_click_config,
        [fieldName]: value,
      },
    }));
  };

  const handleSelectorChange = (fieldName, subField) => (value) => {
    applyConfig((current) => ({
      ...current,
      process_after_click_config: {
        ...current.process_after_click_config,
        [fieldName]: {
          ...current.process_after_click_config[fieldName],
          [subField]: value,
        },
      },
    }));
  };

  const showScrollSettings = processAfterClick === CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_SCROLL_LOGIN
    || processAfterClick === CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_SCROLL_CLICK_LOGIN;

  const showLoginTrigger = processAfterClick === CART_LOGIN_PROCESS_AFTER_CLICK.CLOSE_SCROLL_CLICK_LOGIN;

  return (
    <div className="ss-bot-statement-wrapper ss-bot-statement-type">
      <div style={{ marginTop: '10px' }}>
        <span style={fieldLabelStyle}>{CART_LOGIN_FIELD_LABELS.text}</span>
        <textarea
          className="ss-input-value"
          rows={3}
          value={normalizedConfig.text}
          onChange={(e) => handleFieldChange('text')(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <SelectField
        label={CART_LOGIN_FIELD_LABELS.display_type}
        value={normalizedConfig.display_type}
        options={CART_LOGIN_DISPLAY_TYPE_OPTIONS}
        onChange={handleFieldChange('display_type')}
      />

      <span style={sectionLabelStyle}>スタイル設定</span>

      <div style={{ marginTop: '10px' }}>
        <span style={fieldLabelStyle}>{CART_LOGIN_FIELD_LABELS.font_size}</span>
        <InputCustom
          style={{ width: '100%' }}
          value={normalizedConfig.style.font_size}
          onChange={handleStyleChange('font_size')}
        />
      </div>

      <SelectField
        label={CART_LOGIN_FIELD_LABELS.font_weight}
        value={normalizedConfig.style.font_weight}
        options={CART_LOGIN_FONT_WEIGHT_OPTIONS}
        onChange={handleStyleChange('font_weight')}
      />

      <PaymentColorFieldRow
        label={CART_LOGIN_FIELD_LABELS.background_color}
        value={normalizedConfig.style.background_color}
        colorPickerValue={toColorPickerValue(normalizedConfig.style.background_color, '#e6f2fb')}
        onChange={handleStyleChange('background_color')}
      />

      <PaymentColorFieldRow
        label={CART_LOGIN_FIELD_LABELS.text_color}
        value={normalizedConfig.style.text_color}
        colorPickerValue={toColorPickerValue(normalizedConfig.style.text_color, '#1f6fa9')}
        onChange={handleStyleChange('text_color')}
      />

      <div style={{ marginTop: '10px' }}>
        <span style={fieldLabelStyle}>{CART_LOGIN_FIELD_LABELS.border_width}</span>
        <InputCustom
          style={{ width: '100%' }}
          value={normalizedConfig.style.border_width}
          onChange={handleStyleChange('border_width')}
        />
      </div>

      <SelectField
        label={CART_LOGIN_FIELD_LABELS.border_style}
        value={normalizedConfig.style.border_style}
        options={CART_LOGIN_BORDER_STYLE_OPTIONS}
        onChange={handleStyleChange('border_style')}
      />

      <PaymentColorFieldRow
        label={CART_LOGIN_FIELD_LABELS.border_color}
        value={normalizedConfig.style.border_color}
        colorPickerValue={toColorPickerValue(normalizedConfig.style.border_color, '#6aa9d8')}
        onChange={handleStyleChange('border_color')}
      />

      <div style={{ marginTop: '10px' }}>
        <span style={fieldLabelStyle}>{CART_LOGIN_FIELD_LABELS.border_radius}</span>
        <InputCustom
          style={{ width: '100%' }}
          value={normalizedConfig.style.border_radius}
          onChange={handleStyleChange('border_radius')}
        />
      </div>

      <SelectField
        label={CART_LOGIN_FIELD_LABELS.text_align}
        value={normalizedConfig.style.text_align}
        options={CART_LOGIN_TEXT_ALIGN_OPTIONS}
        onChange={handleStyleChange('text_align')}
      />

      <div style={{ marginTop: '10px' }}>
        <span style={fieldLabelStyle}>{CART_LOGIN_FIELD_LABELS.padding}</span>
        <InputCustom
          style={{ width: '100%' }}
          value={normalizedConfig.style.padding}
          onChange={handleStyleChange('padding')}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <span style={fieldLabelStyle}>{CART_LOGIN_FIELD_LABELS.width}</span>
        <InputCustom
          style={{ width: '100%' }}
          value={normalizedConfig.style.width}
          onChange={handleStyleChange('width')}
        />
      </div>

      {normalizedConfig.display_type === 'button' && (
        <PaymentColorFieldRow
          label={CART_LOGIN_FIELD_LABELS.hover_background_color}
          value={normalizedConfig.style.hover_background_color}
          colorPickerValue={toColorPickerValue(normalizedConfig.style.hover_background_color, '#d8ebf9')}
          onChange={handleStyleChange('hover_background_color')}
        />
      )}

      <SelectField
        label={CART_LOGIN_FIELD_LABELS.process_after_click}
        value={processAfterClick}
        options={CART_LOGIN_PROCESS_AFTER_CLICK_OPTIONS}
        onChange={handleFieldChange('process_after_click')}
      />

      {showLoginTrigger && (
        <div style={{ marginTop: '10px' }}>
          <span style={fieldLabelStyle}>{CART_LOGIN_FIELD_LABELS.open_login_trigger}</span>
          <FukushashikiSearchRow
            mode={processConfig.open_login_trigger.search_mode}
            inputValue={processConfig.open_login_trigger.search_value || ''}
            onModeChange={handleSelectorChange('open_login_trigger', 'search_mode')}
            onInputChange={handleSelectorChange('open_login_trigger', 'search_value')}
            variant={FUKUSHASHIKI_VARIANTS.DEFAULT}
            selectId="cart-login-open-trigger-mode"
          />
        </div>
      )}

      {showScrollSettings && (
        <>
          <div style={{ marginTop: '10px' }}>
            <span style={fieldLabelStyle}>{CART_LOGIN_FIELD_LABELS.scroll_target}</span>
            <FukushashikiSearchRow
              mode={processConfig.scroll_target.search_mode}
              inputValue={processConfig.scroll_target.search_value || ''}
              onModeChange={handleSelectorChange('scroll_target', 'search_mode')}
              onInputChange={handleSelectorChange('scroll_target', 'search_value')}
              variant={FUKUSHASHIKI_VARIANTS.DEFAULT}
              selectId="cart-login-scroll-target-mode"
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <span style={fieldLabelStyle}>{CART_LOGIN_FIELD_LABELS.action_delay_ms}</span>
            <InputNum
              min={0}
              max={10000}
              step={100}
              value={processConfig.action_delay_ms}
              onChange={(value) => handleProcessConfigChange('action_delay_ms', value)}
            />
          </div>

          <SelectField
            label={CART_LOGIN_FIELD_LABELS.scroll_behavior}
            value={processConfig.scroll_behavior}
            options={CART_LOGIN_SCROLL_BEHAVIOR_OPTIONS}
            onChange={(value) => handleProcessConfigChange('scroll_behavior', value)}
          />

          <SelectField
            label={CART_LOGIN_FIELD_LABELS.scroll_block}
            value={processConfig.scroll_block}
            options={CART_LOGIN_SCROLL_BLOCK_OPTIONS}
            onChange={(value) => handleProcessConfigChange('scroll_block', value)}
          />
        </>
      )}
    </div>
  );
}
