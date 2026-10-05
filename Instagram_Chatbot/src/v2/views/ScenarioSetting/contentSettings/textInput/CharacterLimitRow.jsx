import React from 'react';
import InputNum from '../../scenarioCommon/InputNum';
import { PULL_DOWN_LABELS, TEXTAREA_LABELS, SETTING_PLACEHOLDERS } from '../../constants/scenarioSettingLabels';

const CharacterLimitRow = ({ typeConfig, onChangeFrom, onChangeTo }) => (
  <div className="ss-user-setting__item-bottom-flex-start">
    <span className="ss-user-setting-label">{TEXTAREA_LABELS.characterLimit}</span>
    <InputNum
      placeholder={SETTING_PLACEHOLDERS.characterLimitExample}
      className="ss-user-setting-input-limit-character"
      max={typeConfig?.character_limit_to}
      min={0}
      onChange={onChangeFrom}
      value={typeConfig?.character_limit_from}
    />
    <span className="ss-range-separator">{PULL_DOWN_LABELS.rangeSeparator}</span>
    <InputNum
      placeholder={SETTING_PLACEHOLDERS.characterLimitExample}
      className="ss-user-setting-input-limit-character"
      min={typeConfig?.character_limit_from || 0}
      onChange={onChangeTo}
      value={typeConfig?.character_limit_to}
    />
  </div>
);

export default CharacterLimitRow;
