import moment from 'moment';
import {
  CALENDAR_SEARCH_LIMIT,
  CALENDAR_TYPE,
  CARD_PAYMENT_RADIO_TYPE,
  CONTENT_TYPE,
  DATE_DISABLE_TYPE,
  DATE_FORMAT,
  EMPTY_STRING,
  SCAN_REGEX,
  WEEKDAY_FRIDAY,
  WEEKDAY_MONDAY,
  WEEKDAY_SATURDAY,
  WEEKDAY_SUNDAY,
  WEEKDAY_THURSDAY,
  WEEKDAY_TUESDAY,
  WEEKDAY_WEDNESDAY,
} from './constants';

export const stringNullOrEmpty = (value) => (
  value === undefined
  || value === null
  || (value && `${value}`.trim() === EMPTY_STRING)
  || value === EMPTY_STRING
);

export const replaceVariable = (content, variables) => (
  content.replaceAll(SCAN_REGEX, (text, variable) => {
    if (!variables?.length) {
      return EMPTY_STRING;
    }
    const matched = variables.reduce(
      (found, item) => (item.variable_name === variable ? item : found),
      null,
    );
    return matched?.default_value ?? EMPTY_STRING;
  })
);

export const focusInput = (wrapperRef) => {
  const inputEl = wrapperRef?.current?.querySelector('input');
  inputEl?.focus();
  inputEl?.select();
};

const matchesNonSelectDate = (current, type) => {
  switch (type) {
    case DATE_DISABLE_TYPE.TODAY:
      return moment().format(DATE_FORMAT) === moment(current).format(DATE_FORMAT);
    case DATE_DISABLE_TYPE.TOMORROW:
      return moment().add(1, 'days').format(DATE_FORMAT) === moment(current).format(DATE_FORMAT);
    case DATE_DISABLE_TYPE.DAY_AFTER_TOMORROW:
      return moment().add(2, 'days').format(DATE_FORMAT) === moment(current).format(DATE_FORMAT);
    case DATE_DISABLE_TYPE.PAST:
      return moment(current).format(DATE_FORMAT) < moment().format(DATE_FORMAT);
    case DATE_DISABLE_TYPE.FUTURE:
      return moment(current).format(DATE_FORMAT) > moment().format(DATE_FORMAT);
    case DATE_DISABLE_TYPE.MOON:
      return moment(current).day() === WEEKDAY_MONDAY;
    case DATE_DISABLE_TYPE.FIRE:
      return moment(current).day() === WEEKDAY_TUESDAY;
    case DATE_DISABLE_TYPE.WATER:
      return moment(current).day() === WEEKDAY_WEDNESDAY;
    case DATE_DISABLE_TYPE.WOOD:
      return moment(current).day() === WEEKDAY_THURSDAY;
    case DATE_DISABLE_TYPE.MONEY:
      return moment(current).day() === WEEKDAY_FRIDAY;
    case DATE_DISABLE_TYPE.SOIL:
      return moment(current).day() === WEEKDAY_SATURDAY;
    case DATE_DISABLE_TYPE.DAY:
      return moment(current).day() === WEEKDAY_SUNDAY;
    default: {
      const exhaustive = type;
      return exhaustive && false;
    }
  }
};

export const handleDisableDateCalendar = (current, calendar) => {
  if (
    calendar.end_date
    || calendar.start_date
    || calendar?.fixed_date?.length !== 0
    || calendar?.non_select_date_time?.length !== 0
    || calendar.aggregation_target_period_from
    || calendar.aggregation_target_period_to
    || calendar.end_date_select
  ) {
    return (
      moment(current, DATE_FORMAT) >= moment(calendar.end_date, DATE_FORMAT).add(1, 'days')
      || moment(current, DATE_FORMAT) < moment(calendar.start_date, DATE_FORMAT)
      || (calendar.type === CALENDAR_TYPE.START_END_DATE
        && moment(current, DATE_FORMAT).isSameOrAfter(
          moment(calendar.end_date_select, DATE_FORMAT),
        ))
      || calendar.fixed_date?.find((date) => date === moment(current).format(DATE_FORMAT))
      || moment(current) < (
        calendar.aggregation_target_period_from !== null
        && calendar.aggregation_target_period_from !== undefined
          ? moment().add(calendar.aggregation_target_period_from - 1, 'days')
          : moment(undefined, DATE_FORMAT)
      )
      || moment(current) > (
        calendar.aggregation_target_period_to
          ? moment().add(calendar.aggregation_target_period_to, 'days')
          : moment(undefined, DATE_FORMAT)
      )
      || calendar.non_select_date_time?.find((type) => matchesNonSelectDate(current, type))
    );
  }
  return false;
};

export const handleDisableEndDateCalendar = (current, calendar) => {
  if (
    calendar.end_date
    || calendar.start_date
    || calendar?.fixed_date?.length !== 0
    || calendar?.non_select_date_time?.length !== 0
    || calendar.start_date_select
    || calendar.specified_period_from
    || calendar.specified_period_to
    || calendar.aggregation_target_period_from
    || calendar.aggregation_target_period_to
  ) {
    return (
      moment(current, DATE_FORMAT).isSameOrAfter(
        moment(calendar.end_date, DATE_FORMAT).add(1, 'days'),
      )
      || moment(current, DATE_FORMAT) < moment(calendar.start_date, DATE_FORMAT)
      || (calendar.type === CALENDAR_TYPE.START_END_DATE
        && moment(current, DATE_FORMAT).isSameOrBefore(
          moment(calendar.start_date_select, DATE_FORMAT),
        ))
      || calendar.fixed_date?.find((date) => date === moment(current).format(DATE_FORMAT))
      || moment(current) < (
        calendar.aggregation_target_period_from !== null
        && calendar.aggregation_target_period_from !== undefined
          ? moment().add(calendar.aggregation_target_period_from - 1, 'days')
          : moment(undefined, DATE_FORMAT)
      )
      || moment(current) > (
        calendar.aggregation_target_period_to
          ? moment().add(calendar.aggregation_target_period_to, 'days')
          : moment(undefined, DATE_FORMAT)
      )
      || moment(current, DATE_FORMAT) < (
        calendar[calendar.type].specified_period_from
          ? moment(calendar.start_date_select, DATE_FORMAT).add(
            calendar[calendar.type].specified_period_from,
            'days',
          )
          : moment(undefined, DATE_FORMAT)
      )
      || moment(current, DATE_FORMAT) > (
        calendar[calendar.type].specified_period_to
          ? moment(calendar.start_date_select, DATE_FORMAT).add(
            calendar[calendar.type].specified_period_to,
            'days',
          )
          : moment(undefined, DATE_FORMAT)
      )
      || calendar.non_select_date_time?.find((type) => matchesNonSelectDate(current, type))
    );
  }
  return false;
};

export const findFirstEnabledDate = (calendar) => {
  const enabledOffset = Array.from(
    { length: CALENDAR_SEARCH_LIMIT + 1 },
    (_, offset) => offset,
  ).find((offset) => !handleDisableDateCalendar(moment().add(offset, 'days'), calendar));
  if (enabledOffset === undefined) {
    return null;
  }
  return moment().add(enabledOffset, 'days').format(DATE_FORMAT);
};

export const findFirstEnabledRange = (calendar) => {
  const enabledOffset = Array.from(
    { length: CALENDAR_SEARCH_LIMIT + 1 },
    (_, offset) => offset,
  ).find((offset) => !handleDisableDateCalendar(moment().add(offset, 'days'), calendar));
  if (enabledOffset === undefined) {
    return { start_date_select: null, end_date_select: null };
  }
  if (enabledOffset === 0) {
    return {
      start_date_select: moment(),
      end_date_select: moment().add(1, 'days'),
    };
  }
  return {
    start_date_select: moment().add(enabledOffset, 'days'),
    end_date_select: moment().add(enabledOffset, 'days'),
  };
};

export const shouldHideNextButton = (message) => {
  if (
    (message.type === CONTENT_TYPE.CARD_PAYMENT_RADIO_BUTTON
      && stringNullOrEmpty(message?.[message.type]?.initial_selection)
      && stringNullOrEmpty(message?.[message.type]?.initial_selection_picture))
    || message.type === CONTENT_TYPE.PRODUCT_PURCHASE_RADIO_BUTTON
    || (message.type === CONTENT_TYPE.CARD_PAYMENT_RADIO_BUTTON
      && (message?.[message.type].type !== CARD_PAYMENT_RADIO_TYPE.PICTURE_RADIO
        ? stringNullOrEmpty(message?.[message.type]?.initial_selection)
          && !message?.[message.type]?.card_linked_setting.includes(
            message?.[message.type]?.initial_selection,
          )
        : stringNullOrEmpty(message?.[message.type]?.initial_selection_picture)
          && message?.[message.type]?.card_linked_setting_picture
            !== message?.[message.type]?.initial_selection_picture))
    || (message.type === CONTENT_TYPE.CAROUSEL && message?.[message.type].require)
    || (message.type === CONTENT_TYPE.RADIO_BUTTON && !message[message.type].initial_selection)
  ) {
    return true;
  }
  return false;
};
