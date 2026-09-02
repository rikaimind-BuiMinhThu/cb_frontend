import React, { useEffect, useState } from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import InputCustom from '../../../scenarioComon/InputCustom';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';
import { buildAutoLogoutConfigFromUrls } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/autoLogoutUtils';

const ScenarioAutoLogoutView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const { autoLogoutConfig, clientCartSystem } = state;
  const { setAutoLogoutConfig, setIsClearLandingPageSession } = actions;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    setAutoLogoutConfig((prev) => ({
      ...prev,
      temp: { ...prev.final },
    }));
  }, [setAutoLogoutConfig]);

  const handleChangeLpUrl = (value) => {
    setErrorMessage('');
    setAutoLogoutConfig((prev) => ({
      ...prev,
      temp: { ...prev.temp, lpUrl: value },
    }));
  };

  const handleChangeSignoutUrl = (value) => {
    setErrorMessage('');
    setAutoLogoutConfig((prev) => ({
      ...prev,
      temp: { ...prev.temp, signoutUrl: value },
    }));
  };

  const handleCancel = () => {
    const { final } = autoLogoutConfig;
    setAutoLogoutConfig((prev) => ({
      ...prev,
      temp: { ...prev.final },
    }));
    setErrorMessage('');

    if (!final?.lpUrl && !final?.signoutUrl && !final?.generatedJs) {
      setIsClearLandingPageSession(false);
    }
    onBack();
  };

  const handleConfirm = () => {
    const { lpUrl, signoutUrl } = autoLogoutConfig.temp;
    const result = buildAutoLogoutConfigFromUrls(clientCartSystem, lpUrl, signoutUrl);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setAutoLogoutConfig((prev) => ({
      ...prev,
      temp: {
        lpUrl: result.lpUrl,
        signoutUrl: result.signoutUrl,
        generatedJs: result.generatedJs,
      },
      final: {
        lpUrl: result.lpUrl,
        signoutUrl: result.signoutUrl,
        generatedJs: result.generatedJs,
      },
    }));
    setIsClearLandingPageSession(true);
    setErrorMessage('');
    onBack();
  };

  return (
    <div>
      <ScenarioFormRow
        label="LP URL"
        tooltip={SCENARIO_MODAL_TOOLTIPS.autoLogoutLpUrl}
      >
        <InputCustom
          value={autoLogoutConfig.temp.lpUrl}
          onChange={handleChangeLpUrl}
          placeholder="https://example.com/lp"
        />
      </ScenarioFormRow>
      <ScenarioFormRow
        label="Signout URL"
        tooltip={SCENARIO_MODAL_TOOLTIPS.autoLogoutSignoutUrl}
      >
        <InputCustom
          value={autoLogoutConfig.temp.signoutUrl}
          onChange={handleChangeSignoutUrl}
          placeholder="https://example.com/shop/customers/sign_out"
        />
      </ScenarioFormRow>
      {errorMessage && (
        <div className="ss-settings-form-error">
          {errorMessage}
        </div>
      )}
      <ScenarioModalFooter
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default ScenarioAutoLogoutView;
