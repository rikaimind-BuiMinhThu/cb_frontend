import React from 'react';

const LabelNoTransitionSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  onChangeValueMessageContent,
}) => {
  const labelNoTransition = content.label_no_transition;
  return (
    <>
      {content.type === 'label_no_transition' && (
        <React.Fragment>
          <div style={{ marginBottom: '10px' }}>* You cannot add other user input components together with "Label (no transition record)".</div>
          <div className="ss-user-setting__item-bottom">
            <textarea
              style={{ width: '90%' }}
              placeholder="テキスト"
              rows="5"
              value={labelNoTransition.value}
              onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'value')}
            />
          </div>
        </React.Fragment>
      )}
    </>
  );
};

export default LabelNoTransitionSetting;
