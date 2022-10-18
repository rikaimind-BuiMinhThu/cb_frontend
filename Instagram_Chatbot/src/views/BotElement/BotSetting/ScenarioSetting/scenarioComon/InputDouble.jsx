import React, { useEffect, useState } from 'react';
import { MDBIcon } from 'mdbreact';

const InputDouble = ({ id, valueLeft, valueRight, onChange, leftWidth, icon, onClickIcon, placeholder, classCustom, isReverseIcon = false, classIcon }) => {

    return (
        <React.Fragment>
            <div className={`ss-user-setting-double-input ${classCustom}`}>
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
                    className="ss-user-setting__item-input-bottom ss-input-value"
                />
                <input
                    onChange={e => onChange(e.target.value, 'right')}
                    value={valueRight}
                    style={leftWidth ? { width: '50%' } : {}}
                    type="text"
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