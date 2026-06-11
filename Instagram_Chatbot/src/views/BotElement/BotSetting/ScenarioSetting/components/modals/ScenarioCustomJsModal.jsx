import React from 'react';
import { Button } from 'reactstrap';
import ModalShort from '../../../../../Popup/ModalShort';
import { useScenarioEditor } from '../../context/ScenarioEditorContext';

const ScenarioCustomJsModal = () => {
  const { state, actions } = useScenarioEditor();
  const {
    isOpenModalCustomJsCode,
    headCustomJsCode,
    topBodyCustomJsCode,
    bottomBodyCustomJsCode,
  } = state;
  const {
    setHeadCustomJsCode,
    setTopBodyCustomJsCode,
    setBottomBodyCustomJsCode,
    setIsOpenModalCustomJsCode,
  } = actions;

  const handleOnChangeValueCustomJsCode = (fieldType) => (e) => {
    e.preventDefault();
    const value = e.target.value;

    if (fieldType === 'head') {
      setHeadCustomJsCode((prevState) => ({
        ...prevState,
        temp: value
      }));
    } else if (fieldType === 'top_body') {
      setTopBodyCustomJsCode((prevState) => ({
        ...prevState,
        temp: value
      }));
    } else if (fieldType === 'bottom_body') {
      setBottomBodyCustomJsCode((prevState) => ({
        ...prevState,
        temp: value
      }));
    }
  };

  const closeAfterDoneCustomJsCode = (func) => (...props) => {
    func(...props);
    setTimeout(() => setIsOpenModalCustomJsCode(false), 0);
  };

  const handleOnCancelCustomJsCode = () => {
    setHeadCustomJsCode((prevState) => ({
      ...prevState,
      temp: prevState.final
    }));
    setTopBodyCustomJsCode((prevState) => ({
      ...prevState,
      temp: prevState.final
    }));
    setBottomBodyCustomJsCode((prevState) => ({
      ...prevState,
      temp: prevState.final
    }));
  };

  const handleOnConfirmCustomJsCode = () => {
    setHeadCustomJsCode((prevState) => ({
      ...prevState,
      final: prevState.temp
    }));
    setTopBodyCustomJsCode((prevState) => ({
      ...prevState,
      final: prevState.temp
    }));
    setBottomBodyCustomJsCode((prevState) => ({
      ...prevState,
      final: prevState.temp
    }));
  };

  return (
    <ModalShort open={isOpenModalCustomJsCode} onClose={closeAfterDoneCustomJsCode(handleOnCancelCustomJsCode)}>
      <div className="sl-popup-create-scenario-wrapper" style={{width: "750px"}}>
        <h4>カスタムJSコードを入力</h4>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="sl-popup-create-scenario-input-wrapper" style={{ marginBottom: '0px' }}>
              <span style={{ width: '100px'}}>ヘッド内のJSコンテンツ</span>
              <textarea
                style={{ width: '100%', height: '120px', padding: '10px', fontSize: '14px', flexGrow: "1" }}
                placeholder="ここにヘッド内のJSコードを入力してください"
                value={headCustomJsCode.temp}
                onChange={handleOnChangeValueCustomJsCode('head')}
              />
            </div>
            <div className="sl-popup-create-scenario-input-wrapper" style={{ marginBottom: '0px' }}>
              <span style={{ width: '100px'}}>上部の本文にJSコンテンツ</span>
              <textarea
                style={{ width: '100%', height: '120px', padding: '10px', fontSize: '14px', flexGrow: "1" }}
                placeholder="ここに上部の本文のJSコードを入力してください"
                value={topBodyCustomJsCode.temp}
                onChange={handleOnChangeValueCustomJsCode('top_body')}
              />
            </div>
            <div className="sl-popup-create-scenario-input-wrapper" style={{ marginBottom: '0px' }}>
              <span style={{ width: '100px'}}>下部の本文のJSコンテンツ</span>
              <textarea
                style={{ width: '100%', height: '120px', padding: '10px', fontSize: '14px', flexGrow: "1" }}
                placeholder="ここに下部の本文のJSコードを入力してください"
                value={bottomBodyCustomJsCode.temp}
                onChange={handleOnChangeValueCustomJsCode('bottom_body')}
              />
            </div>
          </div>
        </div>
        <div className="sl-popup-create-scenario-btn-wrapper">
          <Button
            className="ss-popup-add-variable-input-close-button"
            onClick={closeAfterDoneCustomJsCode(handleOnCancelCustomJsCode)}
          >
            閉じる
          </Button>
          <Button
            style={{ backgroundColor: '#024BB9' }}
            className="ss-popup-add-variable-input-keep-button"
            onClick={closeAfterDoneCustomJsCode(handleOnConfirmCustomJsCode)}
          >
            保存
          </Button>
        </div>
      </div>
    </ModalShort>
  );
};

export default ScenarioCustomJsModal;
