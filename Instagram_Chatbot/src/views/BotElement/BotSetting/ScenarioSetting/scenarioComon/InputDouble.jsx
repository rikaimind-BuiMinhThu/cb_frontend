import React, { useEffect, useState } from 'react';
import { MDBIcon } from 'mdbreact';

const InputDouble = ({ id, valueLeft, valueRight, onChange, rightWidth, icon, onClickIcon, placeholder, classCustom, isReverseIcon = false, classIcon, disabled = false }) => {

    return (
        <React.Fragment>
            <div className={`ss-user-setting-double-input ${classCustom ? classCustom : ''}`}>
                {/* {icon && isReverseIcon &&
                    <MDBIcon
                        onClick={onClickIcon}
                        fas
                        icon={icon}
                        style={{marginRight: '3px'}}
                        className="ss-plus-circle-option-icon"
                    />
                } */}
                <input
                    onChange={e => onChange(e.target.value, 'left')}
                    value={valueLeft}
                    type="placeholder"
                    name="ss-user-setting__name"
                    placeholder={placeholder?.[0]}
                    disabled={disabled}
                    className="ss-user-setting__item-input-bottom ss-input-value"
                />
                <input
                    onChange={e => onChange(e.target.value, 'right')}
                    value={valueRight}
                    style={rightWidth ? { width: '50%' } : {}}
                    type="text"
                    disabled={disabled}
                    name="ss-user-setting__name"
                    placeholder={placeholder?.[1]}
                    className="ss-user-setting__item-input-bottom ss-input-value"
                />
                {icon &&
                    <MDBIcon
                        onClick={onClickIcon}
                        fas
                        icon={icon}
                        className={classIcon ? classIcon : "ss-plus-circle-option-icon"}
                    />
                }
            </div>
        </React.Fragment>
    )
}


export default InputDouble;