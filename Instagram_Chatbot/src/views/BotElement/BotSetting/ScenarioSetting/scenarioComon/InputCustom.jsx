import React, { useState } from 'react';
import { MDBIcon } from 'mdbreact';
import CheckboxCustom from './CheckboxCustom';

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
  ...props
}) => {
  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const renderWithClearIcon = () => {
    return (
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%' }}>
        <input
          {...props}
          id={id}
          maxLength={maxLength}
          type={type === 'password' && showPassword ? 'text' : type} // Toggle type for password
          inputMode={inputMode}
          onPaste={onPaste}
          pattern={pattern}
          onKeyPress={onKeyPress}
          name="ss-user-setting__item-text_input-use-api"
          className={`ss-input-value ${!useFukushashiki ? 'ss-user-setting-item' : ''} ${className || ''}`}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          style={{ ...style, width: '100%', paddingRight: type === 'password' ? '50px' : '30px' }} // Extra padding for eye icon
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
        />
        {type === 'password' && (
          <MDBIcon
            fas
            icon={showPassword ? 'eye-slash' : 'eye'} // Toggle eye icon
            onClick={handleTogglePassword}
            style={{
              position: 'absolute',
              right: clearable ? '30px' : '10px', // Adjust position if clear icon is present
              cursor: 'pointer',
              color: '#666',
              fontSize: '14px',
            }}
            className="ss-password-toggle-icon"
          />
        )}
        {clearable && (
          <MDBIcon
            fas
            icon="times"
            onClick={() => onChange('')}
            style={{
              position: 'absolute',
              right: '10px',
              cursor: 'pointer',
              color: '#666',
              fontSize: '14px',
            }}
            className="ss-clear-input-icon"
          />
        )}
      </div>
    );
  };

  const renderWithoutClearIcon = () => {
    return (
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%' }}>
        <input
          {...props}
          id={id}
          maxLength={maxLength}
          type={type === 'password' && showPassword ? 'text' : type} // Toggle type for password
          inputMode={inputMode}
          onPaste={onPaste}
          pattern={pattern}
          onKeyPress={onKeyPress}
          name="ss-user-setting__item-text_input-use-api"
          className={`ss-input-value ${!useFukushashiki ? 'ss-user-setting-item' : ''} ${className || ''}`}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          style={{ ...style, width: '98%', paddingRight: type === 'password' ? '50px' : '30px' }} // Padding for eye icon
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
        />
        {type === 'password' && (
          <MDBIcon
            fas
            icon={showPassword ? 'eye-slash' : 'eye'} // Toggle eye icon
            onClick={handleTogglePassword}
            style={{
              position: 'absolute',
              right: '20px',
              cursor: 'pointer',
              color: '#666',
              fontSize: '14px',
            }}
            className="ss-password-toggle-icon"
          />
        )}
      </div>
    );
  };

  return (
    <React.Fragment>
      {editableLabel ? (
        <input
          {...props}
          type="text"
          inputMode={inputMode}
          value={labelValue}
          onChange={e => onLabelChange(e.target.value)}
          className={`ss-editable-label ${classLabel || ''}`}
          style={{ borderRadius: '5px', border: '1px solid gray', padding: '5px', fontSize: '14px', fontWeight: '400', width: '1%', ...styleLabel }}
        />
      ) : (
        label && (
          <div
            className={classLabel}
            style={{ fontSize: '14px', fontWeight: '400', ...inline === false ? { width: '90%' } : { width: 'fit-content' }, ...styleLabel }}
          >
            {label}
          </div>
        )
      )}
      {clearable ? renderWithClearIcon() : renderWithoutClearIcon()}
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
          style={{ width: '5%' }}
          onClick={onClickIcon}
          fas
          icon={icon}
          className={classIcon ? classIcon : 'ss-plus-circle-option-icon'}
        />
      )}
    </React.Fragment>
  );
};

export default InputCustom;