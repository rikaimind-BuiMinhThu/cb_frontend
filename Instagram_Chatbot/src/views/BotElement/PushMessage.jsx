import React from 'react'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
function PushMessage() {
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <h4>Push message</h4>
              </CardHeader>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default PushMessage