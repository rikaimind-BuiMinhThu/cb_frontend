import React from 'react';
import {
  DEFAULT_PARAM_SECURITY,
  PARAM_SECURITY_MODES,
} from 'v2/variables/paramSecurityConstants';
import {
  PARAM_SECURITY_LABELS,
  PARAM_SECURITY_PARAM_OPTIONS,
} from '../../../constants/paramSecurityLabels';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import InputCustom from '../../../scenarioCommon/InputCustom';
import { algorithmForMode } from '../../../utils/paramSecurityUtils';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';

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
      <ScenarioFormRow label={PARAM_SECURITY_LABELS.params} alignTop required>
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

      <ScenarioFormRow label={PARAM_SECURITY_LABELS.algorithm}>
        <InputCustom value={algorithm} disabled onChange={() => {}} />
      </ScenarioFormRow>

      {mode === PARAM_SECURITY_MODES.ENCRYPT && (
        <ScenarioFormRow label={PARAM_SECURITY_LABELS.key} required>
          <InputCustom
            type="password"
            value={paramSecurity.key || ''}
            onChange={(value) => patchParamSecurity({ key: value })}
          />
        </ScenarioFormRow>
      )}

      {mode === PARAM_SECURITY_MODES.HASH && (
        <>
          <ScenarioFormRow label={PARAM_SECURITY_LABELS.salt}>
            <InputCustom
              value={paramSecurity.salt || ''}
              onChange={(value) => patchParamSecurity({ salt: value })}
            />
            <p className="ss-settings-help-text">{PARAM_SECURITY_LABELS.saltHelp}</p>
          </ScenarioFormRow>
          <p className="ss-settings-help-text">{PARAM_SECURITY_LABELS.cannotDecode}</p>
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
