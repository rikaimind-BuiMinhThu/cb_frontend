import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import { renderCommentInput } from './pullDownFieldBlocks';

const PeriodFromToTypeSetting = (props) => {
  const {
    typeConfig,
    changeTypeField,
    dataYear,
    dataMonth,
    dataDay,
  } = buildPullDownSettingContext(props);

  const renderPeriodBlock = (prefix) => (
    <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-pull-down-setting__timezone-block">
      <SelectCustom
        className="ss-pull-down-setting__select--48"
        value={typeConfig?.[`year_${prefix}`]}
        data={dataYear}
        placeholder={PULL_DOWN_LABELS.year}
        onChange={changeTypeField(`year_${prefix}`)}
      />
      <SelectCustom
        className="ss-pull-down-setting__select--48"
        value={typeConfig?.[`month_${prefix}`]}
        data={dataMonth}
        placeholder={PULL_DOWN_LABELS.month}
        onChange={changeTypeField(`month_${prefix}`)}
      />
      <SelectCustom
        className="ss-pull-down-setting__select--48-mt"
        value={typeConfig?.[`day_${prefix}`]}
        data={dataDay}
        placeholder={PULL_DOWN_LABELS.day}
        onChange={changeTypeField(`day_${prefix}`)}
      />
    </div>
  );

  const renderPeriodSelectors = () => (
    <div className="ss-user-setting__item-bottom ss-pull-down-setting__timezone-row">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-pull-down-setting__timezone-row">
        {renderPeriodBlock('start_at')}
        <span>{PULL_DOWN_LABELS.rangeSeparator}</span>
        {renderPeriodBlock('end_at')}
      </div>
    </div>
  );

  return (
    <>
      {renderPeriodSelectors()}
      {renderCommentInput({ typeConfig, changeTypeField })}
    </>
  );
};

export default PeriodFromToTypeSetting;
