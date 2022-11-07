import React, { useEffect, useState } from 'react';

const CheckboxCustom = ({ id, label, value = false, onChange, className, styleSpan, disabled = false }) => {
    return (
        <React.Fragment>
            <div onClick={() => { onChange(!value) }} className={`ss-user-setting__item-text_input-save-variable-wrapper ${className ? className : ''}`}>
                <input
                    disabled={disabled}
                    id={id}
                    style={{ width: '15px' }}
                    checked={value}
                    onChange={e => onChange(e.target.checked)}
                    type="checkbox"
                    name="ss-user-setting__item-text_input-save-variable"
                />
                {label && <span style={styleSpan} >{label}</span>}
            </div>
        </React.Fragment>
    )
}

export default CheckboxCustom;
