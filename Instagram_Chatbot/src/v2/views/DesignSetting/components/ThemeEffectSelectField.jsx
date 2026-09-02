import React from 'react';
import PropTypes from 'prop-types';
import { FIELD_FOCUS_EFFECT_OPTIONS } from '../constants/designThemeConstants';
import { normalizeFieldFocusEffect } from 'v2/views/DesignSetting/utils/designThemeUtils';
import DesignSettingLabel from './shared/DesignSettingLabel';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

const ThemeEffectSelectField = ({
  label,
  value,
  onChange,
  fullWidth,
  tooltipKey,
  options,
  normalizeValue,
}) => {
  const effectOptions = options || FIELD_FOCUS_EFFECT_OPTIONS;
  const normalize = normalizeValue || normalizeFieldFocusEffect;

  return (
    <div className={`theme-field${fullWidth ? ' theme-field--full' : ''}`}>
      <DesignSettingLabel tooltip={getDesignSettingTooltip(tooltipKey)} className="theme-field__label">
        {label}
      </DesignSettingLabel>
      <div className="theme-field__control">
        <select
          className="theme-field__select"
          value={normalize(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          {effectOptions.map(({ id, label: optionLabel }) => (
            <option key={id} value={id}>
              {optionLabel}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

ThemeEffectSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  tooltipKey: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  normalizeValue: PropTypes.func,
};

ThemeEffectSelectField.defaultProps = {
  value: 'outline_soft',
  fullWidth: false,
  tooltipKey: '',
  options: null,
  normalizeValue: null,
};

export default ThemeEffectSelectField;
