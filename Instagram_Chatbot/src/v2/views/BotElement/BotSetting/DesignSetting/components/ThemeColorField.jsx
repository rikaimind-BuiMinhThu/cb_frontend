import React from 'react';
import PropTypes from 'prop-types';
import PresetColorPicker from './PresetColorPicker';
import DesignSettingLabel from './shared/DesignSettingLabel';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

const ThemeColorField = ({
  label,
  value,
  onChange,
  isText,
  fullWidth,
  tooltipKey,
}) => {
  const fieldClassName = `theme-field theme-field--color${fullWidth ? ' theme-field--full' : ''}`;
  const tooltip = getDesignSettingTooltip(tooltipKey);

  if (isText) {
    return (
      <div className={fieldClassName}>
        <DesignSettingLabel tooltip={tooltip} className="theme-field__label">
          {label}
        </DesignSettingLabel>
        <div className="theme-field__control">
          <input
            type="text"
            className="theme-field__input theme-field__input--text"
            value={value || ''}
            placeholder="例: 0 0 0 2px rgba(50,122,237,0.3)"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={fieldClassName}>
      <DesignSettingLabel tooltip={tooltip} className="theme-field__label">
        {label}
      </DesignSettingLabel>
      <div className="theme-field__control">
        <PresetColorPicker
          value={value || ''}
          onChange={onChange}
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
  tooltipKey: PropTypes.string,
};

ThemeColorField.defaultProps = {
  value: '',
  isText: false,
  fullWidth: false,
  tooltipKey: '',
};

export default ThemeColorField;
