import React, { useEffect } from "react";
import SelectCustom from "./SelectCustom";
import { CRAWL_ELEMENT_TYPES, CHATBOT_ACTIONS } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";

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
  const hasData = Boolean(data && data.length > 0);
  useEffect(() => {
    if (hidden || hasData) return;

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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-once parent postMessage
  }, [hidden, hasData]);

  if (data === null || data === undefined) return null;
  const selectWidthClass = pullDown.with_suffix ? 'ss-select--70' : 'ss-select--full';

  return (
    <React.Fragment>
      <SelectCustom
        disabled={disabled}
        data={data}
        keyValue={keyValue}
        nameValue={nameValue}
        className={selectWidthClass}
        placeholder={pullDown?.customization?.display_unselected}
        value={pullDown?.[pullDown?.type]?.value || undefined}
        onChange={onChange}
      />
      {
        pullDown.with_suffix && (
          <label className="ss-lp-option-suffix">{pullDown.lp_integration_option_text}</label>
        )
      }
    </React.Fragment>
  );
};

export default LPIntegrationOptionPullDown;
