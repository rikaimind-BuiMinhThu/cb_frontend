import React from 'react';
import PropTypes from 'prop-types';
import DesignSettingLabel from './shared/DesignSettingLabel';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

const THEME_TEXT_INPUT_CLASS = 'theme-field__input theme-field__input--text';

const ThemeTextField = ({
  label, value, onChange, fullWidth, tooltipKey, placeholder,
}) => {
  const fieldClassName = `theme-field${fullWidth ? ' theme-field--full' : ''}`;

  return (
    <div className={fieldClassName}>
      <DesignSettingLabel tooltip={getDesignSettingTooltip(tooltipKey)} className="theme-field__label">
        {label}
      </DesignSettingLabel>
      <div className="theme-field__control">
        <input
          type="text"
          className={THEME_TEXT_INPUT_CLASS}
          value={value || ''}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};

ThemeTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  tooltipKey: PropTypes.string,
  placeholder: PropTypes.string,
};

ThemeTextField.defaultProps = {
  value: '',
  fullWidth: false,
  tooltipKey: '',
  placeholder: '',
};

export default ThemeTextField;
