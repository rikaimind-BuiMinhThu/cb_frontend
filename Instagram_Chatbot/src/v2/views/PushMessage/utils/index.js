export const hoursOptions = [...Array(24).keys()].map((each) => {
  const value = each < 10 ? "0" + each : each;
  return {
    value: +value,
    label: value,
  };
});

export const sinceHourOptions = [...Array(36).keys()].map((each) => {
  const value = each + 1 + "時間後";
  return {
    value: (each + 1) * 60,
    label: value,
  };
});

export const sinceMinutesOptions = [...Array(11).keys()].map((each) => {
  const value = (each + 1) * 5 + "分後";
  return {
    value: (each + 1) * 5,
    label: value,
  };
});

export const sinceOptions = [...sinceMinutesOptions, ...sinceHourOptions];
