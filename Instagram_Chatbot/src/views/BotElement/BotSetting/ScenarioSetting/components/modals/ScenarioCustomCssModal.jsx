import React from 'react';
import { Button } from 'reactstrap';
import ModalShort from '../../../../../Popup/ModalShort';
import { useScenarioEditor } from '../../context/ScenarioEditorContext';

const ScenarioCustomCssModal = () => {
  const { state, actions } = useScenarioEditor();
  const { isOpenModalCustomCss, customCssContent } = state;
  const { setCustomCssContent, setIsOpenModalCustomCss } = actions;

  const handleOnChangeValueCustomCss = (e) => {
    e.preventDefault();
    setCustomCssContent((prevState) => ({
      ...prevState,
      temp: e.target.value,
    }));
  };

  const closeAfterDone = (func) => (...props) => {
    func(...props);
    setTimeout(() => setIsOpenModalCustomCss(false), 0);
  };

  const handleOnCancelCustomCss = () => {
    setCustomCssContent((prevState) => ({
      ...prevState,
      temp: prevState.final,
    }));
  };

  const handleOnConfirmCustomCss = () => {
    setCustomCssContent((prevState) => ({
      ...prevState,
      final: prevState.temp,
    }));
  };

  return (
    <ModalShort open={isOpenModalCustomCss} onClose={closeAfterDone(handleOnCancelCustomCss)}>
      <div className="sl-popup-create-scenario-wrapper" style={{width: "750px"}}>
        <h4>カスタム CSS を入力</h4>
        <div style={{ marginBottom: '10px' }}>
          <div className="sl-popup-create-scenario-input-wrapper" style={{ marginBottom: '0px' }}>
            <span style={{ width: '100px', whiteSpace: "nowrap", wordBreak: "normal" }}>CSSコンテンツ</span>
            <textarea
              style={{ width: '100%', height: '150px', padding: '10px', fontSize: '14px', flexGrow: "1" }}
              placeholder="ここにカスタムCSSコンテンツを入力してください"
              value={customCssContent.temp}
              onChange={handleOnChangeValueCustomCss}
            />
          </div>
        </div>
        <div className="sl-popup-create-scenario-btn-wrapper">
          <Button
            className="ss-popup-add-variable-input-close-button"
            onClick={closeAfterDone(handleOnCancelCustomCss)}
          >
            閉じる
          </Button>
          <Button
            style={{ backgroundColor: '#024BB9' }}
            className="ss-popup-add-variable-input-keep-button"
            onClick={closeAfterDone(handleOnConfirmCustomCss)}
          >
            保存
          </Button>
        </div>
      </div>
    </ModalShort>
  );
};

export default ScenarioCustomCssModal;
