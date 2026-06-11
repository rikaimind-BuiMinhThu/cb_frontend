import React from 'react';

const LabelNoTransitionPreview = ({
  content,
  message,
  indexContent,
}) => {
  const labelNoTransition = content.label_no_transition;
  return (
    <>
      {content.type === 'label_no_transition' && (
        <div style={{ marginBottom: '10px' }}>
          {labelNoTransition.value}
        </div>
      )}
    </>
  );
};

export default LabelNoTransitionPreview;
