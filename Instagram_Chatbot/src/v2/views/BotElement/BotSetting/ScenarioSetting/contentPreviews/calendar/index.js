import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/ja_JP';
import DatePickerCustom from '../../scenarioComon/DatePickerCustom';
import { CALENDAR_TYPES } from '../../constants/contentTypeConstants';
import {
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
} from '../../utils/scenarioCalendarUtils';
import CalendarEmbeddedHeader from '../../contentSettings/calendar/shared/CalendarEmbeddedHeader';
import '../../styles/contentPreviews/calendar.css';

const CalendarPreview = ({ content }) => {
  const calendar = content.calendar;

  const renderHeader = () => {
    if (!calendar.title_require && !calendar.require) return null;
    return (
      <div className="ss-message__content--user-calender-top ss-calendar-preview__header">
        {calendar.title_require && (
          <span className="ss-message__content--user-calender-title">{calendar.title}</span>
        )}
        {calendar.require === true && (
          <span className="ss-message__content--user-text-input-required">※必須</span>
        )}
      </div>
    );
  };

  const renderDateSelection = () => (
    <DatePickerCustom
      className="ss-calendar-preview__picker"
      value={calendar.date_selection_test ? moment(calendar.date_selection_test, 'YYYY-MM-DD') : null}
      onChange={(date, dateString) => console.log(dateString)}
      disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
    />
  );

  const renderEmbedded = () => (
    <div className="ss-message__content--user-calender-embedded ss-calendar-preview__embedded">
      <Calendar
        className="ss-custom-calendar ss-calendar-preview__embedded-calendar"
        fullscreen={false}
        locale={locale}
        headerRender={({ value, type, onChange, onTypeChange }) => (
          <CalendarEmbeddedHeader value={value} type={type} onChange={onChange} onTypeChange={onTypeChange} />
        )}
        value={calendar.date_selection_test ? moment(calendar.date_selection_test, 'YYYY-MM-DD') : null}
        onChange={(value) => console.log(value.format('DD/MM/YYYY'))}
        disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
      />
    </div>
  );

  const renderStartEndDate = () => (
    <div className="ss-calendar-preview__start-end-row">
      <DatePickerCustom
        className="ss-calendar-preview__start-end-picker"
        disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
        value={calendar.start_date_test ? moment(calendar.start_date_test, 'YYYY-MM-DD') : null}
        onChange={(date, dateString) => console.log(dateString)}
      />
      <DatePickerCustom
        className="ss-calendar-preview__start-end-picker"
        disabledDate={(current) => handleDisableEndDateCalendar(current, calendar)}
        value={calendar.end_date_test ? moment(calendar.end_date_test, 'YYYY-MM-DD') : null}
        onChange={(date, dateString) => console.log(dateString)}
      />
    </div>
  );

  const renderTypePreview = () => {
    switch (calendar.type) {
      case CALENDAR_TYPES.DATE_SELECTION:
        return renderDateSelection();
      case CALENDAR_TYPES.EMBEDDED:
        return renderEmbedded();
      case CALENDAR_TYPES.START_END_DATE:
        return renderStartEndDate();
      default:
        return null;
    }
  };

  if (content.type !== 'calendar') return null;

  return (
    <div className="ss-calendar-preview__wrapper">
      {renderHeader()}
      {renderTypePreview()}
    </div>
  );
};

CalendarPreview.propTypes = {
  content: PropTypes.object.isRequired,
};

export default CalendarPreview;
