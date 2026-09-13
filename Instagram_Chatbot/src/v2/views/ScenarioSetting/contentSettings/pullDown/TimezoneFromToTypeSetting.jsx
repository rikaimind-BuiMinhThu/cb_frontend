import React from 'react';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import {
  renderHourRangeRow,
  renderCommentInput,
} from './pullDownFieldBlocks';

const TimezoneFromToTypeSetting = (props) => {
  const {
    typeConfig,
    pullDownType,
    changeTimeField,
    changeTypeField,
    dataHour,
    dataMinutes,
    dataEveryMinute,
  } = buildPullDownSettingContext(props);

  const renderTimezoneBlock = (prefix) => (
    <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-pull-down-setting__timezone-block">
      <SelectCustom
        className="ss-pull-down-setting__select--48"
        value={typeConfig?.[`hour_${prefix}`]}
        data={dataHour}
        placeholder={PULL_DOWN_LABELS.hour}
        onChange={changeTypeField(`hour_${prefix}`)}
      />
      <SelectCustom
        className="ss-pull-down-setting__select--48"
        value={typeConfig?.[`minute_${prefix}`]}
        data={dataMinutes}
        placeholder={PULL_DOWN_LABELS.minute}
        onChange={changeTypeField(`minute_${prefix}`)}
      />
      <SelectCustom
        className="ss-pull-down-setting__select--48-mt"
        value={typeConfig?.[`every_minute_${prefix}`]}
        data={dataEveryMinute}
        placeholder={PULL_DOWN_LABELS.everyMinute}
        onChange={changeTypeField(`every_minute_${prefix}`)}
      />
    </div>
  );

  const renderTimezoneSelectors = () => (
    <div className="ss-user-setting__item-bottom ss-pull-down-setting__timezone-row">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-pull-down-setting__timezone-row">
        {renderTimezoneBlock('start_at')}
        <span>{PULL_DOWN_LABELS.rangeSeparator}</span>
        {renderTimezoneBlock('end_at')}
      </div>
    </div>
  );

  return (
    <>
      {renderHourRangeRow({ typeConfig, pullDownType, changeTimeField })}
      {renderTimezoneSelectors()}
      {renderCommentInput({ typeConfig, changeTypeField })}
    </>
  );
};

export default TimezoneFromToTypeSetting;
