import React from 'react';
import './../../../../assets/css/bot/withdrawal-prevention.css';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

function WithdrawalPrevention() {
  const [valueWP, setValueWP] = useState('');
  const [chooseImage, setChooseImage] = useState(false);

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>Withdrawal Prevention</CardHeader>
              <CardBody>
                <div>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    id="invalid"
                    name="withdrawal-prevention"
                    value="invalid"
                    onClick={() => setChooseImage(false)}
                  />
                  <label className="wp-lable" for="invalid">
                    invalid
                  </label>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    id="standard_exit_popup"
                    name="withdrawal-prevention"
                    value="standard_exit_popup"
                    onClick={() => setChooseImage(false)}
                  />
                  <label className="wp-lable" for="standard_exit_popup">
                    Standard exit popup
                  </label>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    id="image_popup"
                    name="withdrawal-prevention"
                    value="image_popup"
                    onClick={() => setChooseImage(true)}
                  />
                  <label className="wp-lable" for="image_popup">
                    image popup
                  </label>
                </div>
                <div style={{ display: chooseImage ? 'block' : 'none' }}>
                  <div className="wp-image-item">
                    <label className="wp-image-label">
                      image URL <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input className="wp-image-input" type="text" defaultValue="" />
                  </div>
                  <div className="wp-image-item">
                    <label className="wp-image-label">
                      Link URL <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input className="wp-image-input" type="text" defaultValue="" />
                  </div>
                </div>
                <Button>Keep</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default WithdrawalPrevention;
