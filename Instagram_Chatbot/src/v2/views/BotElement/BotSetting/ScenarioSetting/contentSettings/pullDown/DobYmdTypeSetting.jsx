import React from 'react';
import {
  dataYearFixed,
  dataMonthFixed,
  dataDayFixed,
} from '../../constants/scenarioFormConstants';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import {
  renderYearRangeRow,
  renderYearMonthDayRow,
  renderFukushashikiField,
} from './pullDownFieldBlocks';

const DobYmdTypeSetting = (props) => {
  const {
    typeConfig,
    changeTimeField,
    changeTypeField,
    changeMessageField,
    messageContent,
    isUseFukushashiki,
  } = buildPullDownSettingContext(props);

  const renderDobNote = () => (
    <div className="ss-user-setting__item-bottom ss-pull-down-setting__dob-note-row">
      <span className="ss-pull-down-setting__dob-note">{PULL_DOWN_LABELS.initialDobNote}</span>
    </div>
  );

  const renderHideDayCheckbox = () => (
    <div className="ss-user-setting__item-bottom ss-pull-down-setting__dob-checkbox-row">
      <div className="ss-user-setting-checkbox-custom_css">
        <input
          type="checkbox"
          className="ss-user-setting-checkbox-custom"
          onChange={(e) => changeTypeField('is_hide_day')(e.target.checked)}
          checked={typeConfig?.is_hide_day || false}
        />
        <label className="ss-pull-down-setting__dob-checkbox-label">{PULL_DOWN_LABELS.hideDay}</label>
      </div>
    </div>
  );

  const renderFukushashikiYear = () => {
    if (!isUseFukushashiki) return null;
    return renderFukushashikiField({
      mode: messageContent?.valueYear_fukushashiki_search_mode,
      inputValue: messageContent?.valueYear_fukushashiki_search_value,
      onModeChange: changeMessageField('valueYear_fukushashiki_search_mode'),
      onInputChange: changeMessageField('valueYear_fukushashiki_search_value'),
    });
  };

  const renderFukushashikiMonth = () => {
    if (!isUseFukushashiki) return null;
    return renderFukushashikiField({
      mode: messageContent?.valueMonth_fukushashiki_search_mode,
      inputValue: messageContent?.valueMonth_fukushashiki_search_value,
      onModeChange: changeMessageField('valueMonth_fukushashiki_search_mode'),
      onInputChange: changeMessageField('valueMonth_fukushashiki_search_value'),
    });
  };

  const renderFukushashikiDay = () => {
    if (!isUseFukushashiki) return null;
    return renderFukushashikiField({
      mode: messageContent?.valueDay_fukushashiki_search_mode,
      inputValue: messageContent?.valueDay_fukushashiki_search_value,
      onModeChange: changeMessageField('valueDay_fukushashiki_search_mode'),
      onInputChange: changeMessageField('valueDay_fukushashiki_search_value'),
    });
  };

  return (
    <>
      {renderYearRangeRow({
        typeConfig,
        changeTimeField,
        showSort: true,
        changeTypeField,
      })}
      {renderDobNote()}
      {renderHideDayCheckbox()}
      {renderYearMonthDayRow({
        typeConfig,
        dataYear: dataYearFixed,
        dataMonth: dataMonthFixed,
        dataDay: dataDayFixed,
        changeTypeField,
        wrap: true,
      })}
      {renderFukushashikiYear()}
      {renderFukushashikiMonth()}
      {renderFukushashikiDay()}
    </>
  );
};

export default DobYmdTypeSetting;
