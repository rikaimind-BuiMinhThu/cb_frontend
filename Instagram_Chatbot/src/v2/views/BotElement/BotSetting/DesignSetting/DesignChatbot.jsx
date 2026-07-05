import React from 'react';
import { Tabs } from 'antd';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import ModalNoti from '../../../Popup/ModalNoti';
import './../../../../assets/css/bot/bot-setting.css';
import './../../../../assets/css/bot/add-bot.css';
import { TAB_BASIC, TAB_DESIGN, TAB_THEME } from './constants/designChatbotConstants';
import ThemeCustomizeTab from './components/ThemeCustomizeTab';
import useDesignChatbot from './hooks/useDesignChatbot';
import BasicInfoTab from './components/BasicInfoTab';
import DesignCustomizeTab from './components/DesignCustomizeTab';
import { AdminPage } from '../../../../components/AdminShell';

function DesignChatbot() {
  const botId = Cookies.get('bot_id');
  const { state, actions } = useDesignChatbot(botId);

  if (!state.isLoaded) {
    return null;
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
              label: '基本情報',
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
              label: 'デザインカスタマイズ',
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
              label: 'テーマカスタマイズ',
              children: (
                <ThemeCustomizeTab
                  themeSettings={state.designSettings.themeSettings}
                  mainColor={state.basicInfo.mainColor}
                  title={state.basicInfo.title}
                  subtitle={state.basicInfo.subtitle}
                  onFieldChange={actions.updateThemeField}
                  onMainColorChange={actions.setMainColor}
                  onSave={actions.saveThemeCustomize}
                />
              ),
            },
          ]}
        />
      </AdminPage>

      <ModalNoti open={state.isOpenNoti} onClose={() => actions.setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <span style={{ fontSize: '16px' }}>{state.msgNoti}</span>
        </div>
      </ModalNoti>
      <Link to="/v2/admin/scenario-list">
        <button style={{ display: 'none' }} type="button">
          SCL
        </button>
      </Link>
    </>
  );
}

export default DesignChatbot;
