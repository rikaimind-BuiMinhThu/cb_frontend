import React from 'react';

const LpIntegrationOptionTypeSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  pullDown,
  renderLPIntegrationOptionSetting,
}) => (
  <>
    {renderLPIntegrationOptionSetting({
      indexMessageSelect,
      indexContent,
      content,
      pullDown,
    })}
  </>
);

export default LpIntegrationOptionTypeSetting;
