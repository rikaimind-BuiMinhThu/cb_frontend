import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import InputCustom from '../scenarioCommon/InputCustom';
import ScenarioModalCheckbox from './modals/shared/ScenarioModalCheckbox';
import ScenarioFormRow from './modals/shared/ScenarioFormRow';
import ScenarioCodeTextarea from './modals/shared/ScenarioCodeTextarea';
import {
  SCENARIO_MODAL_TOOLTIPS,
  REGISTER_BUTTON_LABELS,
} from './modals/shared/scenarioModalTooltips';
import {
  getDefaultStepTagEvent,
  getDefaultTagLabelForMessage,
  shouldShowMessageTagBlock,
} from '../utils/tagFiringUtils';
import { applyAmazonPayUsageToMessage } from '../utils/amazonPayConfigUtils';

const labelWithTooltip = (text, tooltipKey) => (
  <>
    {text}
    <AdminInfoTooltip text={SCENARIO_MODAL_TOOLTIPS[tooltipKey]} />
  </>
);

const collectScrollSnapshots = (settingsEl) => {
  if (!settingsEl) return [];

  const snapshots = [];
  const userSetting = settingsEl.closest('.ss-user-setting, .ss-layout-user-setting, .ss-combine-setting');
  const bottom = settingsEl.closest('.ss-user-setting__bottom, .ss-combine-setting__bottom');
  const main = userSetting?.querySelector('.ss-user-setting__main, .ss-combine-setting__main');
  const detailBody = settingsEl.closest('.ss-layout-detail-body');

  [bottom, main, detailBody].forEach((node) => {
    if (!node) return;
    snapshots.push({ node, scrollTop: node.scrollTop });
  });

  return snapshots;
};

const restoreScrollSnapshots = (snapshots) => {
  snapshots.forEach(({ node, scrollTop }) => {
    if (node) node.scrollTop = scrollTop;
  });
};

const RegisterButtonSettingsContent = ({
  selectedMessage,
  dataMessages,
  setDataMessages,
  isUseFukushashiki = false,
  isUseAmazonPay = false,
  tagFiringEnabled = false,
}) => {
  const [alignBeginningStop, setAlignBeginningStop] = useState(false);
  const settingsRef = useRef(null);
  const pendingScrollSnapshotsRef = useRef(null);
  const showAmazonPayMessageOptions = isUseFukushashiki && isUseAmazonPay;
  const showMessageTagBlock = tagFiringEnabled && shouldShowMessageTagBlock(selectedMessage);

  const updateMessage = (updates) => {
    setDataMessages(dataMessages.map((msg) => (
      msg.id === selectedMessage.id ? { ...msg, ...updates } : msg
    )));
  };

  const updateMessagePreserveScroll = (updates) => {
    pendingScrollSnapshotsRef.current = collectScrollSnapshots(settingsRef.current);
    updateMessage(updates);
  };

  useLayoutEffect(() => {
    const snapshots = pendingScrollSnapshotsRef.current;
    if (!snapshots) return;
    pendingScrollSnapshotsRef.current = null;
    restoreScrollSnapshots(snapshots);
    requestAnimationFrame(() => {
      restoreScrollSnapshots(snapshots);
    });
  });

  const showCodeEditor = !!selectedMessage.button_jscode;

  return (
    <div
      ref={settingsRef}
      className="ss-user-register-button-settings"
    >
      <div className="ss-user-register-button-settings__main">
        <ScenarioModalCheckbox
          checked={alignBeginningStop}
          onChange={setAlignBeginningStop}
          label={labelWithTooltip(
            REGISTER_BUTTON_LABELS.alignBeginningStop,
            'alignBeginningStop',
          )}
        />
        <ScenarioModalCheckbox
          checked={!!selectedMessage.not_use_button}
          onChange={(checked) => updateMessage({ not_use_button: checked })}
          label={labelWithTooltip(
            REGISTER_BUTTON_LABELS.notUseButton,
            'notUseButton',
          )}
        />
        {!selectedMessage.not_use_button && (
          <ScenarioFormRow
            label={REGISTER_BUTTON_LABELS.registerButtonName}
            tooltip={SCENARIO_MODAL_TOOLTIPS.registerButtonName}
          >
            <InputCustom
              placeholder="例：次へ、登録する"
              value={selectedMessage.buttonName}
              maxLength={30}
              onChange={(value) => updateMessage({ buttonName: value })}
            />
          </ScenarioFormRow>
        )}
        <ScenarioModalCheckbox
          checked={showCodeEditor}
          onChange={(checked) => updateMessagePreserveScroll({ button_jscode: checked })}
          label={labelWithTooltip(
            REGISTER_BUTTON_LABELS.useButtonJavascript,
            'useButtonJavascript',
          )}
        />
        {showAmazonPayMessageOptions && (
          <ScenarioModalCheckbox
            checked={!!selectedMessage.is_used_when_amazon_pay}
            onChange={(checked) => updateMessage(applyAmazonPayUsageToMessage(selectedMessage, checked))}
            label={labelWithTooltip(
              REGISTER_BUTTON_LABELS.useForAmazonPay,
              'useForAmazonPay',
            )}
          />
        )}
        {showMessageTagBlock && (
          <>
            <ScenarioModalCheckbox
              checked={!!selectedMessage.tag_enabled}
              onChange={(checked) => {
                if (!checked) {
                  updateMessage({ tag_enabled: false });
                  return;
                }
                updateMessage({
                  tag_enabled: true,
                  tag_event: selectedMessage.tag_event || getDefaultStepTagEvent(dataMessages, selectedMessage),
                  tag_label: selectedMessage.tag_label || getDefaultTagLabelForMessage(dataMessages, selectedMessage),
                });
              }}
              label={labelWithTooltip(
                REGISTER_BUTTON_LABELS.fireTag,
                'fireTag',
              )}
            />
            {!!selectedMessage.tag_enabled && (
              <>
                <ScenarioFormRow
                  label={REGISTER_BUTTON_LABELS.tagEvent}
                  tooltip={SCENARIO_MODAL_TOOLTIPS.fireTag}
                >
                  <InputCustom
                    value={selectedMessage.tag_event || ''}
                    onChange={(value) => updateMessage({ tag_event: value })}
                  />
                </ScenarioFormRow>
                <ScenarioFormRow
                  label={REGISTER_BUTTON_LABELS.tagLabel}
                  tooltip={SCENARIO_MODAL_TOOLTIPS.fireTag}
                >
                  <InputCustom
                    value={selectedMessage.tag_label || ''}
                    onChange={(value) => updateMessage({ tag_label: value })}
                  />
                </ScenarioFormRow>
              </>
            )}
          </>
        )}
      </div>
      {showCodeEditor && (
        <div className="ss-user-register-button-settings__code-flyout">
          <ScenarioFormRow
            label={REGISTER_BUTTON_LABELS.registerButtonJscode}
            tooltip={SCENARIO_MODAL_TOOLTIPS.registerButtonJscode}
            alignTop
          >
            <ScenarioCodeTextarea
              id="ss-register-button-jscode"
              value={selectedMessage.jscode || ''}
              onChange={(value) => updateMessage({ jscode: value })}
              placeholder="JavaScriptコードを入力"
              language="javascript"
              height={120}
            />
          </ScenarioFormRow>
        </div>
      )}
    </div>
  );
};

RegisterButtonSettingsContent.propTypes = {
  selectedMessage: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  isUseFukushashiki: PropTypes.bool,
  isUseAmazonPay: PropTypes.bool,
  tagFiringEnabled: PropTypes.bool,
};

export default RegisterButtonSettingsContent;
