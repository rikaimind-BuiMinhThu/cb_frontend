import React from 'react';
import CheckboxCustom from '../../scenarioCommon/CheckboxCustom';
import { SETTING_LABELS, TEXTAREA_LABELS } from '../../constants/scenarioSettingLabels';
import CharacterLimitRow from '../textInput/CharacterLimitRow';
import { buildTextareaSettingContext } from './textareaSettingContext';

const TextInputTypeSetting = (props) => {
  const { textarea, isUseFukushashiki } = props;
  const { typeConfig, changeContent, renderFukushashikiRow } = buildTextareaSettingContext(props);

  const renderRequire = () => (
    <CheckboxCustom
      label={SETTING_LABELS.require}
      onChange={changeContent('require')}
      value={textarea.require}
    />
  );

  const renderContentTextarea = () => (
    <div className="ss-textarea-setting__content">
      <textarea
        className="ss-textarea-setting__textarea ss-input-value"
        placeholder={TEXTAREA_LABELS.placeholder}
        rows="5"
        value={typeConfig?.content}
        onChange={(e) => changeContent(textarea.type, 'content')(e.target.value)}
      />
    </div>
  );

  const renderFukushashiki = () => {
    if (!isUseFukushashiki) return null;
    return renderFukushashikiRow();
  };

  return (
    <>
      <div className="ss-textarea-setting__require">
        {renderRequire()}
      </div>
      <CharacterLimitRow
        typeConfig={typeConfig}
        onChangeFrom={changeContent(textarea.type, 'character_limit_from')}
        onChangeTo={changeContent(textarea.type, 'character_limit_to')}
      />
      {renderContentTextarea()}
      {renderFukushashiki()}
    </>
  );
};

export default TextInputTypeSetting;
