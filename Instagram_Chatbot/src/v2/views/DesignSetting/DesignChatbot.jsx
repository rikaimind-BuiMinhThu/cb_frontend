import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Spin } from 'antd';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  AdminPage,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import ThemeCustomizeTab from './components/ThemeCustomizeTab';
import BasicInfoTab from './components/BasicInfoTab';
import DesignCustomizeTab from './components/DesignCustomizeTab';
import useDesignChatbot from './hooks/useDesignChatbot';
import {
  BOT_ID_COOKIE_KEY,
  BOT_LIST_PATH,
  CREATE_BOT_LABEL,
  MODE_CREATE,
  MODE_EDIT,
  SCL_BUTTON_LABEL,
  SCENARIO_LIST_PATH,
  TAB_BASIC,
  TAB_BASIC_LABEL,
  TAB_DESIGN,
  TAB_DESIGN_LABEL,
  TAB_THEME,
  TAB_THEME_LABEL,
} from './constants/designChatbotConstants';
import 'v2/assets/css/bot/bot-setting.css';
import 'v2/assets/css/bot/add-bot.css';

const resolveEditSaveHandler = (tabmenu, actions) => {
  if (tabmenu === TAB_BASIC) {
    return actions.saveBasicInfo;
  }
  if (tabmenu === TAB_DESIGN) {
    return actions.saveDesignSettings;
  }
  return actions.saveThemeCustomize;
};

const DesignChatbot = ({ mode = MODE_EDIT }) => {
  const isCreateMode = mode === MODE_CREATE;
  const botId = isCreateMode ? null : Cookies.get(BOT_ID_COOKIE_KEY);
  const { state, actions } = useDesignChatbot(botId, { mode });

  const createHeaderActions = (
    <>
      <AdminActionButton
        action="back"
        onClick={() => { window.location.href = BOT_LIST_PATH; }}
      />
      <AdminActionButton
        action="create"
        label={CREATE_BOT_LABEL}
        loading={state.isSaving}
        onClick={actions.createBot}
      />
    </>
  );

  const editHeaderActions = (
    <AdminActionButton
      action="save"
      onClick={resolveEditSaveHandler(state.tabmenu, actions)}
    />
  );

  const resolveHeaderActions = () => {
    if (!state.isLoaded) {
      return null;
    }
    if (isCreateMode) {
      return createHeaderActions;
    }
    return editHeaderActions;
  };

  useAdminHeaderActions(resolveHeaderActions());

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
                  onSave={isCreateMode ? actions.createBot : actions.saveBasicInfo}
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
                  onSave={isCreateMode ? actions.createBot : actions.saveDesignSettings}
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
                  designType={state.basicInfo.designType}
                  title={state.basicInfo.title}
                  subtitle={state.basicInfo.subtitle}
                  onFieldChange={actions.updateThemeField}
                  onMainColorChange={actions.setMainColor}
                  onApplyDerivedTheme={actions.applyDerivedTheme}
                  onResetSection={actions.resetThemeSection}
                  onSave={isCreateMode ? actions.createBot : actions.saveThemeCustomize}
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

DesignChatbot.propTypes = {
  mode: PropTypes.oneOf([MODE_EDIT, MODE_CREATE]),
};

DesignChatbot.defaultProps = {
  mode: MODE_EDIT,
};

export default DesignChatbot;
