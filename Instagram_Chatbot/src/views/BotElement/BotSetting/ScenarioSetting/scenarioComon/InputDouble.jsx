import React from 'react';
import { MDBIcon } from 'mdbreact';

const InputDouble = ({
  id,
  valueLeft,
  valueRight,
  onChange,
  rightWidth,
  icon,
  onClickIcon,
  placeholder,
  classCustom,
  isReverseIcon = false,
  classIcon,
  disabled = false,
  style,
  showSecondInput = true,
}) => (
  <div
    style={style}
    className={[
      'ss-user-setting-double-input',
      !showSecondInput ? 'ss-user-setting-double-input--single' : '',
      classCustom || '',
    ].filter(Boolean).join(' ')}
  >
    <input
      onChange={(e) => onChange(e.target.value, 'left')}
      value={valueLeft}
      type="text"
      name="ss-user-setting__name"
      placeholder={placeholder?.[0]}
      disabled={disabled}
      className="ss-user-setting__item-input-bottom ss-input-value"
    />
    {showSecondInput && (
      <input
        onChange={(e) => onChange(e.target.value, 'right')}
        value={valueRight}
        style={rightWidth ? { width: '50%' } : {}}
        type="text"
        disabled={disabled}
        name="ss-user-setting__name"
        placeholder={placeholder?.[1]}
        className="ss-user-setting__item-input-bottom ss-input-value"
      />
    )}
    {icon && (
      <MDBIcon
        onClick={onClickIcon}
        fas
        icon={icon}
        className={classIcon || 'ss-plus-circle-option-icon'}
      />
    )}
  </div>
);

export default InputDouble;
