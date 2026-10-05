import React from 'react';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import {
  renderHourRangeRow,
  renderHourMinuteEveryRow,
  renderFukushashikiField,
} from './pullDownFieldBlocks';

const TimeHmTypeSetting = (props) => {
  const {
    typeConfig,
    pullDownType,
    changeTimeField,
    changeTypeField,
    changeMessageField,
    messageContent,
    isUseFukushashiki,
    dataHour,
    dataMinutes,
    dataEveryMinute,
  } = buildPullDownSettingContext(props);

  const renderFukushashikiHour = () => {
    if (!isUseFukushashiki) return null;
    return renderFukushashikiField({
      mode: messageContent?.valueHour_fukushashiki_search_mode,
      inputValue: messageContent?.valueHour_fukushashiki_search_value,
      onModeChange: changeMessageField('valueHour_fukushashiki_search_mode'),
      onInputChange: changeMessageField('valueHour_fukushashiki_search_value'),
    });
  };

  const renderFukushashikiMinute = () => {
    if (!isUseFukushashiki) return null;
    return renderFukushashikiField({
      mode: messageContent?.valueMinute_fukushashiki_search_mode,
      inputValue: messageContent?.valueMinute_fukushashiki_search_value,
      onModeChange: changeMessageField('valueMinute_fukushashiki_search_mode'),
      onInputChange: changeMessageField('valueMinute_fukushashiki_search_value'),
      withTooltip: false,
    });
  };

  return (
    <>
      {renderHourRangeRow({ typeConfig, pullDownType, changeTimeField })}
      {renderHourMinuteEveryRow({
        typeConfig,
        dataHour,
        dataMinutes,
        dataEveryMinute,
        changeTypeField,
      })}
      {renderFukushashikiHour()}
      {renderFukushashikiMinute()}
    </>
  );
};

export default TimeHmTypeSetting;
