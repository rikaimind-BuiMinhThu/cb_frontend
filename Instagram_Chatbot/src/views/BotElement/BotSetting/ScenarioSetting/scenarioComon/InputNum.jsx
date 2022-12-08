import React, { useEffect, useState } from 'react';
import { InputNumber } from 'antd';

const InputNum = ({ id, addonAfter, maxLength, addonBefore, label, value, onChange, placeholder, max = 9999999, min = 0, className, disabled = false, style, styleLabel, controls }) => {

    return (
        <React.Fragment>
            {label && <div style={{ ...styleLabel }}>{label}</div>}
            <InputNumber
                style={{ ...style }}
                id={id}
                max={max}
                min={min}
                maxLength={maxLength}
                addonAfter={addonAfter}
                addonBefore={addonBefore}
                controls={controls}
                placeholder={placeholder}
                className={`${addonAfter ? '': 'ss-input-value'} ${className}`}
                onChange={value => onChange(value)}
                value={value}
                disabled={disabled}
            />
        </React.Fragment>
    )
}


export default InputNum;

