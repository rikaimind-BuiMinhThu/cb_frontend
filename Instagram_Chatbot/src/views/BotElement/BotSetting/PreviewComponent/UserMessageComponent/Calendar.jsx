import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES, CART_SYSTEM } from "../Constants";
import DatePickerCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/DatePickerCustom";
import moment from "moment-timezone";
import { Select, Radio, Row, Col, Calendar as AntdCalendar } from "antd";
import {
  firstDeliverableOnOrAfter,
  isDeliverableWeekday,
} from "../../deliveryDateRules";

function isCalendarPreviewRelativeOn(calendar) {
  const v = calendar?.preview_relative_range_enabled;
  return v === true || v === 1 || v === "true" || v === "1";
}

const JST = "Asia/Tokyo";

function getPreviewRelativeAnchorDayJst() {
  const nowJst = moment.tz(JST);
  const dayStart = nowJst.clone().startOf("day");
  return nowJst.hour() >= 14
    ? dayStart.clone().add(2, "days")
    : dayStart.clone().add(1, "day");
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

function isDeliveryDateCalendar(cal) {
  return String(cal?.save_input_content ?? "").trim() === "delivery_date";
}

function isSundayOrMondayJst(current) {
  const d = moment.tz(current, JST).startOf("day");
  const dow = d.day();
  return dow === 0 || dow === 1;
}

function isShopifyCartSystem(cartSystem) {
  return String(cartSystem ?? "").toLowerCase() === CART_SYSTEM.SHOPIFY;
}

export function mergeCalendarForPreviewRelativeRange(calendar, cartSystem = "") {
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

  const anchor = getPreviewRelativeAnchorDayJst();

  let effStart = anchor.clone().add(daysFromToday, "days");
  if (cfgStartOk && effStart.isBefore(cfgStart)) effStart = cfgStart.clone();
  if (cfgEndOk && effStart.isAfter(cfgEnd)) effStart = cfgEnd.clone();

  let endAnchor = anchor.clone().add(daysFromToday, "days");
  if (cfgStartOk && endAnchor.isBefore(cfgStart)) endAnchor = cfgStart.clone();
  if (cfgEndOk && endAnchor.isAfter(cfgEnd)) endAnchor = cfgEnd.clone();

  let effEnd;
  if (daysFromEnd > 0) {
    effEnd = endAnchor.clone().add(daysFromEnd - 1, "days");
  } else if (daysFromEnd < 0) {
    effEnd = endAnchor.clone().add(daysFromEnd, "days");
  } else {
    effEnd = endAnchor.clone();
  }
  if (cfgStartOk && effEnd.isBefore(cfgStart)) effEnd = cfgStart.clone();
  if (cfgEndOk && effEnd.isAfter(cfgEnd)) effEnd = cfgEnd.clone();
  if (effStart.isAfter(effEnd)) effEnd = effStart.clone();

  if (isDeliveryDateCalendar(calendar) && isShopifyCartSystem(cartSystem)) {
    let effStartJ = moment.tz(effStart.format("YYYY-MM-DD"), "YYYY-MM-DD", JST).startOf("day");
    if (effStartJ.day() === 0 || effStartJ.day() === 1) {
      effStartJ = firstDeliverableOnOrAfter(effStartJ);
    }
    const nowJst = moment.tz(JST);
    const deliverableSlots = nowJst.hour() >= 14 ? 6 : 7;
    let effEndJ = endDateInclusiveForDeliverableDayCount(
      effStartJ,
      deliverableSlots,
      cfgEndOk ? cfgEnd : null
    );
    if (effStartJ.isAfter(effEndJ, "day")) effEndJ = effStartJ.clone();
    effStart = effStartJ;
    effEnd = effEndJ;
  }

  const merged = {
    ...calendar,
    start_date: effStart.format("YYYY-MM-DD"),
    end_date: effEnd.format("YYYY-MM-DD"),
  };
  delete merged.aggregation_target_period_from;
  delete merged.aggregation_target_period_to;
  return merged;
}

/** True when the day is strictly before start_date or after end_date (inclusive range allowed). */
function isDateOutsideCalendarConfiguredRange(current, cal) {
  if (!cal) return false;
  const startStr = String(cal.start_date ?? "").trim();
  const endStr = String(cal.end_date ?? "").trim();
  if (!startStr || !endStr) return false;
  const d = moment(current).startOf("day");
  const minD = moment(startStr, "YYYY-MM-DD").startOf("day");
  const maxD = moment(endStr, "YYYY-MM-DD").startOf("day");
  if (!minD.isValid() || !maxD.isValid()) return false;
  return d.isBefore(minD) || d.isAfter(maxD);
}

export default function Calendar({ content, messageIndex, contentIndex, onChangeValue, errors, disabled, locale, cartSystem = "",}) {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.CALENDAR) return null;

  const calendar = content.calendar;

  const handleDisableDateCalendar = (current, calendar) => {
    if (
      calendar.end_date ||
      calendar.start_date ||
      calendar?.fixed_date?.length !== 0 ||
      calendar?.non_select_date_time?.length !== 0 ||
      calendar.aggregation_target_period_from ||
      calendar.aggregation_target_period_to ||
      calendar.end_date_select
    ) {
      return (
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
        calendar.non_select_date_time?.find((type) => {
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
            return moment(current).day() === 1;
          } else if (type === "fire") {
            return moment(current).day() === 2;
          } else if (type === "water") {
            return moment(current).day() === 3;
          } else if (type === "wood") {
            return moment(current).day() === 4;
          } else if (type === "money") {
            return moment(current).day() === 5;
          } else if (type === "soil") {
            return moment(current).day() === 6;
          } else if (type === "day") {
            return moment(current).day() === 0;
          }
        })
      );
    }
  };

  const handleDisableEndDateCalendar = (current, calendar) => {
    if (
      calendar.end_date ||
      calendar.start_date ||
      calendar?.fixed_date?.length !== 0 ||
      calendar?.non_select_date_time?.length !== 0 ||
      calendar.start_date_select ||
      calendar.specified_period_from ||
      calendar.specified_period_to ||
      calendar.aggregation_target_period_from ||
      calendar.aggregation_target_period_to
    ) {
      return (
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
        calendar.non_select_date_time?.find((type) => {
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
            return moment(current).day() === 1;
          } else if (type === "fire") {
            return moment(current).day() === 2;
          } else if (type === "water") {
            return moment(current).day() === 3;
          } else if (type === "wood") {
            return moment(current).day() === 4;
          } else if (type === "money") {
            return moment(current).day() === 5;
          } else if (type === "soil") {
            return moment(current).day() === 6;
          } else if (type === "day") {
            return moment(current).day() === 0;
          }
        })
      );
    }
  };

  const calendarForPreviewDisable = isCalendarPreviewRelativeOn(calendar)
    ? mergeCalendarForPreviewRelativeRange(calendar, cartSystem)
    : calendar;

  const previewDisableDateStart = (current) => {
    if (handleDisableDateCalendar(current, calendarForPreviewDisable)) return true;
    if (isDateOutsideCalendarConfiguredRange(current, calendarForPreviewDisable)) return true;
    if (
      isShopifyCartSystem(cartSystem) &&
      isDeliveryDateCalendar(calendarForPreviewDisable) &&
      isSundayOrMondayJst(current)
    ) {
      return true;
    }
    return false;
  };

  const previewDisableDateEnd = (current) => {
    if (handleDisableEndDateCalendar(current, calendarForPreviewDisable)) return true;
    if (isDateOutsideCalendarConfiguredRange(current, calendarForPreviewDisable)) return true;
    if (
      isShopifyCartSystem(cartSystem) &&
      isDeliveryDateCalendar(calendarForPreviewDisable) &&
      isSundayOrMondayJst(current)
    ) {
      return true;
    }
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
          locale={locale || "ja"}
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
            locale={locale}
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
              locale={locale}
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