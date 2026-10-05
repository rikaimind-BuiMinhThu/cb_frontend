import React from 'react';
import PropTypes from 'prop-types';
import { AdminActionButton } from '../../../../../components/AdminShell';
import DeviceDesignPanel from './DeviceDesignPanel';
import BubbleSettingsSection from './BubbleSettingsSection';

const DesignCustomizeTab = ({ designSettings, onFieldChange, onSave }) => (
  <div className="design-setting-tab-content">
    <form action="POST">
      <div className="design-customize-sections">
        <div className="design-customize-panels">
          <DeviceDesignPanel
            device="pc"
            title="PC"
            displayType={designSettings.displayType}
            width={designSettings.widthPc}
            height={designSettings.heightPc}
            widthUnit="px"
            position={designSettings.positionPc}
            buttonType={designSettings.buttonTypePc}
            rightTitle={designSettings.rightPcTitle}
            rightMargin={designSettings.rightMarginPc}
            bottomMargin={designSettings.bottomMarginPc}
            onChange={onFieldChange}
          />
          <DeviceDesignPanel
            device="sp"
            title="スマートフォン"
            width={designSettings.widthSp}
            height={designSettings.heightSp}
            widthUnit="%"
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
          popupCloseBot={designSettings.popupCloseBot}
          onChange={onFieldChange}
        />

        <div className="design-customize-footer admin-form-actions">
          <AdminActionButton action="save" label="設定保存" onClick={onSave} />
        </div>
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
    popupCloseBot: PropTypes.bool,
    titleBubble: PropTypes.string,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default DesignCustomizeTab;
