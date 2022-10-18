import React, { useEffect, useState } from 'react';

const InputNum = ({ id, value, onChange, placeholder, max = 9999999, min = 0, className, disabled = false }) => {

    return (
        <React.Fragment>            
            <input
                id={id}
                max={max}
                min={min}
                type="number"
                name="ss-user-setting__name"
                placeholder={placeholder}
                className={`ss-input-value ${className}`}
                onChange={e => onChange(e.target.value)}
                value={value}
                disabled={disabled}
            />
        </React.Fragment>
    )
}


export default InputNum;