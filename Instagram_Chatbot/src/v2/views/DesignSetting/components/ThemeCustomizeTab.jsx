import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  THEME_SECTIONS,
  THEME_MAIN_COLOR_CONFIRM_CANCEL,
  THEME_MAIN_COLOR_CONFIRM_MESSAGE,
  THEME_MAIN_COLOR_CONFIRM_OK,
  THEME_MAIN_COLOR_CONFIRM_TITLE,
  THEME_PREVIEW_CLICK_HINT,
} from '../constants/designThemeConstants';
import { DEFAULT_MAIN_COLOR } from '../constants/designChatbotConstants';
import ThemeAccordionSection from './ThemeAccordionSection';
import ThemeCustomizePreview from './ThemeCustomizePreview';
import ThemeSectionNav from './ThemeSectionNav';
import { AdminConfirmModal } from 'v2/components/AdminShell';

const DEFAULT_EXPANDED_SECTIONS = [];

const ThemeCustomizeTab = ({
  themeSettings,
  mainColor,
  designType,
  title,
  subtitle,
  onFieldChange,
  onMainColorChange,
  onApplyDerivedTheme,
  onResetSection,
  onSave,
}) => {
  const [activeSectionId, setActiveSectionId] = useState('headerMain');
  const [expandedSections, setExpandedSections] = useState(DEFAULT_EXPANDED_SECTIONS);
  const [showModalInPreview, setShowModalInPreview] = useState(true);
  const [pendingMainColor, setPendingMainColor] = useState(null);
  const sectionRefs = useRef({});

  const setSectionRef = useCallback((sectionId, node) => {
    if (node) {
      sectionRefs.current[sectionId] = node;
    }
  }, []);

  const handleSectionSelect = useCallback((sectionId) => {
    setActiveSectionId(sectionId);
    setExpandedSections([sectionId]);
    requestAnimationFrame(() => {
      sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handleSectionExpand = useCallback((sectionId, expanded) => {
    if (expanded) {
      setActiveSectionId(sectionId);
      setExpandedSections([sectionId]);
      return;
    }
    setExpandedSections((prev) => prev.filter((id) => id !== sectionId));
  }, []);

  const handleMainColorChange = useCallback((color) => {
    if (color === mainColor) return;
    setPendingMainColor(color);
  }, [mainColor]);

  const handleApplyDerived = useCallback(() => {
    if (!pendingMainColor) return;
    onApplyDerivedTheme(pendingMainColor);
    setPendingMainColor(null);
  }, [pendingMainColor, onApplyDerivedTheme]);

  const handleSkipDerived = useCallback(() => {
    if (!pendingMainColor) return;
    onMainColorChange(pendingMainColor);
    setPendingMainColor(null);
  }, [pendingMainColor, onMainColorChange]);

  return (
    <div className="design-setting-tab-content">
      <div className="theme-customize-tab-layout">
        <div className="theme-customize-tab-preview">
          <p className="theme-customize-tab-preview__hint">
            {THEME_PREVIEW_CLICK_HINT}
          </p>
          <ThemeCustomizePreview
            themeSettings={themeSettings}
            mainColor={mainColor}
            designType={designType}
            title={title}
            subtitle={subtitle}
            activeSectionId={activeSectionId}
            onSectionSelect={handleSectionSelect}
            showModalPreview={showModalInPreview}
          />
        </div>
        <div className="theme-customize-tab-settings">
          <ThemeSectionNav
            activeSectionId={activeSectionId}
            onSectionSelect={handleSectionSelect}
          />
          <div className="theme-customize-tab-settings__scroll">
            {THEME_SECTIONS.map((section) => (
              <div
                key={section.id}
                ref={(node) => setSectionRef(section.id, node)}
              >
                <ThemeAccordionSection
                  sectionId={section.id}
                  title={section.title}
                  fields={section.fields}
                  themeSettings={themeSettings}
                  mainColor={mainColor}
                  onMainColorChange={handleMainColorChange}
                  isActive={activeSectionId === section.id}
                  isExpanded={expandedSections.includes(section.id)}
                  onExpand={handleSectionExpand}
                  onFieldChange={onFieldChange}
                  onResetSection={onResetSection}
                  showModalInPreview={showModalInPreview}
                  onModalPreviewToggle={setShowModalInPreview}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <AdminConfirmModal
        open={Boolean(pendingMainColor)}
        title={THEME_MAIN_COLOR_CONFIRM_TITLE}
        message={THEME_MAIN_COLOR_CONFIRM_MESSAGE}
        okText={THEME_MAIN_COLOR_CONFIRM_OK}
        cancelText={THEME_MAIN_COLOR_CONFIRM_CANCEL}
        onOk={handleApplyDerived}
        onCancel={handleSkipDerived}
      />
    </div>
  );
};

ThemeCustomizeTab.propTypes = {
  themeSettings: PropTypes.object.isRequired,
  mainColor: PropTypes.string,
  designType: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  onMainColorChange: PropTypes.func.isRequired,
  onApplyDerivedTheme: PropTypes.func.isRequired,
  onResetSection: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

ThemeCustomizeTab.defaultProps = {
  mainColor: DEFAULT_MAIN_COLOR,
  designType: '',
  title: '',
  subtitle: '',
};

export default ThemeCustomizeTab;
