import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';

const TimezoneFromToPreview = ({ pullDown, dataHour, dataMinutes }) => {
  const typeConfig = pullDown[pullDown.type];

  const renderTimeBlock = () => (
  <>
    <div className="ss-pull-down-preview__fields-row">
      <SelectCustom
        data={dataHour}
        placeholder={PULL_DOWN_LABELS.hour}
        className="ss-pull-down-preview__select--half"
      />
      <SelectCustom
        data={dataMinutes}
        placeholder={PULL_DOWN_LABELS.minute}
        className="ss-pull-down-preview__select--half"
      />
    </div>
  </>
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
      {renderTimeBlock()}
      {renderRangeSeparator()}
      {renderTimeBlock()}
      {renderComment()}
    </div>
  );
};

export default TimezoneFromToPreview;
