import React from 'react';
import PropTypes from 'prop-types';

const ThemeNumberField = ({ label, value, onChange, suffix, fullWidth }) => {
  const fieldClassName = `theme-field${fullWidth ? ' theme-field--full' : ''}`;
  const numericValue = String(value || '').replace(/px$/i, '');

  return (
    <div className={fieldClassName}>
      <label className="theme-field__label">{label}</label>
      <div className="theme-field__control">
        <input
          type="number"
          min="8"
          max="32"
          className="theme-field__input theme-field__input--text"
          value={numericValue}
          placeholder="14"
          onChange={(e) => {
            const next = e.target.value.trim();
            onChange(next ? `${next}${suffix}` : '');
          }}
        />
        <span className="theme-field__suffix">{suffix}</span>
      </div>
    </div>
  );
};

ThemeNumberField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  suffix: PropTypes.string,
  fullWidth: PropTypes.bool,
};

ThemeNumberField.defaultProps = {
  value: '',
  suffix: 'px',
  fullWidth: false,
};

export default ThemeNumberField;
