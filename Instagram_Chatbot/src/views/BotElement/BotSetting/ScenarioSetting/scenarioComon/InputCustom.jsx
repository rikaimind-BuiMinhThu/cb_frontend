import React from 'react';
import { MDBIcon } from 'mdbreact';
import CheckboxCustom from './CheckboxCustom';

const InputCustom = ({ id, type = "text", value, maxLength = 200, onChange, placeholder, className, label, icon, onClickIcon, classIcon, handleCheckBox, valueCheckbox = false, style, classLabel, disabled = false, styleLabel, inline = true, onKeyPress, pattern, onPaste, readOnly = false }) => {

    return (
        <React.Fragment>
            {label && <div className={classLabel} style={{ fontSize: '14px', fontWeight: '400', ...inline === false ? {width: '90%'}: {width: 'fit-content'}, ...styleLabel }}>{label}</div>}
            <input
                id={id}
                maxLength={maxLength}
                type={type}
                onPaste={onPaste}
                pattern={pattern}
                onKeyPress={onKeyPress}
                name="ss-user-setting__item-text_input-use-api"
                className={`ss-input-value ss-user-setting-item ${className ? className : ''}`}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                style={{...style}}
                onChange={e => onChange(e.target.value)}
                readOnly={readOnly}
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
