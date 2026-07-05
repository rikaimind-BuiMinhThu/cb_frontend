import React from 'react';
import { SETTING_PLACEHOLDERS } from '../constants/scenarioSettingLabels';
import '../styles/contentSettings/label.css';

const LabelSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  label,
  onChangeValueMessageContent,
}) => {
  const renderTextarea = () => (
    <div className="ss-user-setting__item-bottom">
      <textarea
        className="ss-user-setting-item-textarea-label ss-input-value ss-label-setting__textarea"
        placeholder={SETTING_PLACEHOLDERS.text}
        rows="5"
        value={label.lbl_content}
        onChange={(e) => onChangeValueMessageContent(
          indexMessageSelect,
          indexContent,
          content.type,
          e.target.value,
          'lbl_content',
        )}
      />
    </div>
  );

  return <>{renderTextarea()}</>;
};

export default LabelSetting;
