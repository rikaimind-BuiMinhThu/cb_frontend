import React from 'react';
import { Checkbox, Row, Col } from 'antd';

const CHECKBOX_GROUP_COL_SPAN = 8;

const CheckboxGroupCustom = ({
  value = [],
  onChange,
  data,
  className = '',
  direct = 'horizontal',
}) => (
  <div className={className}>
    <Checkbox.Group className="ss-checkbox-group" onChange={onChange} value={value}>
      {direct === 'horizontal' ? (
        <Row>
          {data.map((item, index) => (
            <Col span={CHECKBOX_GROUP_COL_SPAN} key={item.key ?? index} className="ss-checkbox-group__col">
              <Checkbox value={item.key}>{item.value}</Checkbox>
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          {data.map((item, index) => (
            <Checkbox key={item.key ?? index} value={item.key}>{item.value}</Checkbox>
          ))}
        </div>
      )}
    </Checkbox.Group>
  </div>
);

export default CheckboxGroupCustom;
