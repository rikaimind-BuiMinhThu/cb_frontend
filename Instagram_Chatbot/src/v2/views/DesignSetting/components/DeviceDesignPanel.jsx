import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber, Select, Space } from 'antd';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';
import {
  BUTTON_TYPE_OPTIONS,
  DEVICE_PC,
  DEVICE_SP,
  DISPLAY_TYPE_OPTIONS,
  LABEL_BOTTOM_MARGIN,
  LABEL_BUTTON_CONTENT,
  LABEL_DISPLAY_TYPE,
  LABEL_POSITION,
  LABEL_RIGHT_MARGIN,
  LABEL_RIGHT_TITLE_PC,
  LABEL_RIGHT_TITLE_SP,
  LABEL_SIZE,
  PLACEHOLDER_BOTTOM_MARGIN,
  PLACEHOLDER_HEIGHT,
  PLACEHOLDER_RIGHT_MARGIN,
  PLACEHOLDER_TITLE_FIELD,
  PLACEHOLDER_WIDTH,
  WIDTH_UNIT_PERCENT,
  WIDTH_UNIT_PX,
  POSITION_BOTTOM,
  POSITION_OPTIONS,
  POSITION_RIGHT,
} from '../constants/designChatbotConstants';

const DesignField = ({ label, tooltipKey, fullWidth, children }) => (
  <div className={`design-field${fullWidth ? ' design-field--full' : ''}`}>
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
  fullWidth: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

DesignField.defaultProps = {
  tooltipKey: '',
  fullWidth: false,
};

const DeviceDesignPanel = ({
  device,
  title,
  displayType,
  width,
  height,
  widthUnit,
  position,
  buttonType,
  rightTitle,
  rightMargin,
  bottomMargin,
  onChange,
}) => {
  const isPc = device === DEVICE_PC;
  const fieldPrefix = isPc ? 'Pc' : 'Sp';
  const rightTitleLabel = isPc ? LABEL_RIGHT_TITLE_PC : LABEL_RIGHT_TITLE_SP;
  const sizeMax = isPc ? 1000 : 100;
  const positionValue = Number(position);
  const buttonTypeValue = Number(buttonType);

  return (
    <section className="design-device-card">
      <h4 className="design-device-card__title">{title}</h4>
      <div className="design-device-card__grid">
        {isPc && (
          <DesignField label={LABEL_DISPLAY_TYPE} tooltipKey="displayType">
            <Select
              value={Number(displayType)}
              options={DISPLAY_TYPE_OPTIONS}
              onChange={(value) => onChange('displayType', value)}
            />
          </DesignField>
        )}

        <DesignField label={LABEL_SIZE} tooltipKey="size" fullWidth>
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
          <DesignField label={rightTitleLabel} tooltipKey="rightTitle">
            <Input
              name={`right_position_${device}_title`}
              placeholder={PLACEHOLDER_TITLE_FIELD}
              value={rightTitle}
              onChange={(e) => onChange(`right${fieldPrefix}Title`, e.target.value)}
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
    </section>
  );
};

DeviceDesignPanel.propTypes = {
  device: PropTypes.oneOf([DEVICE_PC, DEVICE_SP]).isRequired,
  title: PropTypes.string.isRequired,
  displayType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  widthUnit: PropTypes.oneOf([WIDTH_UNIT_PX, WIDTH_UNIT_PERCENT]).isRequired,
  position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  buttonType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  rightTitle: PropTypes.string.isRequired,
  rightMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  bottomMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DeviceDesignPanel;
