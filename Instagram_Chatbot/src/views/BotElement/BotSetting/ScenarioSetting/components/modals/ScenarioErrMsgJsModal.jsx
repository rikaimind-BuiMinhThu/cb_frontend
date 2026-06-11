import React from 'react';
import { Button } from 'reactstrap';
import ModalShort from '../../../../../Popup/ModalShort';
import { useScenarioEditor } from '../../context/ScenarioEditorContext';

const ScenarioErrMsgJsModal = () => {
  const { state, actions } = useScenarioEditor();
  const { isOpenErrMsgByJsSettingModal, errMsgJsCode } = state;
  const { setErrMsgJsCode, setIsOpenErrMsgByJsSettingModal } = actions;

  return (
    <ModalShort open={isOpenErrMsgByJsSettingModal} onClose={() => setIsOpenErrMsgByJsSettingModal(false)}>
      <div className="sl-popup-error-message-wrapper" style={{ width: "750px" }}>
        <h4>エラーメッセンジ取得JSコードを入力</h4>
        <div style={{ marginBottom: "10px" }}>
          <div className="sl-popup-error-message-input-wrapper" style={{ marginBottom: "0px" }}>
            <span style={{ width: "100px", whiteSpace: "nowrap", wordBreak: "normal" }}>JSコード</span>
            <textarea
              style={{ width: "100%", height: "150px", padding: "10px", fontSize: "14px", flexGrow: "1" }}
              placeholder="ここにJSコードを入力してください"
              value={errMsgJsCode}
              onChange={(e) => setErrMsgJsCode(e.target.value)}
            />
          </div>
        </div>
        <div className="sl-popup-error-message-btn-wrapper">
          <Button
            className="ss-popup-error-message-input-close-button"
            onClick={() => setIsOpenErrMsgByJsSettingModal(false)}
          >
            閉じる
          </Button>
          <Button
            style={{ backgroundColor: "#024BB9" }}
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

export default ScenarioErrMsgJsModal;
