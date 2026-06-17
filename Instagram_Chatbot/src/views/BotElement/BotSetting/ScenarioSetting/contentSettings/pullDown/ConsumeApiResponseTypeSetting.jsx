import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { dataConsumeApiResponse } from '../../constants/scenarioFormConstants';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';
import { buildPullDownSettingContext } from './pullDownSettingContext';

const ConsumeApiResponseTypeSetting = (props) => {
  const { typeConfig, pullDownType, changeContent } = buildPullDownSettingContext(props);

  const renderApiSelector = () => (
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        className="ss-pull-down-setting__input--90"
        value={typeConfig}
        placeholder={PULL_DOWN_LABELS.selectApi}
        data={dataConsumeApiResponse}
        onChange={changeContent(pullDownType)}
      />
    </div>
  );

  return <>{renderApiSelector()}</>;
};

export default ConsumeApiResponseTypeSetting;
