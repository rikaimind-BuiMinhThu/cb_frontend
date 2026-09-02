import * as yup from "yup";

const schema = yup.object({
  name: yup
    .string()
    .required("テンプレート名は、必ず指定してください。")
    .max(50, "テンプレート名は50文字以下にしてください。"),
  content: yup
    .string()
    .required("メッセージは、必ず指定してください。")
    .max(200, "メッセージは200文字以下にしてください。"),
});

export default schema;
