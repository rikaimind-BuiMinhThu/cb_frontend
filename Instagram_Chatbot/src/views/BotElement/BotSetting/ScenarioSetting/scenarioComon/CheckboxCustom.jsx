import React, { useEffect, useState } from 'react';

const CheckboxCustom = ({ id, label, value = false, onChange, className }) => {
    const [data, setData] = useState(value || false);

    const handleChange = (valueChange) => {
        console.log(valueChange);
        setData(valueChange);
        onChange(valueChange);
    }
    return (
        <React.Fragment>
            <div onClick={() => handleChange(!data)} className={`ss-user-setting__item-text_input-save-variable-wrapper ${className}`}>
                <input
                    id={id}
                    checked={data}
                    onChange={e => handleChange(e.target.checked)}
                    type="checkbox"
                    name="ss-user-setting__item-text_input-save-variable"
                />
                {label && <span>{label}</span>}                
            </div>
        </React.Fragment>
    )
}

export default CheckboxCustom;
