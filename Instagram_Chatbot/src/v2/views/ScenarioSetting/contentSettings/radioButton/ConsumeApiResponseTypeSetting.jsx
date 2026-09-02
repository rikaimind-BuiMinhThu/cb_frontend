import React from 'react';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import { dataConsumeApiResponse } from '../../constants/scenarioFormConstants';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';

const ConsumeApiResponseTypeSetting = (props) => {
  const { radioButton } = props;
  const { changeContent } = buildRadioButtonSettingContext(props);

  const renderApiSelect = () => (
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        id="range"
        className="ss-select--full"
        value={radioButton.consume_api_response}
        data={dataConsumeApiResponse}
        onChange={changeContent('consume_api_response')}
        keyValue="key"
      />
    </div>
  );

  return <>{renderApiSelect()}</>;
};

export default ConsumeApiResponseTypeSetting;
