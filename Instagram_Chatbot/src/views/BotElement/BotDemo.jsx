import { useEffect } from 'react';
import { useState } from 'react';
import { Col, Row } from 'reactstrap';
import '../../assets/css/bot/bot-demo.css';
// import IconManDefault from '../../assets/img/bot-icon/man1_new.png';
import Preview from './BotSetting/Preview';
import Cookies from 'js-cookie';
import api from '../../api/api-management';
import ModalNoti from '../../views/Popup/ModalNoti';

const BotDemo = () => {
  // states
  const [isChatBoxClick, setIsChatBoxClick] = useState(true);
  const [scenarioId, setScenarioId] = useState('');
  const bot_id = Cookies.get('bot_id');

  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [messageNoti, setMessageNoti] = useState('');

  // side effects
  useEffect(() => {
    setTimeout(() => {
      setIsChatBoxClick(true);
    }, 300);
  }, []);

  useEffect(() => {
    api.get(`/api/v1/managements/chatbots/${bot_id}/get_scenario_selected`).then((response) => {
      console.log(response);
      if (response.data.data) {
        setScenarioId(response.data.data.id);
        Cookies.set('scenario_id', response.data.data.id);
      } else {
        setIsOpenNoti(true);
        setMessageNoti('シナリオがありません。');
        setTimeout(() => {
          setIsOpenNoti(false);
          setMessageNoti('');
        }, 2000);
      }
    });
  }, []);

  const handleOpenPreview = (isOpen) => {
    if (document.getElementById('sp-container')) {
      if (isOpen) {
        document.getElementById('sp-container').style.height = '620px';
        document.getElementById('sp-header').style.position = 'static';
        document.getElementById('sp-header').style.borderBottomLeftRadius = '0px';
        document.getElementById('sp-header').style.borderBottomRightRadius = '0px';
        document.getElementById('sp-header').style.borderTopLeftRadius = "2px";
        document.getElementById('sp-header').style.borderTopRightRadius = "2px";
        document.getElementById('sp-process-bar').style.display = 'block';
        document.getElementById('sp-body').style.display = 'block';
      } else {
        document.getElementById('sp-container').style.height = '0px';
        document.getElementById('sp-process-bar').style.display = 'none';
        document.getElementById('sp-body').style.display = 'none';
        document.getElementById('sp-header').style.borderBottomLeftRadius = '25px';
        document.getElementById('sp-header').style.borderBottomRightRadius = '25px';
        document.getElementById('sp-header').style.borderTopLeftRadius = "25px";
        document.getElementById('sp-header').style.borderTopRightRadius = "25px";
        document.getElementById('sp-header').style.position = 'absolute';
        document.getElementById('sp-header').style.bottom = '13px';
      }
      setIsChatBoxClick(isOpen);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <h2 className="title-bd">Demo</h2>
          <div className="action-wrapper-bd">
            <h4 className="action-title-bd">アクションクリック</h4>
            <div className="actions-bd">
              <span className="action-bd" onClick={() => handleOpenPreview(!isChatBoxClick)}>
                open-close
              </span>
              <span className="action-bd" onClick={() => handleOpenPreview(true)}>
                open
              </span>
              <span id="action-bd" className="action-bd" onClick={() => handleOpenPreview(false)}>
                close
              </span>
            </div>
          </div>
        </Col>
      </Row>
      {scenarioId && (
        <Preview
          isOpen={isChatBoxClick}
          onOpenPreview={(isOpen) => handleOpenPreview(isOpen)}
          scenarioIdProps={scenarioId}
        />
      )}
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <span style={{ fontSize: '16px' }}>{messageNoti}</span>
        </div>
      </ModalNoti>
    </div>
  );
};

export default BotDemo;
