import React, { useEffect, useState } from 'react';

const InputNum = ({ id, value, onChange, placeholder, max, min, className }) => {
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
                onChange={onChange}
                value={value}
            />
        </React.Fragment>
    )
}


export default InputNum;