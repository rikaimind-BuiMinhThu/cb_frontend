import { createContext, useContext } from 'react';
import { FIELD_PLACEHOLDER_STYLE_FLOAT } from 'v2/views/DesignSetting/constants/designThemeConstants';

export const PreviewThemeContext = createContext(null);

export const usePreviewTheme = () => useContext(PreviewThemeContext);

export const isFloatPlaceholderEnabled = (themeSettings) => (
  themeSettings?.fieldPlaceholderStyle === FIELD_PLACEHOLDER_STYLE_FLOAT
);
