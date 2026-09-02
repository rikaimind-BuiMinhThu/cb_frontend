import React from 'react';
import { MDBIcon } from 'mdbreact';
import { SETTING_PLACEHOLDERS } from '../constants/scenarioSettingLabels';

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
  classIcon,
  disabled = false,
  showSecondInput = true,
  valueOnly = false,
}) => {
  const isSingle = !showSecondInput || valueOnly;
  const wrapperClassName = [
    'ss-user-setting-double-input',
    isSingle ? 'ss-user-setting-double-input--single' : '',
    rightWidth && !valueOnly ? 'ss-user-setting-double-input--right-half' : '',
    classCustom || '',
  ].filter(Boolean).join(' ');

  const rightPlaceholder = valueOnly
    ? (placeholder?.[1] || placeholder?.[0] || SETTING_PLACEHOLDERS.value)
    : placeholder?.[1];

  return (
    <div id={id} className={wrapperClassName}>
      {!valueOnly && (
        <input
          onChange={(e) => onChange(e.target.value, 'left')}
          value={valueLeft}
          type="text"
          name="ss-user-setting__name"
          placeholder={placeholder?.[0]}
          disabled={disabled}
          className="ss-user-setting__item-input-bottom ss-input-value"
        />
      )}
      {(showSecondInput || valueOnly) && (
        <input
          onChange={(e) => onChange(e.target.value, 'right')}
          value={valueRight}
          type="text"
          disabled={disabled}
          name="ss-user-setting__name"
          placeholder={rightPlaceholder}
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
};

export default InputDouble;
