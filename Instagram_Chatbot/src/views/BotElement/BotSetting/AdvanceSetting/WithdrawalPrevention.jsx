import React from 'react';
import './../../../../assets/css/bot/withdrawal-prevention.css';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

function WithdrawalPrevention() {
  const [valueWP, setValueWP] = useState('');
  const [chooseImage, setChooseImage] = useState(false);

  function handleKeep() {
    let invalid = document.getElementById('invalid');
    let standard = document.getElementById('standard_exit_popup');
    let image = document.getElementById('image_popup');
    let image_URL = document.getElementById('image_URL');
    let link_URL = document.getElementById('link_URL');
    let res;
    if (invalid.checked) {
      res = invalid.value;
    } else if (standard.checked) {
      res = standard.value;
    } else {
      res = [image_URL.value, link_URL.value];
    }
    console.log(res);
  }

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
                    defaultValue={0}
                    onClick={() => setChooseImage(false)}
                  />
                  <label className="wp-lable" for="invalid">
                    invalid
                  </label>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    defaultChecked
                    id="standard_exit_popup"
                    name="withdrawal-prevention"
                    defaultValue={1}
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
                    <input id="image_URL" className="wp-image-input" type="text" defaultValue={1} />
                  </div>
                  <div className="wp-image-item">
                    <label className="wp-image-label">Link URL</label>
                    <input id="link_URL" className="wp-image-input" type="text" defaultValue={2} />
                  </div>
                </div>
                <Button onClick={() => handleKeep()}>Keep</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default WithdrawalPrevention;
