import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { dataConsumeApiResponse } from '../../constants/scenarioFormConstants';
import { buildCheckboxSettingContext } from './checkboxSettingContext';

const ConsumeApiResponseTypeSetting = (props) => {
  const { checkbox } = props;
  const { indexMessageSelect, indexContent, changeContent } = buildCheckboxSettingContext(props);

  const renderApiSelect = () => (
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        id="range"
        className="ss-select--full"
        value={checkbox.consume_api_response}
        data={dataConsumeApiResponse}
        onChange={(value) => {
          // preserve original signature: content type 'checkbox' not content.type
          props.onChangeValueMessageContent(
            indexMessageSelect,
            indexContent,
            'checkbox',
            value,
            'consume_api_response',
          );
        }}
        keyValue="key"
      />
    </div>
  );

  return <>{renderApiSelect()}</>;
};

export default ConsumeApiResponseTypeSetting;
