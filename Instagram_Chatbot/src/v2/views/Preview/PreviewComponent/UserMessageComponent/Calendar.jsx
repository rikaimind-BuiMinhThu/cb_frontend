import React from 'react';
import PropTypes from 'prop-types';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from "../Constants";
import DatePickerCustom from "v2/components/BotMessages/DatePickerCustom";
import moment from "moment-timezone";
import { Select, Radio, Row, Col, Calendar as AntdCalendar } from "antd";
import pickerLocaleJaJP from "antd/es/date-picker/locale/ja_JP";
import { withJaShortWeekDays } from "v2/utils/ensureMomentJaSundayFirstWeek";

export const isCalendarPreviewRelativeOn = (calendar) => {
  const v = calendar?.preview_relative_range_enabled;
  return v === true || v === 1 || v === "true" || v === "1";
};

const JST = "Asia/Tokyo";
const MAX_CLOSED_BUMP_DAYS = 366;
const DEFAULT_DELIVERY_CUT_OFF = "14:00";
const DELIVERY_CUT_OFF_NONE = "__delivery_cut_off_none__";
const AGG_FROM_KEY = "aggregation_target_period_from";
const AGG_TO_KEY = "aggregation_target_period_to";

export const getEffectivePreviewClosedWeekdays = (calendar) => {
  const arr = calendar?.preview_closed_weekdays;
  return Array.isArray(arr) ? [...arr] : [];
};

const isCalendarPreviewDaysSplitEnabled = (calendar) => {
  const v = calendar?.preview_days_split_enabled;
  return v === true || v === 1 || v === "true" || v === "1";
};

const skipClosedWeekdays = (day, closed) => {
  if (!closed.length || !closed.includes(day.day())) return day;
  return skipClosedWeekdays(day.clone().add(1, "day"), closed);
};

const advanceBusinessDaysJst = (fromDay, businessDays, closed) => {
  const m = Number.isFinite(businessDays) && businessDays > 0 ? Math.floor(businessDays) : 0;
  const step = (day, remaining) => {
    if (remaining <= 0) return day;
    return step(skipClosedWeekdays(day.clone().add(1, "day"), closed), remaining - 1);
  };
  return step(fromDay.clone().startOf("day"), m);
};

const addCalendarDaysJst = (fromDay, calendarDays) => {
  const n = Number.isFinite(calendarDays) && calendarDays > 0 ? Math.floor(calendarDays) : 0;
  return fromDay.clone().startOf("day").add(n, "days");
};

const bumpEffStartPastAnyClosedWeekday = (effStart, closed) => {
  if (!closed || !closed.length) return effStart.clone().startOf("day");
  const step = (day, remaining) => {
    if (remaining <= 0 || !closed.includes(day.day())) return day;
    return step(day.clone().add(1, "day"), remaining - 1);
  };
  return step(effStart.clone().startOf("day"), MAX_CLOSED_BUMP_DAYS);
};

const bumpPreviewAnchorPastClosedTodayOrTomorrow = (cursor, closed) => {
  if (!closed || !closed.length) return cursor.clone().startOf("day");
  const step = (day, remaining) => {
    if (remaining <= 0) return day;
    const next = day.clone().add(1, "day");
    const curClosed = closed.includes(day.day());
    const nextClosed = closed.includes(next.day());
    if (!curClosed && !nextClosed) return day;
    return step(day.clone().add(1, "day"), remaining - 1);
  };
  return step(cursor.clone().startOf("day"), MAX_CLOSED_BUMP_DAYS);
};

const clampDayToCfgRange = (d, cfgStart, cfgEnd, cfgStartOk, cfgEndOk) => {
  const started = d.clone().startOf("day");
  const afterStart = cfgStartOk && started.isBefore(cfgStart) ? cfgStart.clone() : started;
  return cfgEndOk && afterStart.isAfter(cfgEnd) ? cfgEnd.clone() : afterStart;
};

const clampEffStartToCfgThenBumpClosed = (effStart, closed, cfgStart, cfgEnd, cfgStartOk, cfgEndOk) => {
  const clamped = clampDayToCfgRange(effStart, cfgStart, cfgEnd, cfgStartOk, cfgEndOk);
  return clampDayToCfgRange(
    bumpEffStartPastAnyClosedWeekday(clamped, closed),
    cfgStart,
    cfgEnd,
    cfgStartOk,
    cfgEndOk,
  );
};

const resolvePreviewRelativeEffStartNonSplit = (cursor, closed, daysFromToday, cfgStart, cfgEnd, cfgStartOk, cfgEndOk) => {
  const c0 = cursor.clone().startOf("day");
  const bumpedCursor = bumpEffStartPastAnyClosedWeekday(c0, closed);
  const spanDays = bumpedCursor.diff(c0, "days");
  const pathA = bumpEffStartPastAnyClosedWeekday(
    clampDayToCfgRange(bumpedCursor.clone().add(daysFromToday, "days"), cfgStart, cfgEnd, cfgStartOk, cfgEndOk),
    closed
  );
  const pathB = bumpEffStartPastAnyClosedWeekday(
    clampDayToCfgRange(c0.clone().add(daysFromToday, "days"), cfgStart, cfgEnd, cfgStartOk, cfgEndOk),
    closed
  );
  const pick =
    spanDays >= 2
      ? pathA.isAfter(pathB)
        ? pathA
        : pathB
      : pathA.isBefore(pathB)
        ? pathA
        : pathB;
  return clampEffStartToCfgThenBumpClosed(pick, closed, cfgStart, cfgEnd, cfgStartOk, cfgEndOk);
};

const shouldShiftPreviewMinOffsetAfterCutOffJst = (calendar) => {
  const rawTime = calendar?.preview_delivery_cut_off_time;
  if (rawTime === "" || rawTime === DELIVERY_CUT_OFF_NONE) return false;
  const t = rawTime === undefined || rawTime === null ? DEFAULT_DELIVERY_CUT_OFF : rawTime;
  if (typeof t !== "string" || !t.trim()) return false;
  const m = t.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return false;
  const cutH = Number(m[1]);
  const cutMin = Number(m[2]);
  if (
    !Number.isFinite(cutH) ||
    cutH < 0 ||
    cutH > 23 ||
    !Number.isFinite(cutMin) ||
    cutMin < 0 ||
    cutMin > 59
  ) {
    return false;
  }
  const now = moment.tz(JST);
  const cutoff = now
    .clone()
    .startOf("day")
    .hour(cutH)
    .minute(cutMin)
    .second(0)
    .millisecond(0);
  return now.isAfter(cutoff);
};

const getCalendarPreviewDayZeroJst = () => {
  return moment.tz(JST).clone().startOf("day");
};

const isJstTodayOrTomorrowCalendarDay = (current) => {
  const ymd = moment.tz(current, JST).format("YYYY-MM-DD");
  const z0 = getCalendarPreviewDayZeroJst();
  const z1 = z0.clone().add(1, "day");
  return ymd === z0.format("YYYY-MM-DD") || ymd === z1.format("YYYY-MM-DD");
};

const nonSelectWeekdayJst = (current) => {
  const ymd = moment.tz(current, JST).format("YYYY-MM-DD");
  return moment.tz(ymd, "YYYY-MM-DD", JST).day();
};

const NON_SELECT_WEEKDAY_KANJI = {
  日: "day",
  月: "moon",
  火: "fire",
  水: "water",
  木: "wood",
  金: "money",
  土: "soil",
};

const calendarNonSelectTypeKey = (type) => {
  if (type == null) return "";
  const fromObject = typeof type === "object" && type !== null
    ? ("key" in type && type.key != null && type.key !== ""
      ? String(type.key)
      : ("value" in type && type.value != null && type.value !== ""
        ? String(type.value)
        : ""))
    : String(type);
  const raw = fromObject.trim();
  if (NON_SELECT_WEEKDAY_KANJI[raw]) return NON_SELECT_WEEKDAY_KANJI[raw];
  return raw.toLowerCase();
};

const getCalendarNonSelectList = (cal) => {
  const x = cal?.non_select_date_time;
  if (x == null || x === "") return [];
  return Array.isArray(x) ? x : [x];
};

export const shouldDisablePreviewClosedWeekdayAtJstTodayOrTomorrow = (current, calendar) => {
  if (!calendar || !isCalendarPreviewRelativeOn(calendar)) return false;
  const closed = getEffectivePreviewClosedWeekdays(calendar);
  if (!closed.length) return false;
  if (!isJstTodayOrTomorrowCalendarDay(current)) return false;
  const cur = moment.tz(current, JST).startOf("day");
  return closed.includes(cur.day());
};

const previewCalendarDateFullCellRenderHideLimboDayAfterCutoffShift = (value, calendar, mergedPreviewCalendar) => {
  if (!value || !isCalendarPreviewRelativeOn(calendar)) return null;
  if (!shouldShiftPreviewMinOffsetAfterCutOffJst(calendar)) return null;
  const merged = mergedPreviewCalendar || mergeCalendarForPreviewRelativeRange(calendar);
  const startStr = String(merged?.start_date ?? "").trim();
  if (!startStr) return null;
  const startD = moment.tz(startStr, "YYYY-MM-DD", JST).startOf("day");
  if (!startD.isValid()) return null;
  const limbo = startD.clone().subtract(1, "day");
  const d = moment.tz(value, JST).startOf("day");
  if (d.isSame(limbo, "day")) {
    return <div className="calendar-hidden-cell" aria-hidden />;
  }
  return null;
};

export const mergeCalendarForPreviewRelativeRange = (calendar) => {
  if (!calendar || !isCalendarPreviewRelativeOn(calendar)) return calendar;

  const d0 = Number(calendar.preview_days_from_today);
  const d1 = Number(calendar.preview_days_relative_to_end_date);
  const daysFromToday = Number.isFinite(d0) ? d0 : 0;
  const daysFromEnd = Number.isFinite(d1) ? d1 : 0;

  const cfgStartStr = String(calendar.start_date || "").trim();
  const cfgEndStr = String(calendar.end_date || "").trim();
  const cfgStart = cfgStartStr
    ? moment.tz(cfgStartStr, "YYYY-MM-DD", JST).startOf("day")
    : null;
  const cfgEnd = cfgEndStr
    ? moment.tz(cfgEndStr, "YYYY-MM-DD", JST).startOf("day")
    : null;
  const cfgStartOk = !!(cfgStart && cfgStart.isValid());
  const cfgEndOk = !!(cfgEnd && cfgEnd.isValid());

  if (cfgStartStr && !cfgStartOk) return calendar;
  if (cfgEndStr && !cfgEndOk) return calendar;

  const dayZero = getCalendarPreviewDayZeroJst();
  const closed = getEffectivePreviewClosedWeekdays(calendar);
  const cutoffShiftedDay = (day) => (
    shouldShiftPreviewMinOffsetAfterCutOffJst(calendar)
      ? day.clone().add(1, "day")
      : day.clone()
  );

  const computeEffStart = () => {
    if (!isCalendarPreviewDaysSplitEnabled(calendar)) {
      return resolvePreviewRelativeEffStartNonSplit(
        cutoffShiftedDay(dayZero),
        closed,
        daysFromToday,
        cfgStart,
        cfgEnd,
        cfgStartOk,
        cfgEndOk,
      );
    }
    const b = Number(calendar.preview_business_days);
    const c = Number(calendar.preview_calendar_days);
    const biz = Number.isFinite(b) && b > 0 ? Math.floor(b) : 0;
    const calDays = Number.isFinite(c) && c > 0 ? Math.floor(c) : 0;
    if (biz === 0 && calDays === 0) {
      return resolvePreviewRelativeEffStartNonSplit(
        cutoffShiftedDay(dayZero),
        closed,
        daysFromToday,
        cfgStart,
        cfgEnd,
        cfgStartOk,
        cfgEndOk,
      );
    }
    const afterCutoff = cutoffShiftedDay(dayZero);
    const afterAnchor = afterCutoff.day() !== 6
      ? bumpPreviewAnchorPastClosedTodayOrTomorrow(afterCutoff, closed)
      : afterCutoff;
    const afterBiz = advanceBusinessDaysJst(afterAnchor, biz, closed);
    const afterCal = addCalendarDaysJst(afterBiz, calDays);
    return clampDayToCfgRange(afterCal, cfgStart, cfgEnd, cfgStartOk, cfgEndOk);
  };

  const computeEffEnd = (start) => {
    const rawEnd = daysFromEnd > 0
      ? dayZero.clone().add(daysFromEnd, "days")
      : daysFromEnd < 0
        ? start.clone().add(daysFromEnd, "days")
        : start.clone();
    const clamped = clampDayToCfgRange(rawEnd, cfgStart, cfgEnd, cfgStartOk, cfgEndOk);
    return start.isAfter(clamped) ? start.clone() : clamped;
  };

  const effStart = computeEffStart();
  const effEnd = computeEffEnd(effStart);
  const calendarWithoutAgg = Object.fromEntries(
    Object.entries(calendar).filter(([key]) => key !== AGG_FROM_KEY && key !== AGG_TO_KEY),
  );

  return {
    ...calendarWithoutAgg,
    start_date: effStart.format("YYYY-MM-DD"),
    end_date: effEnd.format("YYYY-MM-DD"),
  };
};

export const isCalendarDateOutsideConfiguredRangeJst = (current, cal) => {
  if (!cal) return false;
  const startStr = String(cal.start_date ?? "").trim();
  const endStr = String(cal.end_date ?? "").trim();
  if (!startStr || !endStr) return false;
  const d = moment.tz(current, JST).startOf("day");
  const minD = moment.tz(startStr, "YYYY-MM-DD", JST).startOf("day");
  const maxD = moment.tz(endStr, "YYYY-MM-DD", JST).startOf("day");
  if (!minD.isValid() || !maxD.isValid()) return false;
  return d.isBefore(minD) || d.isAfter(maxD);
};

const shouldSkipWeekdayNonSelectInPreviewMergedRange = (cal, current) => {
  if (!cal || !isCalendarPreviewRelativeOn(cal)) return false;
  const startStr = String(cal.start_date ?? "").trim();
  const endStr = String(cal.end_date ?? "").trim();
  if (!startStr || !endStr) return false;
  return !isCalendarDateOutsideConfiguredRangeJst(current, cal);
};

const shouldSkipDayMoonNonSelectUnlessSunMonOnJstTodayOrTomorrow = (cal, current) => {
  const dow = nonSelectWeekdayJst(current);
  if (dow !== 0 && dow !== 1) return true;
  if (!isJstTodayOrTomorrowCalendarDay(current)) return true;
  if (!cal) return false;
  const startStr = String(cal.start_date ?? "").trim();
  const endStr = String(cal.end_date ?? "").trim();
  if (!startStr || !endStr) return false;
  if (isCalendarDateOutsideConfiguredRangeJst(current, cal)) return true;
  return false;
};

const Calendar = ({ content, messageIndex, contentIndex, onChangeValue, errors, disabled, locale }) => {
  const mergedJaPickerLocale = React.useMemo(
    () => withJaShortWeekDays(locale || pickerLocaleJaJP),
    [locale]
  );
  const [, setPreviewTimeTick] = React.useState(0);
  React.useEffect(() => {
    if (!content || content.type !== MESSAGE_CONTENT_TYPES.CALENDAR) return undefined;
    if (!isCalendarPreviewRelativeOn(content.calendar)) return undefined;
    const id = window.setInterval(() => setPreviewTimeTick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, [content]);

  const mergedForPreviewCellHide = React.useMemo(() => {
    if (!content || content.type !== MESSAGE_CONTENT_TYPES.CALENDAR) return null;
    const cal = content.calendar;
    if (!cal || !isCalendarPreviewRelativeOn(cal)) return null;
    return mergeCalendarForPreviewRelativeRange(cal);
  }, [content]);

  if (!content || content.type !== MESSAGE_CONTENT_TYPES.CALENDAR) return null;

  const calendar = content.calendar;

  const handleDisableDateCalendar = (current, calendar) => {
    if (shouldDisablePreviewClosedWeekdayAtJstTodayOrTomorrow(current, calendar)) {
      return true;
    }
    if (
      calendar.end_date ||
      calendar.start_date ||
      calendar?.fixed_date?.length !== 0 ||
      getCalendarNonSelectList(calendar).length > 0 ||
      calendar.aggregation_target_period_from ||
      calendar.aggregation_target_period_to ||
      calendar.end_date_select
    ) {
      return !!(
        moment(current, "YYYY-MM-DD") >=
        moment(calendar.end_date, "YYYY-MM-DD").add(1, "days") ||
        moment(current, "YYYY-MM-DD") <
        moment(calendar.start_date, "YYYY-MM-DD") ||
        (calendar.type === "start_end_date" &&
          moment(current, "YYYY-MM-DD").isSameOrAfter(
            moment(calendar.end_date_select, "YYYY-MM-DD")
          )) ||
        calendar.fixed_date?.find(
          (date) => date === moment(current).format("YYYY-MM-DD")
        ) ||
        moment(current) <
        (calendar.aggregation_target_period_from !== null &&
          calendar.aggregation_target_period_from !== undefined
          ? moment().add(calendar.aggregation_target_period_from - 1, "days")
          : moment(undefined, "YYYY-MM-DD")) ||
        moment(current) >
        (calendar.aggregation_target_period_to
          ? moment().add(calendar.aggregation_target_period_to, "days")
          : moment(undefined, "YYYY-MM-DD")) ||
        getCalendarNonSelectList(calendar).find((rawType) => {
          const type = calendarNonSelectTypeKey(rawType);
          const skipWeekdayNonSelect =
            type === "day" || type === "moon"
              ? shouldSkipDayMoonNonSelectUnlessSunMonOnJstTodayOrTomorrow(calendar, current)
              : shouldSkipWeekdayNonSelectInPreviewMergedRange(calendar, current);
          if (
            skipWeekdayNonSelect &&
            (type === "moon" ||
              type === "fire" ||
              type === "water" ||
              type === "wood" ||
              type === "money" ||
              type === "soil" ||
              type === "day")
          ) {
            return false;
          }
          if (type === "today") {
            return (
              moment().format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "tomorrow") {
            return (
              moment().add(1, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "day_after_tomorrow") {
            return (
              moment().add(2, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "past") {
            return (
              moment(current).format("YYYY-MM-DD") <
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "future") {
            return (
              moment(current).format("YYYY-MM-DD") >
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "moon") {
            return nonSelectWeekdayJst(current) === 1;
          } else if (type === "fire") {
            return nonSelectWeekdayJst(current) === 2;
          } else if (type === "water") {
            return nonSelectWeekdayJst(current) === 3;
          } else if (type === "wood") {
            return nonSelectWeekdayJst(current) === 4;
          } else if (type === "money") {
            return nonSelectWeekdayJst(current) === 5;
          } else if (type === "soil") {
            return nonSelectWeekdayJst(current) === 6;
          } else if (type === "day") {
            return nonSelectWeekdayJst(current) === 0;
          }
          return undefined;
        })
      );
    }
    return false;
  };

  const handleDisableEndDateCalendar = (current, calendar) => {
    if (shouldDisablePreviewClosedWeekdayAtJstTodayOrTomorrow(current, calendar)) {
      return true;
    }
    if (
      calendar.end_date ||
      calendar.start_date ||
      calendar?.fixed_date?.length !== 0 ||
      getCalendarNonSelectList(calendar).length > 0 ||
      calendar.start_date_select ||
      calendar.specified_period_from ||
      calendar.specified_period_to ||
      calendar.aggregation_target_period_from ||
      calendar.aggregation_target_period_to
    ) {
      return !!(
        moment(current, "YYYY-MM-DD").isSameOrAfter(
          moment(calendar.end_date, "YYYY-MM-DD").add(1, "days")
        ) ||
        moment(current, "YYYY-MM-DD") <
        moment(calendar.start_date, "YYYY-MM-DD") ||
        (calendar.type === "start_end_date" &&
          moment(current, "YYYY-MM-DD").isSameOrBefore(
            moment(calendar.start_date_select, "YYYY-MM-DD")
          )) ||
        calendar.fixed_date?.find(
          (date) => date === moment(current).format("YYYY-MM-DD")
        ) ||
        moment(current) <
        (calendar.aggregation_target_period_from !== null &&
          calendar.aggregation_target_period_from !== undefined
          ? moment().add(calendar.aggregation_target_period_from - 1, "days")
          : moment(undefined, "YYYY-MM-DD")) ||
        moment(current) >
        (calendar.aggregation_target_period_to
          ? moment().add(calendar.aggregation_target_period_to, "days")
          : moment(undefined, "YYYY-MM-DD")) ||
        moment(current, "YYYY-MM-DD") <
        (calendar[calendar.type].specified_period_from
          ? moment(calendar.start_date_select, "YYYY-MM-DD").add(
            calendar[calendar.type].specified_period_from,
            "days"
          )
          : moment(undefined, "YYYY-MM-DD")) ||
        moment(current, "YYYY-MM-DD") >
        (calendar[calendar.type].specified_period_to
          ? moment(calendar.start_date_select, "YYYY-MM-DD").add(
            calendar[calendar.type].specified_period_to,
            "days"
          )
          : moment(undefined, "YYYY-MM-DD")) ||
        getCalendarNonSelectList(calendar).find((rawType) => {
          const type = calendarNonSelectTypeKey(rawType);
          const skipWeekdayNonSelect =
            type === "day" || type === "moon"
              ? shouldSkipDayMoonNonSelectUnlessSunMonOnJstTodayOrTomorrow(calendar, current)
              : shouldSkipWeekdayNonSelectInPreviewMergedRange(calendar, current);
          if (
            skipWeekdayNonSelect &&
            (type === "moon" ||
              type === "fire" ||
              type === "water" ||
              type === "wood" ||
              type === "money" ||
              type === "soil" ||
              type === "day")
          ) {
            return false;
          }
          if (type === "today") {
            return (
              moment().format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "tomorrow") {
            return (
              moment().add(1, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "day_after_tomorrow") {
            return (
              moment().add(2, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "past") {
            return (
              moment(current).format("YYYY-MM-DD") <
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "future") {
            return (
              moment(current).format("YYYY-MM-DD") >
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "moon") {
            return nonSelectWeekdayJst(current) === 1;
          } else if (type === "fire") {
            return nonSelectWeekdayJst(current) === 2;
          } else if (type === "water") {
            return nonSelectWeekdayJst(current) === 3;
          } else if (type === "wood") {
            return nonSelectWeekdayJst(current) === 4;
          } else if (type === "money") {
            return nonSelectWeekdayJst(current) === 5;
          } else if (type === "soil") {
            return nonSelectWeekdayJst(current) === 6;
          } else if (type === "day") {
            return nonSelectWeekdayJst(current) === 0;
          }
          return undefined;
        })
      );
    }
    return false;
  };

  const calendarForPreviewDisable = isCalendarPreviewRelativeOn(calendar)
    ? mergeCalendarForPreviewRelativeRange(calendar)
    : calendar;

  const previewDisableDateStart = (current) => {
    if (isCalendarDateOutsideConfiguredRangeJst(current, calendarForPreviewDisable)) return true;
    if (handleDisableDateCalendar(current, calendarForPreviewDisable)) return true;
    return false;
  };

  const previewDisableDateEnd = (current) => {
    if (isCalendarDateOutsideConfiguredRangeJst(current, calendarForPreviewDisable)) return true;
    if (handleDisableEndDateCalendar(current, calendarForPreviewDisable)) return true;
    return false;
  };

  const renderTitle = () => {
    if (!calendar.title_require && !calendar.require) return null;

    return (
      <div className="ss-message__content--user-calender-top m-b-0">
        {calendar.title_require && (
          <span className="ss-message__content--user-calender-title">
            {calendar.title}
          </span>
        )}
        {calendar.require === true && (
          <span className="ss-message__content--user-text-input-required">
            {REQUIRED_FIELD_LABEL}
          </span>
        )}
      </div>
    );
  };

  const renderStartEndDateContent = () => {
    return (
      <div className="ss-message__split-row">
        <DatePickerCustom
          disabled={disabled}
          locale={mergedJaPickerLocale}
          className="w-49-percent m-t-5"
          disabledDate={previewDisableDateStart}
          value={
            calendar.start_date_select
              ? moment(calendar.start_date_select, "YYYY-MM-DD")
              : null
          }
          onChange={(date, dateString) =>
            onChangeValue(
              contentIndex,
              content.type,
              dateString,
              "start_date_select"
            )
          }
        />
        <DatePickerCustom
          disabled={disabled}
          locale={mergedJaPickerLocale}
          className="w-49-percent m-t-5"
          disabledDate={previewDisableDateEnd}
          value={
            calendar.end_date_select
              ? moment(calendar.end_date_select, "YYYY-MM-DD")
              : null
          }
          onChange={(date, dateString) =>
            onChangeValue(
              contentIndex,
              content.type,
              dateString,
              "end_date_select"
            )
          }
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (calendar.type) {
      case "date_selection":
        return renderDateSelectionContent();
      case "embedded":
        return renderEmbeddedContent();
      case "start_end_date":
        return renderStartEndDateContent();
      default:
        return null;
    }
  };

  const renderDateSelectionContent = () => {
    return (
      <React.Fragment>
        <DatePickerCustom
          disabled={disabled}
          locale={mergedJaPickerLocale}
          format={"YYYY-MM-DD"}
          className="w-100-percent m-t-5"
          value={
            calendar.date_select
              ? moment(calendar.date_select, "YYYY-MM-DD")
              : null
          }
          onChange={(date, dateString) =>
            onChangeValue(
              contentIndex,
              content.type,
              dateString,
              "date_select"
            )
          }
          disabledDate={previewDisableDateStart}
        />
      </React.Fragment>
    );
  };

  const renderEmbeddedContent = () => {
    return (
      <React.Fragment>
        <div className="ss-message__content--user-calender-embedded m-t-5">
          <AntdCalendar
            disabled={disabled}
            fullscreen={false}
            className="ss-custom-calendar preview-calendar-panel"
            locale={mergedJaPickerLocale}
            dateFullCellRender={(v) => {
              const limbo = previewCalendarDateFullCellRenderHideLimboDayAfterCutoffShift(
                v,
                calendar,
                mergedForPreviewCellHide
              );
              if (limbo) return limbo;
              return <div className="ant-picker-cell-inner">{v.date()}</div>;
            }}
            headerRender={({
              value,
              type,
              onChange,
              onTypeChange,
            }) => {
              const start = 0;
              const end = 12;
              const pickerValue = value ? value : moment();
              const localeData = pickerValue.localeData();
              const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthIndex) =>
                localeData.monthsShort(pickerValue.clone().month(monthIndex))
              );

              const monthOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                .filter((monthIndex) => monthIndex >= start && monthIndex < end)
                .map((monthIndex) => (
                    <Select.Option
                      key={monthIndex}
                      value={monthIndex}
                      className="month-item"
                    >
                      {months[monthIndex]}
                    </Select.Option>
                ));

              const year = pickerValue.year();
              const month = pickerValue.month();
              const options = Array.from({ length: 100 }, (_, index) => year - 50 + index).map((yearValue) => (
                <Select.Option
                  key={yearValue}
                  value={yearValue}
                  className="year-item"
                >
                  {yearValue}
                </Select.Option>
              ));
              return (
                <div className="p-8">
                  <Row gutter={8}>
                    <Col>
                      <Select
                        size="small"
                        dropdownMatchSelectWidth={false}
                        className="my-year-select"
                        value={year}
                        onChange={(newYear) => {
                          const now = pickerValue.clone().year(newYear);
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
                          const now = pickerValue.clone().month(newMonth);
                          onChange(now);
                        }}
                      >
                        {monthOptions}
                      </Select>
                    </Col>
                    <Col>
                      <Radio.Group
                        size="small"
                        onChange={(e) =>
                          onTypeChange(e.target.value)
                        }
                        value={type}
                      >
                        <Radio.Button value="month">
                          月
                        </Radio.Button>
                        <Radio.Button value="year">年</Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                </div>
              );
            }}
            value={
              calendar.date_select
                ? moment(calendar.date_select, "YYYY-MM-DD")
                : null
            }
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                "date_select"
              )
            }
            disabledDate={previewDisableDateStart}
          />
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="m-b-10">
      {renderTitle()}
      {/* calendar: type = 'date_selection' */}
      {renderContent()}
      {/* calendar: type = 'embedded' */}
      {calendar.type === "embedded" && (
        <React.Fragment>
          <div
            className="ss-message__content--user-calender-embedded m-t-5"
          >
            <AntdCalendar
              // onLoad={
              //   checkLoadCalendar()
              // }
              disabled={disabled}
              className="ss-custom-calendar preview-calendar-panel"
              fullscreen={false}
              locale={mergedJaPickerLocale}
              dateFullCellRender={(v) => {
                const limbo = previewCalendarDateFullCellRenderHideLimboDayAfterCutoffShift(
                  v,
                  calendar,
                  mergedForPreviewCellHide
                );
                if (limbo) return limbo;
                return <div className="ant-picker-cell-inner">{v.date()}</div>;
              }}
              // format={"YYYY-MM-DD"}
              headerRender={({
                value,
                type,
                onChange,
                onTypeChange,
              }) => {
                const start = 0;
                const end = 12;
                const pickerValue = value ? value : moment();
                const localeData = pickerValue.localeData();
                const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthIndex) =>
                  localeData.monthsShort(pickerValue.clone().month(monthIndex))
                );
                const monthOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                  .filter((monthIndex) => monthIndex >= start && monthIndex < end)
                  .map((monthIndex) => (
                    <Select.Option
                      key={monthIndex}
                      value={monthIndex}
                      className="month-item"
                    >
                      {months[monthIndex]}
                    </Select.Option>
                  ));

                const year = pickerValue.year();
                const month = pickerValue.month();
                const options = Array.from({ length: 100 }, (_, index) => year - 50 + index).map((yearValue) => (
                  <Select.Option
                    key={yearValue}
                    value={yearValue}
                    className="year-item"
                  >
                    {yearValue}
                  </Select.Option>
                ));
                return (
                  <div className="calendar-pad-8">
                    <Row gutter={8}>
                      <Col>
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          className="my-year-select"
                          value={year}
                          onChange={(newYear) => {
                            const now = pickerValue.clone().year(newYear);
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
                            const now = pickerValue.clone().month(newMonth);
                            onChange(now);
                          }}
                        >
                          {monthOptions}
                        </Select>
                      </Col>
                      <Col>
                        <Radio.Group
                          size="small"
                          onChange={(e) =>
                            onTypeChange(e.target.value)
                          }
                          value={type}
                        >
                          <Radio.Button value="month">
                            月
                          </Radio.Button>
                          <Radio.Button value="year">年</Radio.Button>
                        </Radio.Group>
                      </Col>
                    </Row>
                  </div>
                );
              }}
              value={
                calendar.date_select
                  ? moment(calendar.date_select, "YYYY-MM-DD")
                  : null
              }
              onChange={(value) =>
                onChangeValue(
                  contentIndex,
                  content.type,
                  value,
                  "date_select"
                )
              }
              disabledDate={previewDisableDateStart}
            />
          </div>
        </React.Fragment>
      )}
      {errors?.[
        `message${messageIndex}_content${contentIndex}_${content.type}`
      ] && (
          <div className="calendar-hint">
            {
              errors?.[
              `message${messageIndex}_content${contentIndex}_${content.type}`
              ]
            }
          </div>
        )}
    </div>
  );
};

Calendar.propTypes = {
  ...baseUserMessageComponentPropTypes,
  locale: PropTypes.object,
  cartSystem: PropTypes.string,
};

export default Calendar;
