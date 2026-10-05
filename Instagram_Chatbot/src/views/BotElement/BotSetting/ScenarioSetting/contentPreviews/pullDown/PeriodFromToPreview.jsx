import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';

const PeriodFromToPreview = ({ pullDown, dataYear, dataMonth, dataDay }) => {
  const typeConfig = pullDown[pullDown.type];

  const renderDateBlock = () => (
    <div className="ss-pull-down-preview__fields-row">
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
    </div>
  );

  const renderRangeSeparator = () => (
    <div className="ss-pull-down-preview__range-separator">{PULL_DOWN_LABELS.rangeSeparator}</div>
  );

  const renderComment = () => (
    <div className="ss-message__content--user-pull_down-comment ss-pull-down-preview__comment--bottom">
      <span>{typeConfig.comment}</span>
    </div>
  );

  return (
    <div className="ss-message__content--user-pull_down--time_hm">
      {renderDateBlock()}
      {renderRangeSeparator()}
      {renderDateBlock()}
      {renderComment()}
    </div>
  );
};

export default PeriodFromToPreview;
