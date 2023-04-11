import * as yup from "yup";

const schema = yup.object({
    title: yup.string().required().min(2).max(40),
    email_id: yup.number().required(),
    last_message_datetime_since: yup.number().required(),
});

export default schema;