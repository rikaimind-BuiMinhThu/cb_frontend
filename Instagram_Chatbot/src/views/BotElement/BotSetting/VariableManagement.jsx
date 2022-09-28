import React from 'react'
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../../assets/css/bot/variable.css';
import { MDBIcon } from 'mdbreact';

function VariableManagement() {
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <button className='btn btn-primary'>USER-DEFINED VARIABLE</button>
                <button className='btn btn-primary'>SYSTEM VARIABLES</button>
                <p className='variable-note'>* A variable that stores the user's input contents. It can be assigned and referenced in the scenario.</p>
              </CardHeader>
              <CardBody>
                <div className=''>
                  <div className='form__head'>
                    <label>Variable name</label>
                    <label>Default value</label>
                  </div>
                  <div className='form__variable'>
                    <div className='form__variable-group'>
                      <input className='form__variable-name' defaultValue='お名前' />
                      <input className='form__variable-value' defaultValue='111' />
                      <div className='form__variable-delete'>
                        <MDBIcon
                          far
                          icon="times-circle" style={{ fontSize: '20px' }}
                        ></MDBIcon>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className='variable-plus'>
                  <MDBIcon fas icon="plus-circle" />
                </div> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default VariableManagement