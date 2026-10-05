import React from 'react';
import PropTypes from 'prop-types';
import { FIELD_FOCUS_EFFECT_OPTIONS } from '../constants/designThemeConstants';
import { normalizeFieldFocusEffect } from '../utils/designThemeUtils';

const ThemeEffectSelectField = ({ label, value, onChange, fullWidth }) => (
  <div className={`theme-field${fullWidth ? ' theme-field--full' : ''}`}>
    <label className="theme-field__label">{label}</label>
    <select
      className="theme-field__select"
      value={normalizeFieldFocusEffect(value)}
      onChange={(e) => onChange(e.target.value)}
    >
      {FIELD_FOCUS_EFFECT_OPTIONS.map(({ id, label: optionLabel }) => (
        <option key={id} value={id}>
          {optionLabel}
        </option>
      ))}
    </select>
  </div>
);

ThemeEffectSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
};

ThemeEffectSelectField.defaultProps = {
  value: 'outline_soft',
  fullWidth: false,
};

export default ThemeEffectSelectField;
