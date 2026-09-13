import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Checkbox } from 'antd';
import {
  BORDER_TWINKLE_EFFECT_OPTIONS,
  BUTTON_BORDER_STYLE_OPTIONS,
  BUTTON_EFFECT_OPTIONS,
  BUTTON_POSITION_OPTIONS,
  MESSAGE_BORDER_STYLE_OPTIONS,
  MODAL_TITLE_ALIGNMENT_OPTIONS,
  THEME_MAIN_COLOR_HELPER,
  THEME_RESET_SECTION_LABEL,
} from '../constants/designThemeConstants';
import { DEFAULT_MAIN_COLOR } from '../constants/designChatbotConstants';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';
import {
  normalizeBorderTwinkleEffect,
  normalizeButtonBorderStyle,
  normalizeButtonEffect,
  normalizeButtonPosition,
  normalizeMessageBorderStyle,
  normalizeModalTitleAlignment,
} from 'v2/views/DesignSetting/utils/designThemeUtils';
import MainColorPicker from './MainColorPicker';
import ThemeColorField from './ThemeColorField';
import ThemeDimensionField from './ThemeDimensionField';
import ThemeEffectSelectField from './ThemeEffectSelectField';
import ThemeNumberField from './ThemeNumberField';
import DesignSettingLabel from './shared/DesignSettingLabel';

const { Panel } = Collapse;

const getGridItemClassName = ({ isColor = false, fullWidth = false, isHighlighted = false } = {}) => (
  [
    isColor ? 'theme-field--color' : '',
    fullWidth ? 'theme-field--full' : '',
    isHighlighted ? 'theme-field--highlighted' : '',
  ].filter(Boolean).join(' ')
);

const ThemeAccordionSection = ({
  sectionId,
  title,
  fields,
  themeSettings,
  mainColor,
  onMainColorChange,
  isActive,
  isExpanded,
  highlightedFieldKey,
  onExpand,
  onFieldChange,
  onResetSection,
  showReset,
  showModalInPreview,
  onModalPreviewToggle,
}) => {
  const renderField = (field, index) => {
    const { key, label, isText, fieldType, fullWidth, effectOptions, unit, unitOptions } = field;

    if (fieldType === 'groupLabel') {
      return (
        <div
          key={`group-${label}-${index}`}
          className="theme-field-group-label theme-field--full"
        >
          {label}
        </div>
      );
    }

    if (fieldType === 'mainColor') {
      return (
        <div
          key={`main-color-${index}`}
          className={`theme-field theme-field--main-color${fullWidth ? ' theme-field--full' : ''}`}
        >
          <DesignSettingLabel
            tooltip={getDesignSettingTooltip('mainColor')}
            className="theme-field__label"
          >
            {label}
          </DesignSettingLabel>
          <div className="theme-field__control">
            <MainColorPicker mainColor={mainColor} onChange={onMainColorChange} />
            <p className="theme-section__main-color-helper">
              {THEME_MAIN_COLOR_HELPER}
            </p>
          </div>
        </div>
      );
    }

    const isHighlighted = highlightedFieldKey === key;
    const isFullWidth = fullWidth ?? false;
    const wrapperClassName = getGridItemClassName({
      fullWidth: isFullWidth,
      isHighlighted,
    });

    if (fieldType === 'effectSelect') {
      const isBorderTwinkle = effectOptions === 'borderTwinkle';
      const isButtonBounce = effectOptions === 'buttonBounce';

      return (
        <div key={key} className={wrapperClassName}>
          <ThemeEffectSelectField
            label={label}
            value={themeSettings[key]}
            fullWidth={isFullWidth}
            tooltipKey={key}
            options={isBorderTwinkle
              ? BORDER_TWINKLE_EFFECT_OPTIONS
              : isButtonBounce
                ? BUTTON_EFFECT_OPTIONS
                : undefined}
            normalizeValue={isBorderTwinkle
              ? normalizeBorderTwinkleEffect
              : isButtonBounce
                ? normalizeButtonEffect
                : undefined}
            onChange={(value) => onFieldChange(key, value)}
          />
        </div>
      );
    }

    if (fieldType === 'borderStyleSelect') {
      return (
        <div key={key} className={wrapperClassName}>
          <ThemeEffectSelectField
            label={label}
            value={themeSettings[key]}
            fullWidth={isFullWidth}
            tooltipKey={key}
            options={BUTTON_BORDER_STYLE_OPTIONS}
            normalizeValue={normalizeButtonBorderStyle}
            onChange={(value) => onFieldChange(key, value)}
          />
        </div>
      );
    }

    if (fieldType === 'messageBorderStyleSelect') {
      return (
        <div key={key} className={wrapperClassName}>
          <ThemeEffectSelectField
            label={label}
            value={themeSettings[key]}
            fullWidth={isFullWidth}
            tooltipKey={key}
            options={MESSAGE_BORDER_STYLE_OPTIONS}
            normalizeValue={normalizeMessageBorderStyle}
            onChange={(value) => onFieldChange(key, value)}
          />
        </div>
      );
    }

    if (fieldType === 'positionSelect') {
      return (
        <div key={key} className={wrapperClassName}>
          <ThemeEffectSelectField
            label={label}
            value={themeSettings[key]}
            fullWidth={isFullWidth}
            tooltipKey={key}
            options={BUTTON_POSITION_OPTIONS}
            normalizeValue={normalizeButtonPosition}
            onChange={(value) => onFieldChange(key, value)}
          />
        </div>
      );
    }

    if (fieldType === 'modalTitleAlignmentSelect') {
      return (
        <div key={key} className={wrapperClassName}>
          <ThemeEffectSelectField
            label={label}
            value={themeSettings[key]}
            fullWidth={isFullWidth}
            tooltipKey={key}
            options={MODAL_TITLE_ALIGNMENT_OPTIONS}
            normalizeValue={normalizeModalTitleAlignment}
            onChange={(value) => onFieldChange(key, value)}
          />
        </div>
      );
    }

    if (fieldType === 'modalPreviewToggle') {
      if (sectionId !== 'modal') return null;

      return (
        <div
          key={`modal-preview-toggle-${index}`}
          className={`theme-field theme-field--modal-preview-toggle${fullWidth ? ' theme-field--full' : ''}`}
        >
          <Checkbox
            checked={showModalInPreview}
            onChange={(event) => onModalPreviewToggle(event.target.checked)}
          >
            {label}
          </Checkbox>
        </div>
      );
    }

    if (fieldType === 'dimension') {
      return (
        <div key={key} className={wrapperClassName}>
          <ThemeDimensionField
            label={label}
            value={themeSettings[key]}
            fullWidth={isFullWidth}
            tooltipKey={key}
            unit={unit}
            unitOptions={unitOptions}
            min={unit === '%' ? 1 : 0}
            max={unit === '%' ? 100 : 200}
            onChange={(value) => onFieldChange(key, value)}
          />
        </div>
      );
    }

    if (fieldType === 'fontSize') {
      return (
        <div key={key} className={wrapperClassName}>
          <ThemeNumberField
            label={label}
            value={themeSettings[key]}
            fullWidth={isFullWidth}
            tooltipKey={key}
            onChange={(value) => onFieldChange(key, value)}
          />
        </div>
      );
    }

    return (
      <div
        key={key}
        className={getGridItemClassName({
          isColor: true,
          fullWidth: isFullWidth,
          isHighlighted,
        })}
      >
        <ThemeColorField
          label={label}
          value={themeSettings[key]}
          isText={isText}
          fullWidth={isFullWidth}
          tooltipKey={key}
          onChange={(value) => onFieldChange(key, value)}
        />
      </div>
    );
  };

  const header = (
    <div className="theme-accordion-section__header">
      <span>{title}</span>
      {showReset && isExpanded && (
        <button
          type="button"
          className="theme-accordion-section__reset"
          onClick={(event) => {
            event.stopPropagation();
            onResetSection(sectionId);
          }}
        >
          {THEME_RESET_SECTION_LABEL}
        </button>
      )}
    </div>
  );

  return (
    <div
      id={`theme-section-${sectionId}`}
      className={`theme-accordion-section${isActive ? ' theme-accordion-section--active' : ''}`}
    >
      <Collapse
        bordered={false}
        activeKey={isExpanded ? sectionId : []}
        onChange={(keys) => {
          const expanded = Array.isArray(keys) ? keys.includes(sectionId) : keys === sectionId;
          onExpand(sectionId, expanded);
        }}
      >
        <Panel header={header} key={sectionId}>
          <div className="theme-section__grid">
            {fields.map(renderField)}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

ThemeAccordionSection.propTypes = {
  sectionId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string.isRequired,
    isText: PropTypes.bool,
    fieldType: PropTypes.string,
    fullWidth: PropTypes.bool,
  })).isRequired,
  themeSettings: PropTypes.object.isRequired,
  mainColor: PropTypes.string,
  onMainColorChange: PropTypes.func,
  isActive: PropTypes.bool,
  isExpanded: PropTypes.bool,
  highlightedFieldKey: PropTypes.string,
  onExpand: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onResetSection: PropTypes.func.isRequired,
  showReset: PropTypes.bool,
  showModalInPreview: PropTypes.bool,
  onModalPreviewToggle: PropTypes.func,
};

ThemeAccordionSection.defaultProps = {
  mainColor: DEFAULT_MAIN_COLOR,
  onMainColorChange: null,
  isActive: false,
  isExpanded: false,
  highlightedFieldKey: '',
  showReset: true,
  showModalInPreview: true,
  onModalPreviewToggle: null,
};

export default ThemeAccordionSection;
