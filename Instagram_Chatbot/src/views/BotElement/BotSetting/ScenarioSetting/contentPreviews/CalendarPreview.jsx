import React from 'react';
import { Radio, Calendar, Select, Row, Col } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/ja_JP';
import DatePickerCustom from '../scenarioComon/DatePickerCustom';
import {
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
} from '../utils/scenarioCalendarUtils';

const CalendarPreview = ({
  content,
  message,
  indexContent,
}) => {
  const calendar = content.calendar;
  return (
    <>
      {
        content.type === 'calendar' && (
          <div style={{ marginBottom: '10px' }}>
            {(calendar.title_require || calendar.require) &&
              <div className="ss-message__content--user-calender-top" style={{ marginBottom: '0px' }}>
                {calendar.title_require &&
                  <span className="ss-message__content--user-calender-title">
                    {calendar.title}
                  </span>
                }
                {calendar.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            {/* calendar: type = 'date_selection' */}
            {calendar.type === 'date_selection' && (
              <React.Fragment>
                <DatePickerCustom
                  style={{ width: '99%', marginTop: '5px' }}
                  value={calendar.date_selection_test ? moment(calendar.date_selection_test, "YYYY-MM-DD") : null}
                  onChange={(date, dateString) => console.log(dateString)}
                  disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                />
              </React.Fragment>
            )}
            {/* calendar: type = 'embedded' */}
            {calendar.type === 'embedded' && (
              <React.Fragment>
                <div className="ss-message__content--user-calender-embedded" style={{ marginTop: '5px' }}>
                  <Calendar
                    className="ss-custom-calendar"
                    fullscreen={false}
                    locale={locale}
                    headerRender={({ value, type, onChange, onTypeChange }) => {
                      const start = 0;
                      const end = 12;
                      const monthOptions = [];
                      value = value ? value : moment();
                      let current = value.clone();
                      const localeData = value.localeData();
                      const months = [];
                      for (let i = 0; i < 12; i++) {
                        current = current.month(i);
                        months.push(localeData.monthsShort(current));
                      }

                      for (let i = start; i < end; i++) {
                        monthOptions.push(
                          <Select.Option key={i} value={i} className="month-item">
                            {months[i]}
                          </Select.Option>,
                        );
                      }

                      const year = value.year();
                      const month = value.month();
                      const options = [];
                      for (let i = year - 50; i < year + 50; i += 1) {
                        options.push(
                          <Select.Option key={i} value={i} className="year-item">
                            {i}
                          </Select.Option>,
                        );
                      }
                      return (
                        <div style={{ padding: 8 }}>
                          <Row gutter={8}>
                            <Col>
                              <Select
                                size="small"
                                dropdownMatchSelectWidth={false}
                                className="my-year-select"
                                value={year}
                                onChange={(newYear) => {
                                  const now = value.clone().year(newYear);
                                  onChange(now);
                                }}
                              >
                                {options}
                              </Select>
                            </Col>
                            <Col>
                              <Select
                                size="small"
                                dropdownMatchSelectWidth={false}
                                value={month}
                                onChange={(newMonth) => {
                                  const now = value.clone().month(newMonth);
                                  onChange(now);
                                }}
                              >
                                {monthOptions}
                              </Select>
                            </Col>
                            <Col>
                              <Radio.Group
                                size="small"
                                onChange={(e) => onTypeChange(e.target.value)}
                                value={type}
                              >
                                <Radio.Button value="month">月</Radio.Button>
                                <Radio.Button value="year">年</Radio.Button>
                              </Radio.Group>
                            </Col>
                          </Row>
                        </div>
                      );
                    }}
                    style={{ top: '20px', width: '300px', border: '1px solid grey' }}
                    value={calendar.date_selection_test ? moment(calendar.date_selection_test, "YYYY-MM-DD") : null}
                    onChange={value => console.log(value.format("DD/MM/YYYY"))}
                    disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                  />
                </div>
              </React.Fragment>
            )}
            {/* calendar: type = 'start_end_date' */}
            {calendar.type === 'start_end_date' && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <DatePickerCustom
                  style={{ width: '49%', marginTop: '5px' }}
                  disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
                  value={calendar.start_date_test ? moment(calendar.start_date_test, "YYYY-MM-DD") : null}
                  onChange={(date, dateString) => console.log(dateString)}
                />
                <DatePickerCustom
                  style={{ width: '49%', marginTop: '5px' }}
                  disabledDate={(current) => handleDisableEndDateCalendar(current, calendar)}
                  value={calendar.end_date_test ? moment(calendar.end_date_test, "YYYY-MM-DD") : null}
                  onChange={(date, dateString) => console.log(dateString)}
                />
              </div>
            )}
          </div>
        )
      }
    </>
  );
};

export default CalendarPreview;
