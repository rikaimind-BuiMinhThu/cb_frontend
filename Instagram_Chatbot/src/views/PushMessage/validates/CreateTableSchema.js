import * as yup from 'yup';
import { parse, isDate } from 'moment';

const today = new Date();

const parseDateString = (value, originalValue) => {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, 'yyyy-MM-dd', new Date());

  return parsedDate;
};

const schema = yup.object({
  title: yup.string().required().min(2).max(40),
  email_id: yup.number().required(),
  last_message_datetime_since: yup.number().required(),
  excluded_time_from: yup.number(),
  excluded_time_to: yup.number(),
  alternate_send_time: yup.number(),
  started_at: yup.date().transform(parseDateString).min(today),
});

export default schema;
