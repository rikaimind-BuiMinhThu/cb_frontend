import React, { useEffect } from "react";
import SelectCustom from "./SelectCustom";
import { CRAWL_ELEMENT_TYPES, CHATBOT_ACTIONS } from "../../PreviewComponent/Constants";

const LPIntegrationOptionPullDown = ({
  search_element_type,
  search_element_value,
  disabled,
  pullDown,
  onChange,
  data,
  postMessageToParent,
  targetElementType = CRAWL_ELEMENT_TYPES.SELECT,
  jsCode = "",
  keyValue="text",
  nameValue="text"
}) => {
  useEffect(() => {
    const crawlOption = {
      targetElementType,
      searchMode: search_element_type,
      searchAddress: search_element_value,
      searchJsCode: jsCode
    };
    postMessageToParent({
      actionData: crawlOption,
      action: CHATBOT_ACTIONS.CRAWL_DATA,
    });
  }, []);

  if (data === null) return null;

  return (
    <React.Fragment>
      <SelectCustom
        disabled={disabled}
        data={data}
        keyValue={keyValue}
        nameValue={nameValue}
        style={{ width: "100%" }}
        placeholder={pullDown?.customization?.display_unselected}
        value={pullDown?.[pullDown?.type]?.value || undefined}
        onChange={onChange}
      />
    </React.Fragment>
  );
};

export default LPIntegrationOptionPullDown;
