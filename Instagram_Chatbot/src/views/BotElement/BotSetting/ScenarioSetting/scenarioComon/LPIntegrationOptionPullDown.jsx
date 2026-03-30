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
  nameValue="text",
  hidden = false
}) => {
  useEffect(() => {
    if (hidden) return;

    const crawlOption = {
      targetElementType,
      searchMode: search_element_type,
      searchAddress: search_element_value,
      searchJsCode: jsCode,
      dontDisplayEmptyOption: pullDown.dont_display_empty_option
    };

    postMessageToParent({
      actionData: crawlOption,
      action: CHATBOT_ACTIONS.CRAWL_DATA,
    });
  }, [hidden]);

  if (data === null || data === undefined) return null;
  const selectWidth = pullDown.with_suffix ? '70%' : '100%';

  return (
    <React.Fragment>
      <SelectCustom
        disabled={disabled}
        data={data}
        keyValue={keyValue}
        nameValue={nameValue}
        style={{ width: selectWidth }}
        placeholder={pullDown?.customization?.display_unselected}
        value={pullDown?.[pullDown?.type]?.value || undefined}
        onChange={onChange}
      />
      {
        pullDown.with_suffix && (
          <label style={{ width: '30%' }}>{pullDown.lp_integration_option_text}</label>
        )
      }
    </React.Fragment>
  );
};

export default LPIntegrationOptionPullDown;
