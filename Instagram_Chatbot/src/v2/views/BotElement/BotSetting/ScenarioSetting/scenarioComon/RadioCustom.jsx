import React from 'react';

const RadioCustom = ({
  id,
  label,
  value = false,
  onChange,
  className,
  styleSpan,
  disabled = false,
}) => (
  <React.Fragment>
    <div
      onClick={() => { onChange(!value); }}
      className={`ss-user-setting__item-text_input-save-variable-wrapper ${className ? className : ''}`}
    >
      <input
        disabled={disabled}
        id={id}
        className="ss-radio-custom__input"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        type="radio"
        name="ss-user-setting__item-text_input-save-variable"
      />
      {label && <span style={styleSpan}>{label}</span>}
    </div>
  </React.Fragment>
);

export default RadioCustom;
