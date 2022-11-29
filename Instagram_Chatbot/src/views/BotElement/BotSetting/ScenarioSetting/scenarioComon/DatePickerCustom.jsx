import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';

const DatePickerCustom = ({ allowClear = true, disabledDate, label, value, onChange, placeholder, className = "", disabled = false, style, styleLabel }) => {

    return (
        <React.Fragment>
            {label && <div style={{ ...styleLabel }}>{label}</div>}
            <DatePicker
                allowClear={allowClear}
                format={"YYYY/MM/DD"}
                onChange={(date, dateString) => onChange(date, dateString)}
                value={value}
                disabled={disabled}
                style={{ ...style }}
                disabledDate={disabledDate}
                className={`ss-input-value ${className}`}
            />
        </React.Fragment>
    )
}


export default DatePickerCustom;