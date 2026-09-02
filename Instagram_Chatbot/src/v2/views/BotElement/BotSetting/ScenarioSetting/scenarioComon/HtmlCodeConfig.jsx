import { HtmlCodeMessage } from "v2/components/BotMessages";
import CheckboxCustom from "./CheckboxCustom";
import { useState } from "react";
import { BOT_MESSAGE_TYPES } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";

export default function HtmlCodeConfig({
  indexMessageSelect,
  indexContent = 0,
  config,
  onChangeValue,
}) {
  const messageType = BOT_MESSAGE_TYPES.HTML_CODE;

  const [htmlValidationError] = useState("");

  const onChangeContent = (value) => {
    onChangeValue(indexMessageSelect, indexContent, messageType, value, "content");
  };

  const onChangeUseAsUGC = (value) => {
    onChangeValue(indexMessageSelect, indexContent, messageType, value, "use_for_ugc");
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
