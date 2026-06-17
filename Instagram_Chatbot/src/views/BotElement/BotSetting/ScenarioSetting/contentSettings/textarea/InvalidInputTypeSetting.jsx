import React from 'react';
import { TEXTAREA_LABELS } from '../../constants/scenarioSettingLabels';
import { buildTextareaSettingContext } from './textareaSettingContext';

const InvalidInputTypeSetting = (props) => {
  const { textarea } = props;
  const { typeConfig, changeContent } = buildTextareaSettingContext(props);

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

  return <>{renderContentTextarea()}</>;
};

export default InvalidInputTypeSetting;
