import React from 'react';
import PropTypes from 'prop-types';
import DeviceDesignPanel from './DeviceDesignPanel';
import BubbleSettingsSection from './BubbleSettingsSection';

const DesignCustomizeTab = ({ designSettings, onFieldChange, onSave }) => (
  <div>
    <form action="POST">
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', display: 'flex', padding: '0 40px' }}>
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
        <hr />
        <BubbleSettingsSection
          titleBubble={designSettings.titleBubble}
          popupCloseBot={designSettings.popupCloseBot}
          onChange={onFieldChange}
        />
        <div style={{ width: '100%', marginTop: '40px', padding: '0 20px' }}>
          <div className="btn-wrapper">
            <button type="button" className="btn btn-preview" onClick={onSave}>
              設定保存
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
);

DesignCustomizeTab.propTypes = {
  designSettings: PropTypes.shape({
    displayType: PropTypes.number,
    widthPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    heightPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    widthSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    heightSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    positionPc: PropTypes.number,
    buttonTypePc: PropTypes.number,
    rightPcTitle: PropTypes.string,
    rightMarginPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottomMarginPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    positionSp: PropTypes.number,
    buttonTypeSp: PropTypes.number,
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
