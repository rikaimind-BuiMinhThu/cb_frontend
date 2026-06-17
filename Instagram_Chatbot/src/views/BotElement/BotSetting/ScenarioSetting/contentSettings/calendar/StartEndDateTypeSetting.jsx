import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import InputNum from '../../scenarioComon/InputNum';
import DatePickerCustom from '../../scenarioComon/DatePickerCustom';
import { CALENDAR_SETTING_LABELS } from '../../constants/scenarioSettingLabels';
import { buildCalendarSettingContext } from './calendarSettingContext';

const StartEndDateTypeSetting = (props) => {
  const {
    calendar,
    changeCalendar,
    changeCalendarNested,
    handleDisableDateCalendar,
    handleDisableEndDateCalendar,
  } = buildCalendarSettingContext(props);

  const renderSpecifiedPeriod = () => (
    <>
      <div className="ss-user-setting__item-bottom-flex-start">
        <span className="ss-user-setting-label ss-calendar-setting__fixed-date-label">
          {CALENDAR_SETTING_LABELS.specifiedPeriod}
        </span>
        <InputNum
          placeholder="0000"
          className="ss-user-setting-input-limit-character ss-calendar-setting__specified-period-input"
          min={1}
          max={calendar[calendar.type].specified_period_to}
          onChange={changeCalendarNested(calendar.type, 'specified_period_from')}
          value={calendar[calendar.type].specified_period_from}
        />
        <span className="ss-calendar-setting__date-range-separator">~</span>
        <InputNum
          placeholder="0000"
          className="ss-user-setting-input-limit-character ss-calendar-setting__specified-period-input"
          min={calendar[calendar.type].specified_period_from}
          max={9999}
          onChange={changeCalendarNested(calendar.type, 'specified_period_to')}
          value={calendar[calendar.type].specified_period_to}
        />
      </div>
      <div className="ss-user-setting__item-bottom-flex-start ss-calendar-setting__specified-period-note">
        <div>
          <span className="ss-user-setting-label ss-calendar-setting__range-note--muted">
            {CALENDAR_SETTING_LABELS.specifiedPeriodHint}
          </span>
        </div>
      </div>
    </>
  );

  const renderDatePickers = () => (
    <div className="ss-user-setting__item-bottom ss-calendar-setting__start-end-pickers">
      <DatePickerCustom
        className="ss-calendar-setting__start-end-picker"
        disabledDate={(current) => handleDisableDateCalendar(current, calendar)}
        value={calendar.start_date_test ? moment(calendar.start_date_test, 'YYYY-MM-DD') : null}
        onChange={(date, dateString) => changeCalendar('start_date_test')(dateString)}
      />
      <DatePickerCustom
        className="ss-calendar-setting__start-end-picker"
        disabledDate={(current) => handleDisableEndDateCalendar(current, calendar)}
        value={calendar.end_date_test ? moment(calendar.end_date_test, 'YYYY-MM-DD') : null}
        onChange={(date, dateString) => changeCalendar('end_date_test')(dateString)}
      />
    </div>
  );

  return (
    <>
      {renderSpecifiedPeriod()}
      {renderDatePickers()}
    </>
  );
};

StartEndDateTypeSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
};

export default StartEndDateTypeSetting;
