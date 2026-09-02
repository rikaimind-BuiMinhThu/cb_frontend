import React from 'react';
import PropTypes from 'prop-types';
import { Select, Space, Typography } from 'antd';
import DesignBotIcons from '../DesignSettingComponents/DesignBotIcons';
import InputNum from 'v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputNum';
import {
  DEFAULT_IMAGES,
  CHAT_BODY_VERSION_DEFAULT,
  CHAT_BODY_VERSIONS,
  OPEN_ANIMATION_DURATION_MS_DEFAULT,
  OPEN_ANIMATION_DURATION_MS_MAX,
  OPEN_ANIMATION_DURATION_MS_MIN,
  OPEN_ANIMATION_STYLE_DEFAULT,
  OPEN_ANIMATION_STYLES,
} from '../constants/designChatbotConstants';
import DesignTypePicker from './DesignTypePicker';
import BasicInfoStatePreview from './BasicInfoStatePreview';
import DesignSettingLabel from './shared/DesignSettingLabel';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

const errorStyle = (message) => ({
  display: message ? 'block' : 'none',
});

const BasicInfoTab = ({
  basicInfo,
  validationErrors,
  iconPresetIndices,
  onFieldChange,
  onClearError,
  onDesignTypeChange,
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
              <DesignSettingLabel tooltip={getDesignSettingTooltip('botName')} required>
                ボット名称
              </DesignSettingLabel>
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
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('chatBodyVersion')}>
                チャット本体バージョン
              </DesignSettingLabel>
              <Select
                style={{ width: 220 }}
                value={basicInfo.chatBodyVersion || CHAT_BODY_VERSION_DEFAULT}
                options={CHAT_BODY_VERSIONS}
                onChange={(value) => onFieldChange('chatBodyVersion', value)}
              />
            </div>
            <span className="subtitle-field">
              ※古いバージョンに変更すると、新しく実装された機能が正しく動作しない可能性があります。
            </span>
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('openAnimationDurationMs')}>
                起動アニメーション速度
              </DesignSettingLabel>
              <Space size={8} align="center" className="basic-info-animation-duration">
                <InputNum
                  style={{ width: 140, minWidth: 120 }}
                  name="open_animation_duration_ms"
                  min={OPEN_ANIMATION_DURATION_MS_MIN}
                  max={OPEN_ANIMATION_DURATION_MS_MAX}
                  value={basicInfo.openAnimationDurationMs}
                  placeholder={String(OPEN_ANIMATION_DURATION_MS_DEFAULT)}
                  onChange={(value) => onFieldChange('openAnimationDurationMs', value)}
                />
                <span className="design-field__suffix">ms</span>
              </Space>
            </div>
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('openAnimationStyle')}>
                起動アニメーションスタイル
              </DesignSettingLabel>
              <Select
                style={{ width: 220 }}
                value={basicInfo.openAnimationStyle || OPEN_ANIMATION_STYLE_DEFAULT}
                options={OPEN_ANIMATION_STYLES}
                onChange={(value) => onFieldChange('openAnimationStyle', value)}
              />
            </div>
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('title')} required>
                タイトル
              </DesignSettingLabel>
              <input
                type="text"
                name="title"
                className="input-field"
                value={basicInfo.title}
                placeholder="サービス名など（例：BOTCHAN）"
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
              <DesignSettingLabel tooltip={getDesignSettingTooltip('subtitle')} required>
                サブタイトル
              </DesignSettingLabel>
              <input
                type="text"
                className="input-field"
                value={basicInfo.subtitle}
                placeholder="フォームの目的（例：資料請求フォーム）"
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
              <DesignSettingLabel tooltip={getDesignSettingTooltip('designType')}>
                デザインタイプ
              </DesignSettingLabel>
              <DesignTypePicker
                designType={basicInfo.designType}
                onChange={onDesignTypeChange}
              />
            </div>
            <span className="error-message design-types" />
          </div>
          <div className="field-add-bot">
            <DesignBotIcons
              botIcon={basicInfo.botImage}
              openingBotIcon={basicInfo.openingBotIcon}
              closingBotIcon={basicInfo.closingBotIcon}
              activeIndices={iconPresetIndices}
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
        </div>
        <div className="bot-right">
          <BasicInfoStatePreview
            mainColor={basicInfo.mainColor}
            title={basicInfo.title}
            subtitle={basicInfo.subtitle}
            botImage={basicInfo.botImage}
            openingBotIcon={basicInfo.openingBotIcon}
            closingBotIcon={basicInfo.closingBotIcon}
            openAnimationDurationMs={basicInfo.openAnimationDurationMs}
            openAnimationStyle={basicInfo.openAnimationStyle}
          />
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
    chatBodyVersion: PropTypes.string,
    openAnimationDurationMs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    openAnimationStyle: PropTypes.string,
  }).isRequired,
  validationErrors: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    botName: PropTypes.string,
    botImage: PropTypes.string,
  }).isRequired,
  iconPresetIndices: PropTypes.shape({
    bot: PropTypes.number,
    opening: PropTypes.number,
    closing: PropTypes.number,
  }),
  onFieldChange: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
  onDesignTypeChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onIconClick: PropTypes.func.isRequired,
  onIconRemove: PropTypes.func.isRequired,
  onIconUpload: PropTypes.func.isRequired,
};

BasicInfoTab.defaultProps = {
  iconPresetIndices: {
    bot: null,
    opening: null,
    closing: null,
  },
};

export default BasicInfoTab;
