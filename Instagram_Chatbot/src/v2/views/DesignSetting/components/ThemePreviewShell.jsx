import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import { generateScopedThemeCss } from 'v2/utils/chatbotThemeCss';
import { getDesignTypeClassName } from 'v2/utils/designTypeChrome';
import {
  DEFAULT_MAIN_COLOR,
  THEME_CSS_VAR_MAIN_COLOR,
  THEME_CSS_VAR_PROGRESS_WIDTH,
  THEME_PREVIEW_HEADER_ICON_ALT,
  THEME_PREVIEW_PROCESS_LABEL,
  THEME_PREVIEW_SAMPLE_SUBTITLE,
  THEME_PREVIEW_SAMPLE_TITLE,
} from '../constants/designChatbotConstants';
import {
  HEADER_CHROME_TITLE_ONLY,
  HEADER_CLOSE_ICON_TIMES,
  PROGRESS_BAR_STYLE_2,
} from '../constants/designThemeConstants';
import { resolveProgressBarStyle } from 'v2/views/DesignSetting/utils/designThemeUtils';
import { PreviewThemeContext } from 'v2/views/Preview/PreviewComponent/PreviewThemeContext';
import PreviewRegion from './PreviewRegion';

const HEADER_CLASS_BASE = 'sp-header theme-customize-preview__header';
const HEADER_CLASS_TITLE_ONLY = 'sp-header--title-only';
const PROCESS_BAR_FRACTION_CLASS = 'sp-process-bar--fraction';
const ICON_CHEVRON_CIRCLE_DOWN = 'chevron-circle-down';
const ICON_TIMES = 'times';

const ThemePreviewShell = ({
  scopeId,
  themeSettings,
  mainColor,
  designType,
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
    return generateScopedThemeCss(
      themeSettings,
      mainColor,
      null,
      `#${scopeId}`,
      designType,
    );
  }, [themeSettings, mainColor, scopeId, designType]);

  const displayTitle = title || (showPlaceholderLabels ? THEME_PREVIEW_SAMPLE_TITLE : '');
  const displaySubtitle = subtitle || (showPlaceholderLabels ? THEME_PREVIEW_SAMPLE_SUBTITLE : '');
  const barWidth = `${Math.min(Math.max(processPercent, 0), 100)}%`;
  const isTitleOnlyChrome = themeSettings?.headerChrome === HEADER_CHROME_TITLE_ONLY;
  const showHeaderIcon = !isTitleOnlyChrome && Boolean(headerIconUrl);
  const progressBarStyle = resolveProgressBarStyle(
    themeSettings?.progressBarStyle,
    themeSettings?.progressLabelMode,
  );
  const isStyle2Progress = progressBarStyle === PROGRESS_BAR_STYLE_2;
  const progressAboveText = (themeSettings?.progressBarAboveText || '').trim();
  const headerCloseIcon = themeSettings?.headerCloseIcon === HEADER_CLOSE_ICON_TIMES
    ? ICON_TIMES
    : ICON_CHEVRON_CIRCLE_DOWN;
  const headerClassName = [
    HEADER_CLASS_BASE,
    isTitleOnlyChrome ? HEADER_CLASS_TITLE_ONLY : '',
  ]
    .filter(Boolean)
    .join(' ');
  const processBarClassName = [
    'sp-process-bar',
    isStyle2Progress ? PROCESS_BAR_FRACTION_CLASS : '',
  ].filter(Boolean).join(' ');
  const themeVars = {
    [THEME_CSS_VAR_MAIN_COLOR]: mainColor,
    [THEME_CSS_VAR_PROGRESS_WIDTH]: barWidth,
    ...(themeSettings?.headerBgColor
      ? { '--pof-header-bg': themeSettings.headerBgColor }
      : {}),
  };
  const designTypeClass = getDesignTypeClassName(designType);
  const rootClassName = `theme-customize-preview ${designTypeClass} ${className}`.trim();

  return (
    <PreviewThemeContext.Provider value={themeSettings}>
    <div
      id={scopeId}
      className={rootClassName}
      style={themeVars}
    >
      <style>{scopedCss}</style>

      <PreviewRegion
        sectionId="header"
        activeSectionId={activeSectionId}
        onSectionSelect={onSectionSelect}
        className="theme-preview-region--header-wrap"
      >
        <div className={headerClassName}>
          <PreviewRegion
            sectionId="header"
            activeSectionId={activeSectionId}
            onSectionSelect={onSectionSelect}
            className="theme-preview-region--header-text"
          >
            <div className="sp-header-left">
              {showHeaderIcon ? (
                <div className="sp-body-bot-side-avatar sp-avatar-bt">
                  <img src={headerIconUrl} alt={THEME_PREVIEW_HEADER_ICON_ALT} />
                </div>
              ) : null}
              <div className="sp-header-left-label">
                <div className="sp-header-left-label-sub-title">{displaySubtitle}</div>
                <div className="sp-header-left-label-title">{displayTitle}</div>
              </div>
            </div>
          </PreviewRegion>
          <div className="sp-header-right">
            <div className="sp-header-right-arrow">
              <MDBIcon fas icon={headerCloseIcon} />
            </div>
          </div>
        </div>
      </PreviewRegion>

      {timerSlot}

      <PreviewRegion
        sectionId="progress"
        activeSectionId={activeSectionId}
        onSectionSelect={onSectionSelect}
        className="theme-preview-region--progress"
      >
        <div className={processBarClassName}>
          {isStyle2Progress ? (
            <div className="sp-process-bar__meta">
              <span className="sp-process-bar__step">{processLabel}</span>
              {progressAboveText ? (
                <span className="sp-process-bar__above">{progressAboveText}</span>
              ) : null}
            </div>
          ) : null}
          <div className="sp-process-bar__track">
            <div className="sp-process-bar-color">
              {isStyle2Progress ? null : processLabel}
            </div>
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
        sectionId="thanks"
        activeSectionId={activeSectionId}
        onSectionSelect={onSectionSelect}
        className="theme-preview-region--thanks"
      >
        <div className="theme-customize-preview__error-top">
          <div className="ss-user-setting__item-text_input-top">
            <div className="ss-bot-submit-thanks-message theme-customize-preview__thanks-message">
              ご注文ありがとうございました。
            </div>
          </div>
        </div>
      </PreviewRegion>

      <PreviewRegion
        sectionId="mainWindow"
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
    </PreviewThemeContext.Provider>
  );
};

ThemePreviewShell.propTypes = {
  scopeId: PropTypes.string.isRequired,
  themeSettings: PropTypes.object,
  mainColor: PropTypes.string,
  designType: PropTypes.string,
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
  designType: '',
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
