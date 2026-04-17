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

export const shortestDeliverableDateJpFromOrderClockJst = (reference) => {
  const ref = reference
    ? moment.tz(reference, JST)
    : moment.tz(JST);
  const hour = ref.hour();
  const dayStart = ref.clone().startOf("day");
  const anchor =
    hour >= 14
      ? dayStart.clone().add(2, "days")
      : dayStart.clone().add(1, "day");
  const first = firstDeliverableOnOrAfter(anchor);
  return `${first.year()}年${first.month() + 1}月${first.date()}日`;
};

export { JST, isDeliverableWeekday, firstDeliverableOnOrAfter };
