import * as yup from "yup";

const schema = yup.object({
  name: yup
    .string()
    .required("プッシュメッセージ名は、必ず指定してください。")
    .max(40, "プッシュメッセージ名は40文字以下にしてください。"),
  sending_method: yup
    .string()
    .required("送信方法は、必ず指定してください。")
    .oneOf(["email", "sms"])
    .default("email"),
  sending_template: yup.number().required("鋳型は、必ず指定してください。"),
  start_time: yup.date().required("開始日時は、必ず指定してください。"),
  is_exclude_time: yup.boolean(),
  exclude_start_time: yup.number(),
  exclude_end_time: yup.number(),
  exclude_push_time: yup.number(),
  last_message_datetime_since: yup.number().required("最終メッセージ日時は、必ず指定してください。"),
});

export default schema;
