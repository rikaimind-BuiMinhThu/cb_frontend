import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Select, Space, Typography } from 'antd';
import DesignBotIcons from '../DesignSettingComponents/DesignBotIcons';
import {
  BASIC_INFO_SECTION_TITLE,
  BOT_NAME_HINT,
  CHAT_BODY_VERSION_DEFAULT,
  CHAT_BODY_VERSION_HINT,
  CHAT_BODY_VERSIONS,
  DEFAULT_IMAGES,
  DURATION_UNIT_MS,
  LABEL_BOT_NAME,
  LABEL_CHAT_BODY_VERSION,
  LABEL_DESIGN_TYPE,
  LABEL_OPEN_ANIMATION_DURATION,
  LABEL_OPEN_ANIMATION_STYLE,
  LABEL_SUBTITLE,
  LABEL_TITLE,
  OPEN_ANIMATION_DURATION_MS_DEFAULT,
  OPEN_ANIMATION_DURATION_MS_MAX,
  OPEN_ANIMATION_DURATION_MS_MIN,
  OPEN_ANIMATION_STYLE_DEFAULT,
  OPEN_ANIMATION_STYLES,
  PLACEHOLDER_BOT_NAME,
  PLACEHOLDER_SUBTITLE,
  PLACEHOLDER_TITLE,
} from '../constants/designChatbotConstants';
import DesignTypePicker from './DesignTypePicker';
import BasicInfoStatePreview from './BasicInfoStatePreview';
import DesignSettingLabel from './shared/DesignSettingLabel';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

const BasicInfoTab = ({
  basicInfo,
  validationErrors,
  iconPresetIndices,
  onFieldChange,
  onClearError,
  onDesignTypeChange,
  onIconClick,
  onIconRemove,
  onIconUpload,
}) => (
  <div className="design-setting-tab-content">
    <Typography.Title level={5} className="basic-info-tab-title">
      {BASIC_INFO_SECTION_TITLE}
    </Typography.Title>
    <form action="">
      <div className="add-bot-container">
        <div className="bot-left">
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('botName')} required>
                {LABEL_BOT_NAME}
              </DesignSettingLabel>
              <input
                type="text"
                name="botName"
                value={basicInfo.botName}
                className="input-field"
                placeholder={PLACEHOLDER_BOT_NAME}
                onChange={(e) => {
                  onFieldChange('botName', e.target.value);
                  onClearError('botName');
                }}
              />
            </div>
            <span className="subtitle-field">
              {BOT_NAME_HINT}
            </span>
            {validationErrors.botName ? (
              <span className="error-message bot-name">
                {validationErrors.botName}
              </span>
            ) : null}
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('chatBodyVersion')}>
                {LABEL_CHAT_BODY_VERSION}
              </DesignSettingLabel>
              <Select
                className="basic-info-select"
                value={basicInfo.chatBodyVersion || CHAT_BODY_VERSION_DEFAULT}
                options={CHAT_BODY_VERSIONS}
                onChange={(value) => onFieldChange('chatBodyVersion', value)}
              />
            </div>
            <span className="subtitle-field">
              {CHAT_BODY_VERSION_HINT}
            </span>
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('openAnimationDurationMs')}>
                {LABEL_OPEN_ANIMATION_DURATION}
              </DesignSettingLabel>
              <Space size={8} align="center" className="basic-info-animation-duration">
                <InputNumber
                  name="open_animation_duration_ms"
                  min={OPEN_ANIMATION_DURATION_MS_MIN}
                  max={OPEN_ANIMATION_DURATION_MS_MAX}
                  value={basicInfo.openAnimationDurationMs}
                  placeholder={String(OPEN_ANIMATION_DURATION_MS_DEFAULT)}
                  onChange={(value) => onFieldChange('openAnimationDurationMs', value)}
                />
                <span className="design-field__suffix">{DURATION_UNIT_MS}</span>
              </Space>
            </div>
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('openAnimationStyle')}>
                {LABEL_OPEN_ANIMATION_STYLE}
              </DesignSettingLabel>
              <Select
                className="basic-info-select"
                value={basicInfo.openAnimationStyle || OPEN_ANIMATION_STYLE_DEFAULT}
                options={OPEN_ANIMATION_STYLES}
                onChange={(value) => onFieldChange('openAnimationStyle', value)}
              />
            </div>
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('title')} required>
                {LABEL_TITLE}
              </DesignSettingLabel>
              <input
                type="text"
                name="title"
                className="input-field"
                value={basicInfo.title}
                placeholder={PLACEHOLDER_TITLE}
                onChange={(e) => {
                  onFieldChange('title', e.target.value);
                  onClearError('title');
                }}
              />
            </div>
            {validationErrors.title ? (
              <span className="error-message title">
                {validationErrors.title}
              </span>
            ) : null}
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('subtitle')} required>
                {LABEL_SUBTITLE}
              </DesignSettingLabel>
              <input
                type="text"
                className="input-field"
                value={basicInfo.subtitle}
                placeholder={PLACEHOLDER_SUBTITLE}
                onChange={(e) => {
                  onFieldChange('subtitle', e.target.value);
                  onClearError('subtitle');
                }}
              />
            </div>
            {validationErrors.subtitle ? (
              <span className="error-message subtile">
                {validationErrors.subtitle}
              </span>
            ) : null}
          </div>
          <div className="field-add-bot">
            <div className="add-bot_field-container">
              <DesignSettingLabel tooltip={getDesignSettingTooltip('designType')}>
                {LABEL_DESIGN_TYPE}
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
