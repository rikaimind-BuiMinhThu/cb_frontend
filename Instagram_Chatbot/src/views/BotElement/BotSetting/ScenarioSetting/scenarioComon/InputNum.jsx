import React, { useEffect, useState } from 'react';
import { InputNumber } from 'antd';

const InputNum = ({ id, label, value, onChange, placeholder, max = 9999999, min = 0, className, disabled = false, style }) => {

    return (
        <React.Fragment>
            {label && <div>{label}</div>}
            <InputNumber
                style={{ ...style }}
                id={id}
                max={max}
                min={min}
                placeholder={placeholder}
                className={`ss-input-value ${className}`}
                onChange={value => onChange(value)}
                value={value}
                disabled={disabled}
            />
        </React.Fragment>
    )
}


export default InputNum;