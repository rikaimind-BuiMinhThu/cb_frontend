import React from 'react';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputNum from '../../scenarioComon/InputNum';
import {
  PULL_DOWN_LABELS,
  SETTING_LABELS,
  TEXTAREA_LABELS,
} from '../../constants/scenarioSettingLabels';
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

  const renderCharacterLimit = () => (
    <div className="ss-user-setting__item-bottom-flex-start">
      <span className="ss-user-setting-label">{TEXTAREA_LABELS.characterLimit}</span>
      <InputNum
        placeholder="0000"
        className="ss-user-setting-input-limit-character"
        max={typeConfig?.character_limit_to}
        min={0}
        value={typeConfig?.character_limit_from}
        onChange={changeContent(textarea.type, 'character_limit_from')}
      />
      <span className="ss-range-separator">{PULL_DOWN_LABELS.rangeSeparator}</span>
      <InputNum
        placeholder="0000"
        className="ss-user-setting-input-limit-character"
        min={typeConfig?.character_limit_from || 0}
        value={typeConfig?.character_limit_to}
        onChange={changeContent(textarea.type, 'character_limit_to')}
      />
    </div>
  );

  const renderContentTextarea = () => (
    <div className="ss-user-setting__item-bottom">
      <textarea
        className="ss-user-setting-item-textarea-label ss-input-value ss-textarea-setting__textarea"
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
      <div className="ss-user-setting__item-text_input-top ss-textarea-setting__require">
        {renderRequire()}
      </div>
      {renderCharacterLimit()}
      {renderContentTextarea()}
      {renderFukushashiki()}
    </>
  );
};

export default TextInputTypeSetting;
