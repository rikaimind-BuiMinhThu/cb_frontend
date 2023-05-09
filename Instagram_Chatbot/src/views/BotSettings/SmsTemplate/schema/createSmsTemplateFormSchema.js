import * as yup from "yup";

const schema = yup.object({
  name: yup
    .string()
    .required("テンプレート名は、必ず指定してください。")
    .max(50),
  content: yup
    .string()
    .required("メッセージは、必ず指定してください。")
    .max(200),
});

export default schema;
