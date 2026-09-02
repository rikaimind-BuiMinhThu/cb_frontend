import React, { useEffect, useState } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { Input } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { message } from 'antd';
import * as utils from '../../../../JS/validate.js';
import { patchWithDrawalPreview } from '../PreviewComponent/Utils';
import 'v2/assets/css/bot/withdrawal-prevention.css';
import { AdminPage, AdminActionButton, AdminFormRow, useAdminHeaderActions } from '../../../../components/AdminShell';

const STATUS = {
  INVALID: 'invalid',
  STANDARD: 'standard_exit_popup',
  IMAGE: 'image_popup',
};

function WithdrawalPrevention() {
  const [botId] = useState(() => Cookies.get('bot_id'));
  const [status, setStatus] = useState(STATUS.INVALID);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!botId) return undefined;
    let cancelled = false;
    api
      .get(`/api/v1/chatbot_settings/withdrawal_preventions/${botId}`)
      .then((res) => {
        if (cancelled) return;
        if (res.data.code === 1) {
          const data = res.data.data || {};
          setStatus(data.withdrawal_prevention_status || STATUS.INVALID);
          setImageUrl(data.withdrawal_prevention_image_url || '');
          setLinkUrl(data.withdrawal_prevention_link_url || '');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      cancelled = true;
    };
  }, [botId]);

  function applyLoaded(data) {
    setStatus(data.withdrawal_prevention_status || STATUS.INVALID);
    setImageUrl(data.withdrawal_prevention_image_url || '');
    setLinkUrl(data.withdrawal_prevention_link_url || '');
  }

  function reload() {
    api
      .get(`/api/v1/chatbot_settings/withdrawal_preventions/${botId}`)
      .then((res) => {
        if (res.data.code === 1) {
          applyLoaded(res.data.data || {});
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function savePayload(payload) {
    if (saving) return;
    setSaving(true);
    patchWithDrawalPreview(botId, payload)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('更新しました。');
          reload();
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setSaving(false));
  }

  function handleKeep() {
    if (saving) return;

    if (status !== STATUS.IMAGE) {
      savePayload({
        withdrawal_prevention: {
          withdrawal_prevention_status: status,
          withdrawal_prevention_image_url: imageUrl,
          withdrawal_prevention_link_url: linkUrl,
        },
      });
      return;
    }

    if (!utils.checkRequired('image_URL', 'errImageURL', '画像URL')) {
      return;
    }

    utils.validateImageURLWithDimension(imageUrl, {
      maxWidth: 800,
      maxHeight: 800,
      callback: (result) => {
        if (result.valid) {
          savePayload({
            withdrawal_prevention: {
              withdrawal_prevention_status: STATUS.IMAGE,
              withdrawal_prevention_image_url: imageUrl,
              withdrawal_prevention_link_url: linkUrl,
            },
          });
        } else {
          const errEl = document.getElementById('errImageURL');
          if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = result.message;
          }
        }
      },
    });
  }

  useAdminHeaderActions(
    <AdminActionButton action="save" loading={saving} onClick={() => handleKeep()} />
  );

  return (
    <>
      <AdminPage card={false}>
        <Row id="screenAll">
          <Col md="12">
            <Card className="admin-page-card">
              <CardBody>
                <div>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    id="invalid"
                    name="withdrawal-prevention"
                    value={STATUS.INVALID}
                    checked={status === STATUS.INVALID}
                    onChange={() => setStatus(STATUS.INVALID)}
                  />
                  <label className="wp-lable" htmlFor="invalid">
                    無効
                  </label>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    id="standard_exit_popup"
                    name="withdrawal-prevention"
                    value={STATUS.STANDARD}
                    checked={status === STATUS.STANDARD}
                    onChange={() => setStatus(STATUS.STANDARD)}
                  />
                  <label className="wp-lable" htmlFor="standard_exit_popup">
                    標準離脱ポップアップ
                  </label>
                  <input
                    className="wp-input-radio"
                    type="radio"
                    id="image_popup"
                    name="withdrawal-prevention"
                    value={STATUS.IMAGE}
                    checked={status === STATUS.IMAGE}
                    onChange={() => setStatus(STATUS.IMAGE)}
                  />
                  <label className="wp-lable" htmlFor="image_popup">
                    像ポップアップ
                  </label>
                </div>
                <div id="display_img_url" style={{ display: status === STATUS.IMAGE ? 'block' : 'none' }}>
                  <AdminFormRow label="画像URL" required htmlFor="image_URL">
                    <Input
                      id="image_URL"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        utils.checkRequired('image_URL', 'errImageURL', '画像URL');
                      }}
                    />
                    <span id="errImageURL" className="admin-form-error"></span>
                  </AdminFormRow>
                  <AdminFormRow label="リンクURL" htmlFor="link_URL">
                    <Input
                      id="link_URL"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
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
