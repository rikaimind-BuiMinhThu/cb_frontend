import React from 'react'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import '../../assets/css/bot/push-message.css'
function PushMessage() {

  function pushMessageList() {

  }

  function deliveryHistory() {

  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4>Push message</h4>
              </CardHeader>
              <CardBody>
                <div className='payment-management-option'>
                  <div id='payment_management_order_his' style={{ color: '#43b8af' }}
                    className='payment-management-option-item' onClick={() => pushMessageList()}>PUSH MESSAGE LIST</div>
                  <div id='payment_management_setting' className='payment-management-option-item'
                    onClick={() => deliveryHistory()}>DELIVERY HISTORY</div>
                </div>

                <Table style={{ textAlign: 'center', tableLayout: 'fixed', overflow: 'hidden' }}>
                  <thead className="text-primary">
                    <tr>
                      <th style={{ width: "5%" }}>No</th>
                      <th style={{ width: "30%" }}>Push message name</th>
                      <th style={{ width: "15%" }}>Sending method</th>
                      <th style={{ width: "20%" }}>Start date and time</th>
                      <th style={{ width: "10%" }}>Situation</th>
                      <th style={{ width: "150px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default PushMessage