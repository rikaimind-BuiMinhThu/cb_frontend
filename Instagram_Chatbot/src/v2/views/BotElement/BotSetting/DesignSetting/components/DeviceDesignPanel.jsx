import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber, Select, Space } from 'antd';
import InputNum from '../../ScenarioSetting/scenarioComon/InputNum';
import { AdminInfoTooltip } from '../../../../../components/AdminShell';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

const DISPLAY_TYPE_OPTIONS = [
  { value: 1, label: 'リロード' },
  { value: 2, label: '非表示' },
  { value: 3, label: 'ボタン押下' },
];

const POSITION_OPTIONS = [
  { value: 1, label: '底辺に設置' },
  { value: 2, label: '右辺に設置' },
];

const BUTTON_TYPE_OPTIONS = [
  { value: 1, label: 'ボタンとタイトル' },
  { value: 2, label: 'ボタンのみ' },
];

function DesignField({ label, tooltipKey, fullWidth, children }) {
  return (
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
}

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
  const isPc = device === 'pc';
  const fieldPrefix = isPc ? 'Pc' : 'Sp';
  const rightTitleLabel = isPc ? '右のタイトル' : 'タイトル';
  const sizeMax = isPc ? 1000 : 100;
  const positionValue = Number(position);
  const buttonTypeValue = Number(buttonType);

  return (
    <section className="design-device-card">
      <h4 className="design-device-card__title">{title}</h4>
      <div className="design-device-card__grid">
        {isPc && (
          <DesignField label="表示タイプ" tooltipKey="displayType">
            <Select
              value={Number(displayType)}
              options={DISPLAY_TYPE_OPTIONS}
              onChange={(value) => onChange('displayType', value)}
            />
          </DesignField>
        )}

        <DesignField label="サイズ" tooltipKey="size" fullWidth>
          <Space size={12} wrap className="design-size-row">
            <InputNum
              style={{ width: '100%', minWidth: 120 }}
              name={`width_${device}`}
              min={1}
              max={sizeMax}
              value={width}
              placeholder="幅"
              onChange={(value) => onChange(`width${fieldPrefix}`, value)}
            />
            <span className="design-field__suffix">{widthUnit}</span>
            <InputNum
              style={{ width: '100%', minWidth: 120 }}
              name={`height_${device}`}
              min={1}
              max={sizeMax}
              value={height}
              placeholder="高さ"
              onChange={(value) => onChange(`height${fieldPrefix}`, value)}
            />
            <span className="design-field__suffix">{widthUnit}</span>
          </Space>
        </DesignField>

        <DesignField label="設置場所" tooltipKey="position">
          <Select
            value={positionValue}
            options={POSITION_OPTIONS}
            onChange={(value) => onChange(`position${fieldPrefix}`, value)}
          />
        </DesignField>

        {positionValue === 2 && (
          <DesignField label={rightTitleLabel} tooltipKey="rightTitle">
            <Input
              name={`right_position_${device}_title`}
              placeholder="タイトル"
              value={rightTitle}
              onChange={(e) => onChange(`right${fieldPrefix}Title`, e.target.value)}
            />
          </DesignField>
        )}

        {positionValue === 1 && (
          <DesignField label="ボタン内容" tooltipKey="buttonType">
            <Select
              value={buttonTypeValue}
              options={BUTTON_TYPE_OPTIONS}
              onChange={(value) => onChange(`buttonType${fieldPrefix}`, value)}
            />
          </DesignField>
        )}

        <DesignField label="右マージン" tooltipKey="rightMargin">
          <InputNumber
            name={`right_margin_${device}`}
            value={rightMargin}
            placeholder="右マージン"
            min={0}
            style={{ width: '100%' }}
            onChange={(value) => onChange(`rightMargin${fieldPrefix}`, value ?? '')}
          />
        </DesignField>

        <DesignField label="下マージン" tooltipKey="bottomMargin">
          <InputNumber
            name={`bottom_margin_${device}`}
            value={bottomMargin}
            placeholder="下マージン"
            min={0}
            style={{ width: '100%' }}
            onChange={(value) => onChange(`bottomMargin${fieldPrefix}`, value ?? '')}
          />
        </DesignField>
      </div>
    </section>
  );
};

DeviceDesignPanel.propTypes = {
  device: PropTypes.oneOf(['pc', 'sp']).isRequired,
  title: PropTypes.string.isRequired,
  displayType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  widthUnit: PropTypes.oneOf(['px', '%']).isRequired,
  position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  buttonType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  rightTitle: PropTypes.string.isRequired,
  rightMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  bottomMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DeviceDesignPanel;
