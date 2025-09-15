import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { InboxOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import './SelectCustom.css';

const { Option } = Select;

const SelectCustom = ({ id, allowClear = true, data, value, onChange, keyValue = "key", style, placeholder, nameValue = "value", mode, label, disabled = false, styleLabel, showSearch = true }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Native select for mobile devices
  if (isMobile) {
    return (
      <React.Fragment>
        {label && <span className="select-custom-label" style={styleLabel}>{label}</span>}
        <select
          id={id}
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
          className="select-custom-native"
          style={style}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
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
      </React.Fragment>
    );
  }

  // Antd Select for desktop
  return (
    <React.Fragment>
      {label && <span className="select-custom-label" style={styleLabel}>{label}</span>}
      <Select
        showSearch={showSearch}
        allowClear={allowClear}
        className="select-custom-antd"
        style={style}
        placeholder={placeholder}
        mode={mode ? mode : 'combobox'}
        notFoundContent={
          <div className="select-custom-not-found">
            <div className="select-custom-not-found-content">
              <InboxOutlined className="select-custom-not-found-icon"/>
              <div>データーがありません</div>
            </div>
          </div>
        }
        onChange={onChange}
        value={value || undefined}
        disabled={disabled}
        virtual={false}
        filterOption={(input, option) =>
          option.children ?
            option.children?.toLowerCase().includes(input.toLowerCase())
            :
            option.value.toLowerCase().includes(input.toLowerCase())
        }
        optionFilterProp="children"
        getPopupContainer={trigger => trigger.parentNode}
      >
        {
          data && data.map((item, index) => {            
            return (item[keyValue] || item[nameValue]) && <Option key={index} value={item[keyValue]}>{item[nameValue]}</Option>
          })
        }
      </Select>
    </React.Fragment>
  )
}

export default SelectCustom;
