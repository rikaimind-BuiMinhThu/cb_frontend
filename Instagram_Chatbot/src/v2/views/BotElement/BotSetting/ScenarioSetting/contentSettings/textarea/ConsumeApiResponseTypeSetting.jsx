import React from 'react';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import { dataConsumeApiResponse } from '../../constants/scenarioFormConstants';
import { buildTextareaSettingContext } from './textareaSettingContext';

const ConsumeApiResponseTypeSetting = (props) => {
  const { textarea } = props;
  const { changeContent } = buildTextareaSettingContext(props);

  const renderApiSelect = () => (
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        id="range"
        className="ss-select--full"
        value={textarea.consume_api_response}
        data={dataConsumeApiResponse}
        onChange={changeContent(textarea.type, 'consume_api_response')}
        keyValue="key"
      />
    </div>
  );

  return <>{renderApiSelect()}</>;
};

export default ConsumeApiResponseTypeSetting;
