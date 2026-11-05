import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import InputCustom from '../../../scenarioComon/InputCustom';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';
import {
  DEFAULT_PARAM_SECURITY,
  PARAM_SECURITY_MODES,
  algorithmForMode,
} from '../../../utils/paramSecurityUtils';

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
        label="保護方式"
        tooltip={SCENARIO_MODAL_TOOLTIPS.paramSecurityMode}
      >
        <select
          className="ss-input-value"
          value={mode}
          onChange={(event) => patchParamSecurity({ mode: event.target.value })}
          aria-label="保護方式"
        >
          <option value={PARAM_SECURITY_MODES.HASH}>ハッシュ</option>
          <option value={PARAM_SECURITY_MODES.ENCRYPT}>暗号化</option>
        </select>
      </ScenarioFormRow>

      <ScenarioFormRow
        label="アルゴリズム"
        tooltip={SCENARIO_MODAL_TOOLTIPS.paramSecurityAlgorithm}
      >
        <InputCustom value={algorithm} disabled onChange={() => {}} />
      </ScenarioFormRow>

      {mode === PARAM_SECURITY_MODES.ENCRYPT && (
        <ScenarioFormRow
          label="キー"
          tooltip={SCENARIO_MODAL_TOOLTIPS.paramSecurityKey}
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
              ランダム生成
            </button>
          </div>
        </ScenarioFormRow>
      )}

      {mode === PARAM_SECURITY_MODES.HASH && (
        <ScenarioFormRow
          label="ソルト"
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
              ランダム生成
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
