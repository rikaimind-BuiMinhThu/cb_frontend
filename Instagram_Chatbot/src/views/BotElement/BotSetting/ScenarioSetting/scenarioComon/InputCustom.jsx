import React, { useState } from 'react';
import { MDBIcon } from 'mdbreact';
import CheckboxCustom from './CheckboxCustom';
import './InputCustom.css';

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
  disabled = false,
  styleLabel,
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

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputFieldClassName = [
    'ss-input-custom-field',
    type === 'password' ? 'ss-input-custom-field--password' : clearable ? 'ss-input-custom-field--with-clear' : '',
    className,
  ].filter(Boolean).join(' ');

  const renderInputField = (withClear) => (
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
        placeholder={placeholder}
        disabled={disabled}
        value={value}
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
          className={`ss-password-toggle-icon ${withClear ? 'ss-password-toggle-icon--with-clear' : withClear === false ? 'ss-password-toggle-icon--no-clear' : 'ss-password-toggle-icon--default'}`}
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

  const labelClassName = [
    classLabel,
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
          value={labelValue}
          onChange={e => onLabelChange(e.target.value)}
          className={`ss-input-custom-editable-label ${classLabel || ''}`}
          style={styleLabel}
        />
      ) : (
        label && (
          <div className={labelClassName} style={styleLabel}>
            {label}
          </div>
        )
      )}
      {clearable ? renderInputField(true) : renderInputField(false)}
      {handleCheckBox && (
        <CheckboxCustom
          label="Use the dropdown"
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
