import React, { useEffect, useState } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { Input } from 'antd';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { message } from 'antd';
import * as utils from '../../../../JS/validate.js';
import { patchWithDrawalPreview } from '../PreviewComponent/Utils';
import 'v2/assets/css/bot/withdrawal-prevention.css';
import { AdminPage, AdminActionButton, AdminFormRow, useAdminHeaderActions } from '../../../../components/AdminShell';

function WithdrawalPrevention() {
  const [valueWP, setValueWP] = useState('');
  const [chooseImage, setChooseImage] = useState(false);
  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [withDrawal, setWithDrawal] = useState({});
  const [checkedChoose, setCheckedChoose] = useState({
    invalid: false,
    standard: false,
    image: false
  })
  // useEffect(() => {
  //   const bot_id = Cookies.get('bot_id');
  //   setBotId(bot_id);
  // }, []);

  useEffect(() => {
    api
      .get(`/api/v1/chatbot_settings/withdrawal_preventions/${botId}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.code == 1) {
          // if(res.data.data.withdrawal_prevention_status == 'invalid'){
          //   setCheckedChoose({invalid: true,standard: false,image: false})
          // }else if(res.data.data.withdrawal_prevention_status == 'image_popup'){
          //   setCheckedChoose({invalid: false,standard: false,image: true})
          // }else{
          //   setCheckedChoose({invalid: false,standard: true,image: false})
          // }
          setWithDrawal(res.data.data);
        }


      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function reload() {
    api
      .get(`/api/v1/chatbot_settings/withdrawal_preventions/${botId}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.code == 1) {
          setWithDrawal(res.data.data);
        }
        if (res.data.data.withdrawal_prevention_status == 'invalid') {
          setCheckedChoose({ invalid: true, standard: false, image: false })
        } else if (res.data.data.withdrawal_prevention_status == 'image_popup') {
          setCheckedChoose({ invalid: false, standard: false, image: true })
        } else {
          setCheckedChoose({ invalid: false, standard: true, image: false })
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
      if (utils.checkRequired('image_URL', 'errImageURL', '画像URL')) {
        // Verify image format and size
        utils.validateImageURLWithDimension(image_URL.value, {
          maxWidth: 800,
          maxHeight: 800,
          callback: (result) => {
            if (result.valid) {
              resWith = {
                withdrawal_prevention: {
                withdrawal_prevention_status: image.value,
                withdrawal_prevention_image_url: image_URL.value,
                withdrawal_prevention_link_url: link_URL.value,
              },
            };
            
            // Send request if data is valid
              if (resWith) {
                patchWithDrawalPreview(botId, resWith)
                  .then((res) => {
                    console.log(res);
                    if (res.data.code == 1) {
                      message.success('更新しました。');
                      reload();
                    }
                  })
                  .catch((err) => {
                    if (err.response?.data.code === 0) {
                      tokenExpired();
                    }
                  });
                }
            } else {
                document.getElementById('errImageURL').style.display = 'block';
                document.getElementById('errImageURL').innerHTML = result.message;
            }
          }
        });
      } else {
        utils.checkRequired('image_URL', 'errImageURL', '画像URL');
      }
    }
    if (resWith) {
      patchWithDrawalPreview(botId, resWith)
        .then((res) => {
          console.log(res);
          if (res.data.code == 1) {
            message.success('更新しました。');
            reload();
          }
        })
        .catch((err) => {
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    }
  }

  function checkRadioChecked() {
    if (withDrawal.withdrawal_prevention_status == 'invalid') {
      document.getElementById('invalid').checked = true
      document.getElementById('standard_exit_popup').checked = false
      document.getElementById('image_popup').checked = false
    } else if (withDrawal.withdrawal_prevention_status == 'standard_exit_popup') {
      document.getElementById('invalid').checked = false
      document.getElementById('standard_exit_popup').checked = true
      document.getElementById('image_popup').checked = false
    } else if (withDrawal.withdrawal_prevention_status == 'image_popup') {
      document.getElementById('invalid').checked = false
      document.getElementById('standard_exit_popup').checked = false
      document.getElementById('image_popup').checked = true
    }
  }

  function setInvalid() {
    document.getElementById('display_img_url').style.display = 'none'
    document.getElementById('invalid').checked = true
  }
  function setStandard() {
    document.getElementById('display_img_url').style.display = 'none'
    document.getElementById('standard_exit_popup').checked = true
  }
  function setImage() {
    document.getElementById('display_img_url').style.display = 'block'
    document.getElementById('image_popup').checked = true
  }

  useAdminHeaderActions(
    <AdminActionButton action="save" onClick={() => handleKeep()} />
  );

  return (
    <>
      <AdminPage card={false}>
        <Row id="screenAll">
          <Col md="12">
            <Card className="admin-page-card">
              <CardBody>
                <div onLoad={checkRadioChecked()}>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    id="invalid"
                    name="withdrawal-prevention"
                    defaultValue={`invalid`}
                    // defaultChecked={checkedChoose.invalid}
                    onClick={() => setInvalid()}

                  />
                  <label className="wp-lable" htmlFor="invalid">
                    無効
                  </label>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    id="standard_exit_popup"
                    name="withdrawal-prevention"
                    defaultValue={`standard_exit_popup`}
                    // defaultChecked={checkedChoose.standard}
                    onClick={() => setStandard()}
                  />
                  <label className="wp-lable" htmlFor="standard_exit_popup">
                    標準離脱ポップアップ
                  </label>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    id="image_popup"
                    name="withdrawal-prevention"
                    // defaultChecked={checkedChoose.image}
                    defaultValue={'image_popup'}
                    onClick={() => setImage()}
                  />
                  <label className="wp-lable" htmlFor="image_popup">
                    像ポップアップ
                  </label>
                </div>
                <div id='display_img_url' style={{ display: withDrawal.withdrawal_prevention_status == 'image_popup' ? 'block' : 'none' }}>
                  <AdminFormRow label="画像URL" required htmlFor="image_URL">
                    <Input
                      id="image_URL"
                      defaultValue={
                        withDrawal?.withdrawal_prevention_image_url
                          ? withDrawal?.withdrawal_prevention_image_url
                          : null
                      }
                      onChange={() => utils.checkRequired('image_URL', 'errImageURL', '画像URL')}
                    />
                    <span id="errImageURL" className="admin-form-error"></span>
                  </AdminFormRow>
                  <AdminFormRow label="リンクURL" htmlFor="link_URL">
                    <Input
                      id="link_URL"
                      defaultValue={
                        withDrawal?.withdrawal_prevention_link_url
                          ? withDrawal?.withdrawal_prevention_link_url
                          : null
                      }
                    />
                  </AdminFormRow>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </AdminPage>
    </>
  );
}

export default WithdrawalPrevention;
