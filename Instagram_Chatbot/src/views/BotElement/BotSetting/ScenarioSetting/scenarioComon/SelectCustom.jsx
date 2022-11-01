import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';

const { Option } = Select;

const SelectCustom = ({ id, data, value, onChange, keyValue = "key", style, placeholder, nameValue = "value", mode, label }) => {

  return (
    <React.Fragment>
      {label && <span style={{marginRight: '2%', fontSize: '14px', fontWeight: '400'}}>{label}</span>}
      <Select
        allowClear
        style={style || {width: '90%'}}
        placeholder={placeholder}
        mode={mode ? mode : 'combobox'}
        onChange={onChange}
        value={value}
      >
        {
          data && data.map((item, index) => {
            return <Option key={index} value={item[keyValue]}>{item[nameValue]}</Option>
          })
        }
      </Select>
    </React.Fragment>
  )
}

export default SelectCustom;
