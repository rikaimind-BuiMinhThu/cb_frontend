import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Select, Row, Col } from 'antd';
import moment from 'moment';

const CalendarEmbeddedHeader = ({ value, type, onChange, onTypeChange }) => {
  const start = 0;
  const end = 12;
  const currentValue = value || moment();
  const localeData = currentValue.localeData();
  const months = Array.from({ length: 12 }, (_, monthIndex) => (
    localeData.monthsShort(currentValue.clone().month(monthIndex))
  ));

  const monthOptions = Array.from({ length: end - start }, (_, offset) => {
    const monthIndex = start + offset;
    return (
      <Select.Option key={monthIndex} value={monthIndex} className="month-item">
        {months[monthIndex]}
      </Select.Option>
    );
  });

  const year = currentValue.year();
  const month = currentValue.month();
  const yearOptions = Array.from({ length: 100 }, (_, offset) => {
    const yearValue = year - 50 + offset;
    return (
      <Select.Option key={yearValue} value={yearValue} className="year-item">
        {yearValue}
      </Select.Option>
    );
  });

  return (
    <div className="ss-calendar-setting__header-padding">
      <Row>
        <Col xs={4}>
          <Select
            size="small"
            dropdownMatchSelectWidth={false}
            className="my-year-select"
            value={year}
            onChange={(newYear) => {
              onChange(currentValue.clone().year(newYear));
            }}
          >
            {yearOptions}
          </Select>
        </Col>
        <Col xs={4}>
          <Select
            size="small"
            dropdownMatchSelectWidth={false}
            value={month}
            onChange={(newMonth) => {
              onChange(currentValue.clone().month(newMonth));
            }}
          >
            {monthOptions}
          </Select>
        </Col>
        <Col xs={4}>
          <Radio.Group size="small" onChange={(e) => onTypeChange(e.target.value)} value={type}>
            <Radio.Button value="month">月</Radio.Button>
            <Radio.Button value="year">年</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
    </div>
  );
};

CalendarEmbeddedHeader.propTypes = {
  value: PropTypes.object,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

export default CalendarEmbeddedHeader;
