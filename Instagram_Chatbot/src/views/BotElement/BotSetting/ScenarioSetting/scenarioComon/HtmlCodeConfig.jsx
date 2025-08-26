import { HtmlCodeMessage } from "components/BotMessages";
import CheckboxCustom from "./CheckboxCustom";
import { useState } from "react";
import { BOT_MESSAGE_TYPES } from "../../PreviewComponent/Constants";

export default function HtmlCodeConfig({
  indexMessageSelect,
  config,
  onChangeValue,
}) {
  const messageType = BOT_MESSAGE_TYPES.HTML_CODE;

  const [htmlValidationError, setHtmlvalidationError] = useState("");

  const onChangeContent = (value) => {
    onChangeValue(indexMessageSelect, 0, messageType, value, "content");
  };

  const onChangeUseAsUGC = (value) => {
    onChangeValue(indexMessageSelect, 0, messageType, value, "use_for_ugc");
  };

  const onChange = (type) => (e) => {
    switch (type) {
      case "content":
        onChangeContent(e);
        break;

      case "use_for_ugc":
        onChangeUseAsUGC(e);
        break;

      default:
        return;
    }
  };

  return (
    <>
      <HtmlCodeMessage
        value={config?.content || ""}
        onChange={onChange("content")}
        validationError={htmlValidationError}
      />
      <CheckboxCustom
        label={"UGCとして使用"}
        onChange={onChange("use_for_ugc")}
        value={!!config?.use_for_ugc}
      />
    </>
  );
}
