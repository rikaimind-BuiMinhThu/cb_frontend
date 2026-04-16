import moment from "moment-timezone";

const JST = "Asia/Tokyo";

const isDeliverableWeekday = (m) => {
  const d = m.day();
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

export const shortestDeliverableDateJpFromOrderClockJst = (reference) => {
  const ref = reference
    ? moment.tz(reference, JST)
    : moment.tz(JST);
  const hour = ref.hour();
  let anchor = ref.clone().startOf("day");
  if (hour >= 14) anchor = anchor.add(1, "day");
  const first = firstDeliverableOnOrAfter(anchor);
  return `${first.year()}年${first.month() + 1}月${first.date()}日`;
};

export { JST, isDeliverableWeekday, firstDeliverableOnOrAfter };
