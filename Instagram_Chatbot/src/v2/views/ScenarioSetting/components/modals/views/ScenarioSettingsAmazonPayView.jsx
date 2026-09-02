import React, { useMemo } from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import SelectCustom from '../../../scenarioCommon/SelectCustom';
import InputNum from '../../../scenarioCommon/InputNum';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import ScenarioCodeTextarea from '../shared/ScenarioCodeTextarea';
import {
  AMAZON_PAY_DETECTION_HELP_TEXT,
  SCENARIO_MODAL_TOOLTIPS,
} from '../shared/scenarioModalTooltips';
import {
  AMAZON_PAY_DETECTION_MODE_OPTIONS,
  AMAZON_PAY_DETECTION_MODES,
  AMAZON_PAY_READY_MODE_OPTIONS,
  AMAZON_PAY_READY_MODES,
} from 'v2/variables/amazonPayConstants';
import { validateLpDomain } from 'v2/views/ScenarioSetting/utils/amazonPayConfigUtils';

const ScenarioSettingsAmazonPayView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const {
    allowedLpDomainsInput,
    amazonPayConfig,
    amazonPayDetectionMode,
    amazonPayReadyMode,
    amazonPayDetectionForm,
  } = state;
  const {
    setAllowedLpDomainsInput,
    setAmazonPayConfig,
    setAmazonPayDetectionMode,
    setAmazonPayReadyMode,
    setAmazonPayDetectionForm,
  } = actions;

  const invalidLpDomains = (allowedLpDomainsInput || '')
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => !validateLpDomain(item).valid);

  const updateDetectionForm = (patch) => {
    setAmazonPayDetectionForm((prev) => ({ ...prev, ...patch }));
  };

  const detectionModeHelp = useMemo(() => {
    switch (amazonPayDetectionMode) {
      case AMAZON_PAY_DETECTION_MODES.URL_PARAM:
        return AMAZON_PAY_DETECTION_HELP_TEXT.detectionUrlParams;
      case AMAZON_PAY_DETECTION_MODES.DOM_SELECTOR:
        return AMAZON_PAY_DETECTION_HELP_TEXT.detectionDomSelectors;
      case AMAZON_PAY_DETECTION_MODES.JS:
      default:
        return AMAZON_PAY_DETECTION_HELP_TEXT.detectionJs;
    }
  }, [amazonPayDetectionMode]);

  const renderDetectionInput = () => {
    if (amazonPayDetectionMode === AMAZON_PAY_DETECTION_MODES.URL_PARAM) {
      return (
        <ScenarioFormRow
          label="判定用URLパラメータ"
          tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayDetectionUrlParams}
          alignTop
        >
          <textarea
            className="ss-settings-textarea ss-settings-textarea--short"
            placeholder="amazonCheckoutSessionId"
            value={amazonPayDetectionForm?.urlParamsText ?? ''}
            onChange={(e) => updateDetectionForm({ urlParamsText: e.target.value })}
          />
          <p className="ss-settings-help-text">{detectionModeHelp}</p>
        </ScenarioFormRow>
      );
    }

    if (amazonPayDetectionMode === AMAZON_PAY_DETECTION_MODES.DOM_SELECTOR) {
      return (
        <ScenarioFormRow
          label="判定用DOMセレクター"
          tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayDetectionDomSelectors}
          alignTop
        >
          <textarea
            className="ss-settings-textarea ss-settings-textarea--short"
            placeholder="#amazon_payment_method"
            value={amazonPayDetectionForm?.domSelectorsText ?? ''}
            onChange={(e) => updateDetectionForm({ domSelectorsText: e.target.value })}
          />
          <p className="ss-settings-help-text">{detectionModeHelp}</p>
        </ScenarioFormRow>
      );
    }

    return (
      <ScenarioFormRow
        label="判定用JSコード"
        tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayDetectionJsCode}
        alignTop
      >
        <ScenarioCodeTextarea
          placeholder="return !!document.querySelector('#amazon_payment_method');"
          value={amazonPayDetectionForm?.jsCode ?? ''}
          onChange={(value) => updateDetectionForm({ jsCode: value })}
          language="javascript"
        />
        <p className="ss-settings-help-text">{detectionModeHelp}</p>
      </ScenarioFormRow>
    );
  };

  return (
    <div>
      <ScenarioFormRow
        label="許可LPドメイン"
        tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayAllowedLpDomains}
        alignTop
      >
        <textarea
          className="ss-settings-textarea ss-settings-textarea--short"
          placeholder={'example.jp\nshop.example.jp'}
          value={allowedLpDomainsInput ?? ''}
          onChange={(e) => setAllowedLpDomainsInput(e.target.value)}
        />
        {invalidLpDomains.length > 0 && (
          <div className="ss-settings-field-error">
            無効なドメイン: {invalidLpDomains.join(', ')}
          </div>
        )}
      </ScenarioFormRow>

      <ScenarioFormRow
        label="Amazon Pay利用の判定"
        tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayUsageDetection}
        alignTop
      >
        <SelectCustom
          value={amazonPayDetectionMode}
          onChange={(value) => setAmazonPayDetectionMode(value)}
          data={AMAZON_PAY_DETECTION_MODE_OPTIONS}
          allowClear={false}
        />
        <p className="ss-settings-help-text">{AMAZON_PAY_DETECTION_HELP_TEXT.usageSection}</p>
      </ScenarioFormRow>

      {renderDetectionInput()}

      <ScenarioFormRow
        label="オートフィル完了の判定"
        tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayAutofillReadyDetection}
        alignTop
      >
        <SelectCustom
          value={amazonPayReadyMode}
          onChange={(value) => setAmazonPayReadyMode(value)}
          data={AMAZON_PAY_READY_MODE_OPTIONS}
          allowClear={false}
        />
        <p className="ss-settings-help-text">{AMAZON_PAY_DETECTION_HELP_TEXT.autofillReadySection}</p>
      </ScenarioFormRow>

      {amazonPayReadyMode === AMAZON_PAY_READY_MODES.DOM_SELECTOR && (
        <ScenarioFormRow
          label="完了判定用DOMセレクター"
          tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayReadyDomSelectors}
          alignTop
        >
          <textarea
            className="ss-settings-textarea ss-settings-textarea--short"
            placeholder="input#order_shipping_address_attributes_name1"
            value={amazonPayDetectionForm?.readySelectorsText ?? ''}
            onChange={(e) => updateDetectionForm({ readySelectorsText: e.target.value })}
          />
          <p className="ss-settings-help-text">{AMAZON_PAY_DETECTION_HELP_TEXT.readyDomSelectors}</p>
        </ScenarioFormRow>
      )}

      <ScenarioFormRow
        label="ポーリング間隔（ms）"
        tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayPollInterval}
      >
        <InputNum
          value={amazonPayConfig?.poll_interval_ms ?? ''}
          onChange={(value) => setAmazonPayConfig((prev) => ({ ...prev, poll_interval_ms: value }))}
        />
      </ScenarioFormRow>
      <ScenarioFormRow
        label="最大ポーリング回数"
        tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayMaxPollCount}
      >
        <InputNum
          value={amazonPayConfig?.max_count ?? ''}
          onChange={(value) => setAmazonPayConfig((prev) => ({ ...prev, max_count: value }))}
        />
      </ScenarioFormRow>
      <ScenarioModalFooter
        onClose={onBack}
        showConfirm={false}
      />
    </div>
  );
};

export default ScenarioSettingsAmazonPayView;
