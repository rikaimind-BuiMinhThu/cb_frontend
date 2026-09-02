import React, { useEffect } from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import InputCustom from '../../../scenarioCommon/InputCustom';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import ScenarioModalCheckbox from '../shared/ScenarioModalCheckbox';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import { SCENARIO_MODAL_TOOLTIPS } from '../shared/scenarioModalTooltips';
import { TIMER_TYPES, TIMER_VARIABLES_DESCRIPTION } from '../../../../PreviewComponent/Constants';

const setNestedConfigValue = (config, keyPath, value) => {
  if (keyPath.length === 1) {
    return { ...config, [keyPath[0]]: value };
  }
  const [head, ...rest] = keyPath;
  return {
    ...config,
    [head]: setNestedConfigValue({ ...(config[head] || {}) }, rest, value),
  };
};

const ScenarioTimerView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const { timerConfig } = state;
  const { setTimerConfig } = actions;

  const handleChangeTimerConfig = ({ keyPath = [], instanceValue = null, useEventValue = false, transform = (v) => v, defaultValue = null }) => (e) => {
    if (!keyPath.length) return;

    const value = (() => {
      if (instanceValue !== null) return instanceValue;
      if (!!e && useEventValue) {
        e.preventDefault?.();
        return e.target?.value ?? e;
      }
      return null;
    })();

    setTimerConfig((prevConfig) => (
      setNestedConfigValue(prevConfig, keyPath, transform(value ?? defaultValue))
    ));
  };

  const handleOnCancelTimerConfig = () => {
    setTimerConfig((prevState) => ({
      ...prevState,
      temp: prevState.final,
    }));
    onBack();
  };

  const handleOnConfirmTimerConfig = () => {
    setTimerConfig((prevState) => ({
      ...prevState,
      final: prevState.temp,
    }));
    onBack();
  };

  const modalData = timerConfig.temp;

  useEffect(() => {
    setTimerConfig((prev) => ({
      ...prev,
      temp: { ...prev.final },
    }));
  }, [setTimerConfig]);

  return (
    <div className="ss-settings-timer-view">
      <div className="modal_timer_config-content">
        <ScenarioFormRow
          label="タイマー時間"
          tooltip={SCENARIO_MODAL_TOOLTIPS.timerDuration}
        >
          {modalData.type === TIMER_TYPES.COUNTING_DOWN && (
            <div className="counting_down_input_holder">
              <div className="counting_down_input_wrapper">
                <InputCustom
                  className="full-width"
                  value={modalData.duration[modalData.type]?.hour ?? 0}
                  onChange={handleChangeTimerConfig({
                    keyPath: ['temp', 'duration', modalData.type, 'hour'],
                    useEventValue: true,
                    defaultValue: 0,
                    transform: (v) => ((v || Number(v) > 0) ? Number(v) : 0),
                  })}
                  placeholder="0"
                  type="number"
                />
                <label className="counting_down_input_label">時</label>
              </div>
              <div className="counting_down_input_wrapper">
                <InputCustom
                  className="full-width"
                  value={modalData.duration[modalData.type]?.minute ?? 0}
                  onChange={handleChangeTimerConfig({
                    keyPath: ['temp', 'duration', modalData.type, 'minute'],
                    useEventValue: true,
                    defaultValue: 0,
                    transform: (v) => ((v || Number(v) > 0) ? Number(v) : 0),
                  })}
                  placeholder="0"
                  type="number"
                />
                <label className="counting_down_input_label">分</label>
              </div>
              <div className="counting_down_input_wrapper">
                <InputCustom
                  className="full-width"
                  value={modalData.duration[modalData.type]?.second ?? 0}
                  onChange={handleChangeTimerConfig({
                    keyPath: ['temp', 'duration', modalData.type, 'second'],
                    useEventValue: true,
                    defaultValue: 0,
                    transform: (v) => ((v || Number(v) > 0) ? Number(v) : 0),
                  })}
                  placeholder="0"
                  type="number"
                />
                <label className="counting_down_input_label">秒</label>
              </div>
            </div>
          )}
        </ScenarioFormRow>

        <ScenarioFormRow
          label="カウント中メッセージ"
          tooltip={SCENARIO_MODAL_TOOLTIPS.timerCountingMessage}
          alignTop
        >
          <textarea
            className="modal_timer_config-html_holder"
            value={modalData.messages.counting.content}
            onChange={handleChangeTimerConfig({
              keyPath: ['temp', 'messages', 'counting', 'content'],
              useEventValue: true,
              transform: (v) => (v ? String(v) : ''),
            })}
            placeholder="カウント中メッセージ"
          />
        </ScenarioFormRow>

        <div className="modal_timer_config-finish_message">
          <ScenarioModalCheckbox
            checked={modalData.messages.finish.isShow}
            onChange={(checked) => handleChangeTimerConfig({
              keyPath: ['temp', 'messages', 'finish', 'isShow'],
              instanceValue: checked,
            })()}
            label={(
              <>
                終了メッセージを表示
                <AdminInfoTooltip text={SCENARIO_MODAL_TOOLTIPS.timerFinishMessage} />
              </>
            )}
          />
          {modalData.messages.finish.isShow && (
            <ScenarioFormRow
              label="終了時メッセージ"
              tooltip={SCENARIO_MODAL_TOOLTIPS.timerFinishMessage}
              alignTop
            >
              <textarea
                className="modal_timer_config-html_holder"
                value={modalData.messages.finish.content}
                onChange={handleChangeTimerConfig({
                  keyPath: ['temp', 'messages', 'finish', 'content'],
                  useEventValue: true,
                  transform: (v) => (v ? String(v) : ''),
                })}
                placeholder="終了時メッセージ"
              />
            </ScenarioFormRow>
          )}
        </div>

        <div className="modal_timer_config-finish_message full-width">
          <ScenarioModalCheckbox
            checked={!!modalData.isRealtimeRemainingTime}
            onChange={(checked) => handleChangeTimerConfig({
              keyPath: ['temp', 'isRealtimeRemainingTime'],
              instanceValue: checked,
            })()}
            label="リアルタイム残り時間表示"
          />
        </div>

        <div className="modal_timer_config-variable_holder">
          {Object.keys(timerConfig.variables).map((key) => (
            <div key={`${key}v_des`}>
              <span><b>{`{{${timerConfig.variables[key]}}}`}</b></span>
              {' - '}
              {TIMER_VARIABLES_DESCRIPTION[modalData.type][key]}
            </div>
          ))}
        </div>
      </div>

      <ScenarioModalFooter
        onClose={handleOnCancelTimerConfig}
        onConfirm={handleOnConfirmTimerConfig}
      />
    </div>
  );
};

export default ScenarioTimerView;
