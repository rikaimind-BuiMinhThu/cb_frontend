import React from 'react';
import { Tabs, Spin } from 'antd';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'v2/assets/css/bot/bot-setting.css';
import 'v2/assets/css/bot/add-bot.css';
import {
  BOT_ID_COOKIE_KEY,
  SCL_BUTTON_LABEL,
  SCENARIO_LIST_PATH,
  TAB_BASIC,
  TAB_BASIC_LABEL,
  TAB_DESIGN,
  TAB_DESIGN_LABEL,
  TAB_THEME,
  TAB_THEME_LABEL,
} from './constants/designChatbotConstants';
import ThemeCustomizeTab from './components/ThemeCustomizeTab';
import useDesignChatbot from './hooks/useDesignChatbot';
import BasicInfoTab from './components/BasicInfoTab';
import DesignCustomizeTab from './components/DesignCustomizeTab';
import { AdminPage, AdminActionButton, useAdminHeaderActions } from 'v2/components/AdminShell';

const DesignChatbot = () => {
  const botId = Cookies.get(BOT_ID_COOKIE_KEY);
  const { state, actions } = useDesignChatbot(botId);

  const saveHandler =
    state.tabmenu === TAB_BASIC
      ? actions.saveBasicInfo
      : state.tabmenu === TAB_DESIGN
        ? actions.saveDesignSettings
        : actions.saveThemeCustomize;

  useAdminHeaderActions(
    state.isLoaded ? <AdminActionButton action="save" onClick={saveHandler} /> : null
  );

  if (!state.isLoaded) {
    return (
      <AdminPage className="admin-page--design-setting">
        <div className="design-setting-loading">
          <Spin />
        </div>
      </AdminPage>
    );
  }

  return (
    <>
      <AdminPage className="admin-page--design-setting">
        <Tabs
          activeKey={String(state.tabmenu)}
          onChange={(key) => actions.setTabmenu(Number(key))}
          className="admin-page-tabs"
          items={[
            {
              key: String(TAB_BASIC),
              label: TAB_BASIC_LABEL,
              children: (
                <BasicInfoTab
                  basicInfo={state.basicInfo}
                  validationErrors={state.validationErrors}
                  iconPresetIndices={state.iconPresetIndices}
                  onFieldChange={(field, value) => {
                    const setters = {
                      title: actions.setTitle,
                      subtitle: actions.setSubtitle,
                      botName: actions.setBotName,
                      chatBodyVersion: actions.setChatBodyVersion,
                      openAnimationDurationMs: (nextValue) => {
                        actions.updateDesignSettingField('openAnimationDurationMs', nextValue);
                      },
                      openAnimationStyle: (nextValue) => {
                        actions.updateDesignSettingField('openAnimationStyle', nextValue);
                      },
                    };
                    setters[field]?.(value);
                  }}
                  onClearError={actions.clearValidationError}
                  onDesignTypeChange={actions.setDesignType}
                  onSave={actions.saveBasicInfo}
                  onIconClick={actions.handleIconClickForType}
                  onIconRemove={actions.handleRemoveImage}
                  onIconUpload={actions.getBaseUrlAdd}
                />
              ),
            },
            {
              key: String(TAB_DESIGN),
              label: TAB_DESIGN_LABEL,
              children: (
                <DesignCustomizeTab
                  designSettings={state.designSettings}
                  onFieldChange={actions.updateDesignSettingField}
                  onSave={actions.saveDesignSettings}
                />
              ),
            },
            {
              key: String(TAB_THEME),
              label: TAB_THEME_LABEL,
              children: (
                <ThemeCustomizeTab
                  themeSettings={state.designSettings.themeSettings}
                  mainColor={state.basicInfo.mainColor}
                  title={state.basicInfo.title}
                  subtitle={state.basicInfo.subtitle}
                  onFieldChange={actions.updateThemeField}
                  onMainColorChange={actions.setMainColor}
                  onApplyDerivedTheme={actions.applyDerivedTheme}
                  onResetSection={actions.resetThemeSection}
                  onSave={actions.saveThemeCustomize}
                />
              ),
            },
          ]}
        />
      </AdminPage>
      <Link to={SCENARIO_LIST_PATH}>
        <button className="admin-visually-hidden" type="button">
          {SCL_BUTTON_LABEL}
        </button>
      </Link>
    </>
  );
};

export default DesignChatbot;
