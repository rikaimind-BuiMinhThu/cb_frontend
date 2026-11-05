import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import InputCustom from '../../../scenarioComon/InputCustom';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import {
  DEFAULT_PARAM_SECURITY,
  PARAM_SECURITY_MODES,
  PARAM_SECURITY_PARAM_OPTIONS,
  algorithmForMode,
} from '../../../utils/paramSecurityUtils';

const ScenarioSettingsParamSecurityView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const paramSecurity = state.paramSecurity || DEFAULT_PARAM_SECURITY;
  const { setParamSecurity } = actions;
  const mode = paramSecurity.mode || PARAM_SECURITY_MODES.NONE;
  const selectedParams = Array.isArray(paramSecurity.params) ? paramSecurity.params : [];
  const algorithm = algorithmForMode(mode) || '';

  const patchParamSecurity = (patch) => {
    const nextMode = patch.mode || mode;
    setParamSecurity({
      ...DEFAULT_PARAM_SECURITY,
      ...paramSecurity,
      ...patch,
      mode: nextMode,
      algorithm: algorithmForMode(nextMode),
    });
  };

  const toggleParam = (value) => {
    const next = selectedParams.includes(value)
      ? selectedParams.filter((item) => item !== value)
      : [...selectedParams, value];
    patchParamSecurity({ params: next });
  };

  return (
    <div className="ss-param-security-view">
      <ScenarioFormRow label="対象パラメータ" alignTop required>
        <div className="ss-param-security-view__params">
          {PARAM_SECURITY_PARAM_OPTIONS.map((option) => (
            <label key={option.value} className="ss-param-security-view__param">
              <input
                type="checkbox"
                checked={selectedParams.includes(option.value)}
                onChange={() => toggleParam(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </ScenarioFormRow>

      <ScenarioFormRow label="アルゴリズム">
        <InputCustom value={algorithm} disabled onChange={() => {}} />
      </ScenarioFormRow>

      {mode === PARAM_SECURITY_MODES.ENCRYPT && (
        <ScenarioFormRow label="キー" required>
          <InputCustom
            type="password"
            value={paramSecurity.key || ''}
            onChange={(value) => patchParamSecurity({ key: value })}
          />
        </ScenarioFormRow>
      )}

      {mode === PARAM_SECURITY_MODES.HASH && (
        <>
          <ScenarioFormRow label="ソルト">
            <InputCustom
              value={paramSecurity.salt || ''}
              onChange={(value) => patchParamSecurity({ salt: value })}
            />
            <p className="ss-settings-help-text">任意。bcrypt前に付与するペッパーです。空欄可。</p>
          </ScenarioFormRow>
          <p className="ss-settings-help-text">復号できません</p>
        </>
      )}

      <ScenarioModalFooter
        onClose={onBack}
        showConfirm={false}
      />
    </div>
  );
};

export default ScenarioSettingsParamSecurityView;
