import React from 'react';
import PropTypes from 'prop-types';
import {
  DEVICE_PC,
  DEVICE_SP,
  PC_PANEL_TITLE,
  SP_PANEL_TITLE,
  WIDTH_UNIT_PERCENT,
  WIDTH_UNIT_PX,
} from '../constants/designChatbotConstants';
import DeviceDesignPanel from './DeviceDesignPanel';
import BubbleSettingsSection from './BubbleSettingsSection';

const DesignCustomizeTab = ({ designSettings, onFieldChange }) => (
  <div className="design-setting-tab-content">
    <form action="POST">
      <div className="design-customize-sections">
        <div className="design-customize-panels">
          <DeviceDesignPanel
            device={DEVICE_PC}
            title={PC_PANEL_TITLE}
            displayType={designSettings.displayType}
            width={designSettings.widthPc}
            height={designSettings.heightPc}
            widthUnit={WIDTH_UNIT_PX}
            position={designSettings.positionPc}
            buttonType={designSettings.buttonTypePc}
            rightTitle={designSettings.rightPcTitle}
            rightMargin={designSettings.rightMarginPc}
            bottomMargin={designSettings.bottomMarginPc}
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
            rightTitle={designSettings.rightSpTitle}
            rightMargin={designSettings.rightMarginSp}
            bottomMargin={designSettings.bottomMarginSp}
            onChange={onFieldChange}
          />
        </div>

        <BubbleSettingsSection
          titleBubble={designSettings.titleBubble}
          onChange={onFieldChange}
        />
      </div>
    </form>
  </div>
);

DesignCustomizeTab.propTypes = {
  designSettings: PropTypes.shape({
    displayType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    widthPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    heightPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    widthSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    heightSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    positionPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    buttonTypePc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rightPcTitle: PropTypes.string,
    rightMarginPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottomMarginPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    positionSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    buttonTypeSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rightSpTitle: PropTypes.string,
    rightMarginSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottomMarginSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    titleBubble: PropTypes.string,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default DesignCustomizeTab;
