import React from 'react';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import {
  renderYearRangeRow,
  renderYearMonthRow,
  renderFukushashikiField,
} from './pullDownFieldBlocks';

const DateYmTypeSetting = (props) => {
  const {
    typeConfig,
    changeTimeField,
    changeTypeField,
    changeMessageField,
    messageContent,
    isUseFukushashiki,
    dataYear,
    dataMonth,
  } = buildPullDownSettingContext(props);

  const renderFukushashikiYear = () => {
    if (!isUseFukushashiki) return null;
    return renderFukushashikiField({
      mode: messageContent?.valueYear_fukushashiki_search_mode,
      inputValue: messageContent?.valueYear_fukushashiki_search_value,
      onModeChange: changeMessageField('valueYear_fukushashiki_search_mode'),
      onInputChange: changeMessageField('valueYear_fukushashiki_search_value'),
      rowClassName: 'ss-user-setting__item-bottom ss-pull-down-setting__fukushashiki-row--spaced',
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

  return (
    <>
      {renderYearRangeRow({ typeConfig, changeTimeField })}
      {renderYearMonthRow({
        typeConfig,
        dataYear,
        dataMonth,
        changeTypeField,
      })}
      {renderFukushashikiYear()}
      {renderFukushashikiMonth()}
    </>
  );
};

export default DateYmTypeSetting;
