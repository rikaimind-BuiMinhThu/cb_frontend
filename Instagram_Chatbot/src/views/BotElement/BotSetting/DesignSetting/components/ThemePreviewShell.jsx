import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { generateScopedThemeCss } from '../../../../../utils/chatbotThemeCss';

const ThemePreviewShell = ({
  scopeId,
  themeSettings,
  mainColor,
  title,
  subtitle,
  headerIconUrl,
  showPlaceholderLabels = true,
  processLabel,
  processPercent,
  className,
  errorPreviewText,
  children,
}) => {
  const scopedCss = useMemo(() => {
    if (!themeSettings) return '';
    return generateScopedThemeCss(themeSettings, mainColor, null, `#${scopeId}`);
  }, [themeSettings, mainColor, scopeId]);

  const displayTitle = title || (showPlaceholderLabels ? 'サンプルタイトル' : '');
  const displaySubtitle = subtitle || (showPlaceholderLabels ? 'サンプルサブタイトル' : '');
  const barWidth = `${Math.min(Math.max(processPercent, 0), 100)}%`;

  return (
    <div id={scopeId} className={`theme-customize-preview ${className}`.trim()}>
      <style>{scopedCss}</style>

      <div
        className="sp-header theme-customize-preview__header"
        style={{ backgroundColor: mainColor }}
      >
        <div className="sp-header-left">
          {headerIconUrl && (
            <div className="sp-body-bot-side-avatar sp-avatar-bt">
              <img src={headerIconUrl} alt="bot-header-icon" />
            </div>
          )}
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

      {errorPreviewText ? (
        <div className="theme-customize-preview__error-top">
          <div className="ss-user-setting__item-text_input-top">
            <div
              className={`error-message-modal ss-bot-submit-error-message theme-customize-preview__error-message`}
            >
              {errorPreviewText}
            </div>
          </div>
        </div>
      ) : null}

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
  headerIconUrl: PropTypes.string,
  showPlaceholderLabels: PropTypes.bool,
  processLabel: PropTypes.string,
  processPercent: PropTypes.number,
  className: PropTypes.string,
  errorPreviewText: PropTypes.string,
  children: PropTypes.node,
};

ThemePreviewShell.defaultProps = {
  themeSettings: null,
  mainColor: '#327AED',
  title: '',
  subtitle: '',
  headerIconUrl: '',
  showPlaceholderLabels: true,
  processLabel: '1 / 3',
  processPercent: 33,
  className: '',
  errorPreviewText: '',
  children: null,
};

export default ThemePreviewShell;
