import React from 'react';
import { Button } from 'reactstrap';
import ModalShort from '../../../../../Popup/ModalShort';
import InputCustom from '../../scenarioComon/InputCustom';
import { TIMER_TYPES, TIMER_VARIABLES_DESCRIPTION } from '../../../PreviewComponent/Constants';
import { useScenarioEditor } from '../../context/ScenarioEditorContext';

const ScenarioTimerModal = () => {
  const { state, actions } = useScenarioEditor();
  const { timerConfig } = state;
  const { setTimerConfig } = actions;

  const handleChangeTimerConfig = ({ keyPath = [], instanceValue = null, useEventValue = false, transform = (v) => v, defaultValue = null }) => (e) => {
    if (!keyPath.length) return;

    let value = instanceValue;

    if (!!e && useEventValue) {
      e.preventDefault?.();
      value = e.target?.value ?? e;
    }

    setTimerConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      let current = newConfig;

      for (let i = 0; i < keyPath.length - 1; i++) {
        const key = keyPath[i];
        current[key] = { ...(current[key] || {}) };
        current = current[key];
      }

      current[keyPath[keyPath.length - 1]] = transform(value || defaultValue);
      return newConfig;
    });
  };

  const closeAfterDoneTimerConfig = (func) => (...props) => {
    new Promise((res) => {
      func(...props);
      res();
    }).then(() => setTimerConfig((config) => ({ ...config, isOpen: false })));
  };

  const handleOnCancelTimerConfig = () => {
    setTimerConfig((prevState) => ({
      ...prevState,
      temp: prevState.final
    }));
  };

  const handleOnConfirmTimerConfig = () => {
    setTimerConfig((prevState) => ({
      ...prevState,
      final: prevState.temp
    }));
  };

  const modalData = timerConfig.temp;

  return (
    <ModalShort open={timerConfig.isOpen} onClose={closeAfterDoneTimerConfig(handleOnCancelTimerConfig)}>
      <div className="sl-popup-create-scenario-wrapper modal_timer_config-holder">
        <h4>タイマーを使用する</h4>
        <div className="modal_timer_config-content">
          <div className="modal_timer_config-input_holder">
            <div className="sl-popup-create-scenario-input-wrapper full-width margin-b-none">
              <span className="modal_timer_config-input-label">{"タイマー時間（秒）"}</span>
              {modalData.type === TIMER_TYPES.COUNTING_DOWN && (
                <div className="counting_down_input_holder">
                  <div className="counting_down_input_wrapper">
                    <InputCustom
                      className="full-width"
                      value={modalData.duration[modalData.type]?.hour ?? 0}
                      onChange={handleChangeTimerConfig({ keyPath: ["temp", "duration", modalData.type, "hour"], useEventValue: true, defaultValue: 0, transform: (v) => (v || Number(v) > 0) ? Number(v) : 0 })}
                      placeholder="0 (秒)"
                      type='number'
                    />
                    <label className="counting_down_input_label">時</label>
                  </div>
                  <div className="counting_down_input_wrapper">
                    <InputCustom
                      className="full-width"
                      value={modalData.duration[modalData.type]?.minute ?? 0}
                      onChange={handleChangeTimerConfig({ keyPath: ["temp", "duration", modalData.type, "minute"], useEventValue: true, defaultValue: 0, transform: (v) => (v || Number(v) > 0) ? Number(v) : 0 })}
                      placeholder="0 (秒)"
                      type='number'
                    />
                    <label className="counting_down_input_label">分</label>
                  </div>
                  <div className="counting_down_input_wrapper">
                    <InputCustom
                      className="full-width"
                      value={modalData.duration[modalData.type]?.second ?? 0}
                      onChange={handleChangeTimerConfig({ keyPath: ["temp", "duration", modalData.type, "second"], useEventValue: true, defaultValue: 0, transform: (v) => (v || Number(v) > 0) ? Number(v) : 0 })}
                      placeholder="0 (秒)"
                      type='number'
                    />
                    <label className="counting_down_input_label">秒</label>
                  </div>

                </div>
              )}
            </div>

            <div className="sl-popup-create-scenario-input-wrapper full-width margin-b-none">
              <span className="modal_timer_config-input-label">カウント中メッセージ</span>
              <textarea
                className="modal_timer_config-html_holder"
                value={modalData.messages.counting.content}
                onChange={handleChangeTimerConfig({ keyPath: ["temp", "messages", "counting", "content"], useEventValue: true, transform: (v) => v ? String(v) : "" })}
                placeholder="カウント中メッセージ"
              />
            </div>

            <div className="modal_timer_config-finish_message full-width">
              <div className="finish_message_label">
                <input
                  type="checkbox"
                  className="ss-user-setting-checkbox-custom"
                  onChange={handleChangeTimerConfig({ keyPath: ["temp", "messages", "finish", "isShow"], instanceValue: !modalData.messages.finish.isShow, tranform: (v) => !!v })}
                  checked={modalData.messages.finish.isShow}
                />
                <label>終了メッセージを表示</label>
              </div>
              <div className="sl-popup-create-scenario-input-wrapper full-width" style={!modalData.messages.finish.isShow ? { display: "none" } : {}}>
                <span className="modal_timer_config-input-label">終了時メッセージ</span>
                <textarea
                  className="modal_timer_config-html_holder"
                  value={modalData.messages.finish.content}
                  onChange={handleChangeTimerConfig({ keyPath: ["temp", "messages", "finish", "content"], useEventValue: true, transform: (v) => v ? String(v) : "" })}
                  placeholder="終了時メッセージ"
                />
              </div>
            </div>
          </div>

          <div className="modal_timer_config-variable_holder">
            {Object.keys(timerConfig.variables).map((key) => (
              <div key={key + "v_des"}><span><b>{`{{${timerConfig.variables[key]}}}`}</b></span> - {TIMER_VARIABLES_DESCRIPTION[modalData.type][key]}</div>
            ))}
          </div>
        </div>

        <div className="sl-popup-create-scenario-btn-wrapper">
          <Button
            className="ss-popup-add-variable-input-close-button"
            onClick={closeAfterDoneTimerConfig(handleOnCancelTimerConfig)}
          >
            閉じる
          </Button>
          <Button
            className="ss-popup-add-variable-input-keep-button modal_confirm-button"
            onClick={closeAfterDoneTimerConfig(handleOnConfirmTimerConfig)}
          >
            保存
          </Button>
        </div>
      </div>
    </ModalShort>
  );
};

export default ScenarioTimerModal;
