import React, { useState, useEffect } from "react";
import SelectCustom from "./SelectCustom";

const LPIntegrationOptionPullDown = ({
  search_element_type,
  search_element_value,
  disabled,
  pullDown,
  onChange,
  data
}) => {
  useEffect(() => {
    const crawObject = {
        type: "lp_integration_option",
        searchMode: search_element_type,
        searchAddress: search_element_value,
        action: "craw",
      };
    
    window.parent.postMessage(
      {
        isOpen: true,
        widthPc: 450,
        heightPc: 700,
        widthSp: 100,
        heightSp: 100,
        chatbotRight: 10,
        chatbotBottom: 10,
        fukushashikiResponse: undefined,
        getErrorMessage: undefined,
        actionSDK: crawObject,
      },
      "*"
    );

    return;
  }, []);

  if (data === null) return null;

  return (
    <React.Fragment>
      <SelectCustom
        disabled={disabled}
        data={data}
        keyValue="text"
        nameValue="text"
        style={{ width: "100%" }}
        placeholder={pullDown?.customization?.display_unselected}
        value={pullDown?.[pullDown?.type]?.value || undefined}
        onChange={onChange}
      />
    </React.Fragment>
  );
};

export default LPIntegrationOptionPullDown;
