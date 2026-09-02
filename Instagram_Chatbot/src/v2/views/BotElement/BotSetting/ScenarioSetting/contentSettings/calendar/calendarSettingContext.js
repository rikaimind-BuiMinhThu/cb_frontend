import moment from 'moment';
import { CALENDAR_TYPES } from '../../constants/contentTypeConstants';
import {
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
} from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/scenarioCalendarUtils';

const findFirstSelectableCalendarDate = (calendar, maxAttempts = 100) => {
  const attemptIndices = Array.from({ length: maxAttempts + 1 }, (_, index) => index);
  const match = attemptIndices.find((index) => (
    !handleDisableDateCalendar(moment().add(index, 'days'), calendar)
  ));
  if (match === undefined) return null;
  return moment().add(match, 'days').format('YYYY-MM-DD');
};

const findFirstSelectableStartEndDates = (calendar, maxAttempts = 100) => {
  if (!handleDisableDateCalendar(moment(), calendar)) {
    return { startDateSelect: undefined, endDateSelect: undefined };
  }
  const scan = { index: 0, startDateSelect: undefined, endDateSelect: undefined };
  while (handleDisableDateCalendar(moment().add(scan.index, 'days'), calendar)) {
    if (scan.index === maxAttempts) {
      return { startDateSelect: null, endDateSelect: null };
    }
    const nextDate = moment().add(scan.index + 1, 'days');
    scan.startDateSelect = nextDate;
    scan.endDateSelect = nextDate.clone();
    scan.index += 1;
  }
  return { startDateSelect: scan.startDateSelect, endDateSelect: scan.endDateSelect };
};

export const buildCalendarSettingContext = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    onChangeValueMessageContent,
    onChangeFixedDate,
    dataMessages,
    setDataMessages,
  } = props;

  const calendar = content.calendar;

  const changeCalendar = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const changeCalendarNested = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) => {
    dataMessages[indexMessageSelect][field] = value;
    setDataMessages([...dataMessages]);
  };

  const handleInitialSelectionChange = (value) => {
    if (value === true) {
      if (calendar.type !== CALENDAR_TYPES.START_END_DATE) {
        const dateSelect = findFirstSelectableCalendarDate(calendar);
        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateSelect, 'date_selection_test');
      } else {
        const { startDateSelect, endDateSelect } = findFirstSelectableStartEndDates(calendar);
        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, startDateSelect, 'start_date_test');
        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, endDateSelect, 'end_date_test');
      }
    } else {
      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'date_selection_test');
      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'date_select');
      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'start_date_select');
      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'end_date_select');
      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'start_date_test');
      onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, null, 'end_date_test');
    }
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'initial_selection');
  };

  return {
    calendar,
    changeCalendar,
    changeCalendarNested,
    changeMessageField,
    handleInitialSelectionChange,
    handleDisableDateCalendar,
    handleDisableEndDateCalendar,
    onChangeFixedDate: (dateString) =>
      onChangeFixedDate(indexMessageSelect, indexContent, content.type, dateString, 'fixed_date'),
  };
};
