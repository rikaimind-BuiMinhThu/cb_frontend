import React from 'react';
import PropTypes from 'prop-types';

const ThemeColorField = ({ label, value, onChange, isText, fullWidth }) => {
  const fieldClassName = `theme-field${fullWidth ? ' theme-field--full' : ''}`;
  const colorValue = value || '#000000';

  if (isText) {
    return (
      <div className={fieldClassName}>
        <label className="theme-field__label">{label}</label>
        <input
          type="text"
          className="theme-field__input theme-field__input--text"
          value={value || ''}
          placeholder="例: 0 0 0 2px rgba(50,122,237,0.3)"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className={fieldClassName}>
      <label className="theme-field__label">{label}</label>
      <div className="theme-field__control">
        <label className="theme-field__swatch-wrap" aria-label={`${label}を選択`}>
          <span
            className="theme-field__swatch"
            style={{ backgroundColor: value || '#ffffff' }}
          />
          <input
            type="color"
            className="theme-field__color-picker"
            value={colorValue}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
        <input
          type="text"
          className="theme-field__input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

ThemeColorField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isText: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

ThemeColorField.defaultProps = {
  value: '',
  isText: false,
  fullWidth: false,
};

export default ThemeColorField;
