import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Select, Space } from 'antd';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import PreviewClosedLauncher from 'v2/views/Preview/PreviewComponent/PreviewClosedLauncher';
import { getBotHeaderIconUrl } from 'v2/views/Preview/PreviewComponent/previewOpeningStyles';
import { buildDesignSettingClosedPreviewState } from 'v2/views/Preview/PreviewComponent/buildDesignSettingClosedPreviewState';
import { buildDesignTypeChromeCss } from 'v2/utils/designTypeChrome';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';
import {
  BUTTON_TYPE_OPTIONS,
  DEVICE_PC,
  DEVICE_SP,
  LABEL_BOTTOM_MARGIN,
  LABEL_BUTTON_CONTENT,
  LABEL_DISPLAY_CONTENT,
  LABEL_POSITION,
  LABEL_RIGHT_MARGIN,
  LABEL_SIZE,
  PLACEHOLDER_BOTTOM_MARGIN,
  PLACEHOLDER_HEIGHT,
  PLACEHOLDER_RIGHT_MARGIN,
  PLACEHOLDER_WIDTH,
  PREVIEW_CLOSED_TITLE,
  WIDTH_UNIT_PERCENT,
  WIDTH_UNIT_PX,
  POSITION_BOTTOM,
  POSITION_OPTIONS,
  POSITION_RIGHT,
} from '../constants/designChatbotConstants';

const LAYOUT_MODE_INLINE = 'inline';
const CLOSED_PREVIEW_FRAME_SCOPE = '.design-device-card__closed-preview-frame';

const noopOpen = () => {};

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

const DeviceDesignPanel = ({
  device,
  title,
  width,
  height,
  widthUnit,
  position,
  buttonType,
  rightMargin,
  bottomMargin,
  basicInfo,
  designSettings,
  onChange,
}) => {
  const isPc = device === DEVICE_PC;
  const fieldPrefix = isPc ? 'Pc' : 'Sp';
  const sizeMax = isPc ? 1000 : 100;
  const positionValue = Number(position);
  const buttonTypeValue = Number(buttonType);
  const frameModifier = isPc
    ? 'design-device-card__closed-preview-frame--pc'
    : 'design-device-card__closed-preview-frame--sp';
  const previewState = buildDesignSettingClosedPreviewState({
    basicInfo,
    designSettings,
  });
  const headerIconSrc = getBotHeaderIconUrl(previewState.botInfor, false);
  const closedPreviewChromeCss = buildDesignTypeChromeCss(
    basicInfo.designType,
    CLOSED_PREVIEW_FRAME_SCOPE,
  );

  return (
    <section className="design-device-card">
      <h4 className="design-device-card__title">{title}</h4>
      <div className="design-device-card__grid">
        <DesignField label={LABEL_SIZE} tooltipKey="size">
          <Space size={12} wrap className="design-size-row">
            <InputNumber
              name={`width_${device}`}
              min={1}
              max={sizeMax}
              value={width}
              placeholder={PLACEHOLDER_WIDTH}
              onChange={(value) => onChange(`width${fieldPrefix}`, value)}
            />
            <span className="design-field__suffix">{widthUnit}</span>
            <InputNumber
              name={`height_${device}`}
              min={1}
              max={sizeMax}
              value={height}
              placeholder={PLACEHOLDER_HEIGHT}
              onChange={(value) => onChange(`height${fieldPrefix}`, value)}
            />
            <span className="design-field__suffix">{widthUnit}</span>
          </Space>
        </DesignField>

        <DesignField label={LABEL_POSITION} tooltipKey="position">
          <Select
            value={positionValue}
            options={POSITION_OPTIONS}
            onChange={(value) => onChange(`position${fieldPrefix}`, value)}
          />
        </DesignField>

        {positionValue === POSITION_RIGHT && (
          <DesignField label={LABEL_DISPLAY_CONTENT} tooltipKey="rightDisplayContent">
            <Select
              value={buttonTypeValue}
              options={BUTTON_TYPE_OPTIONS}
              onChange={(value) => onChange(`buttonType${fieldPrefix}`, value)}
            />
          </DesignField>
        )}

        {positionValue === POSITION_BOTTOM && (
          <DesignField label={LABEL_BUTTON_CONTENT} tooltipKey="buttonType">
            <Select
              value={buttonTypeValue}
              options={BUTTON_TYPE_OPTIONS}
              onChange={(value) => onChange(`buttonType${fieldPrefix}`, value)}
            />
          </DesignField>
        )}

        <DesignField label={LABEL_RIGHT_MARGIN} tooltipKey="rightMargin">
          <InputNumber
            name={`right_margin_${device}`}
            value={rightMargin}
            placeholder={PLACEHOLDER_RIGHT_MARGIN}
            min={0}
            onChange={(value) => onChange(`rightMargin${fieldPrefix}`, value ?? '')}
          />
        </DesignField>

        <DesignField label={LABEL_BOTTOM_MARGIN} tooltipKey="bottomMargin">
          <InputNumber
            name={`bottom_margin_${device}`}
            value={bottomMargin}
            placeholder={PLACEHOLDER_BOTTOM_MARGIN}
            min={0}
            onChange={(value) => onChange(`bottomMargin${fieldPrefix}`, value ?? '')}
          />
        </DesignField>
      </div>

      <div className="design-device-card__closed-preview">
        <h5 className="design-device-card__closed-preview-title">{PREVIEW_CLOSED_TITLE}</h5>
        <style>{closedPreviewChromeCss}</style>
        <div className={`design-device-card__closed-preview-frame ${frameModifier}`}>
          <PreviewClosedLauncher
            state={previewState}
            headerIconSrc={headerIconSrc}
            onOpen={noopOpen}
            isMobileView={!isPc}
            layoutMode={LAYOUT_MODE_INLINE}
            hideWhenDisplayHidden={false}
          />
        </div>
      </div>
    </section>
  );
};

DeviceDesignPanel.propTypes = {
  device: PropTypes.oneOf([DEVICE_PC, DEVICE_SP]).isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  widthUnit: PropTypes.oneOf([WIDTH_UNIT_PX, WIDTH_UNIT_PERCENT]).isRequired,
  position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  buttonType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  rightMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  bottomMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
    titleBubble: PropTypes.string,
    positionPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    buttonTypePc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rightMarginPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottomMarginPc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    positionSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    buttonTypeSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rightMarginSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bottomMarginSp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DeviceDesignPanel;
