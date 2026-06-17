import React from 'react';
import InputCustom from '../../scenarioComon/InputCustom';
import { buildTextInputSettingContext } from './textInputSettingContext';

const EmailConfirmationTypeSetting = (props) => {
  const { textInput, isUseFukushashiki } = props;
  const { typeConfig, changeContent, renderFukushashikiRow } = buildTextInputSettingContext(props);

  return (
    <>
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          placeholder="プレースホルダ"
          onChange={changeContent(textInput.type, 'cfEmlAdd_email')}
          value={typeConfig?.cfEmlAdd_email || ''}
        />
      </div>
      {isUseFukushashiki &&
        renderFukushashikiRow('value_fukushashiki_search_mode', 'value_fukushashiki_search_value', {
          variant: 'compact',
        })}
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          placeholder="プレースホルダ"
          onChange={changeContent(textInput.type, 'cfEmlAdd_confirm_email')}
          value={typeConfig?.cfEmlAdd_confirm_email || ''}
        />
      </div>
      {isUseFukushashiki &&
        renderFukushashikiRow('valueConfirm_fukushashiki_search_mode', 'valueConfirm_fukushashiki_search_value', {
          variant: 'compact',
        })}
    </>
  );
};

export default EmailConfirmationTypeSetting;
