import React from 'react';
import { Checkbox, Row, Col } from 'antd';

const CheckboxGroupCustom = ({
  value = [],
  onChange,
  data,
  style,
  styleCol,
  direct = 'horizontal',
}) => (
  <div style={style}>
    <Checkbox.Group className="ss-checkbox-group" onChange={onChange} value={value}>
      {direct === 'horizontal' ? (
        <Row>
          {data.map((item, index) => (
            <Col span={8} key={index} className="ss-checkbox-group__col" style={styleCol}>
              <Checkbox value={item.key}>{item.value}</Checkbox>
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          {data.map((item, index) => (
            <Checkbox key={index} value={item.key}>{item.value}</Checkbox>
          ))}
        </div>
      )}
    </Checkbox.Group>
  </div>
);

export default CheckboxGroupCustom;
