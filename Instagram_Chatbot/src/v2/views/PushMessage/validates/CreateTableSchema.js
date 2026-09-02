import * as yup from 'yup';
import {
  LAST_MESSAGE_REQUIRED,
  METHOD_EMAIL,
  METHOD_SMS,
  NAME_MAX,
  NAME_MAX_LENGTH,
  NAME_REQUIRED,
  SENDING_METHOD_REQUIRED,
  START_TIME_REQUIRED,
  TEMPLATE_REQUIRED,
} from '../constants';

const schema = yup.object({
  name: yup
    .string()
    .required(NAME_REQUIRED)
    .max(NAME_MAX_LENGTH, NAME_MAX),
  sending_method: yup
    .string()
    .required(SENDING_METHOD_REQUIRED)
    .oneOf([METHOD_EMAIL, METHOD_SMS])
    .default(METHOD_EMAIL),
  sending_template: yup.number().required(TEMPLATE_REQUIRED),
  start_time: yup.date().required(START_TIME_REQUIRED),
  is_exclude_time: yup.boolean(),
  exclude_start_time: yup.number(),
  exclude_end_time: yup.number(),
  exclude_push_time: yup.number(),
  last_message_datetime_since: yup.number().required(LAST_MESSAGE_REQUIRED),
});

export default schema;
