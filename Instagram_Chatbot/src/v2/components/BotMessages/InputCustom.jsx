import React, { useState } from 'react';
import { MDBIcon } from 'mdbreact';
import CheckboxCustom from './CheckboxCustom';
import {
  isFloatPlaceholderEnabled,
  usePreviewTheme,
} from 'v2/views/Preview/PreviewComponent/PreviewThemeContext';
import './InputCustom.css';

const USE_DROPDOWN_LABEL = 'Use the dropdown';
const FIELD_FLOAT_CLASS = 'field-float';
const FIELD_FLOAT_FILLED_CLASS = 'field-float field-float--filled';
const FIELD_FLOAT_LABEL_CLASS = 'field-float__label';

const resolvePasswordToggleClass = (withClear) => {
  if (withClear) return 'ss-password-toggle-icon ss-password-toggle-icon--with-clear';
  if (withClear === false) return 'ss-password-toggle-icon ss-password-toggle-icon--no-clear';
  return 'ss-password-toggle-icon ss-password-toggle-icon--default';
};

const InputCustom = ({
  id,
  type = "text",
  value,
  maxLength = 200,
  onChange,
  placeholder,
  className,
  label,
  icon,
  onClickIcon,
  classIcon,
  handleCheckBox,
  valueCheckbox = false,
  style,
  classLabel,
  labelClassName,
  disabled = false,
  inline = true,
  onKeyPress,
  pattern,
  onPaste,
  readOnly = false,
  useFukushashiki = false,
  editableLabel = false,
  onLabelChange,
  labelValue,
  inputMode = "text",
  clearable = false,
  containerClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const themeSettings = usePreviewTheme();
  const useFloat = isFloatPlaceholderEnabled(themeSettings) && Boolean(placeholder);
  const resolvedClassLabel = classLabel || labelClassName;
  const hasValue = Boolean(value);
  const floatWrapperClass = hasValue ? FIELD_FLOAT_FILLED_CLASS : FIELD_FLOAT_CLASS;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const passwordFieldClass = type === 'password' ? 'ss-input-custom-field--password' : '';
  const clearableFieldClass = type !== 'password' && clearable ? 'ss-input-custom-field--with-clear' : '';
  const inputFieldClassName = [
    'ss-input-custom-field',
    passwordFieldClass,
    clearableFieldClass,
    className,
  ].filter(Boolean).join(' ');

  const renderInputField = (withClear) => {
    const inputNode = (
      <div className={`ss-input-custom-container ${containerClassName}`.trim()}>
        <input
          {...props}
          id={id}
          maxLength={maxLength}
          type={type === 'password' && showPassword ? 'text' : type}
          inputMode={inputMode}
          onPaste={onPaste}
          pattern={pattern}
          onKeyPress={onKeyPress}
          name="ss-user-setting__item-text_input-use-api"
          className={`ss-input-value ${!useFukushashiki ? 'ss-user-setting-item' : ''} ${inputFieldClassName}`}
          placeholder={useFloat ? '' : placeholder}
          disabled={disabled}
          value={value ?? ''}
          style={style}
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
          onCompositionStart={(e) => props?.onCompositionStart?.(e)}
          onCompositionEnd={(e) => props?.onCompositionEnd?.(e)}
        />
        {type === 'password' && (
          <MDBIcon
            fas
            icon={showPassword ? 'eye-slash' : 'eye'}
            onClick={handleTogglePassword}
            className={resolvePasswordToggleClass(withClear)}
          />
        )}
        {withClear && (
          <MDBIcon
            fas
            icon="times"
            onClick={() => onChange('')}
            className="ss-clear-input-icon"
          />
        )}
      </div>
    );

    if (!useFloat) return inputNode;

    return (
      <div className={floatWrapperClass}>
        <span className={FIELD_FLOAT_LABEL_CLASS}>{placeholder}</span>
        {inputNode}
      </div>
    );
  };

  const labelElementClassName = [
    resolvedClassLabel,
    inline === false ? 'ss-input-custom-label--block' : 'ss-input-custom-label--inline',
    'ss-input-custom-label',
  ].filter(Boolean).join(' ');

  return (
    <React.Fragment>
      {editableLabel ? (
        <input
          {...props}
          type="text"
          inputMode={inputMode}
          value={labelValue ?? ''}
          onChange={e => onLabelChange(e.target.value)}
          className={`ss-input-custom-editable-label ${resolvedClassLabel || ''}`}
        />
      ) : (
        label && (
          <div className={labelElementClassName}>
            {label}
          </div>
        )
      )}
      {clearable ? renderInputField(true) : renderInputField(false)}
      {handleCheckBox && (
        <CheckboxCustom
          label={USE_DROPDOWN_LABEL}
          className="ss-user-setting-checkbox-custom"
          onChange={value => handleCheckBox(value)}
          value={valueCheckbox}
        />
      )}
      {icon && (
        <MDBIcon
          className={`ss-input-custom-icon ${classIcon ? classIcon : 'ss-plus-circle-option-icon'}`}
          onClick={onClickIcon}
          fas
          icon={icon}
        />
      )}
    </React.Fragment>
  );
};

export default InputCustom;
