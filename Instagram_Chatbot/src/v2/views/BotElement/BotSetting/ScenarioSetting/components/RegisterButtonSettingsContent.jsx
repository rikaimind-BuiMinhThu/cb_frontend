import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputCustom from '../scenarioComon/InputCustom';
import ScenarioModalCheckbox from './modals/shared/ScenarioModalCheckbox';
import ScenarioFormRow from './modals/shared/ScenarioFormRow';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import ScenarioCodeTextarea from './modals/shared/ScenarioCodeTextarea';
import {
  SCENARIO_MODAL_TOOLTIPS,
  REGISTER_BUTTON_LABELS,
} from './modals/shared/scenarioModalTooltips';

const labelWithTooltip = (text, tooltipKey) => (
  <>
    {text}
    <AdminInfoTooltip text={SCENARIO_MODAL_TOOLTIPS[tooltipKey]} />
  </>
);

const RegisterButtonSettingsContent = ({
  selectedMessage,
  dataMessages,
  setDataMessages,
}) => {
  const [alignBeginningStop, setAlignBeginningStop] = useState(false);

  const updateMessage = (updates) => {
    setDataMessages(dataMessages.map((msg) => (
      msg.id === selectedMessage.id ? { ...msg, ...updates } : msg
    )));
  };

  const showCodeEditor = !!selectedMessage.button_jscode;

  return (
    <div
      className={`ss-user-register-button-settings${
        showCodeEditor ? ' ss-user-register-button-settings--code-open' : ''
      }`}
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
          onChange={(checked) => updateMessage({ button_jscode: checked })}
          label={labelWithTooltip(
            REGISTER_BUTTON_LABELS.useButtonJavascript,
            'useButtonJavascript',
          )}
        />
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
};

export default RegisterButtonSettingsContent;
