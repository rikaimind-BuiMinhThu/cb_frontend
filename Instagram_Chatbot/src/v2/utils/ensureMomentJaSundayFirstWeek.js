import moment from "moment-timezone";
import "moment/locale/ja";

const localeState = { configured: false };

const JA_SHORT_WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"];

export const ensureMomentJaSundayFirstWeek = () => {
  if (localeState.configured) return;
  localeState.configured = true;
  moment.updateLocale("ja", {
    week: { dow: 0, doy: 6 },
    weekdaysMin: JA_SHORT_WEEK_DAYS.slice(),
    weekdaysShort: JA_SHORT_WEEK_DAYS.slice(),
  });
};

export const withJaShortWeekDays = (pickerLocale) => {
  if (!pickerLocale || !pickerLocale.lang) return pickerLocale;
  return {
    ...pickerLocale,
    lang: {
      ...pickerLocale.lang,
      shortWeekDays: JA_SHORT_WEEK_DAYS,
    },
  };
};
