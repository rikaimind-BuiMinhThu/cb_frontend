import React from 'react';
import { TEXTAREA_LABELS } from '../../constants/scenarioSettingLabels';
import { buildTextareaSettingContext } from './textareaSettingContext';

const InvalidInputTypeSetting = (props) => {
  const { textarea } = props;
  const { typeConfig, changeContent } = buildTextareaSettingContext(props);

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

  return <>{renderContentTextarea()}</>;
};

export default InvalidInputTypeSetting;
