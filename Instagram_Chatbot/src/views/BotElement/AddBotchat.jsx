import React from 'react'
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import "./../../assets/css/bot/add-bot.css"
function AddBotchat() {
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4>Add Botchat</h4>
              </CardHeader>
              <CardBody>
                <form action="">
                  <div className='add-bot-container'>
                    <div className='bot-infor'>
                      <div className='field-add-bot'>
                        <span className='label-field'>Scenario template</span>
                        <select className="input-field" id='slect-scenario' name="scenario-template">
                          <option value="1">Option 1</option>
                          <option value="2">Option 2</option>
                          <option value="3">Option 3</option>
                        </select>
                      </div>
                      <div className='field-add-bot'>
                        <span className='label-field'>URL of existing form</span>
                        <input type="text" name='URL' className='input-field' />
                      </div>
                      <div className='field-add-bot'>
                        <span className='label-field'>Title</span>
                        <input type="text" name='title' className='input-field' />
                      </div>
                      <div className='field-add-bot'>
                        <span className='label-field'>URL of existing form</span>
                        <input type="text" className='input-field' />
                      </div>
                    </div>
                    <div className='line-height'></div>
                    <div className='bot-custom'>asdasd</div>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div >
    </>
  )
}

export default AddBotchat