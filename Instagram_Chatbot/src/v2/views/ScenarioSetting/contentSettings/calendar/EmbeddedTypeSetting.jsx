import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/ja_JP';
import CalendarEmbeddedHeader from './shared/CalendarEmbeddedHeader';
import { buildCalendarSettingContext } from './calendarSettingContext';

const EmbeddedTypeSetting = (props) => {
  const { calendar, changeCalendar, handleDisableDateCalendar } = buildCalendarSettingContext(props);

  const renderEmbeddedCalendar = () => (
    <div className="ss-user-setting__item-bottom-flex-start ss-calendar-setting__embedded-wrap">
      <Calendar
        className="ss-custom-calendar ss-calendar-setting__embedded-calendar"
        fullscreen={false}
        locale={locale}
        headerRender={({ value, type, onChange, onTypeChange }) => (
          <CalendarEmbeddedHeader value={value} type={type} onChange={onChange} onTypeChange={onTypeChange} />
        )}
        value={calendar.date_selection_test ? moment(calendar.date_selection_test, 'YYYY-MM-DD') : null}
        onChange={(value) => changeCalendar('date_selection_test')(value)}
        disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
      />
    </div>
  );

  return renderEmbeddedCalendar();
};

EmbeddedTypeSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
};

export default EmbeddedTypeSetting;
