import React from 'react';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import InputCustom from '../../scenarioCommon/InputCustom';
import { dataMonthFixed, dataDayFixed } from '../../constants/scenarioFormConstants';
import { PULL_DOWN_LABELS, SETTING_PLACEHOLDERS } from '../../constants/scenarioSettingLabels';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import { renderFukushashikiField } from './pullDownFieldBlocks';

const DateMdTypeSetting = (props) => {
  const {
    typeConfig,
    changeTypeField,
    changeMessageField,
    messageContent,
    isUseFukushashiki,
  } = buildPullDownSettingContext(props);

  const renderDateSelectors = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex">
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
        <InputCustom
          className="ss-pull-down-setting__select--32"
          placeholder={SETTING_PLACEHOLDERS.comment}
          value={typeConfig?.comment}
          onChange={changeTypeField('comment')}
        />
      </div>
    </div>
  );

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
      {renderDateSelectors()}
      {renderFukushashikiMonth()}
      {renderFukushashikiDay()}
    </>
  );
};

export default DateMdTypeSetting;
