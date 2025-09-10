import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import { InboxOutlined } from "@ant-design/icons";

const { Option } = Select;

const SelectCustom = ({ id, allowClear = true, data, value, onChange, keyValue = "key", style, placeholder, nameValue = "value", mode, label, disabled = false, styleLabel, showSearch = true }) => {
  return (
    <React.Fragment>
      {label && <span style={{ marginRight: '2%', fontSize: '14px', fontWeight: '400', ...styleLabel }}>{label}</span>}
      <Select
        showSearch={showSearch}
        allowClear={allowClear}
        style={style || { width: '90%' }}
        placeholder={placeholder}
        mode={mode ? mode : 'combobox'}
        notFoundContent={
          <div
            style={{
              height: "90px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <InboxOutlined style={{fontSize: "50px", fontWeight: "100"}}/>
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
