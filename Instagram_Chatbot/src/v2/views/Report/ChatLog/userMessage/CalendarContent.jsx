/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';
import DatePickerCustom from 'v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/DatePickerCustom';
import locale from 'antd/es/date-picker/locale/ja_JP';
import moment from 'moment';
import { Radio, Calendar, Row, Select, Col } from 'antd';

import {
  REQUIRED_LABEL,
  PLACEHOLDER_YEAR,
  PLACEHOLDER_MONTH,
  DATE_FORMAT,
  CALENDAR_HEADER_MONTH,
  CALENDAR_HEADER_YEAR,
  CALENDAR_TYPE,
  RADIO_SIZE_SMALL,
} from './constants';


const CalendarContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
}) => {
  const calendar = content.calendar;
  if (!calendar) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(calendar.title_require || calendar.require) && (
                      <div
                        className="ss-message__content--user-calender-top chat-log-um-mb-0"
                    
                      >
                        {calendar.title_require && (
                          <span className="ss-message__content--user-calender-title">
                            {calendar.title}
                          </span>
                        )}
                        {calendar.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    {/* calendar: type = 'date_selection' */}
                    {calendar.type === CALENDAR_TYPE.DATE_SELECTION && (
                      <React.Fragment>
                        <DatePickerCustom
                          disabled={true}
                          locale={locale}
                          format={DATE_FORMAT}
                          className="chat-log-um-field-99" 
                          value={
                            calendar.date_select
                              ? moment(calendar.date_select, DATE_FORMAT)
                              : null
                          }
                          onChange={(date, dateString) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              dateString,
                              "date_select"
                            )
                          }
                          disabledDate={(current) =>
                            handleDisableDateCalendar(current, calendar)
                          }
                        />
                      </React.Fragment>
                    )}
                    {/* calendar: type = 'embedded' */}
                    {calendar.type === CALENDAR_TYPE.EMBEDDED && (
                      <React.Fragment>
                        <div
                          className="ss-message__content--user-calender-embedded chat-log-um-mt-5"
                      
                        >
                          <Calendar
                            // onLoad={
                            //   checkLoadCalendar()
                            // }
                            disabled={true}
                            className="ss-custom-calendar chat-log-um-calendar-box"
                            fullscreen={false}
                            locale={locale}
                            // format={DATE_FORMAT}
                            headerRender={({
                              value,
                              type,
                              onChange,
                              onTypeChange,
                            }) => {
                              const calendarValue = value || moment();
                              const localeData = calendarValue.localeData();
                              const months = Array.from({ length: 12 }, (_, monthIndex) => (
                                localeData.monthsShort(calendarValue.clone().month(monthIndex))
                              ));
                              const monthOptions = months.map((monthLabel, monthIndex) => (
                                <Select.Option
                                  key={monthIndex}
                                  value={monthIndex}
                                  className="month-item"
                                >
                                  {monthLabel}
                                </Select.Option>
                              ));
                              const year = calendarValue.year();
                              const month = calendarValue.month();
                              const options = Array.from({ length: 100 }, (_, offset) => {
                                const optionYear = year - 50 + offset;
                                return (
                                  <Select.Option
                                    key={optionYear}
                                    value={optionYear}
                                    className="year-item"
                                  >
                                    {optionYear}
                                  </Select.Option>
                                );
                              });
                              return (
                                <div className="chat-log-um-calendar-pad" >
                                  <Row gutter={8}>
                                    <Col>
                                      <Select
                                        size={RADIO_SIZE_SMALL}
                                        dropdownMatchSelectWidth={false}
                                        className="my-year-select"
                                        value={year}
                                        onChange={(newYear) => {
                                          const now = calendarValue.clone().year(newYear);
                                          onChange(now);
                                        }}
                                      >
                                        {options}
                                      </Select>
                                    </Col>
                                    <Col>
                                      <Select
                                        size={RADIO_SIZE_SMALL}
                                        dropdownMatchSelectWidth={false}
                                        value={month}
                                        onChange={(newMonth) => {
                                          const now = calendarValue.clone().month(newMonth);
                                          onChange(now);
                                        }}
                                      >
                                        {monthOptions}
                                      </Select>
                                    </Col>
                                    <Col>
                                      <Radio.Group
                                        size={RADIO_SIZE_SMALL}
                                        onChange={(e) =>
                                          onTypeChange(e.target.value)
                                        }
                                        value={type}
                                      >
                                        <Radio.Button value={CALENDAR_HEADER_MONTH}>
                                          {PLACEHOLDER_MONTH}
                                        </Radio.Button>
                                        <Radio.Button value={CALENDAR_HEADER_YEAR}>{PLACEHOLDER_YEAR}</Radio.Button>
                                      </Radio.Group>
                                    </Col>
                                  </Row>
                                </div>
                              );
                            }}
                            value={
                              calendar.date_select
                                ? moment(calendar.date_select, DATE_FORMAT)
                                : null
                            }
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "date_select"
                              )
                            }
                            disabledDate={(current) =>
                              handleDisableDateCalendar(current, calendar)
                            }
                          />
                        </div>
                      </React.Fragment>
                    )}
                    {/* calendar: type = 'start_end_date' */}
                    {calendar.type === CALENDAR_TYPE.START_END_DATE && (
                      <div
                        className="chat-log-um-split" 
                      >
                        <DatePickerCustom
                          disabled={true}
                          className="chat-log-um-field-half-mt" 
                          disabledDate={(current) =>
                            handleDisableDateCalendar(current, calendar)
                          }
                          value={
                            calendar.start_date_select
                              ? moment(calendar.start_date_select, DATE_FORMAT)
                              : null
                          }
                          onChange={(date, dateString) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              dateString,
                              "start_date_select"
                            )
                          }
                        />
                        <DatePickerCustom
                          disabled={true}
                          className="chat-log-um-field-half-mt" 
                          disabledDate={(current) =>
                            handleDisableEndDateCalendar(current, calendar)
                          }
                          value={
                            calendar.end_date_select
                              ? moment(calendar.end_date_select, DATE_FORMAT)
                              : null
                          }
                          onChange={(date, dateString) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              dateString,
                              "end_date_select"
                            )
                          }
                        />
                      </div>
                    )}
                    {errors?.[
                      `message${indexMessage}_content${indexContent}_${content.type}`
                    ] && (
                      <div className="chat-log-um-error" >
                        {
                          errors?.[
                            `message${indexMessage}_content${indexContent}_${content.type}`
                          ]
                        }
                      </div>
                    )}
                  </div>
  );
};

CalendarContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
  handleDisableDateCalendar: PropTypes.func,
  handleDisableEndDateCalendar: PropTypes.func,
};

export default CalendarContent;
