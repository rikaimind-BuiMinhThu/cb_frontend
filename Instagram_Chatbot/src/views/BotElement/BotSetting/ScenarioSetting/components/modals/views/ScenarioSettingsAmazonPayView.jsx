import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import SelectCustom from '../../../scenarioComon/SelectCustom';
import InputNum from '../../../scenarioComon/InputNum';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';
import { LP_INTEGRATION_MODES } from '../../../../../../../variables/amazonPayConstants';
import { validateLpDomain } from '../../../utils/amazonPayConfigUtils';

const ScenarioSettingsAmazonPayView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const {
    allowedLpDomainsInput,
    lpIntegrationMode,
    amazonPayConfig,
  } = state;
  const {
    setAllowedLpDomainsInput,
    setLpIntegrationMode,
    setAmazonPayConfig,
  } = actions;

  const invalidLpDomains = (allowedLpDomainsInput || '')
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => !validateLpDomain(item).valid);

  return (
    <div>
      <ScenarioFormRow
        label="LP連携モード"
        tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayLpIntegrationMode}
      >
        <SelectCustom
          value={lpIntegrationMode}
          onChange={(value) => setLpIntegrationMode(value)}
          data={[
            { key: LP_INTEGRATION_MODES.GENERIC, value: 'Generic（設定ベース）' },
            { key: LP_INTEGRATION_MODES.LEGACY, value: 'Legacy（既存ドメイン判定）' },
            { key: LP_INTEGRATION_MODES.AUTO, value: 'Auto（Generic優先、なければLegacy）' },
          ]}
        />
      </ScenarioFormRow>
      <ScenarioFormRow
        label="許可LPドメイン"
        tooltip={SCENARIO_MODAL_TOOLTIPS.amazonPayAllowedLpDomains}
        alignTop
      >
        <textarea
          style={{ width: '100%', minHeight: '90px', padding: '10px', fontSize: '14px' }}
          placeholder={'example.jp\nshop.example.jp'}
          value={allowedLpDomainsInput ?? ''}
          onChange={(e) => setAllowedLpDomainsInput(e.target.value)}
        />
        {invalidLpDomains.length > 0 && (
          <div style={{ color: 'rgb(185, 74, 72)', fontSize: '13px', marginTop: '6px' }}>
            無効なドメイン: {invalidLpDomains.join(', ')}
          </div>
        )}
      </ScenarioFormRow>
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
