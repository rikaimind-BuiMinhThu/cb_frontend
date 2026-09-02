import React from 'react';
import PropTypes from 'prop-types';
import { Input, Radio } from 'antd';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';

function DesignField({ label, tooltipKey, children }) {
  return (
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
}

DesignField.propTypes = {
  label: PropTypes.string.isRequired,
  tooltipKey: PropTypes.string,
  children: PropTypes.node.isRequired,
};

DesignField.defaultProps = {
  tooltipKey: '',
};

const BubbleSettingsSection = ({ titleBubble, popupCloseBot, onChange }) => (
  <section className="design-bubble-card">
    <h4 className="design-device-card__title">バブル設定</h4>
    <div className="design-bubble-card__grid">
      <DesignField label="タイトル" tooltipKey="titleBubble">
        <Input
          name="title_bubble"
          value={titleBubble}
          placeholder="簡単90秒で注文完了"
          onChange={(e) => onChange('titleBubble', e.target.value)}
        />
      </DesignField>
      <DesignField label="離脱防止" tooltipKey="popupCloseBot">
        <Radio.Group
          value={popupCloseBot}
          onChange={(e) => onChange('popupCloseBot', e.target.value)}
        >
          <Radio value={false}>無効</Radio>
          <Radio value={true}>有効</Radio>
        </Radio.Group>
      </DesignField>
    </div>
  </section>
);

BubbleSettingsSection.propTypes = {
  titleBubble: PropTypes.string.isRequired,
  popupCloseBot: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BubbleSettingsSection;
