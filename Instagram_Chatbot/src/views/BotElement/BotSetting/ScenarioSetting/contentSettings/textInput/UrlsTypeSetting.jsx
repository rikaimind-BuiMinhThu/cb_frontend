import React from 'react';
import InputCustom from '../../scenarioComon/InputCustom';
import { buildTextInputSettingContext } from './textInputSettingContext';

const UrlsTypeSetting = (props) => {
  const { textInput, isUseFukushashiki } = props;
  const { typeConfig, changeContent, renderFukushashikiRow } = buildTextInputSettingContext(props);

  return (
    <>
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          placeholder="プレースホルダ"
          onChange={changeContent(textInput.type, 'placeholder')}
          value={typeConfig?.placeholder}
        />
      </div>
      {isUseFukushashiki &&
        renderFukushashikiRow('fukushashiki_search_mode', 'fukushashiki_search_value', {
          variant: 'compact',
        })}
    </>
  );
};

export default UrlsTypeSetting;
