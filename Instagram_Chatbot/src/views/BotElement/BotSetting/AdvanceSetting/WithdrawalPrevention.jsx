import React, { useEffect } from 'react';
import './../../../../assets/css/bot/withdrawal-prevention.css';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import api from './../../../../api/api-management';
import { tokenExpired } from 'api/tokenExpired';
import ModalNoti from 'views/Popup/ModalNoti';
import * as utils from './../../../../JS/validate.js';

function WithdrawalPrevention() {
  const [valueWP, setValueWP] = useState('');
  const [chooseImage, setChooseImage] = useState(false);
  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [withDrawal, setWithDrawal] = useState({});
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();

  useEffect(() => {
    const bot_id = Cookies.get('bot_id');
    setBotId(bot_id);
  }, []);

  useEffect(() => {
    reload();
  }, [botId]);

  function reload() {
    api
      .get(`/api/v1/chatbot_settings/withdrawal_preventions/${botId}`)
      .then((res) => {
        console.log(res.data.data);
        if (res.data.code == 1) {
          setWithDrawal(res.data.data);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function handleKeep() {
    let invalid = document.getElementById('invalid');
    let standard = document.getElementById('standard_exit_popup');
    let image = document.getElementById('image_popup');
    let image_URL = document.getElementById('image_URL');
    let link_URL = document.getElementById('link_URL');
    let resWith;
    if (invalid.checked) {
      resWith = {
        withdrawal_prevention: {
          withdrawal_prevention_status: invalid.value,
          withdrawal_prevention_image_url: withDrawal.withdrawal_prevention_image_url,
          withdrawal_prevention_link_url: withDrawal.withdrawal_prevention_link_url,
        },
      };
    } else if (standard.checked) {
      resWith = {
        withdrawal_prevention: {
          withdrawal_prevention_status: standard.value,
          withdrawal_prevention_image_url: withDrawal.withdrawal_prevention_image_url,
          withdrawal_prevention_link_url: withDrawal.withdrawal_prevention_link_url,
        },
      };
    } else {
      if (utils.checkRequired('image_URL', 'errImageURL', 'image URL')) {
        resWith = {
          withdrawal_prevention: {
            withdrawal_prevention_status: image.value,
            withdrawal_prevention_image_url: image_URL.value,
            withdrawal_prevention_link_url: link_URL.value,
          },
        };
      } else {
        utils.checkRequired('image_URL', 'errImageURL', 'image URL');
      }
    }
    console.log(resWith);
    if (resWith) {
      api
        .patch(`/api/v1/chatbot_settings/withdrawal_preventions/${botId}`, resWith)
        .then((res) => {
          console.log(res);
          if (res.data.code == 1) {
            setMsgNoti(`Update successfully!`);
            setIsOpenNoti(true);
            reload();
            setTimeout(() => {
              setIsOpenNoti(false);
              setMsgNoti(``);
            }, 2000);
          }
        })
        .catch((err) => {
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
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
                    defaultValue={`invalid`}
                    defaultChecked={
                      withDrawal.withdrawal_prevention_status === 'invalid' ? true : false
                    }
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
                    defaultValue={`standard_exit_popup`}
                    defaultChecked={
                      withDrawal.withdrawal_prevention_status == 'standard_exit_popup'
                        ? true
                        : false
                    }
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
                    defaultChecked={
                      withDrawal.withdrawal_prevention_status == 'image_popup' ? true : false
                    }
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
                    <input
                      id="image_URL"
                      className="wp-image-input"
                      type="text"
                      defaultValue={
                        withDrawal.withdrawal_prevention_image_url
                          ? withDrawal.withdrawal_prevention_image_url
                          : null
                      }
                      onChange={() => utils.checkRequired('image_URL', 'errImageURL', 'image URL')}
                    />
                    <span id="errImageURL" className="wp-image-err"></span>
                  </div>
                  <div className="wp-image-item">
                    <label className="wp-image-label">Link URL</label>
                    <input
                      id="link_URL"
                      className="wp-image-input"
                      type="text"
                      defaultValue={
                        withDrawal.withdrawal_prevention_link_url
                          ? withDrawal.withdrawal_prevention_link_url
                          : null
                      }
                    />
                  </div>
                </div>
                <Button onClick={() => handleKeep()}>Keep</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
      </div>
    </>
  );
}

export default WithdrawalPrevention;
