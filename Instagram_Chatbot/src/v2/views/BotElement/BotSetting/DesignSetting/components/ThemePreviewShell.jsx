import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { generateScopedThemeCss } from '../../../../../utils/chatbotThemeCss';
import { DEFAULT_MAIN_COLOR } from '../constants/designChatbotConstants';
import { resolveHeaderBgColor } from '../utils/designThemeUtils';
import PreviewRegion from './PreviewRegion';

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
  timerSlot,
  activeSectionId,
  onSectionSelect,
  children,
  modalOverlay,
}) => {
  const scopedCss = useMemo(() => {
    if (!themeSettings) return '';
    return generateScopedThemeCss(themeSettings, mainColor, null, `#${scopeId}`);
  }, [themeSettings, mainColor, scopeId]);

  const headerBg = resolveHeaderBgColor(themeSettings, mainColor);
  const displayTitle = title || (showPlaceholderLabels ? 'サンプルタイトル' : '');
  const displaySubtitle = subtitle || (showPlaceholderLabels ? 'サンプルサブタイトル' : '');
  const barWidth = `${Math.min(Math.max(processPercent, 0), 100)}%`;

  return (
    <div
      id={scopeId}
      className={`theme-customize-preview ${className}`.trim()}
      style={{ '--c-header-bg': headerBg }}
    >
      <style>{scopedCss}</style>

      <PreviewRegion
        sectionId="headerMain"
        activeSectionId={activeSectionId}
        onSectionSelect={onSectionSelect}
        className="theme-preview-region--header-wrap"
      >
        <div
          className="sp-header theme-customize-preview__header"
        >
          <PreviewRegion
            sectionId="headerMain"
            activeSectionId={activeSectionId}
            onSectionSelect={onSectionSelect}
            className="theme-preview-region--header-text"
          >
            <div className="sp-header-left">
              {headerIconUrl && (
                <div className="preview-open-frame__avatar">
                  <img src={headerIconUrl} alt="bot-header-icon" />
                </div>
              )}
              <div className="sp-header-left-label">
                <div className="sp-header-left-label-sub-title">{displaySubtitle}</div>
                <div className="sp-header-left-label-title">{displayTitle}</div>
              </div>
            </div>
          </PreviewRegion>
        </div>
      </PreviewRegion>

      {timerSlot}

      <PreviewRegion
        sectionId="progress"
        activeSectionId={activeSectionId}
        onSectionSelect={onSectionSelect}
        className="theme-preview-region--progress"
      >
        <div className="sp-process-bar">
          <div
            className="sp-process-bar-color"
            style={{ width: barWidth }}
          >
            {processLabel}
          </div>
        </div>
      </PreviewRegion>

      {errorPreviewText ? (
        <PreviewRegion
          sectionId="errors"
          activeSectionId={activeSectionId}
          onSectionSelect={onSectionSelect}
          className="theme-preview-region--error"
        >
          <div className="theme-customize-preview__error-top">
            <div className="ss-user-setting__item-text_input-top">
              <div
                className="error-message-modal ss-bot-submit-error-message theme-customize-preview__error-message"
              >
                {errorPreviewText}
              </div>
            </div>
          </div>
        </PreviewRegion>
      ) : null}

      <PreviewRegion
        sectionId="window"
        activeSectionId={activeSectionId}
        onSectionSelect={onSectionSelect}
        className="theme-preview-region--body"
      >
        <div className="sp-body theme-customize-preview__body">
          {children}
        </div>
      </PreviewRegion>

      {modalOverlay}
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
  timerSlot: PropTypes.node,
  activeSectionId: PropTypes.string,
  onSectionSelect: PropTypes.func,
  children: PropTypes.node,
  modalOverlay: PropTypes.node,
};

ThemePreviewShell.defaultProps = {
  themeSettings: null,
  mainColor: DEFAULT_MAIN_COLOR,
  title: '',
  subtitle: '',
  headerIconUrl: '',
  showPlaceholderLabels: true,
  processLabel: '1 / 3',
  processPercent: 33,
  className: '',
  errorPreviewText: '',
  timerSlot: null,
  activeSectionId: '',
  onSectionSelect: null,
  children: null,
  modalOverlay: null,
};

export default ThemePreviewShell;
