import React from 'react';
import { useScenarioContentSettingProps } from '../hooks/useScenarioContentSettingProps';

export const withContentPreviewContext = (Component) => {
  const Wrapped = (inputProps) => {
    const { indexMessageSelect, indexContent, content, message, indexMessage } = inputProps;
    const ctx = useScenarioContentSettingProps(
      indexMessageSelect ?? indexMessage,
      indexContent,
      content
    );
    return <Component {...ctx} {...inputProps} message={message} />;
  };
  Wrapped.displayName = `WithContentPreviewContext(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
};
