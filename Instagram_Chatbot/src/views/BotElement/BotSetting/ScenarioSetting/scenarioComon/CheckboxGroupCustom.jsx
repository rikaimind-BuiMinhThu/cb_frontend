import React, { useEffect, useState } from 'react';
import { Checkbox, Row, Col } from 'antd';

const CheckboxGroupCustom = ({ id, value = [], onChange, className, disabled = false, data, style, styleCol }) => {
    return (
        <div style={{...style}}>
            <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
                <Row>
                    {data.map((item, index) => {
                        return <Col span={8} key={index} style={{display: "flex", justifyContent: 'space-around', ...styleCol}}>
                            <Checkbox value={item.key}>{item.value}</Checkbox>
                        </Col>
                    })}
                </Row>
            </Checkbox.Group>
        </div>
    )
}

export default CheckboxGroupCustom;
