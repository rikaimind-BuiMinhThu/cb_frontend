import React, { useEffect, useState } from 'react';
import { InputNumber } from 'antd';

const InputNum = ({ id, value, onChange, placeholder, max = 9999999, min = 0, className, disabled = false }) => {

    return (
        <React.Fragment>            
            <InputNumber
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