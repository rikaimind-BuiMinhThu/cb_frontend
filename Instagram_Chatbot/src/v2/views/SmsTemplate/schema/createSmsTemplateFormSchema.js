import * as yup from 'yup';
import {
  CONTENT_MAX,
  CONTENT_MAX_LENGTH,
  CONTENT_REQUIRED,
  NAME_MAX,
  NAME_MAX_LENGTH,
  NAME_REQUIRED,
} from '../constants';

const schema = yup.object({
  name: yup
    .string()
    .required(NAME_REQUIRED)
    .max(NAME_MAX_LENGTH, NAME_MAX),
  content: yup
    .string()
    .required(CONTENT_REQUIRED)
    .max(CONTENT_MAX_LENGTH, CONTENT_MAX),
});

export default schema;
