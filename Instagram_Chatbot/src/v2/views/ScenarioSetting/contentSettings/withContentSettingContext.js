import React from 'react';
import { useScenarioContentSettingProps } from '../hooks/useScenarioContentSettingProps';

export const withContentSettingContext = (Component) => {
  const Wrapped = (inputProps) => {
    const { indexMessageSelect, indexContent, content } = inputProps;
    const ctx = useScenarioContentSettingProps(indexMessageSelect, indexContent, content);
    return <Component {...ctx} {...inputProps} />;
  };
  Wrapped.displayName = `WithContentSettingContext(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
};
