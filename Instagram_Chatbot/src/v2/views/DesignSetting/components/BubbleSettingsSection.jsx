import React from 'react';
import PropTypes from 'prop-types';
import { Input, Radio } from 'antd';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import { getDesignSettingTooltip } from '../constants/designSettingTooltips';
import {
  BUBBLE_SECTION_TITLE,
  LABEL_BUBBLE_TITLE,
  LABEL_POPUP_CLOSE,
  PLACEHOLDER_BUBBLE_TITLE,
  RADIO_DISABLED,
  RADIO_ENABLED,
} from '../constants/designChatbotConstants';

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

const BubbleSettingsSection = ({ titleBubble, popupCloseBot, onChange }) => (
  <section className="design-bubble-card">
    <h4 className="design-device-card__title">{BUBBLE_SECTION_TITLE}</h4>
    <div className="design-bubble-card__grid">
      <DesignField label={LABEL_BUBBLE_TITLE} tooltipKey="titleBubble">
        <Input
          name="title_bubble"
          value={titleBubble}
          placeholder={PLACEHOLDER_BUBBLE_TITLE}
          onChange={(e) => onChange('titleBubble', e.target.value)}
        />
      </DesignField>
      <DesignField label={LABEL_POPUP_CLOSE} tooltipKey="popupCloseBot">
        <Radio.Group
          value={popupCloseBot}
          onChange={(e) => onChange('popupCloseBot', e.target.value)}
        >
          <Radio value={false}>{RADIO_DISABLED}</Radio>
          <Radio value={true}>{RADIO_ENABLED}</Radio>
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
