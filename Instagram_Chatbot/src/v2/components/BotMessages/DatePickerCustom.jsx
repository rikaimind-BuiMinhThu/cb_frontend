import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import localeJaJP from 'antd/es/date-picker/locale/ja_JP';
import {
  ensureMomentJaSundayFirstWeek,
  withJaShortWeekDays,
} from 'v2/utils/ensureMomentJaSundayFirstWeek';
import './InputCustom.css';

ensureMomentJaSundayFirstWeek();

const defaultPickerLocale = withJaShortWeekDays(localeJaJP);
const DATE_FORMAT_DEFAULT = 'YYYY-MM-DD';
const SP_CONTAINER_ID = 'sp-container';
const SP_CONTAINER_ID_ALT = 'sp-container1';
const SP_CONTAINER_CLASS = '.sp-container';
const SP_CONTAINER_CLASS_ALT = '.sp-container1';

export const resolveChatbotDatePickerPopupContainer = (trigger) => {
  if (!trigger || !trigger.closest) return document.body;
  return (
    trigger.closest(`#${SP_CONTAINER_ID_ALT}`)
    || trigger.closest(`#${SP_CONTAINER_ID}`)
    || trigger.closest(SP_CONTAINER_CLASS_ALT)
    || trigger.closest(SP_CONTAINER_CLASS)
    || document.body
  );
};

const defaultGetPopupContainer = (trigger) => resolveChatbotDatePickerPopupContainer(trigger);

const DatePickerCustom = ({
  allowClear = true,
  format = DATE_FORMAT_DEFAULT,
  disabledDate,
  label,
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  style,
  styleLabel,
  getPopupContainer,
  locale: localeProp,
}) => {
  const mergedLocale = localeProp && typeof localeProp === 'object'
    ? withJaShortWeekDays(localeProp)
    : defaultPickerLocale;

  return (
    <>
      {label && <div className="ss-input-custom-label" style={styleLabel}>{label}</div>}
      <DatePicker
        allowClear={allowClear}
        locale={mergedLocale}
        format={format}
        onChange={onChange}
        value={value}
        disabled={disabled}
        style={style}
        disabledDate={disabledDate}
        placeholder={placeholder}
        className={`ss-input-value ${className}`}
        getPopupContainer={getPopupContainer || defaultGetPopupContainer}
      />
    </>
  );
};

DatePickerCustom.propTypes = {
  allowClear: PropTypes.bool,
  format: PropTypes.string,
  disabledDate: PropTypes.func,
  label: PropTypes.node,
  value: PropTypes.object,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  styleLabel: PropTypes.object,
  getPopupContainer: PropTypes.func,
  locale: PropTypes.object,
};

export default DatePickerCustom;
