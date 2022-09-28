import '../../../../assets/css/bot/scenario/scenario-single.css';
import { useEffect } from 'react';
import { Col, Row, Card, CardBody, CardHeader, Button } from 'reactstrap';
import icon from '../../../../assets/img/bot-icon/man1_new.png'
import { MDBIcon } from 'mdbreact';
const Scenario = () => {
  // states

  // side effects
  useEffect(() => {
    document.title = 'Edit Scenario';
    window.scrollTo(0, 0);
  }, []);

  function botUploadFile() {
    document.getElementById('bot-file-upload').click()
  }

  function getBaseUrl(event) {
    // console.log('getNe');
    var file = document.querySelector('input[type=file]')['files'][0];
    // if (file?.type === 'image/png' || file?.type === 'image/jpeg') {
    var reader = new FileReader();
    var baseString;
    var imgUrl = URL.createObjectURL(event.target.files[0]);
    if (file?.type === 'image/png' || file?.type === 'image/jpeg' || file?.type === 'image/jpg'
      || file?.type === 'image/gif' || file?.type === 'image/img') {
      document.getElementById(`bot-file-upload-img`).style.display = "block"
      document.getElementById(`bot-file-upload-img`).src = imgUrl;
    } else {
      document.getElementById(`bot-file-upload-img`).style.display = "none"
      document.getElementById(`bot-file-upload-img`).src = '';
    }

    reader.onloadend = function () {
      baseString = reader.result;
      // setInputImage(baseString);
      console.log(event.target.files[0].name);
      document.getElementById('bot-file-upload-name').innerHTML = event.target.files[0].name
      if (baseString !== undefined || baseString !== '') {
        // document.getElementById('newClientImgLogoErrMsg').style.display = 'none';
        console.log('No file selected')
      }
    };
    reader.readAsDataURL(file);
    // return true;
    // } else {
    // return false;
    // }
  }

  return (
    <div className="content">
      <div className="ss-actions">
        <Button>Save scenario</Button>
        <Button>Save and preview</Button>
      </div>
      <Row>
        <Col >
          <Card>
            <CardBody>
              <div className='ss-sc-setting'>
                <div className='ss-sc-content ss-overview'>

                  {/* Input name of scenario */}
                  <input className='ss-scenario-name' type="text"></input>

                  {/* Overview scenario */}
                  <div className='ss-overview-detail'>

                    {/* Detail bot chat overview */}
                    <div className='ss-bot-chat'>
                      <div className='ss-bot-chat-detail'>
                        <img className='ss-bot-ava' src={icon}></img>
                        <div className='ss-bot-chat-detail-content'>

                        </div>
                        <div className='ss-chat-option'>
                          <MDBIcon
                            fas
                            icon="pencil-alt"
                            style={{ fontSize: '20px', marginTop: "10px" }}></MDBIcon>

                          <MDBIcon
                            fas
                            icon="grip-vertical"
                            style={{ fontSize: '20px', marginTop: "10px" }}
                          ></MDBIcon>
                        </div>
                      </div>
                      <MDBIcon
                        fas
                        icon="plus-circle"
                        style={{ fontSize: '20px', margin: "10px 0px 0px 10px" }}
                      ></MDBIcon>
                    </div>

                    {/* Detail user chat overview */}
                    <div className='ss-user-chat'>
                      <div className='ss-user-chat-detail'>
                        <div className='ss-user-chat-detail-content'>

                        </div>
                        <div className='ss-chat-option'>
                          <MDBIcon
                            fas
                            icon="pencil-alt"
                            style={{ fontSize: '20px', marginTop: "10px" }}></MDBIcon>

                          <MDBIcon
                            fas
                            icon="grip-vertical"
                            style={{ fontSize: '20px', marginTop: "10px" }}
                          ></MDBIcon>
                        </div>

                      </div>
                      <MDBIcon
                        className='ss-user-add-input'
                        fas
                        icon="plus-circle"
                      ></MDBIcon>

                    </div>
                  </div>
                </div>
                <div className='ss-sc-content ss-bot-setting'>
                  <div id='bot-statement' className='ss-bot-statement-detail-setting'>

                    {/* Bot setting detail below */}
                    <div style={{ padding: '10px' }}>
                      <label>type</label>
                      <select name="bot_statement_type" id="bot-statement-type" className='ss-bot-statement-type'>
                        <option value="text">Text</option>
                        <option value="file">File</option>
                        <option value="email">Email</option>
                        <option value="script">Script</option>
                        <option value="deplay">Delay</option>
                        {/* <option value="api_link_age">Text</option> Pending */}
                      </select>

                      <div id='bot-statement-type-text' className='ss-bot-statement-type-text'>
                        <textarea
                          name="bot-statement-type-text-content"
                          id="bot-statement-type-text-content"
                          className='bot-statement-type-text-content'
                          rows={5}
                          placeholder="Input..."></textarea>
                        <input type="checkbox" id='bot-text-scroll-auto' name='bot-text-scroll-auto' />&ensp;
                        <label htmlFor="scroll-auto">Do not scroll automatically</label>
                      </div>

                      <div id='bot-statement-type-file' className='ss-bot-statement-type-file'>
                        <div style={{ textAlign: "center" }}>
                          <img src="" id="bot-file-upload-img" className='ss-bot-file-upload-img' alt="" />
                          <span id="bot-file-upload-name"></span><br /><br />
                          <input type="file" id="bot-file-upload" name="bot-file-upload" hidden
                            onChange={(e) => {
                              getBaseUrl(e);
                              // setUpdateImageChange(true);
                            }}
                          />
                          <button className='ss-bot-file-upload-btn' onClick={() => botUploadFile()}>
                            Upload
                          </button>
                        </div>
                      </div>

                      <div id='bot-statement-type-email' className='ss-bot-statement-type-email'>

                      </div>

                    </div>

                    <div>

                    </div>
                  </div>
                  <div id='user-chat' className='ss-user-chat-detail-setting'>
                    <span>Name </span><input type="text" className='ss-user-chat-detail-setting-user-title' />
                    <div id='' className='ss-user-chat-detail-setting-content'>

                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        {/* <Col >
          <Card>
            <CardBody>
              
            </CardBody>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
};

export default Scenario;
