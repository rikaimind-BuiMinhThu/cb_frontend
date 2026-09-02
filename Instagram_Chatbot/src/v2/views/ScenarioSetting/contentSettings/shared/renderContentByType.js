/**
 * Renders a component based on type using switch-case.
 */
export const renderContentByType = (type, typeMap) => {
  switch (type) {
    default:
      if (typeMap[type]) {
        return typeMap[type];
      }
      return null;
  }
};

export const createTypeRenderer = (typeMap) => (type) => {
  const Component = renderContentByType(type, typeMap);
  if (!Component) return null;
  return Component;
};
