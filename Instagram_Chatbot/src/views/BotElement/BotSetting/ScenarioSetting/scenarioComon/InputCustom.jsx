import React, { useEffect, useState } from 'react';
import { MDBIcon } from 'mdbreact';
import CheckboxCustom from './CheckboxCustom';
import Select from './SelectCustom';

const InputCustom = ({ id, value, onChange, placeholder, className, label, icon, onClickIcon, classIcon, handleCheckBox, valueCheckbox = false, style }) => {

    return (
        <React.Fragment>
            {label && <span style={{ fontSize: '14px', fontWeight: '400', width: 'fit-content' }}>{label}</span>}
            <input
                id={id}
                type="text"
                name="ss-user-setting__item-text_input-use-api"
                className={`ss-input-value ss-user-setting-item ${className}`}
                placeholder={placeholder}
                value={value}
                style={style}
                onChange={e => onChange(e.target.value)}
            />
            {handleCheckBox &&
                <CheckboxCustom
                    label="Use the dropdown"
                    className="ss-user-setting-checkbox-custom"
                    onChange={value => handleCheckBox(value)}
                    value={valueCheckbox}
                />
            }
            {icon &&
                <MDBIcon
                    style={{ width: '5%' }}
                    onClick={onClickIcon}
                    fas
                    icon={icon}
                    className={classIcon ? classIcon : "ss-plus-circle-option-icon"}
                />
            }
        </React.Fragment>
    )
}


export default InputCustom;