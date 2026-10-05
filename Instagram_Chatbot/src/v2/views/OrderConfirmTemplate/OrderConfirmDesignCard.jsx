import React from 'react';
import PropTypes from 'prop-types';
import {
  DEFAULT_ORDER_CONFIRM_DESIGN,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_NORMAL,
  buildOrderConfirmDesignPreviewHtml,
  normalizeOrderConfirmConfig,
  normalizeOrderConfirmDesign,
} from 'v2/utils/orderConfirmLpScriptGenerator';
import {
  DESIGN_BACKGROUND,
  DESIGN_CONTAINER,
  DESIGN_DIVIDER,
  DESIGN_DIVIDER_COLOR,
  DESIGN_FONT_SIZE,
  DESIGN_LABEL,
  DESIGN_NOTE,
  DESIGN_PADDING,
  DESIGN_PREVIEW,
  DESIGN_RADIUS,
  DESIGN_SECTION,
  DESIGN_TEXT_COLOR,
  DESIGN_TOTAL_COLOR,
  DESIGN_TOTAL_WEIGHT,
  DESIGN_VALUE,
  DESIGN_WEIGHT,
  DESIGN_WEIGHT_BOLD,
  DESIGN_WEIGHT_NORMAL,
  RESET_DESIGN,
} from './constants';

const HEX6_PATTERN = /^#[0-9a-fA-F]{6}$/;
const HEX3_PATTERN = /^#[0-9a-fA-F]{3}$/;
const FALLBACK_COLOR_INPUT = '#000000';

const toColorInputValue = (value) => {
  if (HEX6_PATTERN.test(value)) return value;
  if (HEX3_PATTERN.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return FALLBACK_COLOR_INPUT;
};

const OrderConfirmColorField = ({ id, label, value, onChange }) => (
  <div className="order-confirm-design-card__form-row">
    <label className="order-confirm-design-card__label" htmlFor={id}>{label}</label>
    <div className="order-confirm-design-card__color-control">
      <input
        id={id}
        type="color"
        className="order-confirm-design-card__color-swatch"
        value={toColorInputValue(value)}
        onChange={(event) => onChange(event.target.value)}
      />
      <input
        type="text"
        className="ss-input-value order-confirm-design-card__color-text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  </div>
);

OrderConfirmColorField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const OrderConfirmNumberField = ({ id, label, value, onChange }) => (
  <div className="order-confirm-design-card__form-row">
    <label className="order-confirm-design-card__label" htmlFor={id}>{label}</label>
    <input
      id={id}
      type="number"
      min="0"
      className="ss-input-value"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

OrderConfirmNumberField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
};

const OrderConfirmWeightField = ({ name, label, value, onChange }) => (
  <div className="order-confirm-design-card__form-row">
    <span className="order-confirm-design-card__label">{label}</span>
    <div className="order-confirm-design-card__weight">
      <label className="order-confirm-design-card__weight-option">
        <input
          type="radio"
          name={name}
          checked={value === FONT_WEIGHT_BOLD}
          onChange={() => onChange(FONT_WEIGHT_BOLD)}
        />
        {DESIGN_WEIGHT_BOLD}
      </label>
      <label className="order-confirm-design-card__weight-option">
        <input
          type="radio"
          name={name}
          checked={value === FONT_WEIGHT_NORMAL}
          onChange={() => onChange(FONT_WEIGHT_NORMAL)}
        />
        {DESIGN_WEIGHT_NORMAL}
      </label>
    </div>
  </div>
);

OrderConfirmWeightField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const OrderConfirmDesignCard = ({ config, onChange }) => {
  const normalizedConfig = normalizeOrderConfirmConfig(config);
  const design = normalizeOrderConfirmDesign(normalizedConfig.design);
  const previewHtml = buildOrderConfirmDesignPreviewHtml({
    ...normalizedConfig,
    design,
  });

  const patchDesign = (patch) => {
    onChange(normalizeOrderConfirmConfig({
      ...normalizedConfig,
      design: { ...design, ...patch },
    }));
  };

  const resetDesign = () => {
    onChange(normalizeOrderConfirmConfig({
      ...normalizedConfig,
      design: { ...DEFAULT_ORDER_CONFIRM_DESIGN },
    }));
  };

  return (
    <div className="order-confirm-design-card">
      <div className="order-confirm-design-card__toolbar">
        <button
          type="button"
          className="ss-settings-modal-action-link"
          onClick={resetDesign}
        >
          {RESET_DESIGN}
        </button>
      </div>

      <div className="order-confirm-design-card__layout">
        <div className="order-confirm-design-card__preview">
          <span className="order-confirm-design-card__section-title">{DESIGN_PREVIEW}</span>
          <div
            className="order-confirm-design-card__preview-box"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>

        <div className="order-confirm-design-card__fields">
          <span className="order-confirm-design-card__section-title">{DESIGN_CONTAINER}</span>
          <OrderConfirmColorField
            id="oc-design-bg"
            label={DESIGN_BACKGROUND}
            value={design.backgroundColor}
            onChange={(value) => patchDesign({ backgroundColor: value })}
          />
          <OrderConfirmColorField
            id="oc-design-text"
            label={DESIGN_TEXT_COLOR}
            value={design.textColor}
            onChange={(value) => patchDesign({ textColor: value })}
          />
          <OrderConfirmNumberField
            id="oc-design-radius"
            label={DESIGN_RADIUS}
            value={design.borderRadiusPx}
            onChange={(value) => patchDesign({ borderRadiusPx: value })}
          />
          <OrderConfirmNumberField
            id="oc-design-padding"
            label={DESIGN_PADDING}
            value={design.paddingPx}
            onChange={(value) => patchDesign({ paddingPx: value })}
          />

          <span className="order-confirm-design-card__section-title">{DESIGN_SECTION}</span>
          <OrderConfirmNumberField
            id="oc-design-section-size"
            label={DESIGN_FONT_SIZE}
            value={design.sectionFontSizePx}
            onChange={(value) => patchDesign({ sectionFontSizePx: value })}
          />
          <OrderConfirmColorField
            id="oc-design-section-color"
            label={DESIGN_TEXT_COLOR}
            value={design.sectionColor}
            onChange={(value) => patchDesign({ sectionColor: value })}
          />
          <OrderConfirmWeightField
            name="oc-design-section-weight"
            label={DESIGN_WEIGHT}
            value={design.sectionFontWeight}
            onChange={(value) => patchDesign({ sectionFontWeight: value })}
          />

          <span className="order-confirm-design-card__section-title">{DESIGN_LABEL}</span>
          <OrderConfirmNumberField
            id="oc-design-label-size"
            label={DESIGN_FONT_SIZE}
            value={design.labelFontSizePx}
            onChange={(value) => patchDesign({ labelFontSizePx: value })}
          />
          <OrderConfirmColorField
            id="oc-design-label-color"
            label={DESIGN_TEXT_COLOR}
            value={design.labelColor}
            onChange={(value) => patchDesign({ labelColor: value })}
          />
          <OrderConfirmWeightField
            name="oc-design-label-weight"
            label={DESIGN_WEIGHT}
            value={design.labelFontWeight}
            onChange={(value) => patchDesign({ labelFontWeight: value })}
          />

          <span className="order-confirm-design-card__section-title">{DESIGN_VALUE}</span>
          <OrderConfirmNumberField
            id="oc-design-value-size"
            label={DESIGN_FONT_SIZE}
            value={design.valueFontSizePx}
            onChange={(value) => patchDesign({ valueFontSizePx: value })}
          />
          <OrderConfirmColorField
            id="oc-design-value-color"
            label={DESIGN_TEXT_COLOR}
            value={design.valueColor}
            onChange={(value) => patchDesign({ valueColor: value })}
          />
          <OrderConfirmWeightField
            name="oc-design-value-weight"
            label={DESIGN_WEIGHT}
            value={design.valueFontWeight}
            onChange={(value) => patchDesign({ valueFontWeight: value })}
          />
          <OrderConfirmColorField
            id="oc-design-total-color"
            label={DESIGN_TOTAL_COLOR}
            value={design.totalColor}
            onChange={(value) => patchDesign({ totalColor: value })}
          />
          <OrderConfirmWeightField
            name="oc-design-total-weight"
            label={DESIGN_TOTAL_WEIGHT}
            value={design.totalFontWeight}
            onChange={(value) => patchDesign({ totalFontWeight: value })}
          />

          <span className="order-confirm-design-card__section-title">{DESIGN_NOTE}</span>
          <OrderConfirmNumberField
            id="oc-design-note-size"
            label={DESIGN_FONT_SIZE}
            value={design.noteFontSizePx}
            onChange={(value) => patchDesign({ noteFontSizePx: value })}
          />
          <OrderConfirmColorField
            id="oc-design-note-color"
            label={DESIGN_TEXT_COLOR}
            value={design.noteColor}
            onChange={(value) => patchDesign({ noteColor: value })}
          />
          <OrderConfirmWeightField
            name="oc-design-note-weight"
            label={DESIGN_WEIGHT}
            value={design.noteFontWeight}
            onChange={(value) => patchDesign({ noteFontWeight: value })}
          />

          <span className="order-confirm-design-card__section-title">{DESIGN_DIVIDER}</span>
          <OrderConfirmColorField
            id="oc-design-divider-color"
            label={DESIGN_DIVIDER_COLOR}
            value={design.dividerColor}
            onChange={(value) => patchDesign({ dividerColor: value })}
          />
        </div>
      </div>
    </div>
  );
};

OrderConfirmDesignCard.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OrderConfirmDesignCard;
