import moment from 'moment';
import { CALENDAR_TYPES } from '../../constants/contentTypeConstants';
import {
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
} from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/scenarioCalendarUtils';

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
        let i = 0;
        let dateSelect = moment().add(i, 'days').format('YYYY-MM-DD');
        while (handleDisableDateCalendar(moment().add(i, 'days'), calendar)) {
          if (i === 100) {
            dateSelect = null;
            break;
          }
          dateSelect = moment().add(i + 1, 'days').format('YYYY-MM-DD');
          i += 1;
        }
        onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, dateSelect, 'date_selection_test');
      } else {
        let i = 0;
        let startDateSelect;
        let endDateSelect;
        while (handleDisableDateCalendar(moment().add(i, 'days'), calendar)) {
          if (i === 100) {
            startDateSelect = null;
            endDateSelect = null;
            break;
          }
          startDateSelect = moment().add(i + 1, 'days');
          endDateSelect = moment().add(i + 1, 'days');
          i += 1;
        }
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
