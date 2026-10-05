import React from 'react';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import SelectCustom from '../../scenarioComon/SelectCustom';
import InputCustom from '../../scenarioComon/InputCustom';
import { hyphenPhoneNumber } from '../../constants/scenarioFormConstants';
import { TEXT_INPUT_LABELS } from '../../constants/scenarioSettingLabels';
import { buildTextInputSettingContext } from './textInputSettingContext';

const PhoneNumberTypeSetting = (props) => {
  const { textInput, isUseFukushashiki } = props;
  const { typeConfig, changeContent, renderFukushashikiRow } = buildTextInputSettingContext(props);

  return (
    <>
      <div className="ss-user-setting__item-bottom">
        <SelectCustom
          id="range"
          value={textInput.phone_number?.withHyphen || false}
          data={hyphenPhoneNumber}
          onChange={changeContent(textInput.type, 'withHyphen')}
          keyValue="key"
        />
      </div>
      {textInput?.phone_number?.withHyphen === true && isUseFukushashiki && (
        <div className="ss-user-setting__item-bottom">
          <CheckboxCustom
            label={TEXT_INPUT_LABELS.disableRemoveLeadingZero}
            onChange={changeContent(textInput.type, 'disable_remove_leading_zero')}
            value={textInput.phone_number?.disable_remove_leading_zero || false}
          />
        </div>
      )}
      {textInput?.phone_number?.withHyphen === true && (
        <div className="ss-user-setting__item-bottom">
          <div className="ss-user-setting__item-select-bottom-wrapper ss-user-setting-phone-number-hyphens">
            <InputCustom
              placeholder="プレースホルダ"
              onChange={changeContent(textInput.type, 'number1')}
              value={typeConfig?.number1}
            />
            <span className="ss-hyphen-separator">-</span>
            <InputCustom
              placeholder="プレースホルダ"
              onChange={changeContent(textInput.type, 'number2')}
              value={typeConfig?.number2}
            />
            <span className="ss-hyphen-separator">-</span>
            <InputCustom
              placeholder="プレースホルダ"
              onChange={changeContent(textInput.type, 'number3')}
              value={typeConfig?.number3}
            />
          </div>
          {isUseFukushashiki && (
            <>
              {renderFukushashikiRow('value1_fukushashiki_search_mode', 'value1_fukushashiki_search_value', {
                variant: 'compact',
                rowClassName: 'ss-fukushashiki-row',
              })}
              {renderFukushashikiRow('value2_fukushashiki_search_mode', 'value2_fukushashiki_search_value', {
                variant: 'compact',
              })}
              {renderFukushashikiRow('value3_fukushashiki_search_mode', 'value3_fukushashiki_search_value', {
                variant: 'compact',
              })}
            </>
          )}
        </div>
      )}
      {textInput?.phone_number?.withHyphen === false && (
        <>
          <div className="ss-user-setting__item-bottom">
            <InputCustom
              placeholder="プレースホルダ"
              onChange={changeContent(textInput.type, 'number')}
              value={typeConfig?.number}
            />
          </div>
          {isUseFukushashiki &&
            renderFukushashikiRow('fukushashiki_search_mode', 'fukushashiki_search_value', {
              variant: 'compact',
            })}
        </>
      )}
    </>
  );
};

export default PhoneNumberTypeSetting;
