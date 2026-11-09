import React from 'react';
import PropTypes from 'prop-types';
import DesignSettingLabel from './shared/DesignSettingLabel';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

const THEME_TEXTAREA_CLASS = 'theme-field__input theme-field__input--textarea';
const THEME_HTML_PREVIEW_CLASS = 'theme-field__html-preview';
const THEME_HTML_PREVIEW_LABEL = 'プレビュー';
const DEFAULT_TEXTAREA_ROWS = 4;

const ThemeTextareaField = ({
  label,
  value,
  onChange,
  fullWidth,
  tooltipKey,
  placeholder,
  rows,
  showHtmlPreview,
}) => {
  const fieldClassName = `theme-field${fullWidth ? ' theme-field--full' : ''}`;
  const htmlValue = value || '';
  const trimmedHtml = htmlValue.trim();

  return (
    <div className={fieldClassName}>
      <DesignSettingLabel tooltip={getDesignSettingTooltip(tooltipKey)} className="theme-field__label">
        {label}
      </DesignSettingLabel>
      <div className="theme-field__control theme-field__control--stacked">
        <textarea
          className={THEME_TEXTAREA_CLASS}
          value={htmlValue}
          placeholder={placeholder}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
        />
        {showHtmlPreview && trimmedHtml ? (
          <div className={THEME_HTML_PREVIEW_CLASS}>
            <div className="theme-field__html-preview-label">{THEME_HTML_PREVIEW_LABEL}</div>
            <div
              className="theme-field__html-preview-body"
              dangerouslySetInnerHTML={{ __html: trimmedHtml }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

ThemeTextareaField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  tooltipKey: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  showHtmlPreview: PropTypes.bool,
};

ThemeTextareaField.defaultProps = {
  value: '',
  fullWidth: false,
  tooltipKey: '',
  placeholder: '',
  rows: DEFAULT_TEXTAREA_ROWS,
  showHtmlPreview: false,
};

export default ThemeTextareaField;
