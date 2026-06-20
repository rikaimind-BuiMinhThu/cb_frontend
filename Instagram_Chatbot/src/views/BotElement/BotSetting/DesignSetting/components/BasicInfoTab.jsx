import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import { AdminActionButton } from '../../../../../components/AdminShell';
import DesignBotIcons from '../DesignSettingComponents/DesignBotIcons';
import { DEFAULT_IMAGES } from '../constants/designChatbotConstants';
import DesignTypePicker from './DesignTypePicker';
import MainColorPicker from './MainColorPicker';

const errorStyle = (message) => ({
  display: message ? 'block' : 'none',
});

const BasicInfoTab = ({
  basicInfo,
  validationErrors,
  onFieldChange,
  onClearError,
  onDesignTypeChange,
  onMainColorChange,
  onPreview,
  onSave,
  onIconClick,
  onIconRemove,
  onIconUpload,
}) => (
  <div className="design-setting-tab-content">
    <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
      ボット設定
    </Typography.Title>
    <form action="">
      <div className="add-bot-container">
          <div className="bot-left">
            <div className="field-add-bot">
              <div className="add-bot_field-container">
                <span className="label-field">
                  タイトル <span style={{ color: 'red' }}>*</span>
                </span>
                <input
                  type="text"
                  name="title"
                  className="input-field"
                  value={basicInfo.title}
                  placeholder="Service name, etc. (e.g. BOTCHAN)"
                  onChange={(e) => {
                    onFieldChange('title', e.target.value);
                    onClearError('title');
                  }}
                />
              </div>
              <span className="error-message title" style={errorStyle(validationErrors.title)}>
                {validationErrors.title}
              </span>
            </div>
            <div className="field-add-bot">
              <div className="add-bot_field-container">
                <span className="label-field">
                  サブタイトル <span style={{ color: 'red' }}>*</span>
                </span>
                <input
                  type="text"
                  className="input-field"
                  value={basicInfo.subtitle}
                  placeholder="Purpose of the form (e.g. information request form)"
                  onChange={(e) => {
                    onFieldChange('subtitle', e.target.value);
                    onClearError('subtitle');
                  }}
                />
              </div>
              <span className="error-message subtile" style={errorStyle(validationErrors.subtitle)}>
                {validationErrors.subtitle}
              </span>
            </div>
            <div className="field-add-bot">
              <div className="add-bot_field-container">
                <span className="label-field">デザインタイプ</span>
                <DesignTypePicker
                  designType={basicInfo.designType}
                  onChange={onDesignTypeChange}
                />
              </div>
              <span className="error-message design-types" />
            </div>
            <div className="field-add-bot">
              <div className="add-bot_field-container">
                <span className="label-field">メインカラー</span>
                <MainColorPicker
                  mainColor={basicInfo.mainColor}
                  onChange={onMainColorChange}
                />
              </div>
              <span className="error-message main-colors" />
            </div>
            <div className="btn-wrapper admin-form-actions">
              <AdminActionButton action="preview" onClick={onPreview} />
            </div>
          </div>
          <div className="bot-right">
            <div>
              <div className="field-add-bot">
                <DesignBotIcons
                  botIcon={basicInfo.botImage}
                  openingBotIcon={basicInfo.openingBotIcon}
                  closingBotIcon={basicInfo.closingBotIcon}
                  onBotIconChange={onIconUpload('bot_image')}
                  onOpeningBotIconChange={onIconUpload('opening_bot_icon')}
                  onClosingBotIconChange={onIconUpload('closing_bot_icon')}
                  onBotIconRemove={onIconRemove('bot_image')}
                  onOpeningBotIconRemove={onIconRemove('opening_bot_icon')}
                  onClosingBotIconRemove={onIconRemove('closing_bot_icon')}
                  images={DEFAULT_IMAGES}
                  onIconClick={onIconClick}
                />
              </div>
              <div className="field-add-bot">
                <div className="add-bot_field-container">
                  <span className="label-field">
                    ボット名称 <span style={{ color: 'red' }}>*</span>
                  </span>
                  <input
                    type="text"
                    name="botName"
                    value={basicInfo.botName}
                    className="input-field"
                    placeholder="サンプルボット..."
                    onChange={(e) => {
                      onFieldChange('botName', e.target.value);
                      onClearError('botName');
                    }}
                  />
                </div>
                <span className="subtitle-field">
                  ※EC-CHAT管理用の名称です。ボット内で表示されることはありません。
                </span>
                <span className="error-message bot-name" style={errorStyle(validationErrors.botName)}>
                  {validationErrors.botName}
                </span>
              </div>
            </div>
            <div className="btn-wrapper admin-form-actions">
              <AdminActionButton action="save" onClick={onSave} />
            </div>
          </div>
        </div>
      </form>
  </div>
);

BasicInfoTab.propTypes = {
  basicInfo: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    designType: PropTypes.string,
    mainColor: PropTypes.string,
    botImage: PropTypes.string,
    openingBotIcon: PropTypes.string,
    closingBotIcon: PropTypes.string,
    botName: PropTypes.string,
  }).isRequired,
  validationErrors: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    botName: PropTypes.string,
    botImage: PropTypes.string,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
  onDesignTypeChange: PropTypes.func.isRequired,
  onMainColorChange: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onIconClick: PropTypes.func.isRequired,
  onIconRemove: PropTypes.func.isRequired,
  onIconUpload: PropTypes.func.isRequired,
};

export default BasicInfoTab;
