import moment from 'moment';

export const DELIVERY_CUT_OFF_SELECT_NONE = '__delivery_cut_off_none__';

export const mergePreviewRelativeCalendar = (calendar) => {
  if (!calendar) return null;

  const fromToday = Number(calendar.preview_days_from_today) || 0;
  const spanDays = Number(calendar.preview_days_relative_to_end_date);

  let start = moment().startOf('day').add(fromToday, 'days');
  let end = start.clone();

  if (Number.isFinite(spanDays) && spanDays !== 0) {
    end = start.clone().add(spanDays - 1, 'days');
  } else if (calendar.end_date) {
    end = moment(calendar.end_date, 'YYYY-MM-DD');
  }

  if (calendar.start_date) {
    const configuredStart = moment(calendar.start_date, 'YYYY-MM-DD');
    if (configuredStart.isValid() && start.isBefore(configuredStart)) {
      start = configuredStart.clone();
    }
  }

  if (calendar.end_date) {
    const configuredEnd = moment(calendar.end_date, 'YYYY-MM-DD');
    if (configuredEnd.isValid() && end.isAfter(configuredEnd)) {
      end = configuredEnd.clone();
    }
  }

  if (end.isBefore(start)) {
    end = start.clone();
  }

  return {
    start_date: start.format('YYYY-MM-DD'),
    end_date: end.format('YYYY-MM-DD'),
  };
};

export const getCalendarPreviewRelativeRangeLabel = (calendar) => {
  const v = calendar?.preview_relative_range_enabled;
  const relOn = v === true || v === 1 || v === 'true' || v === '1';
  if (!relOn) return null;
  const merged = mergePreviewRelativeCalendar(calendar);
  if (!merged?.start_date || !merged?.end_date) return null;
  const s = moment(merged.start_date, 'YYYY-MM-DD');
  const e = moment(merged.end_date, 'YYYY-MM-DD');
  if (!s.isValid() || !e.isValid()) return null;
  return { start: merged.start_date, end: merged.end_date };
};

export const isCalendarPreviewRelativeRangeEnabled = (calendar) => {
  const v = calendar?.preview_relative_range_enabled;
  return v === true || v === 1 || v === 'true' || v === '1';
};

export const isCalendarPreviewDaysSplitEnabled = (calendar) => {
  const v = calendar?.preview_days_split_enabled;
  return v === true || v === 1 || v === 'true' || v === '1';
};

export const deliveryCutOffTimeSelectValue = (calendar) => {
  const s = calendar?.preview_delivery_cut_off_time;
  if (s === '') return DELIVERY_CUT_OFF_SELECT_NONE;
  if (s === undefined || s === null) return '14:00';
  if (typeof s !== 'string') return '14:00';
  const m = s.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return '14:00';
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(h) || h < 0 || h > 23 || !Number.isFinite(mm)) return '14:00';
  return `${String(h).padStart(2, '0')}:00`;
};

const matchNonSelectableDay = (type, current) => {
  if (type === 'today') {
    return moment().format('YYYY-MM-DD') === moment(current).format('YYYY-MM-DD');
  }
  if (type === 'tomorrow') {
    return moment().add(1, 'days').format('YYYY-MM-DD') === moment(current).format('YYYY-MM-DD');
  }
  if (type === 'day_after_tomorrow') {
    return moment().add(2, 'days').format('YYYY-MM-DD') === moment(current).format('YYYY-MM-DD');
  }
  if (type === 'past') {
    return moment(current).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD');
  }
  if (type === 'future') {
    return moment(current).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD');
  }
  const dayMap = { moon: 1, fire: 2, water: 3, wood: 4, money: 5, soil: 6, day: 0 };
  if (dayMap[type] !== undefined) {
    return moment(current).day() === dayMap[type];
  }
  return false;
};

export const handleDisableDateCalendar = (current, calendar) => {
  if (calendar.end_date || calendar.start_date
    || calendar.fixed_date.length !== 0 || calendar.non_select_date_time
    || calendar.aggregation_target_period_from || calendar.aggregation_target_period_to
    || calendar.end_date_test || calendar[calendar.type].specified_period_from
    || calendar[calendar.type].specified_period_to) {
    return (moment(current, 'YYYY-MM-DD') >= moment(calendar.end_date, 'YYYY-MM-DD').add(1, 'days')
      || moment(current, 'YYYY-MM-DD') < moment(calendar.start_date, 'YYYY-MM-DD')
      || (calendar.type === 'start_end_date' && moment(current, 'YYYY-MM-DD').isSameOrAfter(moment(calendar.end_date_test, 'YYYY-MM-DD')))
      || calendar.fixed_date?.find((date) => date === moment(current).format('YYYY-MM-DD'))
      || moment(current) < ((calendar.aggregation_target_period_from !== null && calendar.aggregation_target_period_from !== undefined) ? moment().add(calendar.aggregation_target_period_from - 1, 'days') : moment(undefined, 'YYYY-MM-DD'))
      || moment(current) > (calendar.aggregation_target_period_to ? moment().add(calendar.aggregation_target_period_to, 'days') : moment(undefined, 'YYYY-MM-DD'))
      || calendar.non_select_date_time?.find((type) => matchNonSelectableDay(type, current)));
  }
  return false;
};

export const handleDisableEndDateCalendar = (current, calendar) => {
  if (calendar.end_date || calendar.start_date
    || calendar.fixed_date || calendar.non_select_date_time
    || calendar.start_date_test || calendar.specified_period_from
    || calendar.specified_period_to || calendar.aggregation_target_period_from
    || calendar.aggregation_target_period_to) {
    return (moment(current, 'YYYY-MM-DD').isSameOrAfter(moment(calendar.end_date, 'YYYY-MM-DD').add(1, 'days'))
      || moment(current, 'YYYY-MM-DD') < moment(calendar.start_date, 'YYYY-MM-DD')
      || (calendar.type === 'start_end_date' && moment(current, 'YYYY-MM-DD').isSameOrBefore(moment(calendar.start_date_test, 'YYYY-MM-DD')))
      || calendar.fixed_date?.find((date) => date === moment(current).format('YYYY-MM-DD'))
      || moment(current) < ((calendar.aggregation_target_period_from !== null && calendar.aggregation_target_period_from !== undefined) ? moment().add(calendar.aggregation_target_period_from - 1, 'days') : moment(undefined, 'YYYY-MM-DD'))
      || moment(current) > (calendar.aggregation_target_period_to ? moment().add(calendar.aggregation_target_period_to, 'days') : moment(undefined, 'YYYY-MM-DD'))
      || moment(current, 'YYYY-MM-DD') < (calendar[calendar.type].specified_period_from ? moment(calendar.start_date_test, 'YYYY-MM-DD').add(calendar[calendar.type].specified_period_from, 'days') : moment(undefined, 'YYYY-MM-DD'))
      || moment(current, 'YYYY-MM-DD') > (calendar[calendar.type].specified_period_to ? moment(calendar.start_date_test, 'YYYY-MM-DD').add(calendar[calendar.type].specified_period_to, 'days') : moment(undefined, 'YYYY-MM-DD'))
      || calendar.non_select_date_time?.find((type) => matchNonSelectableDay(type, current)));
  }
  return false;
};
