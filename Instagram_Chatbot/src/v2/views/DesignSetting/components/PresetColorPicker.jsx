import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';
import ColorPicker from '@rc-component/color-picker';
import {
  MAIN_COLORS,
  PRESET_COLOR_HEX_MAX_LENGTH,
  PRESET_COLOR_HEX_PATTERN,
  THEME_CSS_VAR_MAIN_COLOR,
} from '../constants/designChatbotConstants';
import '@rc-component/color-picker/assets/index.css';

const toStoredHex = (hex, presets) => {
  const trimmed = String(hex || '').slice(0, PRESET_COLOR_HEX_MAX_LENGTH);
  const matched = presets.find((preset) => preset.toLowerCase() === trimmed.toLowerCase());
  if (matched) {
    return matched;
  }
  return trimmed.toLowerCase();
};

const PresetColorPicker = ({ value, onChange, presets = MAIN_COLORS }) => {
  const [open, setOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState(null);
  const [localColor, setLocalColor] = useState(null);
  const currentColor = localColor || value || presets[0];
  const displayHex = hexDraft ?? currentColor;
  const activePreset = presets.find(
    (preset) => preset.toLowerCase() === currentColor.toLowerCase(),
  );

  useEffect(() => {
    setLocalColor(null);
    setHexDraft(null);
  }, [value]);

  const commitColor = (hex) => {
    const stored = toStoredHex(hex, presets);
    setLocalColor(stored);
    onChange(stored);
  };

  const handlePanelChange = (color) => {
    const hex = color.toHexString().slice(0, PRESET_COLOR_HEX_MAX_LENGTH);
    setHexDraft(null);
    commitColor(hex);
  };

  const handlePresetClick = (color) => {
    setHexDraft(null);
    setLocalColor(color);
    onChange(color);
    setOpen(false);
  };

  const handleHexInputChange = (event) => {
    const next = event.target.value.slice(0, PRESET_COLOR_HEX_MAX_LENGTH);
    setHexDraft(next);
    if (!PRESET_COLOR_HEX_PATTERN.test(next)) {
      return;
    }
    commitColor(next);
  };

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setHexDraft(null);
    }
  };

  const panel = (
    <div className="preset-color-picker__panel">
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
        value={currentColor}
        disabledAlpha
        onChange={handlePanelChange}
      />
      <input
        type="text"
        className="preset-color-picker__hex-input"
        value={displayHex}
        maxLength={PRESET_COLOR_HEX_MAX_LENGTH}
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
          className="preset-color-picker__swatch"
          style={{ [THEME_CSS_VAR_MAIN_COLOR]: currentColor }}
        />
        <span className="preset-color-picker__hex">{currentColor}</span>
      </button>
    </Popover>
  );
};

PresetColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  presets: PropTypes.arrayOf(PropTypes.string),
};

export default PresetColorPicker;
