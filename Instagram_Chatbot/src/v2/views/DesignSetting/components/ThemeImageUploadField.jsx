import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import DesignSettingLabel from './shared/DesignSettingLabel';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';
import {
  THEME_IMAGE_FILE_ACCEPT,
  THEME_IMAGE_REMOVE_LABEL,
  THEME_IMAGE_SELECT_LABEL,
  THEME_IMAGE_UPLOAD_ALT,
} from '../constants/designThemeConstants';

const ThemeImageUploadField = ({
  label,
  value,
  onChange,
  fullWidth,
  tooltipKey,
}) => {
  const inputRef = useRef(null);
  const fieldClassName = `theme-field${fullWidth ? ' theme-field--full' : ''}`;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className={fieldClassName}>
      <DesignSettingLabel tooltip={getDesignSettingTooltip(tooltipKey)} className="theme-field__label">
        {label}
      </DesignSettingLabel>
      <div className="theme-field__control theme-field__control--image">
        {value ? (
          <div className="theme-field__image-preview">
            <img src={value} alt={THEME_IMAGE_UPLOAD_ALT} className="theme-field__image-preview-img" />
            <button
              type="button"
              className="theme-field__image-remove"
              onClick={() => onChange('')}
            >
              {THEME_IMAGE_REMOVE_LABEL}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="theme-field__image-select"
            onClick={() => inputRef.current?.click()}
          >
            {THEME_IMAGE_SELECT_LABEL}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={THEME_IMAGE_FILE_ACCEPT}
          className="theme-field__image-input"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

ThemeImageUploadField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  tooltipKey: PropTypes.string,
};

ThemeImageUploadField.defaultProps = {
  value: '',
  fullWidth: false,
  tooltipKey: '',
};

export default ThemeImageUploadField;
