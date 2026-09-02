import React from 'react';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';

const DateYmdPreview = ({ pullDown, dataYear, dataMonth, dataDay }) => {
  const typeConfig = pullDown[pullDown.type];

  const renderSelectors = () => (
    <div className="ss-pull-down-preview__fields-row--wrap">
      <SelectCustom
        data={dataYear}
        placeholder={PULL_DOWN_LABELS.year}
        className="ss-pull-down-preview__select--third"
      />
      <SelectCustom
        data={dataMonth}
        placeholder={PULL_DOWN_LABELS.month}
        className="ss-pull-down-preview__select--third"
      />
      <SelectCustom
        data={dataDay}
        placeholder={PULL_DOWN_LABELS.day}
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

export default DateYmdPreview;
