import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';

const CheckboxCustom = ({ id, label, value = false, onChange, className, styleSpan, disabled = false, style }) => {
    return (
        <React.Fragment>
            <div style={{ ...style, width: 'fit-content' }} className={`ss-user-setting__item-checkbox ${className ? className : ''}`}>
                <Checkbox
                    disabled={disabled}
                    id={id}
                    // className={className ? className : ''}
                    style={{ color: '#767676' }}
                    checked={value}
                    onChange={e => onChange(e.target.checked)}
                    name="ss-user-setting__item-text_input-save-variable">
                    {label && typeof label === 'string' ? (
                      <div style={{ ...styleSpan }} dangerouslySetInnerHTML={{ __html: label }} />
                    ) : (
                      <div style={{ ...styleSpan }}>{label}</div>
                    )}
                </Checkbox>
            </div>
        </React.Fragment>
    )
}

export default CheckboxCustom;


