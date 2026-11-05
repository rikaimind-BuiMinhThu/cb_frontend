import React from 'react';
import {
  DEFAULT_PARAM_SECURITY,
  PARAM_SECURITY_MODES,
} from 'v2/variables/paramSecurityConstants';
import { PARAM_SECURITY_LABELS } from '../../../constants/paramSecurityLabels';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import InputCustom from '../../../scenarioCommon/InputCustom';
import { algorithmForMode } from '../../../utils/paramSecurityUtils';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';

const generateRandomSecret = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const ScenarioSettingsParamSecurityView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const paramSecurity = state.paramSecurity || DEFAULT_PARAM_SECURITY;
  const { setParamSecurity } = actions;
  const mode = paramSecurity.mode === PARAM_SECURITY_MODES.HASH
    ? PARAM_SECURITY_MODES.HASH
    : PARAM_SECURITY_MODES.ENCRYPT;
  const algorithm = algorithmForMode(mode) || '';

  const patchParamSecurity = (patch) => {
    const nextMode = patch.mode || mode;
    setParamSecurity({
      ...DEFAULT_PARAM_SECURITY,
      ...paramSecurity,
      ...patch,
      mode: nextMode,
      algorithm: algorithmForMode(nextMode),
      params: [],
      key: nextMode === PARAM_SECURITY_MODES.ENCRYPT
        ? (patch.key !== undefined ? patch.key : paramSecurity.key)
        : null,
      salt: nextMode === PARAM_SECURITY_MODES.HASH
        ? (patch.salt !== undefined ? patch.salt : paramSecurity.salt)
        : null,
    });
  };

  return (
    <div className="ss-param-security-view">
      <ScenarioFormRow
        label={PARAM_SECURITY_LABELS.mode}
        tooltip={SCENARIO_MODAL_TOOLTIPS.paramSecurityMode}
        required
      >
        <select
          className="ss-input-value"
          value={mode}
          onChange={(event) => patchParamSecurity({ mode: event.target.value })}
          aria-label={PARAM_SECURITY_LABELS.mode}
        >
          <option value={PARAM_SECURITY_MODES.HASH}>{PARAM_SECURITY_LABELS.modeHash}</option>
          <option value={PARAM_SECURITY_MODES.ENCRYPT}>{PARAM_SECURITY_LABELS.modeEncrypt}</option>
        </select>
      </ScenarioFormRow>

      <ScenarioFormRow
        label={PARAM_SECURITY_LABELS.algorithm}
        tooltip={SCENARIO_MODAL_TOOLTIPS.paramSecurityAlgorithm}
      >
        <InputCustom value={algorithm} disabled onChange={() => {}} />
      </ScenarioFormRow>

      {mode === PARAM_SECURITY_MODES.ENCRYPT && (
        <ScenarioFormRow
          label={PARAM_SECURITY_LABELS.key}
          tooltip={SCENARIO_MODAL_TOOLTIPS.paramSecurityKey}
          required
        >
          <div className="ss-param-security-view__field-row">
            <InputCustom
              type="password"
              value={paramSecurity.key || ''}
              onChange={(value) => patchParamSecurity({ key: value })}
            />
            <button
              type="button"
              className="ss-settings-modal-action-link"
              onClick={() => patchParamSecurity({ key: generateRandomSecret() })}
            >
              {PARAM_SECURITY_LABELS.generateRandom}
            </button>
          </div>
        </ScenarioFormRow>
      )}

      {mode === PARAM_SECURITY_MODES.HASH && (
        <ScenarioFormRow
          label={PARAM_SECURITY_LABELS.salt}
          tooltip={SCENARIO_MODAL_TOOLTIPS.paramSecuritySalt}
        >
          <div className="ss-param-security-view__field-row">
            <InputCustom
              type="password"
              value={paramSecurity.salt || ''}
              onChange={(value) => patchParamSecurity({ salt: value })}
            />
            <button
              type="button"
              className="ss-settings-modal-action-link"
              onClick={() => patchParamSecurity({ salt: generateRandomSecret() })}
            >
              {PARAM_SECURITY_LABELS.generateRandom}
            </button>
          </div>
        </ScenarioFormRow>
      )}

      <ScenarioModalFooter
        onClose={onBack}
        showConfirm={false}
      />
    </div>
  );
};

export default ScenarioSettingsParamSecurityView;
