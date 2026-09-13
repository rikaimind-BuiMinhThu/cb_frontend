import React from 'react';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';

const TimeHmPreview = ({ pullDown, dataHour, dataMinutes }) => {
  const typeConfig = pullDown[pullDown.type];

  const renderSelectors = () => (
    <div className="ss-pull-down-preview__fields-row">
      <SelectCustom
        data={dataHour}
        placeholder={PULL_DOWN_LABELS.hour}
        className="ss-pull-down-preview__select--third"
      />
      <SelectCustom
        data={dataMinutes}
        placeholder={PULL_DOWN_LABELS.minute}
        className="ss-pull-down-preview__select--third"
      />
      <div className="ss-message__content--user-pull_down-comment ss-pull-down-preview__comment-inline">
        <span>{typeConfig.comment}</span>
      </div>
    </div>
  );

  return (
    <div className="ss-message__content--user-pull_down--time_hm">
      {renderSelectors()}
    </div>
  );
};

export default TimeHmPreview;
