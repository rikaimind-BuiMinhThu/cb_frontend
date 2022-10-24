import React, { useEffect, useState } from 'react';

const CheckboxCustom = ({ id, label, value = false, onChange, isOnChange = true, className, styleSpan, disabled = false }) => {
    const [data, setData] = useState(value || false);

    const handleChange = (valueChange) => {
        setData(valueChange);
        onChange(valueChange);
    }
    return (
        <React.Fragment>
            <div onClick={() => handleChange(!data)} className={`ss-user-setting__item-text_input-save-variable-wrapper ${className ? className : ''}`}>
                <input
                    disabled={disabled}
                    id={id}
                    style={{width: '15px'}}
                    checked={isOnChange ? data : value}
                    onChange={isOnChange ? e => handleChange(e.target.checked) : onChange}
                    type="checkbox"
                    name="ss-user-setting__item-text_input-save-variable"
                />
                {label && <span style={styleSpan} >{label}</span>}
            </div>
        </React.Fragment>
    )
}

export default CheckboxCustom;
