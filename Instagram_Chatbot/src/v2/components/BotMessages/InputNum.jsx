import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';
import './InputCustom.css';

const InputNum = ({
  id,
  addonAfter,
  maxLength,
  addonBefore,
  label,
  value,
  onChange,
  placeholder,
  max = 99999999,
  min = 0,
  className,
  disabled = false,
  controls,
  formatter,
  parser,
  onPaste,
  autoComplete,
}) => (
  <>
    {label && <div className="ss-input-custom-label">{label}</div>}
    <InputNumber
      id={id}
      autoComplete={autoComplete}
      max={max}
      onPaste={onPaste}
      parser={parser}
      formatter={formatter}
      min={min}
      maxLength={maxLength}
      addonAfter={addonAfter}
      addonBefore={addonBefore}
      controls={controls}
      placeholder={placeholder}
      className={`bot-messages-input-num ${addonAfter ? '' : 'ss-input-value'} ${className || ''}`}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  </>
);

InputNum.propTypes = {
  id: PropTypes.string,
  addonAfter: PropTypes.node,
  maxLength: PropTypes.number,
  addonBefore: PropTypes.node,
  label: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  controls: PropTypes.bool,
  formatter: PropTypes.func,
  parser: PropTypes.func,
  onPaste: PropTypes.func,
  autoComplete: PropTypes.string,
};

export default InputNum;
