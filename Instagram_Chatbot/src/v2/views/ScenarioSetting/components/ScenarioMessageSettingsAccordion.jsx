import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { hasActiveSpecialDisplayConditions } from 'v2/views/ScenarioSetting/utils/amazonPayConfigUtils';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import { SCENARIO_MODAL_TOOLTIPS } from './modals/shared/scenarioModalTooltips';
import AudienceConditionsContent from './AudienceConditionsContent';
import RegisterButtonSettingsContent from './RegisterButtonSettingsContent';

const PANEL = {
  AUDIENCE: 'audience',
  OTHER: 'other',
};

const clearAccordionPanelLayout = (role) => {
  if (role === 'user') {
    const main = document.querySelector('.ss-user-setting__main');
    const bottom = document.querySelector('.ss-user-setting__bottom');
    if (main) main.style.height = '';
    if (bottom) bottom.style.maxHeight = '';
  } else {
    const container = document.querySelector('.ss-bot-setting-condition-container');
    if (container) container.style.height = '';
  }
};

const renderTriggerHelp = (tooltipKey) => (
  <span
    className="ss-message-settings-accordion__trigger-help"
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => e.stopPropagation()}
    role="presentation"
  >
    <AdminInfoTooltip text={SCENARIO_MODAL_TOOLTIPS[tooltipKey]} />
  </span>
);

const ScenarioMessageSettingsAccordion = ({
  variant = 'user',
  selectedMessage,
  dataMessages,
  setDataMessages,
  indexMessageSelect,
}) => {
  const {
    isUseFukushashiki,
    resetConditionPanelLayout,
    onChangeAmazonPayDisplayMode,
  } = useScenarioPanelDestructuring();

  const [activePanel, setActivePanel] = useState(null);

  const role = variant === 'bot' ? 'bot' : 'user';
  const showOtherSettings = variant !== 'bot';
  const containerClass = variant === 'bot'
    ? 'ss-bot-setting-condition-container ss-message-settings-accordion'
    : 'ss-user-setting-condition-container ss-message-settings-accordion';

  useEffect(() => {
    const hasConditions = (selectedMessage?.conditions?.length ?? 0) > 0;
    const hasSpecial = hasActiveSpecialDisplayConditions(selectedMessage, isUseFukushashiki);

    setActivePanel(hasConditions || hasSpecial ? PANEL.AUDIENCE : null);
    resetConditionPanelLayout(role);
    clearAccordionPanelLayout(role);
  }, [indexMessageSelect, selectedMessage, isUseFukushashiki, resetConditionPanelLayout, role]);

  const hasActiveSpecialDisplay = hasActiveSpecialDisplayConditions(selectedMessage, isUseFukushashiki);
  const hasAudienceConditions = (selectedMessage?.conditions?.length ?? 0) > 0;
  const hasAudienceConfigured = hasActiveSpecialDisplay || hasAudienceConditions;

  const otherSettingsTags = useMemo(() => {
    if (!selectedMessage) return [];
    const tags = [];
    if (selectedMessage.not_use_button) {
      tags.push('登録ボタン非表示');
    }
    if (selectedMessage.buttonName) {
      tags.push('ボタン名設定');
    }
    if (selectedMessage.button_jscode || selectedMessage.jscode) {
      tags.push('JavaScript');
    }
    return tags;
  }, [selectedMessage]);

  const selectPanel = (panel) => {
    const next = activePanel === panel ? null : panel;
    setActivePanel(next);
    resetConditionPanelLayout(role);
    clearAccordionPanelLayout(role);
  };

  const renderTriggerBadge = (label) => (
    <span className="ss-conditions-more-settings__summary-tag">{label}</span>
  );

  if (!selectedMessage) return null;

  return (
    <div className={containerClass}>
      <div className="ss-message-settings-accordion__triggers">
        <div className="ss-message-settings-accordion__trigger-group">
          <Button
            type="button"
            className={`ss-message-settings-accordion__trigger${
              activePanel === PANEL.AUDIENCE ? ' ss-message-settings-accordion__trigger--active' : ''
            }${hasAudienceConfigured ? ' ss-message-settings-accordion__trigger--configured' : ''}`}
            onClick={() => selectPanel(PANEL.AUDIENCE)}
          >
            <span className="ss-message-settings-accordion__trigger-label">
              表示対象者の条件設定
              {renderTriggerHelp('audienceConditionsSettings')}
            </span>
          </Button>
          {activePanel !== PANEL.AUDIENCE && (hasActiveSpecialDisplay || hasAudienceConditions) && (
            <div className="ss-conditions-more-settings__summary">
              {hasActiveSpecialDisplay && (
                <span className="ss-message-settings-accordion__trigger-badge">（設定済み）</span>
              )}
              {hasAudienceConditions && renderTriggerBadge('表示条件')}
            </div>
          )}
        </div>

        {showOtherSettings && (
          <div className="ss-message-settings-accordion__trigger-group">
            <Button
              type="button"
              className={`ss-message-settings-accordion__trigger${
                activePanel === PANEL.OTHER ? ' ss-message-settings-accordion__trigger--active' : ''
              }`}
              onClick={() => selectPanel(PANEL.OTHER)}
            >
              <span className="ss-message-settings-accordion__trigger-label">
                その他の設定
                {renderTriggerHelp('otherSettings')}
              </span>
            </Button>
            {otherSettingsTags.length > 0 && activePanel !== PANEL.OTHER && (
              <div className="ss-conditions-more-settings__summary">
                {otherSettingsTags.map((label) => renderTriggerBadge(label))}
              </div>
            )}
          </div>
        )}
      </div>

      {activePanel === PANEL.AUDIENCE && (
        <div className="ss-message-settings-accordion__content">
          <AudienceConditionsContent
            variant={variant}
            selectedMessage={selectedMessage}
            dataMessages={dataMessages}
            setDataMessages={setDataMessages}
            isUseFukushashiki={isUseFukushashiki}
            onChangeAmazonPayDisplayMode={onChangeAmazonPayDisplayMode}
          />
        </div>
      )}

      {activePanel === PANEL.OTHER && showOtherSettings && (
        <div className="ss-message-settings-accordion__content">
          <RegisterButtonSettingsContent
            selectedMessage={selectedMessage}
            dataMessages={dataMessages}
            setDataMessages={setDataMessages}
          />
        </div>
      )}
    </div>
  );
};

ScenarioMessageSettingsAccordion.propTypes = {
  variant: PropTypes.oneOf(['user', 'bot', 'combine']),
  selectedMessage: PropTypes.object,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  indexMessageSelect: PropTypes.number.isRequired,
};

export default ScenarioMessageSettingsAccordion;
