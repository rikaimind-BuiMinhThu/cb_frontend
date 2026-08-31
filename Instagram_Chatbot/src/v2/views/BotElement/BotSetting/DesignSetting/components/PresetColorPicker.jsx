import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MAIN_COLORS } from '../constants/designChatbotConstants';
import { expandHexColor, hexColorsEqual, isCssHexColor } from '../utils/designThemeUtils';

const NATIVE_COLOR_FALLBACK = '#000000';

const toCommittedColor = (color) => {
  const expanded = expandHexColor(color);
  if (isCssHexColor(expanded)) return expanded;
  return '';
};

const PresetColorPicker = ({ value, onChange, presets = MAIN_COLORS, showHex = true }) => {
  const customColorRef = useRef(null);
  const inputIdRef = useRef(null);
  if (!inputIdRef.current) {
    inputIdRef.current = `preset-color-${Math.random().toString(36).slice(2, 9)}`;
  }

  const expandedValue = expandHexColor(value);
  const hasHex = isCssHexColor(expandedValue);
  const nativeColor = hasHex ? expandedValue : NATIVE_COLOR_FALLBACK;
  const presetIndex = presets.findIndex((color) => hexColorsEqual(color, expandedValue));
  const isCustomColor = presetIndex === -1;
  const hexInputValue = /^#[0-9a-fA-F]{6}$/.test(String(value || '').trim())
    ? String(value).trim()
    : (hasHex ? expandedValue : (value || ''));
  const swatchColor = hasHex
    ? expandedValue
    : (value && value !== 'transparent' ? value : 'transparent');

  const [hexDraft, setHexDraft] = useState(hexInputValue);

  useEffect(() => {
    setHexDraft(hexInputValue);
  }, [hexInputValue]);

  const commitColor = (color) => {
    const nextColor = toCommittedColor(color);
    if (!nextColor) return;
    onChange(nextColor);
  };

  const handlePresetClick = (color) => {
    commitColor(color);
  };

  const handleCustomClick = () => {
    customColorRef.current?.click();
  };

  const handleHexChange = (nextValue) => {
    setHexDraft(nextValue);
    const nextColor = toCommittedColor(nextValue);
    if (nextColor) {
      onChange(nextColor);
    }
  };

  const handleHexBlur = () => {
    const nextColor = toCommittedColor(hexDraft);
    if (nextColor) {
      onChange(nextColor);
      return;
    }
    setHexDraft(hexInputValue);
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
          <span
            className={`main-colors__swatch${value === 'transparent' ? ' main-colors__swatch--transparent' : ''}`}
            style={{ backgroundColor: swatchColor }}
          />
        </div>
        <span className="main-colors__custom-label">カスタム</span>
      </div>
      {showHex ? (
        <input
          type="text"
          className="theme-field__input theme-field__input--hex"
          value={hexDraft}
          placeholder="#ffffff"
          spellCheck={false}
          onChange={(e) => handleHexChange(e.target.value)}
          onBlur={handleHexBlur}
        />
      ) : null}
      <input
        ref={customColorRef}
        id={inputIdRef.current}
        type="color"
        value={nativeColor}
        onChange={(e) => commitColor(e.target.value)}
        style={{ visibility: 'hidden', width: '0px', height: '0px' }}
      />
    </div>
  );
};

PresetColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  presets: PropTypes.arrayOf(PropTypes.string),
  showHex: PropTypes.bool,
};

PresetColorPicker.defaultProps = {
  presets: MAIN_COLORS,
  showHex: true,
};

export default PresetColorPicker;
