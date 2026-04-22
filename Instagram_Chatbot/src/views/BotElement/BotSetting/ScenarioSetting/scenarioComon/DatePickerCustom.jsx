import React from 'react';
import { DatePicker } from 'antd';
import localeJaJP from 'antd/es/date-picker/locale/ja_JP';
import {
  ensureMomentJaSundayFirstWeek,
  withJaShortWeekDays,
} from 'utils/ensureMomentJaSundayFirstWeek';

ensureMomentJaSundayFirstWeek();

const defaultPickerLocale = withJaShortWeekDays(localeJaJP);

export function resolveChatbotDatePickerPopupContainer(trigger) {
    if (!trigger || !trigger.closest) return document.body;
    return (
        trigger.closest("#sp-container1") ||
        trigger.closest("#sp-container") ||
        trigger.closest(".sp-container1") ||
        trigger.closest(".sp-container") ||
        document.body
    );
}

const defaultGetPopupContainer = (trigger) => resolveChatbotDatePickerPopupContainer(trigger);

const DatePickerCustom = ({
    allowClear = true,
    format = "YYYY-MM-DD",
    disabledDate,
    label,
    value,
    onChange,
    placeholder,
    className = "",
    disabled = false,
    style,
    styleLabel,
    getPopupContainer,
    locale: localeProp,
}) => {
    const mergedLocale =
        localeProp && typeof localeProp === 'object'
            ? withJaShortWeekDays(localeProp)
            : defaultPickerLocale;

    return (
        <React.Fragment>
            {label && <div style={{ ...styleLabel }}>{label}</div>}
            <DatePicker
                allowClear={allowClear}
                locale={mergedLocale}
                format={format}
                onChange={(date, dateString) => onChange(date, dateString)}
                value={value}
                disabled={disabled}
                style={{ ...style }}
                disabledDate={disabledDate}
                className={`ss-input-value ${className}`}
                getPopupContainer={getPopupContainer || defaultGetPopupContainer}
            />
        </React.Fragment>
    )
}


export default DatePickerCustom;