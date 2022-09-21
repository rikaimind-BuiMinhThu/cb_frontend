import React from 'react'
import { Button } from 'react-bootstrap';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import "./../../assets/css/bot/bot-list.css"
import Cookies from 'js-cookie';
function BotManagement() {
  function openBotSetting(){
    Cookies.set('bot_type', "bot");
    window.location.href= '/admin/scenario-setting'
  }
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className='div-add-bot'>
                  <button className="btn-add-bot" onClick={()=>{window.location.href = '/admin/add-bot-management'}}>Add bot</button>
                </div>
              </CardHeader>
              <CardBody>
                <Table
                  style={{
                    textAlign: 'center',
                    tableLayout: 'fixed',
                    overflow: 'hidden',
                    border: '1px solid'
                  }}
                >
                  <thead className="text-primary">  
                    <tr>
                      <th style={{width:"10%", border: '1px solid #7186a0'}}>ID</th>
                      <th style={{width:"20%", border: '1px solid #7186a0'}}>Bot name</th>
                      <th style={{width:"15%", border: '1px solid #7186a0'}}>Status</th>
                      <th style={{width:"20%", border: '1px solid #7186a0'}}>Owner name</th>
                      <th style={{width:"15%", border: '1px solid #7186a0'}}>My authority</th>
                      <th style={{ width: '250px', minWidth: '250px',border: '1px solid #7186a0' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='border-table-bot'>1</td>
                      <td className='border-table-bot'>Bot Hien no 50k</td>
                      <td className='border-table-bot'>Active</td>
                      <td className='border-table-bot'>Hoang Cong Nghia</td>
                      <td className='border-table-bot'>Owner</td>
                      <td className='border-table-bot action-table-bot'>
                        <div style={{display:"flex", textAlign:"center", width:"100%"}}>
                          <button className='btn-edit-bot' onClick={() => openBotSetting()}>Edit</button>
                          <button className='btn-demo-bot'>Demo</button>
                          <button className='btn-stop-bot'>Stop</button>
                          <button className='btn-delete-bot'>Delete</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>

                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default BotManagement