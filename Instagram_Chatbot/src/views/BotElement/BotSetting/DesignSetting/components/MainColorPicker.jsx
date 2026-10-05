import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { MAIN_COLORS } from '../constants/designChatbotConstants';

const MainColorPicker = ({ mainColor, onChange }) => {
  const customColorRef = useRef(null);
  const presetIndex = MAIN_COLORS.indexOf(mainColor);
  const isCustomColor = presetIndex === -1;

  const handlePresetClick = (index, color) => {
    onChange(color);
  };

  const handleCustomClick = () => {
    customColorRef.current?.click();
  };

  return (
    <div className="main-colors">
      {MAIN_COLORS.map((color, index) => (
        <div
          key={color}
          className={`color color-${index}${!isCustomColor && presetIndex === index ? ' active' : ''}`}
          onClick={() => handlePresetClick(index, color)}
        >
          <span style={{ backgroundColor: color }} />
        </div>
      ))}

      <div
        className={`color color-999${isCustomColor ? ' active' : ''}`}
        style={{ position: 'relative' }}
        onClick={handleCustomClick}
      >
        <span style={{ backgroundColor: mainColor }} />
        <span style={{ position: 'absolute', bottom: '-35px', width: '60px' }}>カスタム</span>
      </div>
      <input
        ref={customColorRef}
        id="custom-color"
        type="color"
        value={mainColor}
        onChange={(e) => onChange(e.target.value)}
        style={{ visibility: 'hidden', width: '0px', height: '0px' }}
      />
    </div>
  );
};

MainColorPicker.propTypes = {
  mainColor: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MainColorPicker;
