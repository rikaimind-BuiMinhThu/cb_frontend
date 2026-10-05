import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePickerCustom from '../../scenarioComon/DatePickerCustom';
import { buildCalendarSettingContext } from './calendarSettingContext';

const DateSelectionTypeSetting = (props) => {
  const { calendar, changeCalendar, handleDisableDateCalendar } = buildCalendarSettingContext(props);

  const renderDatePicker = () => (
    <div className="ss-user-setting__item-bottom">
      <DatePickerCustom
        className="ss-calendar-setting__type-picker"
        value={calendar.date_selection_test ? moment(calendar.date_selection_test, 'YYYY-MM-DD') : null}
        onChange={(date, dateString) => changeCalendar('date_selection_test')(dateString)}
        disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
      />
    </div>
  );

  return renderDatePicker();
};

DateSelectionTypeSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
};

export default DateSelectionTypeSetting;
