import React from 'react'
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../../../assets/css/bot/email/list-email.css'

function ListEmail() {
  return (
    // <div>ListEmail</div>
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4 style={{ margin: '10px 0' }}>List Email</h4>
                <button className='btn btn-primary'>Add new email</button>
              </CardHeader>
              <CardBody>
                <div className='mail__list'>
                  <div className='mail__list-item'>
                    <p>Test</p>
                    <div className='mail-block'>

                      <table className='mail-table'>
                        <tr>
                          <th>From</th>
                          <td>nghia ne (no-reply@botchan.chat)</td>
                        </tr>
                        <tr>
                          <th>To</th>
                          <td>aaa@gmail.com</td>
                        </tr>
                        <tr>
                          <th>CC</th>
                          <td>aaa@gmail.com <br />aaab@gmail.com</td>
                        </tr>
                        <tr>
                          <th>BCC</th>
                          <td>aaa@gmail.com <br />aaab@gmail.com</td>
                        </tr>
                        <tr>
                          <th>Reply-To</th>
                          <td>aaa@gmail.com</td>
                        </tr>
                      </table>

                      <div className='mail-detail'>
                        <div className='email-detail--subject' type='text' >
                          <span>Subject: </span>test send</div>
                        <div className='mail-detail--text' >
                          <span>Text: </span>
                          <p>send email</p>
                        </div>
                      </div>

                      <div className='mail-actions'>
                        <button className='mail-actions--btn btn btn-default'>Edit</button>
                        <button className='mail-actions--btn btn btn-success'>duplication</button>
                        <button className='mail-actions--btn btn btn-danger'>Delete</button>
                      </div>
                    </div>
                  </div>
                  <div className='mail__list-item'>
                    <p>Test</p>
                    <div className='mail-block'>

                      <table className='mail-table'>
                        <tr>
                          <th>From</th>
                          <td>nghia ne (no-reply@botchan.chat)</td>
                        </tr>
                        <tr>
                          <th>To</th>
                          <td>aaa@gmail.com</td>
                        </tr>
                        <tr>
                          <th>CC</th>
                          <td>aaa@gmail.com <br />aaab@gmail.com</td>
                        </tr>
                        <tr>
                          <th>BCC</th>
                          <td>aaa@gmail.com <br />aaab@gmail.com</td>
                        </tr>
                        <tr>
                          <th>Reply-To</th>
                          <td>aaa@gmail.com</td>
                        </tr>
                      </table>

                      <div className='mail-detail'>
                        <div className='email-detail--subject' type='text' >
                          <span>Subject: </span>test send</div>
                        <div className='mail-detail--text' >
                          <span>Text: </span>
                          <p>send email</p>
                        </div>
                      </div>

                      <div className='mail-actions'>
                        <button className='mail-actions--btn btn btn-default'>Edit</button>
                        <button className='mail-actions--btn btn btn-success'>Duplicate</button>
                        <button className='mail-actions--btn btn btn-danger'>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default ListEmail