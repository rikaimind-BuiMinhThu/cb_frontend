import moment from "moment-timezone";

const JST = "Asia/Tokyo";

const isDeliverableWeekday = (m) => {
  const d = m.clone().startOf("day").day();
  return d >= 2 && d <= 6;
};

const firstDeliverableOnOrAfter = (startDayJst) => {
  let x = startDayJst.clone().startOf("day");
  for (let i = 0; i < 21; i += 1) {
    if (isDeliverableWeekday(x)) return x;
    x = x.add(1, "day");
  }
  return startDayJst.clone().startOf("day");
};

export const shortestDeliverableDateJpFromOrderClockJst = (reference, calendar) => {
  const ref = reference
    ? moment.tz(reference, JST)
    : moment.tz(JST);
  const t = calendar?.preview_delivery_cut_off_time;
  const m = String(t == null || t === "" ? "14:00" : t)
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);
  const ok = m && +m[1] >= 0 && +m[1] <= 23 && +m[2] >= 0 && +m[2] <= 59;
  const cutH = ok ? +m[1] : 14;
  const cutM = ok ? +m[2] : 0;
  const dayStart = ref.clone().startOf("day");
  const afterCut = ref.hour() * 60 + ref.minute() >= cutH * 60 + cutM;
  const anchor = afterCut ? dayStart.clone().add(1, "day") : dayStart.clone();
  const first = firstDeliverableOnOrAfter(anchor);
  return `${first.year()}年${first.month() + 1}月${first.date()}日`;
};

export { JST, isDeliverableWeekday, firstDeliverableOnOrAfter };
