import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';
import {
  DEVICE_PC,
  DEVICE_SP,
  DISPLAY_TYPE_OPTIONS,
  LABEL_DISPLAY_TYPE,
  PC_PANEL_TITLE,
  SP_PANEL_TITLE,
  WIDTH_UNIT_PERCENT,
  WIDTH_UNIT_PX,
} from '../constants/designChatbotConstants';
import DeviceDesignPanel from './DeviceDesignPanel';
import BubbleSettingsSection from './BubbleSettingsSection';

const DesignField = ({ label, tooltipKey, children }) => (
  <div className="design-field">
    <label className="design-field__label">
      {label}
      {tooltipKey && (
        <AdminInfoTooltip text={getDesignSettingTooltip(tooltipKey)} />
      )}
    </label>
    <div className="design-field__control">{children}</div>
  </div>
);

DesignField.propTypes = {
  label: PropTypes.string.isRequired,
  tooltipKey: PropTypes.string,
  children: PropTypes.node.isRequired,
};

DesignField.defaultProps = {
  tooltipKey: '',
};

const DesignCustomizeTab = ({ basicInfo, designSettings, onFieldChange }) => (
  <div className="design-setting-tab-content">
    <form action="POST">
      <div className="design-customize-sections">
        <BubbleSettingsSection
          titleBubble={designSettings.titleBubble}
          onChange={onFieldChange}
        />

        <section className="design-customize-shared">
          <div className="design-customize-shared-grid">
            <DesignField label={LABEL_DISPLAY_TYPE} tooltipKey="displayType">
              <Select
                value={Number(designSettings.displayType)}
                options={DISPLAY_TYPE_OPTIONS}
                onChange={(value) => onFieldChange('displayType', value)}
              />
            </DesignField>
          </div>
        </section>

        <div className="design-customize-panels">
          <DeviceDesignPanel
            device={DEVICE_PC}
            title={PC_PANEL_TITLE}
            width={designSettings.widthPc}
            height={designSettings.heightPc}
            widthUnit={WIDTH_UNIT_PX}
            position={designSettings.positionPc}
            buttonType={designSettings.buttonTypePc}
            rightMargin={designSettings.rightMarginPc}
            bottomMargin={designSettings.bottomMarginPc}
            basicInfo={basicInfo}
            designSettings={designSettings}
            onChange={onFieldChange}
          />
          <DeviceDesignPanel
            device={DEVICE_SP}
            title={SP_PANEL_TITLE}
            width={designSettings.widthSp}
            height={designSettings.heightSp}
            widthUnit={WIDTH_UNIT_PERCENT}
            position={designSettings.positionSp}
            buttonType={designSettings.buttonTypeSp}
            rightMargin={designSettings.rightMarginSp}
            bottomMargin={designSettings.bottomMarginSp}
            basicInfo={basicInfo}
            designSettings={designSettings}
            onChange={onFieldChange}
          />
        </div>
      </div>
    </form>
  </div>
);

DesignCustomizeTab.propTypes = {
  basicInfo: PropTypes.shape({
    title: PropTypes.string,
    mainColor: PropTypes.string,
    designType: PropTypes.string,
    botImage: PropTypes.string,
    openingBotIcon: PropTypes.string,
    closingBotIcon: PropTypes.string,
  }).isRequired,
  designSettings: PropTypes.shape({
    displayType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    widthPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    heightPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    widthSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    heightSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    positionPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    buttonTypePc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rightMarginPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottomMarginPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    positionSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    buttonTypeSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rightMarginSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottomMarginSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    titleBubble: PropTypes.string,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default DesignCustomizeTab;
