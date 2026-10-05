import moment from 'moment-timezone';

const JST = 'Asia/Tokyo';
const DEFAULT_CUT_OFF_TIME = '14:00';
const DEFAULT_CUT_OFF_HOUR = 14;
const DEFAULT_CUT_OFF_MINUTE = 0;
const LOOKAHEAD_DAYS = 21;
const DATE_JP_YEAR_SUFFIX = '年';
const DATE_JP_MONTH_SUFFIX = '月';
const DATE_JP_DAY_SUFFIX = '日';
const WEEKDAY_TUESDAY = 2;
const WEEKDAY_SATURDAY = 6;
const CUT_OFF_TIME_PATTERN = /^(\d{1,2}):(\d{2})$/;
const HOUR_MAX = 23;
const MINUTE_MAX = 59;
const MINUTES_PER_HOUR = 60;

const isDeliverableWeekday = (m) => {
  const d = m.clone().startOf('day').day();
  return d >= WEEKDAY_TUESDAY && d <= WEEKDAY_SATURDAY;
};

const firstDeliverableOnOrAfter = (startDayJst) => {
  const candidates = Array.from({ length: LOOKAHEAD_DAYS }, (_, index) =>
    startDayJst.clone().startOf('day').add(index, 'day')
  );
  return candidates.find(isDeliverableWeekday) ?? startDayJst.clone().startOf('day');
};

export const shortestDeliverableDateJpFromOrderClockJst = (reference, calendar) => {
  const ref = reference
    ? moment.tz(reference, JST)
    : moment.tz(JST);
  const t = calendar?.preview_delivery_cut_off_time;
  const m = String(t == null || t === '' ? DEFAULT_CUT_OFF_TIME : t)
    .trim()
    .match(CUT_OFF_TIME_PATTERN);
  const ok = m && +m[1] >= 0 && +m[1] <= HOUR_MAX && +m[2] >= 0 && +m[2] <= MINUTE_MAX;
  const cutH = ok ? +m[1] : DEFAULT_CUT_OFF_HOUR;
  const cutM = ok ? +m[2] : DEFAULT_CUT_OFF_MINUTE;
  const dayStart = ref.clone().startOf('day');
  const afterCut = ref.hour() * MINUTES_PER_HOUR + ref.minute() >= cutH * MINUTES_PER_HOUR + cutM;
  const anchor = afterCut ? dayStart.clone().add(1, 'day') : dayStart.clone();
  const first = firstDeliverableOnOrAfter(anchor);
  return `${first.year()}${DATE_JP_YEAR_SUFFIX}${first.month() + 1}${DATE_JP_MONTH_SUFFIX}${first.date()}${DATE_JP_DAY_SUFFIX}`;
};

export { JST, isDeliverableWeekday, firstDeliverableOnOrAfter };
