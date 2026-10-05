import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  MAIN_COLORS,
  PRESET_COLOR_CUSTOM_LABEL,
  PRESET_COLOR_INPUT_ID_PREFIX,
  THEME_CSS_VAR_MAIN_COLOR,
} from '../constants/designChatbotConstants';

const PresetColorPicker = ({ value, onChange, presets = MAIN_COLORS }) => {
  const customColorRef = useRef(null);
  const inputIdRef = useRef(null);
  if (!inputIdRef.current) {
    inputIdRef.current = `${PRESET_COLOR_INPUT_ID_PREFIX}${Math.random().toString(36).slice(2, 9)}`;
  }
  const currentColor = value || presets[0];
  const presetIndex = presets.indexOf(currentColor);
  const isCustomColor = presetIndex === -1;

  const handlePresetClick = (color) => {
    onChange(color);
  };

  const handleCustomClick = () => {
    customColorRef.current?.click();
  };

  return (
    <div className="main-colors">
      {presets.map((color, index) => (
        <div
          key={color}
          className={`color color-${index}${!isCustomColor && presetIndex === index ? ' active' : ''}`}
          onClick={() => handlePresetClick(color)}
        >
          <span
            className="main-colors__swatch"
            style={{ [THEME_CSS_VAR_MAIN_COLOR]: color }}
          />
        </div>
      ))}

      <div className="main-colors__custom">
        <div
          className={`color color-999${isCustomColor ? ' active' : ''}`}
          onClick={handleCustomClick}
        >
          <span
            className="main-colors__swatch"
            style={{ [THEME_CSS_VAR_MAIN_COLOR]: currentColor }}
          />
        </div>
        <span className="main-colors__custom-label">{PRESET_COLOR_CUSTOM_LABEL}</span>
      </div>
      <input
        ref={customColorRef}
        id={inputIdRef.current}
        type="color"
        value={currentColor}
        onChange={(e) => onChange(e.target.value)}
        className="main-colors__color-input"
      />
    </div>
  );
};

PresetColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  presets: PropTypes.arrayOf(PropTypes.string),
};

export default PresetColorPicker;
