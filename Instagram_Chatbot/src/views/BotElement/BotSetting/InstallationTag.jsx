import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import api from '../../../api/api-management'
import { tokenExpired } from 'api/tokenExpired';
function InstallationTag() {

  const [urlDemo, setUrlDemo] = useState('')
  const [botId, setBotId] = useState(Cookies.get('bot_id'))
  const [scenarioIdSelected, setScenarioSelected] = useState()

  useEffect(() => {
    let url = '/admin/demo-bot/' + botId
    setUrlDemo(url)
    api.get(`/api/v1/managements/chatbots/${botId}/get_scenario_selected`).then(res => {
      console.log('res: ', res.data);
      setScenarioSelected(res?.data?.data?.id)
    }).catch(err => {
      console.log(err);
      if (err.response?.data.code === 0) {
        tokenExpired();
      }
    })
  }, [])

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4 style={{ color: '#767676' }}>Installation guide</h4>
              </CardHeader>
              <CardBody>
                <span style={{ color: '#767676' }}>Embed a bot on your site</span> <br />
                <span style={{ color: '#767676', fontWeight: "400" }}>Paste the following code inside the &lt;body&gt; tag of your website to display the webchat in the bottom right corner of the page.</span>
                <div style={{ width: "90%", border: '1px solid grey', color: '#767676', padding: '5px', borderRadius: '5px' }}>
                  &lt;script&gt; sessionStorage.setItem("bot_id", "{botId}"); sessionStorage.setItem("scenario_id", "{scenarioIdSelected}");&lt;/script&gt; <br />
                  &lt;script src="https://ec-chatbot-test1.com/sdk.js" defer&gt;&lt;/script&gt;
                </div>
                <br />
                <div style={{ color: '#767676', marginTop: "15px", padding: "5px", width: "100%", borderBottom: '1px solid grey' }}>
                  <span style={{ color: '#767676' }}>Demo URL</span>
                </div>
                <div style={{ color: "#767676" }}>
                  Try chat on the demo site below. It is not reflected in the conversation log and report results. <br />
                  <Link to={urlDemo}>
                    <button style={{ padding: "5px 35px", border: 'none', borderRadius: "10px", backgroundColor: "#6bd198", color: '#FFFFFF' }}>デモ</button>
                  </Link>
                  <br />
                  * By adding /bot ID to the end of the URL, you can run a specific scenario that is already selected in list scenario.
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