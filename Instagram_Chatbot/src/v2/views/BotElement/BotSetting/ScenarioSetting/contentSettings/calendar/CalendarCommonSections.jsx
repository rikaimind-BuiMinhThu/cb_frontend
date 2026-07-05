import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Checkbox, Select } from 'antd';
import moment from 'moment';
import SelectCustom from '../../scenarioComon/SelectCustom';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputNum from '../../scenarioComon/InputNum';
import InputCustom from '../../scenarioComon/InputCustom';
import DatePickerCustom from '../../scenarioComon/DatePickerCustom';
import { dropDownTitle, typeCalendar, dataSelectDateTime } from '../../constants/scenarioFormConstants';
import {
  CALENDAR_SETTING_LABELS,
  CALENDAR_WEEKDAY_OPTIONS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';
import {
  DELIVERY_CUT_OFF_SELECT_NONE,
  deliveryCutOffTimeSelectValue,
  getCalendarPreviewRelativeRangeLabel,
  isCalendarPreviewDaysSplitEnabled,
  isCalendarPreviewRelativeRangeEnabled,
} from '../../utils/scenarioCalendarUtils';
import { buildCalendarSettingContext } from './calendarSettingContext';

const { Option } = Select;

const CalendarCommonSections = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    dataMessages,
    dataInputVar,
    setIsOpenAddVariable,
  } = props;

  const {
    calendar,
    changeCalendar,
    changeMessageField,
    handleInitialSelectionChange,
    onChangeFixedDate,
  } = buildCalendarSettingContext(props);

  const renderSaveToVariable = () => (
    <>
      <CheckboxCustom
        label={SETTING_LABELS.saveToVariable}
        onChange={changeCalendar('is_save_input_content')}
        value={calendar.is_save_input_content}
      />
      {calendar.is_save_input_content && (
        <div className="ss-user-setting__item-bottom">
          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
            <SelectCustom
              className="ss-select--full ss-select--spaced-right"
              value={calendar?.save_input_content}
              data={dataInputVar}
              keyValue="variable_name"
              nameValue="variable_name"
              onChange={changeCalendar('save_input_content')}
            />
            <Button className="ss-user-setting__select-btn-add ss-btn--no-margin" onClick={() => setIsOpenAddVariable(true)}>
              {SETTING_LABELS.add}
            </Button>
          </div>
        </div>
      )}
    </>
  );

  const renderRequire = () => (
    <CheckboxCustom
      label={SETTING_LABELS.require}
      onChange={changeCalendar('require')}
      value={calendar.require}
    />
  );

  const renderTitleAndType = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex">
        <SelectCustom
          className="ss-setting-row__col-half"
          value={calendar?.title_require}
          data={dropDownTitle}
          onChange={changeCalendar('title_require')}
        />
        <SelectCustom
          allowClear={false}
          className="ss-setting-row__col-half"
          value={calendar?.type}
          data={typeCalendar}
          onChange={changeCalendar('type')}
        />
      </div>
    </div>
  );

  const renderTitleInput = () => {
    if (calendar.title_require !== true) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          placeholder={SETTING_PLACEHOLDERS.title}
          onChange={changeCalendar('title')}
          value={calendar.title}
        />
      </div>
    );
  };

  const renderDateRange = () => (
    <div className="ss-user-setting__item-bottom-flex-start ss-calendar-setting__date-range-row">
      <span className="ss-user-setting-label ss-calendar-setting__fixed-date-label">
        {CALENDAR_SETTING_LABELS.startEndDate}
      </span>
      <DatePickerCustom
        className="ss-calendar-setting__date-range-picker"
        value={calendar.start_date ? moment(calendar.start_date, 'YYYY-MM-DD') : null}
        onChange={(date, dateString) => changeCalendar('start_date')(dateString)}
      />
      <span className="ss-calendar-setting__date-range-separator">~</span>
      <DatePickerCustom
        className="ss-calendar-setting__date-range-picker"
        value={calendar.end_date ? moment(calendar.end_date, 'YYYY-MM-DD') : null}
        onChange={(date, dateString) => changeCalendar('end_date')(dateString)}
      />
    </div>
  );

  const renderPreviewRangeHint = () => {
    const previewRel = getCalendarPreviewRelativeRangeLabel(calendar);
    if (!previewRel) return null;
    return (
      <div className="ss-user-setting__item-bottom ss-calendar-setting__preview-hint">
        {CALENDAR_SETTING_LABELS.previewRangeLabel}: {previewRel.start} ～ {previewRel.end}
      </div>
    );
  };

  const renderApiValidation = () => (
    <CheckboxCustom
      label={CALENDAR_SETTING_LABELS.useApiValidation}
      onChange={changeCalendar('use_api_input_value')}
      value={calendar.use_api_input_value}
    />
  );

  const renderInitialSelection = () => (
    <CheckboxCustom
      label={CALENDAR_SETTING_LABELS.initialSelection}
      onChange={handleInitialSelectionChange}
      value={calendar.initial_selection}
    />
  );

  const renderPreviewRelativeRange = () => (
    <>
      <div className="ss-user-setting__item-bottom ss-calendar-setting__preview-offset-wrap">
        <CheckboxCustom
          label={CALENDAR_SETTING_LABELS.previewRelativeRange}
          onChange={changeCalendar('preview_relative_range_enabled')}
          value={isCalendarPreviewRelativeRangeEnabled(calendar)}
        />
      </div>
      {isCalendarPreviewRelativeRangeEnabled(calendar) && renderPreviewOffsetControls()}
    </>
  );

  const renderPreviewOffsetControls = () => (
    <div className="ss-user-setting__calendar-preview-offset-wrap">
      <div className="ss-user-setting__calendar-preview-offset-row">
        <span className="ss-user-setting-label ss-calendar-setting__split-label">
          {CALENDAR_SETTING_LABELS.daysFromToday}
        </span>
        <InputNum
          placeholder="0"
          className="ss-calendar-setting__preview-offset-input"
          min={Number.MIN_SAFE_INTEGER}
          max={Number.MAX_SAFE_INTEGER}
          disabled={isCalendarPreviewDaysSplitEnabled(calendar)}
          onChange={changeCalendar('preview_days_from_today')}
          value={calendar.preview_days_from_today ?? 0}
        />
      </div>
      <div className="ss-user-setting__item-bottom ss-calendar-setting__preview-offset-wrap">
        <CheckboxCustom
          label={CALENDAR_SETTING_LABELS.businessCalendarSplit}
          onChange={(value) => {
            if (value === true || value === 1) {
              const total = Number(calendar.preview_days_from_today) || 0;
              changeCalendar('preview_days_split_enabled')(true);
              changeCalendar('preview_business_days')(0);
              changeCalendar('preview_calendar_days')(total);
            } else {
              changeCalendar('preview_days_split_enabled')(false);
            }
          }}
          value={isCalendarPreviewDaysSplitEnabled(calendar)}
        />
      </div>
      {isCalendarPreviewDaysSplitEnabled(calendar) && renderBusinessCalendarSplit()}
      <div className="ss-user-setting__calendar-preview-offset-row">
        <span className="ss-user-setting-label ss-calendar-setting__split-label">
          {CALENDAR_SETTING_LABELS.consecutiveDays}
        </span>
        <InputNum
          placeholder="0"
          className="ss-calendar-setting__preview-offset-input"
          min={Number.MIN_SAFE_INTEGER}
          max={Number.MAX_SAFE_INTEGER}
          onChange={changeCalendar('preview_days_relative_to_end_date')}
          value={calendar.preview_days_relative_to_end_date ?? 0}
        />
      </div>
    </div>
  );

  const renderBusinessCalendarSplit = () => (
    <>
      <div className="ss-calendar-setting__split-panel">
        <div className="ss-calendar-setting__split-equation">
          <span className="ss-calendar-setting__split-label">=</span>
          <div className="ss-calendar-setting__split-column">
            <span className="ss-user-setting-label ss-calendar-setting__split-label">
              {CALENDAR_SETTING_LABELS.businessDays}
            </span>
            <div className="ss-calendar-setting__split-input-row">
              <InputNum
                placeholder="0"
                className="ss-calendar-setting__preview-offset-input"
                min={Number.MIN_SAFE_INTEGER}
                max={Number.MAX_SAFE_INTEGER}
                onChange={(v) => {
                  const businessDays = Number(v) || 0;
                  const calendarDays = Number(calendar.preview_calendar_days) || 0;
                  changeCalendar('preview_business_days')(businessDays);
                  changeCalendar('preview_days_from_today')(businessDays + calendarDays);
                }}
                value={calendar.preview_business_days ?? 0}
              />
              <span className="ss-calendar-setting__split-hint">{CALENDAR_SETTING_LABELS.businessDaysHint}</span>
            </div>
          </div>
          <span className="ss-calendar-setting__split-label">+</span>
          <div className="ss-calendar-setting__split-column">
            <span className="ss-user-setting-label ss-calendar-setting__split-label">
              {CALENDAR_SETTING_LABELS.calendarDays}
            </span>
            <div className="ss-calendar-setting__split-input-row">
              <InputNum
                placeholder="0"
                className="ss-calendar-setting__preview-offset-input"
                min={Number.MIN_SAFE_INTEGER}
                max={Number.MAX_SAFE_INTEGER}
                onChange={(v) => {
                  const calendarDays = Number(v) || 0;
                  const businessDays = Number(calendar.preview_business_days) || 0;
                  changeCalendar('preview_calendar_days')(calendarDays);
                  changeCalendar('preview_days_from_today')(businessDays + calendarDays);
                }}
                value={calendar.preview_calendar_days ?? 0}
              />
              <span className="ss-calendar-setting__split-hint">{CALENDAR_SETTING_LABELS.calendarDaysHint}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="ss-user-setting__item-bottom ss-calendar-setting__preview-offset-wrap">
        <div className="ss-user-setting-label ss-calendar-setting__split-label ss-field-label--bold">
          {CALENDAR_SETTING_LABELS.cutOffTime}
        </div>
        <Select
          className="ss-calendar-setting__cutoff-select"
          showSearch
          optionFilterProp="children"
          value={deliveryCutOffTimeSelectValue(calendar)}
          onChange={(val) => {
            const saved = val === DELIVERY_CUT_OFF_SELECT_NONE ? '' : val;
            changeCalendar('preview_delivery_cut_off_time')(saved);
          }}
          getPopupContainer={(trigger) => trigger.parentNode}
        >
          <Option value={DELIVERY_CUT_OFF_SELECT_NONE}>{CALENDAR_SETTING_LABELS.cutOffNone}</Option>
          {Array.from({ length: 24 }, (_, h) => (
            <Option key={h} value={`${String(h).padStart(2, '0')}:00`}>
              {`${h}:00`}
            </Option>
          ))}
        </Select>
        <div className="ss-calendar-setting__cutoff-hint">{CALENDAR_SETTING_LABELS.cutOffTimeHint}</div>
      </div>
      <div className="ss-user-setting__item-bottom ss-calendar-setting__preview-offset-wrap">
        <div className="ss-user-setting-label ss-calendar-setting__split-label ss-field-label--bold">
          {CALENDAR_SETTING_LABELS.closedWeekdays}
        </div>
        <div className="ss-user-setting-label ss-calendar-setting__split-label">{CALENDAR_SETTING_LABELS.weekdaySetting}</div>
        <div className="ss-calendar-setting__weekday-row">
          {CALENDAR_WEEKDAY_OPTIONS.map(({ dow, label }) => {
            const closedList = Array.isArray(calendar.preview_closed_weekdays)
              ? calendar.preview_closed_weekdays
              : [];
            const checked = closedList.includes(dow);
            return (
              <Checkbox
                key={dow}
                checked={checked}
                onChange={(e) => {
                  const next = new Set(
                    Array.isArray(calendar.preview_closed_weekdays)
                      ? [...calendar.preview_closed_weekdays]
                      : [],
                  );
                  if (e.target.checked) next.add(dow);
                  else next.delete(dow);
                  changeCalendar('preview_closed_weekdays')(Array.from(next).sort((a, b) => a - b));
                }}
              >
                {label}
              </Checkbox>
            );
          })}
        </div>
      </div>
    </>
  );

  const renderNonSelectableDateTime = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-calendar-setting__non-select-wrap">
        <SelectCustom
          label={CALENDAR_SETTING_LABELS.nonSelectableDateTime}
          mode="multiple"
          className="ss-select--wide"
          labelClassName="ss-field-label--section-spaced"
          data={dataSelectDateTime}
          onChange={changeCalendar('non_select_date_time')}
          value={calendar.non_select_date_time}
        />
      </div>
    </div>
  );

  const renderFixedDate = () => (
    <>
      <div className="ss-user-setting__item-bottom-flex-start ss-user-setting__item-custom">
        <span className="ss-user-setting-label ss-calendar-setting__fixed-date-label">
          {CALENDAR_SETTING_LABELS.fixedDate}
        </span>
        <DatePickerCustom
          value={calendar.select_fixed_date ? moment(calendar.select_fixed_date, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => onChangeFixedDate(dateString)}
          className="ss-calendar-setting__fixed-date-picker"
          allowClear
        />
      </div>
      <div className="ss-user-setting__item-bottom">
        <SelectCustom
          mode="multiple"
          className="ss-calendar-setting__fixed-date-list"
          data={calendar.fixed_date}
          onChange={changeCalendar('fixed_date')}
          value={calendar.fixed_date}
        />
      </div>
    </>
  );

  const renderAggregationPeriod = () => (
    <>
      <div className="ss-user-setting__item-bottom-flex-start ss-calendar-setting__range-note">
        <div>
          <span className="ss-user-setting-label ss-calendar-setting__fixed-date-label ss-field-label--bold">
            {CALENDAR_SETTING_LABELS.nonSelectableDateRange}
          </span>
        </div>
        <div>
          <span className="ss-user-setting-label ss-calendar-setting__fixed-date-label">
            {CALENDAR_SETTING_LABELS.nonSelectableDateRangeHint}
          </span>
        </div>
      </div>
      <div className="ss-user-setting__item-bottom-flex-start">
        <span className="ss-user-setting-label ss-calendar-setting__fixed-date-label">
          {CALENDAR_SETTING_LABELS.aggregationPeriod}
        </span>
        <InputNum
          placeholder="0000"
          className="ss-user-setting-input-limit-character ss-calendar-setting__aggregation-input"
          min={Number.MIN_SAFE_INTEGER}
          max={calendar.aggregation_target_period_to}
          onChange={changeCalendar('aggregation_target_period_from')}
          value={calendar.aggregation_target_period_from}
        />
        <span className="ss-calendar-setting__date-range-separator">~</span>
        <InputNum
          placeholder="0000"
          className="ss-user-setting-input-limit-character ss-calendar-setting__aggregation-input"
          min={calendar.aggregation_target_period_from}
          max={Number.MAX_SAFE_INTEGER}
          onChange={changeCalendar('aggregation_target_period_to')}
          value={calendar.aggregation_target_period_to}
        />
      </div>
    </>
  );

  return (
    <div className="ss-user-setting__item-text_input-top ss-calendar-setting">
      {renderSaveToVariable()}
      {renderRequire()}
      {renderTitleAndType()}
      {renderTitleInput()}
      {renderDateRange()}
      {renderPreviewRangeHint()}
      {renderApiValidation()}
      {renderInitialSelection()}
      {renderPreviewRelativeRange()}
      {renderNonSelectableDateTime()}
      {renderFixedDate()}
      {renderAggregationPeriod()}
    </div>
  );
};

CalendarCommonSections.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  dataInputVar: PropTypes.array,
  setIsOpenAddVariable: PropTypes.func.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  onChangeFixedDate: PropTypes.func.isRequired,
  setDataMessages: PropTypes.func.isRequired,
};

export default CalendarCommonSections;
