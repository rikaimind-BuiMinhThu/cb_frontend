import React from 'react';
import InputNum from '../scenarioCommon/InputNum';
import { COMBINE_CONTENT_ROLES } from 'v2/views/BotElement/BotSetting/PreviewComponent/Constants';
import { COMBINE_BOT_TYPE_OPTIONS, getCombineContentTypeLabel } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/combineContentDefaults';

const CombineBlockHeader = ({
  content,
  indexContent,
  onChangeBlockType,
  onChangeBlockPadding,
}) => {
  const isBot = content.role === COMBINE_CONTENT_ROLES.BOT;

  return (
    <div className="ss-combine-block-header">
      <span className={`ss-combine-block-setting__role-badge ss-combine-block-setting__role-badge--${content.role}`}>
        {isBot ? 'ボット' : 'ユーザー'}
      </span>

      {isBot ? (
        <select
          className="ss-input-value ss-combine-block-header__type-select"
          value={content.type}
          onChange={(e) => onChangeBlockType(indexContent, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          {COMBINE_BOT_TYPE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      ) : (
        <span className="ss-combine-block-header__type-label">
          {getCombineContentTypeLabel(content.role, content.type)}
        </span>
      )}

      <div className="ss-combine-block-header__padding">
        <span className="ss-combine-block-header__padding-label">余白 (px)</span>
        <InputNum
          min={0}
          max={100}
          className="ss-combine-block-header__padding-input"
          value={content.padding ?? 10}
          onChange={(value) => onChangeBlockPadding(indexContent, value)}
        />
      </div>
    </div>
  );
};

export default CombineBlockHeader;
