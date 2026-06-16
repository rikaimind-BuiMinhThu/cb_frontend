import React from 'react';
import { Button } from 'reactstrap';
import ModalShort from '../../../../../Popup/ModalShort';
import { useScenarioEditor } from '../../context/ScenarioEditorContext';

const ERR_MSG_MODES = {
  JS: 'js',
  SELECTOR: 'selector',
};

const ScenarioErrMsgSettingModal = () => {
  const { state, actions } = useScenarioEditor();
  const {
    isOpenErrMsgByJsSettingModal,
    errMsgJsCode,
    errMsgSettingMode,
    errMsgFieldSelectors,
    errMsgFormSelectors,
  } = state;
  const {
    setErrMsgJsCode,
    setIsOpenErrMsgByJsSettingModal,
    setErrMsgSettingMode,
    setErrMsgFieldSelectors,
    setErrMsgFormSelectors,
  } = actions;

  const isJsMode = errMsgSettingMode !== ERR_MSG_MODES.SELECTOR;

  return (
    <ModalShort open={isOpenErrMsgByJsSettingModal} onClose={() => setIsOpenErrMsgByJsSettingModal(false)}>
      <div className="sl-popup-error-message-wrapper" style={{ width: '750px' }}>
        <h4>エラーメッセージ取得設定</h4>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input
              type="radio"
              name="errMsgSettingMode"
              checked={isJsMode}
              onChange={() => setErrMsgSettingMode(ERR_MSG_MODES.JS)}
            />
            JSコードで設定
          </label>
          {isJsMode && (
            <div className="sl-popup-error-message-input-wrapper" style={{ marginBottom: '0px' }}>
              <span style={{ width: '100px', whiteSpace: 'nowrap', wordBreak: 'normal' }}>JSコード</span>
              <textarea
                style={{ width: '100%', height: '150px', padding: '10px', fontSize: '14px', flexGrow: '1' }}
                placeholder="ここにJSコードを入力してください"
                value={errMsgJsCode}
                onChange={(e) => setErrMsgJsCode(e.target.value)}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input
              type="radio"
              name="errMsgSettingMode"
              checked={!isJsMode}
              onChange={() => setErrMsgSettingMode(ERR_MSG_MODES.SELECTOR)}
            />
            セレクターで設定
          </label>
          {!isJsMode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="sl-popup-error-message-input-wrapper">
                <span style={{ width: '180px', whiteSpace: 'nowrap' }}>フィールドエラーセレクター</span>
                <input
                  type="text"
                  style={{ width: '100%', padding: '8px', fontSize: '14px', flexGrow: '1' }}
                  placeholder="例: .formErrorContent, .field-error"
                  value={errMsgFieldSelectors}
                  onChange={(e) => setErrMsgFieldSelectors(e.target.value)}
                />
              </div>
              <div className="sl-popup-error-message-input-wrapper">
                <span style={{ width: '180px', whiteSpace: 'nowrap' }}>フォームエラーセレクター</span>
                <input
                  type="text"
                  style={{ width: '100%', padding: '8px', fontSize: '14px', flexGrow: '1' }}
                  placeholder="例: #alert-box, .form-errors"
                  value={errMsgFormSelectors}
                  onChange={(e) => setErrMsgFormSelectors(e.target.value)}
                />
              </div>
              <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                ※ 複数セレクターはカンマ区切りで入力してください
              </p>
            </div>
          )}
        </div>

        <div className="sl-popup-error-message-btn-wrapper">
          <Button
            className="ss-popup-error-message-input-close-button"
            onClick={() => setIsOpenErrMsgByJsSettingModal(false)}
          >
            閉じる
          </Button>
          <Button
            style={{ backgroundColor: '#024BB9' }}
            className="ss-popup-error-message-input-keep-button"
            onClick={() => setIsOpenErrMsgByJsSettingModal(false)}
          >
            保存
          </Button>
        </div>
      </div>
    </ModalShort>
  );
};

export default ScenarioErrMsgSettingModal;
