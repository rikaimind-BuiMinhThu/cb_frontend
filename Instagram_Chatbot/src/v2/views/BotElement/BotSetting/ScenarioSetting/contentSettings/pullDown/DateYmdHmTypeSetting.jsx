import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { dataMonthFixed, dataDayFixed } from '../../constants/scenarioFormConstants';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import {
  renderHourRangeRow,
  renderHourMinuteEveryRow,
} from './pullDownFieldBlocks';

const DATE_YMD_HM_YEAR_OPTIONS = [
  { key: '2022', value: '2022' },
  { key: '2023', value: '2023' },
];

const DateYmdHmTypeSetting = (props) => {
  const {
    typeConfig,
    pullDownType,
    changeTimeField,
    changeTypeField,
    dataHour,
    dataMinutes,
    dataEveryMinute,
  } = buildPullDownSettingContext(props);

  const renderDateSelectors = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex">
        <SelectCustom
          className="ss-pull-down-setting__select--32"
          value={typeConfig?.year}
          data={DATE_YMD_HM_YEAR_OPTIONS}
          placeholder={PULL_DOWN_LABELS.year}
          onChange={changeTypeField('year')}
        />
        <SelectCustom
          className="ss-pull-down-setting__select--32"
          value={typeConfig?.month}
          data={dataMonthFixed}
          placeholder={PULL_DOWN_LABELS.month}
          onChange={changeTypeField('month')}
        />
        <SelectCustom
          className="ss-pull-down-setting__select--32"
          value={typeConfig?.day}
          data={dataDayFixed}
          placeholder={PULL_DOWN_LABELS.day}
          onChange={changeTypeField('day')}
        />
      </div>
    </div>
  );

  return (
    <>
      {renderDateSelectors()}
      {renderHourRangeRow({ typeConfig, pullDownType, changeTimeField })}
      {renderHourMinuteEveryRow({
        typeConfig,
        dataHour,
        dataMinutes,
        dataEveryMinute,
        changeTypeField,
      })}
    </>
  );
};

export default DateYmdHmTypeSetting;
