import React from 'react';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import {
  renderYearRangeRow,
  renderYearMonthDayRow,
  renderFukushashikiField,
} from './pullDownFieldBlocks';

const DateYmdTypeSetting = (props) => {
  const {
    typeConfig,
    changeTimeField,
    changeTypeField,
    changeMessageField,
    messageContent,
    isUseFukushashiki,
    dataYear,
    dataMonth,
    dataDay,
  } = buildPullDownSettingContext(props);

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
      {renderYearRangeRow({ typeConfig, changeTimeField })}
      {renderYearMonthDayRow({
        typeConfig,
        dataYear,
        dataMonth,
        dataDay,
        changeTypeField,
      })}
      {renderFukushashikiYear()}
      {renderFukushashikiMonth()}
      {renderFukushashikiDay()}
    </>
  );
};

export default DateYmdTypeSetting;
