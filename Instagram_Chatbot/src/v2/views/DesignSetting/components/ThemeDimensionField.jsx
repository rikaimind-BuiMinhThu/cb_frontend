import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DesignSettingLabel from './shared/DesignSettingLabel';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

const parseDimensionValue = (value, fallbackUnit = 'px') => {
  if (!value || typeof value !== 'string') {
    return { numericValue: '', unit: fallbackUnit };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return { numericValue: '', unit: fallbackUnit };
  }

  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(%|px)?/);
  if (!match) {
    return { numericValue: '', unit: fallbackUnit };
  }

  return {
    numericValue: match[1],
    unit: match[2] || fallbackUnit,
  };
};

const ThemeDimensionField = ({
  label,
  value,
  onChange,
  unit,
  unitOptions,
  fullWidth,
  tooltipKey,
  min,
  max,
}) => {
  const availableUnits = unitOptions || (unit ? [unit] : ['px']);
  const defaultUnit = availableUnits[0];
  const { numericValue, unit: parsedUnit } = useMemo(
    () => parseDimensionValue(value, defaultUnit),
    [value, defaultUnit],
  );
  const selectedUnit = availableUnits.includes(parsedUnit) ? parsedUnit : defaultUnit;
  const fieldClassName = `theme-field${fullWidth ? ' theme-field--full' : ''}`;
  const showUnitSelect = availableUnits.length > 1;

  const emitValue = (nextNumeric, nextUnit) => {
    const trimmed = String(nextNumeric ?? '').trim();
    if (!trimmed) {
      onChange('');
      return;
    }
    onChange(`${trimmed}${nextUnit}`);
  };

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
          placeholder=""
          onChange={(e) => emitValue(e.target.value, selectedUnit)}
        />
        {showUnitSelect ? (
          <select
            className="theme-field__select theme-field__select--unit"
            value={selectedUnit}
            onChange={(e) => emitValue(numericValue, e.target.value)}
          >
            {availableUnits.map((unitOption) => (
              <option key={unitOption} value={unitOption}>
                {unitOption}
              </option>
            ))}
          </select>
        ) : (
          <span className="theme-field__suffix">{selectedUnit}</span>
        )}
      </div>
    </div>
  );
};

ThemeDimensionField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  unit: PropTypes.string,
  unitOptions: PropTypes.arrayOf(PropTypes.string),
  fullWidth: PropTypes.bool,
  tooltipKey: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
};

ThemeDimensionField.defaultProps = {
  value: '',
  unit: '',
  unitOptions: null,
  fullWidth: false,
  tooltipKey: '',
  min: 0,
  max: 100,
};

export default ThemeDimensionField;
