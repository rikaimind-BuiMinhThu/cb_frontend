import '../styles/base/preview-common.css';
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
        <div className="ss-content-preview">
          {labelNoTransition.value}
        </div>
      )}
    </>
  );
};

export default LabelNoTransitionPreview;
