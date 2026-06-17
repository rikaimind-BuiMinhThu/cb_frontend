import React from 'react';
import InputNum from '../../scenarioComon/InputNum';

const CharacterLimitRow = ({ typeConfig, onChangeFrom, onChangeTo }) => (
  <div className="ss-user-setting__item-bottom-flex-start">
    <span className="ss-user-setting-label">字数制限</span>
    <InputNum
      placeholder="0000"
      className="ss-user-setting-input-limit-character"
      max={typeConfig?.character_limit_to}
      min={0}
      onChange={onChangeFrom}
      value={typeConfig?.character_limit_from}
    />
    <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
    <InputNum
      placeholder="0000"
      className="ss-user-setting-input-limit-character"
      min={typeConfig?.character_limit_from || 0}
      onChange={onChangeTo}
      value={typeConfig?.character_limit_to}
    />
  </div>
);

export default CharacterLimitRow;
