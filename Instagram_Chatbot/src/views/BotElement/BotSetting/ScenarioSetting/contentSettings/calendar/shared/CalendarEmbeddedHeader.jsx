import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Select, Row, Col } from 'antd';
import moment from 'moment';

const CalendarEmbeddedHeader = ({ value, type, onChange, onTypeChange }) => {
  const start = 0;
  const end = 12;
  const monthOptions = [];
  const currentValue = value || moment();
  let current = currentValue.clone();
  const localeData = currentValue.localeData();
  const months = [];

  for (let i = 0; i < 12; i += 1) {
    current = current.month(i);
    months.push(localeData.monthsShort(current));
  }

  for (let i = start; i < end; i += 1) {
    monthOptions.push(
      <Select.Option key={i} value={i} className="month-item">
        {months[i]}
      </Select.Option>,
    );
  }

  const year = currentValue.year();
  const month = currentValue.month();
  const yearOptions = [];
  for (let i = year - 50; i < year + 50; i += 1) {
    yearOptions.push(
      <Select.Option key={i} value={i} className="year-item">
        {i}
      </Select.Option>,
    );
  }

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
