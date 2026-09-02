import React from 'react';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import InputCustom from '../../scenarioCommon/InputCustom';
import FukushashikiSearchRow from '../shared/FukushashikiSearchRow';
import {
  dataHourFixed,
  dataYearFixed,
} from '../../constants/scenarioFormConstants';
import {
  FUKUSHASHIKI_VARIANTS,
  PULL_DOWN_LABELS,
  PULL_DOWN_SORT_OPTIONS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';

export const renderHourRangeRow = ({
  typeConfig,
  pullDownType,
  changeTimeField,
}) => (
  <div className="ss-user-setting__item-bottom-flex-start">
    <span className="ss-user-setting-label ss-pull-down-setting__range-row">
      {PULL_DOWN_LABELS.rangeSetting}
    </span>
    <SelectCustom
      className="ss-pull-down-setting__select--18"
      value={typeConfig?.start_at}
      placeholder={PULL_DOWN_LABELS.startHour}
      data={dataHourFixed.filter(
        (item) => parseInt(item.value, 10) <= parseInt(typeConfig?.end_at || '23', 10),
      )}
      onChange={changeTimeField('start_at', 'dataHour')}
    />
    <span className="ss-pull-down-setting__range-separator">{PULL_DOWN_LABELS.rangeSeparator}</span>
    <SelectCustom
      className="ss-pull-down-setting__select--18"
      placeholder={PULL_DOWN_LABELS.endHour}
      value={typeConfig?.end_at}
      data={dataHourFixed.filter(
        (item) => parseInt(item.value, 10) > parseInt(typeConfig?.start_at || '0', 10),
      )}
      onChange={changeTimeField('end_at', 'dataHour')}
    />
  </div>
);

export const renderYearRangeRow = ({
  typeConfig,
  changeTimeField,
  showSort = false,
  changeTypeField,
}) => (
  <div className="ss-user-setting__item-bottom-flex-start">
    <span className="ss-user-setting-label ss-pull-down-setting__range-row">
      {PULL_DOWN_LABELS.rangeSetting}
    </span>
    <SelectCustom
      className="ss-pull-down-setting__select--18"
      value={typeConfig?.start_year}
      placeholder={PULL_DOWN_LABELS.startYear}
      data={dataYearFixed.filter(
        (item) => parseInt(item.value, 10) < parseInt(typeConfig?.end_year || '2072', 10),
      )}
      onChange={changeTimeField('start_year', 'dataYear')}
    />
    <span className="ss-pull-down-setting__range-separator">{PULL_DOWN_LABELS.rangeSeparator}</span>
    <SelectCustom
      className="ss-pull-down-setting__select--18"
      placeholder={PULL_DOWN_LABELS.endYear}
      value={typeConfig?.end_year}
      data={dataYearFixed.filter(
        (item) => parseInt(item.value, 10) > parseInt(typeConfig?.start_year || '1935', 10),
      )}
      onChange={changeTimeField('end_year', 'dataYear')}
    />
    {showSort && (
      <SelectCustom
        className="ss-pull-down-setting__select--29"
        placeholder={PULL_DOWN_LABELS.sort}
        value={typeConfig?.sort}
        data={PULL_DOWN_SORT_OPTIONS}
        onChange={changeTypeField('sort')}
      />
    )}
  </div>
);

export const renderCommentInput = ({ typeConfig, changeTypeField, className = 'ss-pull-down-setting__input--90' }) => (
  <div className="ss-user-setting__item-bottom">
    <InputCustom
      className={className}
      placeholder={SETTING_PLACEHOLDERS.comment}
      value={typeConfig?.comment}
      onChange={changeTypeField('comment')}
    />
  </div>
);

export const renderFukushashikiField = ({
  mode,
  inputValue,
  onModeChange,
  onInputChange,
  rowClassName = 'ss-user-setting__item-bottom ss-pull-down-setting__fukushashiki-row',
  withTooltip = true,
}) => (
  <FukushashikiSearchRow
    mode={mode}
    inputValue={inputValue ?? ''}
    onModeChange={onModeChange}
    onInputChange={onInputChange}
    variant={withTooltip ? FUKUSHASHIKI_VARIANTS.COMPACT : FUKUSHASHIKI_VARIANTS.COMPACT}
    useFukushashiki
    maxLength={250}
    rowClassName={rowClassName}
  />
);

export const renderHourMinuteEveryRow = ({
  typeConfig,
  dataHour,
  dataMinutes,
  dataEveryMinute,
  changeTypeField,
  includeComment = true,
}) => (
  <div className="ss-user-setting__item-bottom">
    <div className="ss-user-setting__item-select-bottom-wrapper-flex">
      <SelectCustom
        className="ss-pull-down-setting__select--24"
        value={typeConfig?.time}
        data={dataHour}
        placeholder={PULL_DOWN_LABELS.hour}
        onChange={changeTypeField('time')}
      />
      <SelectCustom
        className="ss-pull-down-setting__select--24"
        value={typeConfig?.minute}
        data={dataMinutes}
        placeholder={PULL_DOWN_LABELS.minute}
        onChange={changeTypeField('minute')}
      />
      <SelectCustom
        className="ss-pull-down-setting__select--24"
        value={typeConfig?.every_minute}
        data={dataEveryMinute}
        placeholder={PULL_DOWN_LABELS.everyMinute}
        onChange={changeTypeField('every_minute')}
      />
      {includeComment && (
        <InputCustom
          className="ss-pull-down-setting__select--24"
          placeholder={SETTING_PLACEHOLDERS.comment}
          value={typeConfig?.comment}
          onChange={changeTypeField('comment')}
        />
      )}
    </div>
  </div>
);

export const renderYearMonthDayRow = ({
  typeConfig,
  dataYear,
  dataMonth,
  dataDay,
  changeTypeField,
  includeComment = true,
  yearData = dataYear,
  monthData = dataMonth,
  dayData = dataDay,
  wrap = false,
}) => (
  <div className="ss-user-setting__item-bottom">
    <div className={`ss-user-setting__item-select-bottom-wrapper-flex ${wrap ? 'ss-pull-down-setting__fields-row--wrap' : ''}`.trim()}>
      <SelectCustom
        className="ss-pull-down-setting__select--32"
        value={typeConfig?.year}
        data={yearData}
        placeholder={PULL_DOWN_LABELS.year}
        onChange={changeTypeField('year')}
      />
      <SelectCustom
        className="ss-pull-down-setting__select--32"
        value={typeConfig?.month}
        data={monthData}
        placeholder={PULL_DOWN_LABELS.month}
        onChange={changeTypeField('month')}
      />
      <SelectCustom
        className="ss-pull-down-setting__select--32"
        value={typeConfig?.day}
        data={dayData}
        placeholder={PULL_DOWN_LABELS.day}
        onChange={changeTypeField('day')}
      />
      {includeComment && (
        <InputCustom
          className={wrap ? 'ss-pull-down-setting__input--32-mt' : 'ss-pull-down-setting__select--32'}
          placeholder={SETTING_PLACEHOLDERS.comment}
          value={typeConfig?.comment}
          onChange={changeTypeField('comment')}
        />
      )}
    </div>
  </div>
);

export const renderYearMonthRow = ({
  typeConfig,
  dataYear,
  dataMonth,
  changeTypeField,
  includeComment = true,
}) => (
  <div className="ss-user-setting__item-bottom">
    <div className="ss-user-setting__item-select-bottom-wrapper-flex">
      <SelectCustom
        className="ss-pull-down-setting__select--32"
        value={typeConfig?.year}
        data={dataYear}
        placeholder={PULL_DOWN_LABELS.year}
        onChange={changeTypeField('year')}
      />
      <SelectCustom
        className="ss-pull-down-setting__select--32"
        value={typeConfig?.month}
        data={dataMonth}
        placeholder={PULL_DOWN_LABELS.month}
        onChange={changeTypeField('month')}
      />
      {includeComment && (
        <InputCustom
          className="ss-pull-down-setting__select--32"
          placeholder={SETTING_PLACEHOLDERS.comment}
          value={typeConfig?.comment}
          onChange={changeTypeField('comment')}
        />
      )}
    </div>
  </div>
);
