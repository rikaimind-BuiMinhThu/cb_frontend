import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { MAIN_COLORS } from '../constants/designChatbotConstants';

const PresetColorPicker = ({ value, onChange, presets = MAIN_COLORS }) => {
  const customColorRef = useRef(null);
  const inputIdRef = useRef(null);
  if (!inputIdRef.current) {
    inputIdRef.current = `preset-color-${Math.random().toString(36).slice(2, 9)}`;
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
          <span className="main-colors__swatch" style={{ backgroundColor: color }} />
        </div>
      ))}

      <div className="main-colors__custom">
        <div
          className={`color color-999${isCustomColor ? ' active' : ''}`}
          onClick={handleCustomClick}
        >
          <span className="main-colors__swatch" style={{ backgroundColor: currentColor }} />
        </div>
        <span className="main-colors__custom-label">カスタム</span>
      </div>
      <input
        ref={customColorRef}
        id={inputIdRef.current}
        type="color"
        value={currentColor}
        onChange={(e) => onChange(e.target.value)}
        style={{ visibility: 'hidden', width: '0px', height: '0px' }}
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
