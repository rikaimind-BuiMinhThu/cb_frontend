import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "../Constants";
import DatePickerCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/DatePickerCustom";
import moment from "moment-timezone";
import { Select, Radio, Row, Col, Calendar as AntdCalendar } from "antd";
import pickerLocaleJaJP from "antd/es/date-picker/locale/ja_JP";
import { withJaShortWeekDays } from "utils/ensureMomentJaSundayFirstWeek";

export function isCalendarPreviewRelativeOn(calendar) {
  const v = calendar?.preview_relative_range_enabled;
  return v === true || v === 1 || v === "true" || v === "1";
}

const JST = "Asia/Tokyo";

export function getEffectivePreviewClosedWeekdays(calendar) {
  const arr = calendar?.preview_closed_weekdays;
  return Array.isArray(arr) ? [...arr] : [];
}

function endDateInclusiveForDeliverableDayCount(startJst, deliverableCount, cfgEndCap) {
  const n = Math.max(1, Math.floor(Number(deliverableCount)) || 1);
  let d = startJst.clone().startOf("day");
  let seen = 0;
  for (let i = 0; i < 400; i += 1) {
    if (isDeliverableWeekday(d)) {
      seen += 1;
      if (seen === n) {
        if (cfgEndCap && d.isAfter(cfgEndCap, "day")) {
          return cfgEndCap.clone().startOf("day");
        }
        return d;
      }
    }
    d = d.clone().add(1, "day");
  }
  return cfgEndCap ? cfgEndCap.clone().startOf("day") : startJst.clone().startOf("day");
}

function resolvePreviewRelativeEffStartNonSplit(cursor, closed, daysFromToday, cfgStart, cfgEnd, cfgStartOk, cfgEndOk) {
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
}

function shouldShiftPreviewMinOffsetAfterCutOffJst(calendar) {
  let t = calendar?.preview_delivery_cut_off_time;
  if (t === "" || t === "__delivery_cut_off_none__") return false;
  if (t === undefined || t === null) {
    t = "14:00";
  }
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
}

function getCalendarPreviewDayZeroJst() {
  return moment.tz(JST).clone().startOf("day");
}

function isJstTodayOrTomorrowCalendarDay(current) {
  const ymd = moment.tz(current, JST).format("YYYY-MM-DD");
  const z0 = getCalendarPreviewDayZeroJst();
  const z1 = z0.clone().add(1, "day");
  return ymd === z0.format("YYYY-MM-DD") || ymd === z1.format("YYYY-MM-DD");
}

function nonSelectWeekdayJst(current) {
  const ymd = moment.tz(current, JST).format("YYYY-MM-DD");
  return moment.tz(ymd, "YYYY-MM-DD", JST).day();
}

const NON_SELECT_WEEKDAY_KANJI = {
  日: "day",
  月: "moon",
  火: "fire",
  水: "water",
  木: "wood",
  金: "money",
  土: "soil",
};

function calendarNonSelectTypeKey(type) {
  if (type == null) return "";
  let raw = "";
  if (typeof type === "object" && type !== null) {
    if ("key" in type && type.key != null && type.key !== "") raw = String(type.key);
    else if ("value" in type && type.value != null && type.value !== "") raw = String(type.value);
  } else {
    raw = String(type);
  }
  raw = raw.trim();
  if (NON_SELECT_WEEKDAY_KANJI[raw]) return NON_SELECT_WEEKDAY_KANJI[raw];
  return raw.toLowerCase();
}

function getCalendarNonSelectList(cal) {
  const x = cal?.non_select_date_time;
  if (x == null || x === "") return [];
  return Array.isArray(x) ? x : [x];
}

export function shouldDisablePreviewClosedWeekdayAtJstTodayOrTomorrow(current, calendar) {
  if (!calendar || !isCalendarPreviewRelativeOn(calendar)) return false;
  const closed = getEffectivePreviewClosedWeekdays(calendar);
  if (!closed.length) return false;
  if (!isJstTodayOrTomorrowCalendarDay(current)) return false;
  const cur = moment.tz(current, JST).startOf("day");
  return closed.includes(cur.day());
}

const HIDDEN_CELL_STYLE = {
  minHeight: 24,
  visibility: "hidden",
  pointerEvents: "none",
};

function previewCalendarDateFullCellRenderHideLimboDayAfterCutoffShift(value, calendar, mergedPreviewCalendar) {
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
    return <div style={HIDDEN_CELL_STYLE} aria-hidden />;
  }
  return null;
}

export function mergeCalendarForPreviewRelativeRange(calendar) {
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

  let effStart;
  if (isCalendarPreviewDaysSplitEnabled(calendar)) {
    const b = Number(calendar.preview_business_days);
    const c = Number(calendar.preview_calendar_days);
    const biz = Number.isFinite(b) && b > 0 ? Math.floor(b) : 0;
    const cal = Number.isFinite(c) && c > 0 ? Math.floor(c) : 0;
    if (biz === 0 && cal === 0) {
      let cursor = dayZero.clone();
      if (shouldShiftPreviewMinOffsetAfterCutOffJst(calendar)) {
        cursor = cursor.clone().add(1, "day");
      }
      effStart = resolvePreviewRelativeEffStartNonSplit(
        cursor,
        closed,
        daysFromToday,
        cfgStart,
        cfgEnd,
        cfgStartOk,
        cfgEndOk
      );
    } else {
      effStart = dayZero.clone();
      if (shouldShiftPreviewMinOffsetAfterCutOffJst(calendar)) {
        effStart = effStart.clone().add(1, "day");
      }
      if (effStart.day() !== 6) {
        effStart = bumpPreviewAnchorPastClosedTodayOrTomorrow(effStart, closed);
      }
      effStart = advanceBusinessDaysJst(effStart, biz, closed);
      effStart = addCalendarDaysJst(effStart, cal);
      if (cfgStartOk && effStart.isBefore(cfgStart)) effStart = cfgStart.clone();
      if (cfgEndOk && effStart.isAfter(cfgEnd)) effStart = cfgEnd.clone();
    }
  } else {
    let cursor = dayZero.clone();
    if (shouldShiftPreviewMinOffsetAfterCutOffJst(calendar)) {
      cursor = cursor.clone().add(1, "day");
    }
    effStart = resolvePreviewRelativeEffStartNonSplit(
      cursor,
      closed,
      daysFromToday,
      cfgStart,
      cfgEnd,
      cfgStartOk,
      cfgEndOk
    );
  }

  let effEnd;
  if (daysFromEnd > 0) {
    effEnd = dayZero.clone().add(daysFromEnd, "days");
  } else if (daysFromEnd < 0) {
    effEnd = effStart.clone().add(daysFromEnd, "days");
  } else {
    effEnd = effStart.clone();
  }
  if (cfgStartOk && effEnd.isBefore(cfgStart)) effEnd = cfgStart.clone();
  if (cfgEndOk && effEnd.isAfter(cfgEnd)) effEnd = cfgEnd.clone();
  if (effStart.isAfter(effEnd)) effEnd = effStart.clone();

  const merged = {
    ...calendar,
    start_date: effStart.format("YYYY-MM-DD"),
    end_date: effEnd.format("YYYY-MM-DD"),
  };
  delete merged.aggregation_target_period_from;
  delete merged.aggregation_target_period_to;
  return merged;
}

export function isCalendarDateOutsideConfiguredRangeJst(current, cal) {
  if (!cal) return false;
  const startStr = String(cal.start_date ?? "").trim();
  const endStr = String(cal.end_date ?? "").trim();
  if (!startStr || !endStr) return false;
  const d = moment.tz(current, JST).startOf("day");
  const minD = moment.tz(startStr, "YYYY-MM-DD", JST).startOf("day");
  const maxD = moment.tz(endStr, "YYYY-MM-DD", JST).startOf("day");
  if (!minD.isValid() || !maxD.isValid()) return false;
  return d.isBefore(minD) || d.isAfter(maxD);
}

function shouldSkipWeekdayNonSelectInPreviewMergedRange(cal, current) {
  if (!cal || !isCalendarPreviewRelativeOn(cal)) return false;
  const startStr = String(cal.start_date ?? "").trim();
  const endStr = String(cal.end_date ?? "").trim();
  if (!startStr || !endStr) return false;
  return !isCalendarDateOutsideConfiguredRangeJst(current, cal);
}

function shouldSkipDayMoonNonSelectUnlessSunMonOnJstTodayOrTomorrow(cal, current) {
  const dow = nonSelectWeekdayJst(current);
  if (dow !== 0 && dow !== 1) return true;
  if (!isJstTodayOrTomorrowCalendarDay(current)) return true;
  if (!cal) return false;
  const startStr = String(cal.start_date ?? "").trim();
  const endStr = String(cal.end_date ?? "").trim();
  if (!startStr || !endStr) return false;
  if (isCalendarDateOutsideConfiguredRangeJst(current, cal)) return true;
  return false;
}

export default function Calendar({ content, messageIndex, contentIndex, onChangeValue, errors, disabled, locale }) {
  const mergedJaPickerLocale = React.useMemo(
    () => withJaShortWeekDays(locale || pickerLocaleJaJP),
    [locale]
  );
  const [previewTimeTick, setPreviewTimeTick] = React.useState(0);
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
  }, [content, previewTimeTick]);

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
      <div className="ss-message__content--user-calender-top" style={{ marginBottom: "0px" }}>
        {calendar.title_require && (
          <span className="ss-message__content--user-calender-title">
            {calendar.title}
          </span>
        )}
        {calendar.require === true && (
          <span className="ss-message__content--user-text-input-required">
            ※必須
          </span>
        )}
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
            // onLoad={
            //   checkLoadCalendar()
            // }
            disabled={disabled}
            fullscreen={false}
            className="ss-custom-calendar"
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
              const monthOptions = [];
              value = value ? value : moment();
              let current = value.clone();
              const localeData = value.localeData();
              const months = [];
              for (let i = 0; i < 12; i++) {
                current = current.month(i);
                months.push(localeData.monthsShort(current));
              }

              for (let i = start; i < end; i++) {
                monthOptions.push(
                  <Select.Option
                    key={i}
                    value={i}
                    className="month-item"
                  >
                    {months[i]}
                  </Select.Option>
                );
              }

              const year = value.year();
              const month = value.month();
              const options = [];
              for (let i = year - 50; i < year + 50; i += 1) {
                options.push(
                  <Select.Option
                    key={i}
                    value={i}
                    className="year-item"
                  >
                    {i}
                  </Select.Option>
                );
              }
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
                          const now = value.clone().year(newYear);
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
                          const now = value.clone().month(newMonth);
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
            
            style={{
              top: "20px",
              width: "300px",
              border: "1px solid grey",
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
            className="ss-message__content--user-calender-embedded"
            style={{ marginTop: "5px" }}
          >
            <AntdCalendar
              // onLoad={
              //   checkLoadCalendar()
              // }
              disabled={disabled}
              className="ss-custom-calendar"
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
                const monthOptions = [];
                value = value ? value : moment();
                let current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  current = current.month(i);
                  months.push(localeData.monthsShort(current));
                }

                for (let i = start; i < end; i++) {
                  monthOptions.push(
                    <Select.Option
                      key={i}
                      value={i}
                      className="month-item"
                    >
                      {months[i]}
                    </Select.Option>
                  );
                }

                const year = value.year();
                const month = value.month();
                const options = [];
                for (let i = year - 50; i < year + 50; i += 1) {
                  options.push(
                    <Select.Option
                      key={i}
                      value={i}
                      className="year-item"
                    >
                      {i}
                    </Select.Option>
                  );
                }
                return (
                  <div style={{ padding: 8 }}>
                    <Row gutter={8}>
                      <Col>
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          className="my-year-select"
                          value={year}
                          onChange={(newYear) => {
                            const now = value.clone().year(newYear);
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
                            const now = value.clone().month(newMonth);
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
              style={{
                top: "20px",
                width: "300px",
                border: "1px solid grey",
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
      {/* calendar: type = 'start_end_date' */}
      {calendar.type === "start_end_date" && (
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <DatePickerCustom
            disabled={disabled}
            locale={mergedJaPickerLocale}
            style={{ width: "49%", marginTop: "5px" }}
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
            style={{ width: "49%", marginTop: "5px" }}
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
      )}
      {errors?.[
        `message${messageIndex}_content${contentIndex}_${content.type}`
      ] && (
          <div style={{ color: "#FF7E00", fontSize: "12px" }}>
            {
              errors?.[
              `message${messageIndex}_content${contentIndex}_${content.type}`
              ]
            }
          </div>
        )}
    </div>
  )
};