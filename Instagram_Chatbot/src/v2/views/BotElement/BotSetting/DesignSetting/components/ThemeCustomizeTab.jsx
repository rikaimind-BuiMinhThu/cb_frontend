import React from 'react';
import PropTypes from 'prop-types';
import { AdminActionButton } from '../../../../../components/AdminShell';
import { THEME_SECTIONS } from '../constants/designThemeConstants';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';
import MainColorPicker from './MainColorPicker';
import ThemeSection from './ThemeSection';
import ThemeCustomizePreview from './ThemeCustomizePreview';
import DesignSettingInfoTooltip from './shared/DesignSettingInfoTooltip';

const ThemeCustomizeTab = ({
  themeSettings,
  mainColor,
  title,
  subtitle,
  onFieldChange,
  onMainColorChange,
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
          <section className="theme-section theme-section--main-color">
            <h5 className="theme-section__title">
              メインカラー
              <DesignSettingInfoTooltip text={getDesignSettingTooltip('mainColor')} />
            </h5>
            <MainColorPicker mainColor={mainColor} onChange={onMainColorChange} />
          </section>
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
        <div className="theme-customize-tab-settings__footer admin-form-actions">
          <AdminActionButton action="save" label="設定保存" onClick={onSave} />
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
  onMainColorChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

ThemeCustomizeTab.defaultProps = {
  mainColor: '#327AED',
  title: '',
  subtitle: '',
};

export default ThemeCustomizeTab;
