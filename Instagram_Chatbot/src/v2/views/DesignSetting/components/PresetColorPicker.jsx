import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';
import ColorPicker from '@rc-component/color-picker';
import {
  MAIN_COLORS,
  PRESET_COLOR_ALPHA_OPAQUE,
  PRESET_COLOR_HEX_MAX_LENGTH,
  PRESET_COLOR_HEX_PATTERN,
  PRESET_COLOR_INPUT_MAX_LENGTH,
  PRESET_COLOR_NO_FILL_LABEL,
  PRESET_COLOR_TRANSPARENT,
  THEME_CSS_VAR_MAIN_COLOR,
} from '../constants/designChatbotConstants';
import '@rc-component/color-picker/assets/index.css';

const isEmptyColor = (color) => !color || color === PRESET_COLOR_TRANSPARENT;

const toStoredHex = (hex, presets) => {
  const trimmed = String(hex || '').slice(0, PRESET_COLOR_HEX_MAX_LENGTH);
  const matched = presets.find((preset) => preset.toLowerCase() === trimmed.toLowerCase());
  if (matched) {
    return matched;
  }
  return trimmed.toLowerCase();
};

const PresetColorPicker = ({
  value,
  onChange,
  presets = MAIN_COLORS,
  allowEmpty = false,
  allowAlpha = false,
}) => {
  const [open, setOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState(null);
  const [localColor, setLocalColor] = useState(null);
  const resolvedValue = localColor ?? value;
  const isNoFill = allowEmpty && isEmptyColor(resolvedValue);
  const solidFallback = presets[0];
  const currentColor = isNoFill ? PRESET_COLOR_TRANSPARENT : (resolvedValue || solidFallback);
  const panelValue = isNoFill ? solidFallback : currentColor;
  const displayHex = hexDraft ?? (isNoFill ? '' : currentColor);
  const activePreset = isNoFill
    ? null
    : presets.find((preset) => preset.toLowerCase() === String(currentColor).toLowerCase());
  const inputMaxLength = allowAlpha ? PRESET_COLOR_INPUT_MAX_LENGTH : PRESET_COLOR_HEX_MAX_LENGTH;
  const triggerLabel = isNoFill ? PRESET_COLOR_NO_FILL_LABEL : currentColor;
  const swatchClassName = isNoFill
    ? 'preset-color-picker__swatch preset-color-picker__swatch--empty'
    : 'preset-color-picker__swatch';

  useEffect(() => {
    setLocalColor(null);
    setHexDraft(null);
  }, [value]);

  const commitStored = (stored) => {
    setLocalColor(stored);
    onChange(stored);
  };

  const commitHex = (hex) => {
    commitStored(toStoredHex(hex, presets));
  };

  const handlePanelChange = (color) => {
    setHexDraft(null);
    if (allowAlpha && color.a < PRESET_COLOR_ALPHA_OPAQUE) {
      commitStored(color.toRgbString());
      return;
    }
    commitHex(color.toHexString().slice(0, PRESET_COLOR_HEX_MAX_LENGTH));
  };

  const handlePresetClick = (color) => {
    setHexDraft(null);
    commitStored(color);
    setOpen(false);
  };

  const handleNoFillClick = () => {
    setHexDraft(null);
    commitStored(PRESET_COLOR_TRANSPARENT);
    setOpen(false);
  };

  const handleHexInputChange = (event) => {
    const next = event.target.value.slice(0, inputMaxLength);
    setHexDraft(next);
    if (!PRESET_COLOR_HEX_PATTERN.test(next)) {
      return;
    }
    commitHex(next);
  };

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setHexDraft(null);
    }
  };

  const noFillClassName = isNoFill
    ? 'preset-color-picker__no-fill preset-color-picker__no-fill--active'
    : 'preset-color-picker__no-fill';

  const panel = (
    <div className="preset-color-picker__panel">
      {allowEmpty ? (
        <button
          type="button"
          className={noFillClassName}
          aria-label={PRESET_COLOR_NO_FILL_LABEL}
          onClick={handleNoFillClick}
        >
          <span className="preset-color-picker__preset-swatch preset-color-picker__preset-swatch--empty" />
          <span className="preset-color-picker__no-fill-label">{PRESET_COLOR_NO_FILL_LABEL}</span>
        </button>
      ) : null}
      <div className="preset-color-picker__presets">
        {presets.map((color) => {
          const isActive = activePreset === color;
          const presetClassName = isActive
            ? 'preset-color-picker__preset preset-color-picker__preset--active'
            : 'preset-color-picker__preset';
          return (
            <button
              key={color}
              type="button"
              className={presetClassName}
              aria-label={color}
              onClick={() => handlePresetClick(color)}
            >
              <span
                className="preset-color-picker__preset-swatch"
                style={{ [THEME_CSS_VAR_MAIN_COLOR]: color }}
              />
            </button>
          );
        })}
      </div>
      <ColorPicker
        value={panelValue}
        disabledAlpha={!allowAlpha}
        onChange={handlePanelChange}
      />
      <input
        type="text"
        className="preset-color-picker__hex-input"
        value={displayHex}
        maxLength={inputMaxLength}
        onChange={handleHexInputChange}
      />
    </div>
  );

  return (
    <Popover
      content={panel}
      trigger="click"
      visible={open}
      onVisibleChange={handleOpenChange}
      placement="bottomLeft"
      overlayClassName="preset-color-picker__popover"
    >
      <button
        type="button"
        className="preset-color-picker__trigger"
        data-color={currentColor}
      >
        <span
          className={swatchClassName}
          style={isNoFill ? undefined : { [THEME_CSS_VAR_MAIN_COLOR]: currentColor }}
        />
        <span className="preset-color-picker__hex">{triggerLabel}</span>
      </button>
    </Popover>
  );
};

PresetColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  presets: PropTypes.arrayOf(PropTypes.string),
  allowEmpty: PropTypes.bool,
  allowAlpha: PropTypes.bool,
};

PresetColorPicker.defaultProps = {
  value: '',
  presets: undefined,
  allowEmpty: false,
  allowAlpha: false,
};

export default PresetColorPicker;
