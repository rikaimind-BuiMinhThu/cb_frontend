import React, { useEffect, useState } from 'react';

const Select = ({ id, data, value, onChange, keyValue }) => {
    const [valueSelected, setValueSelected] = useState(() => {
      if (keyValue === 'key') {
        let valueInitial = data.find(item => item.key === value)?.value;
        return valueInitial;
      } else {
        return value;
      }
    });
    const [isToggleSelect, setIsToggleSelect] = useState(false);
    const [indexCurSelected, setIndexCurSelected] = useState('');
    const [keySelected, setKeySelected] = useState('');
  
    function handleClickSelect(e) {
      setIsToggleSelect(prevState => !prevState);
      e.stopPropagation();
    }
  
    function handleClickOutSelect() {
      setIsToggleSelect(false);
    }
  
    useEffect(() => {
      document.addEventListener('click', handleClickOutSelect);
      // document.getElementById(`ss-select-custom-${id}`).addEventListener('click', handleClickSelect);
    }, []);
  
    const onChangeSelectValue = (value, key) => {
      setValueSelected(value);
      keyValue === 'value' ? onChange(value) : onChange(key);
    }
  
    const handleHoverSelect = (index, value) => {
      if (valueSelected !== value) {
        document.querySelector(`.ss-select-item-${index}`).style.backgroundColor = '#DDDDDD';
        document.querySelector(`.ss-select-item-${index}`).style.color = 'black';
      }
    }
  
    const handleOutSelect = (index, value) => {
      if (valueSelected !== value) {
        document.querySelector(`.ss-select-item-${index}`).style.backgroundColor = '#5997FB';
        document.querySelector(`.ss-select-item-${index}`).style.color = '#fff';
      }
    }
  
    return (
      <React.Fragment>
        <div
          onClick={(e) => handleClickSelect(e)}
          id={`ss-select-custom-${id}`} className="ss-select-custom">
          <input
            name="ss-user-setting__select-type"
            id="ss-user-setting__select-type"
            className="ss-input-value"
            value={valueSelected}
            readOnly
          ></input>
          <i className="ss-custom-arrow-select arrow down"></i>
          <div style={!isToggleSelect ? { display: 'none' } : {}} className="ss-select-value-dropdown">
            <ul className="ss-select-value-items">
              {data.map(({ value, key }, index) => {
                return (
                  <li
                    // onMouseOver={() => handleHoverSelect(index === value, value)}
                    // onMouseOut={() => handleOutSelect(index, value)}
                    className={`ss-select-item-${index}`}
                    onClick={() => onChangeSelectValue(value, key)}
                    style={valueSelected === value ? { backgroundColor: '#DDDDDD', color: 'black' } : {}}
                    key={index}
                    value={key}
                  >
                    {value}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </React.Fragment>
    )
  }

export default Select;
