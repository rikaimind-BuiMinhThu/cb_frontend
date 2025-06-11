import React from 'react';
import { MDBIcon } from 'mdbreact';
import CheckboxCustom from './CheckboxCustom';

const InputCustom = ({ id, type = "text", value, maxLength = 200, onChange, placeholder, className, label, icon, onClickIcon, classIcon, handleCheckBox, valueCheckbox = false, style, classLabel, disabled = false, styleLabel, inline = true, onKeyPress, pattern, onPaste, readOnly = false, useFukushashiki = false, editableLabel = false, 
    onLabelChange, 
    labelValue,
    inputMode = "text"
 }) => {

    return (
        <React.Fragment>
            {editableLabel ? (
                <input
                    type="text"
                    inputmode={inputMode}
                    value={labelValue}
                    onChange={e => onLabelChange(e.target.value)}
                    className={`ss-editable-label ${classLabel || ''}`}
                    style={{ borderRadius: '5px', border: '1px solid gray',padding: '5px', fontSize: '14px', fontWeight: '400', width:'1%', ...styleLabel }}
                />
            ) : (
                label && (
                    <div 
                        className={classLabel} 
                        style={{ fontSize: '14px', fontWeight: '400', ...inline === false ? { width: '90%' } : { width: 'fit-content' }, ...styleLabel }}
                    >
                        {label}
                    </div>
                )
            )}
            <input
                id={id}
                maxLength={maxLength}
                type={type}
                inputmode={inputMode}
                onPaste={onPaste}
                pattern={pattern}
                onKeyPress={onKeyPress}
                name="ss-user-setting__item-text_input-use-api"
                className={`ss-input-value ${!useFukushashiki ? 'ss-user-setting-item' : ''} ${className || ''}`}
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
