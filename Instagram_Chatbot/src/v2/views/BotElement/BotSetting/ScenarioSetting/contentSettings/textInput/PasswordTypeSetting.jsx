import React from 'react';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputCustom from '../../scenarioComon/InputCustom';
import { TEXT_INPUT_LABELS } from '../../constants/scenarioSettingLabels';
import { buildTextInputSettingContext } from './textInputSettingContext';
import CharacterLimitRow from './CharacterLimitRow';

const PasswordTypeSetting = (props) => {
  const { textInput, isUseFukushashiki } = props;
  const { typeConfig, changeContent, renderFukushashikiRow } = buildTextInputSettingContext(props);

  return (
    <>
      <CharacterLimitRow
        typeConfig={typeConfig}
        onChangeFrom={changeContent(textInput.type, 'character_limit_from')}
        onChangeTo={changeContent(textInput.type, 'character_limit_to')}
      />
      <div className="ss-user-setting-item-use-character">
        <CheckboxCustom
          label={TEXT_INPUT_LABELS.allowSpecialChars}
          onChange={changeContent(textInput.type, 'allow_special_chars')}
          value={typeConfig?.allow_special_chars}
        />
      </div>
      <div className="ss-user-setting__item-bottom">
        <div className="ss-user-setting__item-select-bottom-wrapper ss-input-text-comment">
          <InputCustom
            className="ss-input--full"
            placeholder={TEXT_INPUT_LABELS.placeholder}
            onChange={changeContent(textInput.type, 'password')}
            value={typeConfig?.password}
          />
        </div>
      </div>
      {isUseFukushashiki &&
        renderFukushashikiRow('fukushashiki_search_mode', 'fukushashiki_search_value', {
          useFukushashiki: false,
          rowClassName: 'ss-user-setting__item-bottom ss-text-input-setting__fukushashiki-row--password',
        })}
      {textInput.type === 'password_confirmation' && (
        <div className="ss-user-setting__item-bottom">
          <div className="ss-user-setting__item-select-bottom-wrapper ss-input-text-comment">
            <InputCustom
              className="ss-input--full"
              placeholder={TEXT_INPUT_LABELS.placeholder}
              onChange={changeContent(textInput.type, 'confirm_password')}
              value={typeConfig?.confirm_password}
            />
          </div>
        </div>
      )}
      {isUseFukushashiki && textInput.type === 'password_confirmation' &&
        renderFukushashikiRow('confirm_fukushashiki_search_mode', 'confirm_fukushashiki_search_value', {
          useFukushashiki: false,
          rowClassName: 'ss-text-input-setting__fukushashiki-row--password-confirm',
        })}
    </>
  );
};

export default PasswordTypeSetting;
