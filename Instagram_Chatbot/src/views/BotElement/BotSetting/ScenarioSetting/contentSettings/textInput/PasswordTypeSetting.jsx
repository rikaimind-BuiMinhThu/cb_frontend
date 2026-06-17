import React from 'react';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputCustom from '../../scenarioComon/InputCustom';
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
          label="特殊文字を許可する"
          onChange={changeContent(textInput.type, 'allow_special_chars')}
          value={typeConfig?.allow_special_chars}
        />
      </div>
      <div className="ss-user-setting__item-bottom">
        <div className="ss-user-setting__item-select-bottom-wrapper ss-input-text-comment">
          <InputCustom
            style={{ width: '100%' }}
            placeholder="プレースホルダ"
            onChange={changeContent(textInput.type, 'password')}
            value={typeConfig?.password}
          />
        </div>
      </div>
      {isUseFukushashiki &&
        renderFukushashikiRow('fukushashiki_search_mode', 'fukushashiki_search_value', {
          useFukushashiki: false,
          rowClassName: 'ss-user-setting__item-bottom',
          rowStyle: { width: '100%', alignItems: 'center', gap: '8px', marginLeft: 0, marginBottom: '10px' },
        })}
      {textInput.type === 'password_confirmation' && (
        <div className="ss-user-setting__item-bottom">
          <div className="ss-user-setting__item-select-bottom-wrapper ss-input-text-comment">
            <InputCustom
              style={{ width: '100%' }}
              placeholder="プレースホルダ"
              onChange={changeContent(textInput.type, 'confirm_password')}
              value={typeConfig?.confirm_password}
            />
          </div>
        </div>
      )}
      {isUseFukushashiki && textInput.type === 'password_confirmation' &&
        renderFukushashikiRow('confirm_fukushashiki_search_mode', 'confirm_fukushashiki_search_value', {
          useFukushashiki: false,
          rowStyle: { width: '100%', alignItems: 'center', gap: '8px', marginLeft: 0 },
        })}
    </>
  );
};

export default PasswordTypeSetting;
