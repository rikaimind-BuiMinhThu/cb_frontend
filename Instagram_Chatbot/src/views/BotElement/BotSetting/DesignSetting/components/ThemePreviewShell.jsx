import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { generateScopedThemeCss } from '../../../../../utils/chatbotThemeCss';

const ThemePreviewShell = ({
  scopeId,
  themeSettings,
  mainColor,
  title,
  subtitle,
  processLabel,
  processPercent,
  className,
  children,
}) => {
  const scopedCss = useMemo(() => {
    if (!themeSettings) return '';
    return generateScopedThemeCss(themeSettings, mainColor, null, `#${scopeId}`);
  }, [themeSettings, mainColor, scopeId]);

  const displayTitle = title || 'サンプルタイトル';
  const displaySubtitle = subtitle || 'サンプルサブタイトル';
  const barWidth = `${Math.min(Math.max(processPercent, 0), 100)}%`;

  return (
    <div id={scopeId} className={`theme-customize-preview ${className}`.trim()}>
      <style>{scopedCss}</style>

      <div
        className="sp-header theme-customize-preview__header"
        style={{ backgroundColor: mainColor }}
      >
        <div className="sp-header-left">
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-sub-title">{displaySubtitle}</div>
            <div className="sp-header-left-label-title">{displayTitle}</div>
          </div>
        </div>
      </div>

      <div className="sp-process-bar">
        <div
          className="sp-process-bar-color"
          style={{ width: barWidth, backgroundColor: mainColor }}
        >
          {processLabel}
        </div>
      </div>

      <div className="sp-body theme-customize-preview__body">
        {children}
      </div>
    </div>
  );
};

ThemePreviewShell.propTypes = {
  scopeId: PropTypes.string.isRequired,
  themeSettings: PropTypes.object,
  mainColor: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  processLabel: PropTypes.string,
  processPercent: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};

ThemePreviewShell.defaultProps = {
  themeSettings: null,
  mainColor: '#327AED',
  title: '',
  subtitle: '',
  processLabel: '1 / 3',
  processPercent: 33,
  className: '',
  children: null,
};

export default ThemePreviewShell;
