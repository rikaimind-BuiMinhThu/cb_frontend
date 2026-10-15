import React from 'react';
import PropTypes from 'prop-types';
import DesignSettingLabel from './shared/DesignSettingLabel';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

const ThemeNumberField = ({
  label, value, onChange, suffix, fullWidth, tooltipKey, min, max,
}) => {
  const fieldClassName = `theme-field${fullWidth ? ' theme-field--full' : ''}`;
  const numericValue = String(value || '').replace(/px$/i, '');

  return (
    <div className={fieldClassName}>
      <DesignSettingLabel tooltip={getDesignSettingTooltip(tooltipKey)} className="theme-field__label">
        {label}
      </DesignSettingLabel>
      <div className="theme-field__control theme-field__control--compact">
        <input
          type="number"
          min={min}
          max={max}
          className="theme-field__input theme-field__input--number"
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
  tooltipKey: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
};

ThemeNumberField.defaultProps = {
  value: '',
  suffix: 'px',
  fullWidth: false,
  tooltipKey: '',
  min: 8,
  max: 32,
};

export default ThemeNumberField;
