import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './SelectCustom.css';
import { isAndroid } from 'v2/utils/deviceUtils';

const { Option } = Select;

const EMPTY_SELECT_VALUE = '';
const SELECT_MODE_COMBOBOX = 'combobox';
const SELECT_CUSTOM_NO_DATA = 'データーがありません';

const SelectCustom = ({
  id,
  allowClear = true,
  data,
  value,
  onChange,
  keyValue = 'key',
  style,
  placeholder,
  nameValue = 'value',
  mode,
  label,
  disabled = false,
  styleLabel,
  showSearch = true,
  className = '',
  labelClassName = '',
}) => {
  if (isAndroid()) {
    return (
      <>
        {label && (
          <span className={`select-custom-label ${labelClassName}`.trim()} style={styleLabel}>
            {label}
          </span>
        )}
        <select
          id={id}
          value={value || EMPTY_SELECT_VALUE}
          onChange={(event) => onChange && onChange(event.target.value)}
          disabled={disabled}
          className={`select-custom-native ${className}`.trim()}
          style={style}
        >
          {placeholder && (
            <option value={EMPTY_SELECT_VALUE} disabled>
              {placeholder}
            </option>
          )}
          {data && data.map((item, index) => {
            if (item[keyValue] || item[nameValue]) {
              return (
                <option key={index} value={item[keyValue]}>
                  {item[nameValue]}
                </option>
              );
            }
            return null;
          })}
        </select>
      </>
    );
  }

  return (
    <>
      {label && (
        <span className={`select-custom-label ${labelClassName}`.trim()} style={styleLabel}>
          {label}
        </span>
      )}
      <Select
        showSearch={showSearch}
        allowClear={allowClear}
        className={`select-custom-antd ${className}`.trim()}
        style={style}
        placeholder={placeholder}
        mode={mode || SELECT_MODE_COMBOBOX}
        notFoundContent={(
          <div className="select-custom-not-found">
            <div className="select-custom-not-found-content">
              <InboxOutlined className="select-custom-not-found-icon" />
              <div>{SELECT_CUSTOM_NO_DATA}</div>
            </div>
          </div>
        )}
        onChange={onChange}
        value={value || undefined}
        disabled={disabled}
        virtual={false}
        filterOption={(input, option) => (
          option.children
            ? option.children?.toLowerCase().includes(input.toLowerCase())
            : option.value.toLowerCase().includes(input.toLowerCase())
        )}
        optionFilterProp="children"
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        {data && data.map((item, index) => (
          (item[keyValue] || item[nameValue]) && (
            <Option key={index} value={item[keyValue]}>{item[nameValue]}</Option>
          )
        ))}
      </Select>
    </>
  );
};

SelectCustom.propTypes = {
  id: PropTypes.string,
  allowClear: PropTypes.bool,
  data: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  keyValue: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  nameValue: PropTypes.string,
  mode: PropTypes.string,
  label: PropTypes.node,
  disabled: PropTypes.bool,
  styleLabel: PropTypes.object,
  showSearch: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default SelectCustom;
