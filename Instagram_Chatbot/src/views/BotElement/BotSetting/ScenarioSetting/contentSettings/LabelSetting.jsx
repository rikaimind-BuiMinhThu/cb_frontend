import React from 'react';

const LabelSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  label,
  onChangeValueMessageContent,
}) => {
  return (
    <>
      <div className="ss-user-setting__item-bottom">
        <textarea
          className="ss-user-setting-item-textarea-label ss-input-value"
          placeholder="テキスト"
          rows="5"
          value={label.lbl_content}
          onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'lbl_content')}
        ></textarea>
      </div>
    </>
  );
};

export default LabelSetting;
