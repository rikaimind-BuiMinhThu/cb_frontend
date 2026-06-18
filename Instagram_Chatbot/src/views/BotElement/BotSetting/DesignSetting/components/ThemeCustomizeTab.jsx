import React from 'react';
import PropTypes from 'prop-types';
import { THEME_SECTIONS } from '../constants/designThemeConstants';
import ThemeSection from './ThemeSection';
import ThemeCustomizePreview from './ThemeCustomizePreview';

const ThemeCustomizeTab = ({
  themeSettings,
  mainColor,
  title,
  subtitle,
  onFieldChange,
  onSave,
}) => (
  <div className="design-setting-tab-content">
    <div className="theme-customize-tab-layout">
        <div className="theme-customize-tab-preview">
          <ThemeCustomizePreview
            themeSettings={themeSettings}
            mainColor={mainColor}
            title={title}
            subtitle={subtitle}
          />
        </div>
        <div className="theme-customize-tab-settings">
          <div className="theme-customize-tab-settings__scroll">
            {THEME_SECTIONS.map((section) => (
              <ThemeSection
                key={section.id}
                title={section.title}
                fields={section.fields}
                themeSettings={themeSettings}
                onFieldChange={onFieldChange}
              />
            ))}
          </div>
          <div className="theme-customize-tab-settings__footer">
            <button type="button" className="btn btn-preview" onClick={onSave}>
              設定保存
            </button>
        </div>
      </div>
    </div>
  </div>
);

ThemeCustomizeTab.propTypes = {
  themeSettings: PropTypes.object.isRequired,
  mainColor: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

ThemeCustomizeTab.defaultProps = {
  mainColor: '#327AED',
  title: '',
  subtitle: '',
};

export default ThemeCustomizeTab;
