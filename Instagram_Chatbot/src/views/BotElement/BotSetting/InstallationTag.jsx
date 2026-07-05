import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import api from '../../../api/api-management'
import { tokenExpired } from 'api/tokenExpired';
import { getEcChatBotFrontEndBaseUrl } from 'variables/constants';

function InstallationTag() {
  const [urlDemo, setUrlDemo] = useState('');
  const [botId] = useState(Cookies.get('bot_id'));
  const [setScenarioSelected] = useState();

  useEffect(() => {
    const url = '/admin/demo-bot/' + botId;

    setUrlDemo(url);

    api.get(`/api/v1/managements/chatbots/${botId}/get_scenario_selected`).then(res => {
      console.log('res: ', res.data);
      setScenarioSelected(res?.data?.data?.id);
    }).catch(err => {
      console.log(err);
      if (err.response?.data.code === 0) {
        tokenExpired();
      }
    })
  }, []);

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4 style={{ color: '#767676' }}>設置ガイド</h4>
              </CardHeader>
              <CardBody>
                {/* 決済チャットボット */}
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ color: '#767676', fontWeight: "600" }}>決済チャットボット</span> <br />
                  <span style={{ color: '#767676' }}>サイトにボットを埋め込む</span> <br />
                  <span style={{ color: '#767676', fontWeight: "400" }}>ページの右下にウェブチャットを表示するためにウェブサイトの &lt;body&gt; タグ内に以下のコードを貼り付けてください。</span>
                  <textarea
                    disabled
                    readOnly
                    style={{
                      width: "90%",
                      border: '1px solid grey',
                      color: '#767676',
                      padding: '5px',
                      borderRadius: '5px',
                      resize: 'none',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      minHeight: '60px'
                    }}
                    value={`<script>sessionStorage.setItem("bot_id", "${botId}");</script>\n<script src="${getEcChatBotFrontEndBaseUrl()}/sdk-v2.js" defer></script>`}
                  />
                </div>

                {/* FAQ チャットボット */}
                <div style={{ marginBottom: '30px' }}>
                  <span style={{ color: '#767676', fontWeight: "600" }}>FAQ チャットボット</span> <br />
                  <span style={{ color: '#767676' }}>サイトにボットを埋め込む</span> <br />
                  <span style={{ color: '#767676', fontWeight: "400" }}>ページの右下にウェブチャットを表示するためにウェブサイトの &lt;body&gt; タグ内に以下のコードを貼り付けてください。</span>
                  <textarea
                    disabled
                    readOnly
                    style={{
                      width: "90%",
                      border: '1px solid grey',
                      color: '#767676',
                      padding: '5px',
                      borderRadius: '5px',
                      resize: 'none',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      minHeight: '60px'
                    }}
                    value={`<script>sessionStorage.setItem("bot_id", "${botId}");</script>\n<script src="${getEcChatBotFrontEndBaseUrl()}/sdk-faq-v1.js" defer></script>`}
                  />
                </div>
                <br />
                <div style={{ color: '#767676', marginTop: "15px", padding: "5px", width: "100%", borderBottom: '1px solid grey' }}>
                  <span style={{ color: '#767676' }}>Demo URL</span>
                </div>
                <div style={{ color: "#767676" }}>
                <p>以下のデモサイトでチャットをお試しください。会話ログとレポート結果に反映されません。</p>
                  <Link to={urlDemo}>
                    <button style={{ padding: "5px 35px", border: 'none', borderRadius: "10px", backgroundColor: "#6bd198", color: '#FFFFFF' }}>デモ</button>
                  </Link>
                  <br />
                  {/* * By adding /bot ID to the end of the URL, you can run a specific scenario that is already selected in list scenario. */}
                  <br /> <br />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default InstallationTag