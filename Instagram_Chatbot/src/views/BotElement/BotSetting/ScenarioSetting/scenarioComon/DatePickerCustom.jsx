import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/ja_JP';

const DatePickerCustom = ({ allowClear = true, format = "YYYY年MM月DD日", disabledDate, label, value, onChange, placeholder, className = "", disabled = false, style, styleLabel }) => {

    return (
        <React.Fragment>
            {label && <div style={{ ...styleLabel }}>{label}</div>}
            <DatePicker
                allowClear={allowClear}
                locale={locale}
                format={format}
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