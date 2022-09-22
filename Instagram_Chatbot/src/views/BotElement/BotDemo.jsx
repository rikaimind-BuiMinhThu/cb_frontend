import { Col, Row } from 'reactstrap';
import '../../assets/css/bot/bot-demo.css';
import IconManDefault from '../../assets/img/bot-icon/man1_new.png';

const BotDemo = () => {
  return (
    <div className="content">
      <Row>
        <Col md="12">
          <h2 className="title-bd">Demo</h2>
          <div className="action-wrapper-bd">
            <h4 className="action-title-bd">Mouse action</h4>
            <div className="actions-bd">
              <span className="action-bd">open-close</span>
              <span className="action-bd">open</span>
              <span className="action-bd">close</span>
            </div>
          </div>
        </Col>
      </Row>
      <div className="chat-wrapper-bd" style={{ bottom: '20px' }}>
        <div className="chat-header-bd" style={{ backgroundColor: 'blue' }}>
          <div className="info-wrapper-bd">
            <img src={IconManDefault} alt="" />
            <div className="info__title">
              <span>Title</span>
              <span>Subtitle</span>
            </div>
          </div>
          <span>{'>'}</span>
        </div>
        <div className="chat-body-bd">
          <div className="message-groups-bd">
            <div className="message-wrapper-bd">
              <div className="message-avt-bd">
                <img src={IconManDefault} alt="" />
              </div>
              <div className="message-bd">
                <p>はじめまして！ 会員登録ありがとうございます。登録はたった1分で完了します！</p>
              </div>
            </div>
            <div className="message-wrapper-bd">
              <div className="message-avt-bd">
                <img src={IconManDefault} alt="" />
              </div>
              <div className="message-bd">
                <p>早速ですが、お客様のお名前を教えてください。</p>
              </div>
            </div>
            <div className="message-wrapper-bd chat-right-bd">
              <h4>Name</h4>
              <input type="text" placeholder="Enter your name" />
              <div className="btn-send-message-bd">
                <button>Next</button>
              </div>
            </div>
            <div className="message-wrapper-bd chat-right-bd">
              <h4>Name</h4>
              <input type="text" placeholder="Enter your name" />
              <div className="btn-send-message-bd">
                <button>Next</button>
              </div>
            </div>
            <div className="message-wrapper-bd chat-right-bd">
              <h4>Name</h4>
              <input type="text" placeholder="Enter your name" />
              <div className="btn-send-message-bd">
                <button>Next</button>
              </div>
            </div>
            <div className="message-wrapper-bd chat-right-bd">
              <h4>Name</h4>
              <input type="text" placeholder="Enter your name" />
              <div className="btn-send-message-bd">
                <button>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotDemo;
