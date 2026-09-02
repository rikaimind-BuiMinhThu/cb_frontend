import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { API_SUCCESS_CODE, BOT_ID_COOKIE_KEY } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminActionButton, AdminFormRow, useAdminHeaderActions } from 'v2/components/AdminShell';
import {
  getRequiredError,
  validateImageURLWithDimension,
  IMAGE_MAX_HEIGHT,
  IMAGE_MAX_WIDTH,
} from 'v2/utils/formValidate';
import { patchWithDrawalPreview } from 'v2/views/BotElement/BotSetting/PreviewComponent/Utils';
import {
  EMPTY_VALUE,
  IMAGE_POPUP_LABEL,
  IMAGE_URL_LABEL,
  INVALID_LABEL,
  LINK_URL_LABEL,
  STANDARD_POPUP_LABEL,
  STATUS,
  UPDATE_SUCCESS_MESSAGE,
  WITHDRAWAL_PREVENTION_PATH_PREFIX,
  WP_IMAGE_FIELDS_HIDDEN,
  WP_IMAGE_FIELDS_VISIBLE,
} from './withdrawalPreventionConstants';
import 'v2/assets/css/bot/withdrawal-prevention.css';

const WithdrawalPrevention = () => {
  const [botId] = useState(() => Cookies.get(BOT_ID_COOKIE_KEY));
  const [status, setStatus] = useState(STATUS.INVALID);
  const [imageUrl, setImageUrl] = useState(EMPTY_VALUE);
  const [linkUrl, setLinkUrl] = useState(EMPTY_VALUE);
  const [imageUrlError, setImageUrlError] = useState(EMPTY_VALUE);
  const [saving, setSaving] = useState(false);

  const applyLoaded = (data) => {
    setStatus(data.withdrawal_prevention_status || STATUS.INVALID);
    setImageUrl(data.withdrawal_prevention_image_url || EMPTY_VALUE);
    setLinkUrl(data.withdrawal_prevention_link_url || EMPTY_VALUE);
  };

  useEffect(() => {
    if (!botId) return undefined;
    const request = { cancelled: false };
    api
      .get(`${WITHDRAWAL_PREVENTION_PATH_PREFIX}/${botId}`)
      .then((res) => {
        if (request.cancelled) return;
        if (res.data.code === API_SUCCESS_CODE) {
          applyLoaded(res.data.data || {});
        }
      })
      .catch((err) => {
        if (request.cancelled) return;
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      request.cancelled = true;
    };
  }, [botId]);

  const reload = () => {
    api
      .get(`${WITHDRAWAL_PREVENTION_PATH_PREFIX}/${botId}`)
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          applyLoaded(res.data.data || {});
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  const savePayload = (payload) => {
    if (saving) return;
    setSaving(true);
    patchWithDrawalPreview(botId, payload)
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          message.success(UPDATE_SUCCESS_MESSAGE);
          reload();
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setSaving(false));
  };

  const handleKeep = () => {
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

    const requiredError = getRequiredError(imageUrl, IMAGE_URL_LABEL);
    if (requiredError) {
      setImageUrlError(requiredError);
      return;
    }

    validateImageURLWithDimension(imageUrl, {
      maxWidth: IMAGE_MAX_WIDTH,
      maxHeight: IMAGE_MAX_HEIGHT,
      callback: (result) => {
        if (result.valid) {
          setImageUrlError(EMPTY_VALUE);
          savePayload({
            withdrawal_prevention: {
              withdrawal_prevention_status: STATUS.IMAGE,
              withdrawal_prevention_image_url: imageUrl,
              withdrawal_prevention_link_url: linkUrl,
            },
          });
          return;
        }
        setImageUrlError(result.message);
      },
    });
  };

  useAdminHeaderActions(
    <AdminActionButton action="save" loading={saving} onClick={handleKeep} />
  );

  const imageFieldsClassName = status === STATUS.IMAGE
    ? WP_IMAGE_FIELDS_VISIBLE
    : WP_IMAGE_FIELDS_HIDDEN;

  return (
    <AdminPage>
      <div className="admin-page-body">
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
            {INVALID_LABEL}
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
            {STANDARD_POPUP_LABEL}
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
            {IMAGE_POPUP_LABEL}
          </label>
        </div>
        <div className={imageFieldsClassName}>
          <AdminFormRow label={IMAGE_URL_LABEL} required htmlFor="image_URL" error={imageUrlError}>
            <Input
              id="image_URL"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImageUrlError(getRequiredError(e.target.value, IMAGE_URL_LABEL));
              }}
            />
          </AdminFormRow>
          <AdminFormRow label={LINK_URL_LABEL} htmlFor="link_URL">
            <Input
              id="link_URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </AdminFormRow>
        </div>
      </div>
    </AdminPage>
  );
};

export default WithdrawalPrevention;
