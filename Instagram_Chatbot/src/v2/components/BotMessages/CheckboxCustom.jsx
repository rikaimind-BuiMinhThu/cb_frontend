import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import './InputCustom.css';

const CheckboxCustom = ({
  id,
  label,
  value = false,
  onChange,
  className,
  styleSpan,
  disabled = false,
  style,
}) => (
  <>
    <div
      style={style}
      className={`ss-user-setting__item-checkbox ${className || ''}`}
    >
      <Checkbox
        disabled={disabled}
        id={id}
        className="ss-checkbox-label-color"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
        name="ss-user-setting__item-text_input-save-variable"
      >
        {label && typeof label === 'string' ? (
          <div style={styleSpan} dangerouslySetInnerHTML={{ __html: label }} />
        ) : (
          <div style={styleSpan}>{label}</div>
        )}
      </Checkbox>
    </div>
  </>
);

CheckboxCustom.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  styleSpan: PropTypes.object,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

export default CheckboxCustom;
