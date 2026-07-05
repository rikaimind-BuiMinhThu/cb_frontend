import React from 'react';

const FromJsResultTypeSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  pullDown,
  renderDetailSettingPulldownFromJs,
}) => (
  <>
    {renderDetailSettingPulldownFromJs({
      indexContent,
      content,
      indexMessageSelect,
      pullDown,
    })}
  </>
);

export default FromJsResultTypeSetting;
