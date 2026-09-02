import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { generateScopedThemeCss } from 'v2/utils/chatbotThemeCss';
import {
  DEFAULT_MAIN_COLOR,
  THEME_CSS_VAR_MAIN_COLOR,
  THEME_CSS_VAR_PROGRESS_WIDTH,
  THEME_PREVIEW_HEADER_ICON_ALT,
  THEME_PREVIEW_PROCESS_LABEL,
  THEME_PREVIEW_SAMPLE_SUBTITLE,
  THEME_PREVIEW_SAMPLE_TITLE,
} from '../constants/designChatbotConstants';
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

  const displayTitle = title || (showPlaceholderLabels ? THEME_PREVIEW_SAMPLE_TITLE : '');
  const displaySubtitle = subtitle || (showPlaceholderLabels ? THEME_PREVIEW_SAMPLE_SUBTITLE : '');
  const barWidth = `${Math.min(Math.max(processPercent, 0), 100)}%`;
  const themeVars = {
    [THEME_CSS_VAR_MAIN_COLOR]: mainColor,
    [THEME_CSS_VAR_PROGRESS_WIDTH]: barWidth,
  };

  return (
    <div
      id={scopeId}
      className={`theme-customize-preview ${className}`.trim()}
      style={themeVars}
    >
      <style>{scopedCss}</style>

      <PreviewRegion
        sectionId="headerMain"
        activeSectionId={activeSectionId}
        onSectionSelect={onSectionSelect}
        className="theme-preview-region--header-wrap"
      >
        <div className="sp-header theme-customize-preview__header">
          <PreviewRegion
            sectionId="headerMain"
            activeSectionId={activeSectionId}
            onSectionSelect={onSectionSelect}
            className="theme-preview-region--header-text"
          >
            <div className="sp-header-left">
              {headerIconUrl && (
                <div className="sp-body-bot-side-avatar sp-avatar-bt">
                  <img src={headerIconUrl} alt={THEME_PREVIEW_HEADER_ICON_ALT} />
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
          <div className="sp-process-bar-color">
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
  processLabel: THEME_PREVIEW_PROCESS_LABEL,
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
