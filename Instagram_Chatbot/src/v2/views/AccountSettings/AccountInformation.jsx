import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import api from 'v2/api/api-management';
import { USER_ID_COOKIE_KEY } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import { ACTION_EDIT, ACTION_LABELS, ADMIN_PATHS, MENU_LABELS } from 'v2/components/AdminShell/constants';
import { getAdminRoutePath } from 'v2/variables/constants';
import {
  COMPANY_NAME_LABEL,
  PHONE_LABEL,
  USERS_PATH,
} from './basicSettingConstants';
import {
  ACCOUNT_INFO_HEADING,
  ACCOUNT_INFO_TITLE,
  ACTIVE_BOT_COUNT_PREFIX,
  ACTIVE_BOT_COUNT_VALUE,
  API_EXPIRED_CODE,
  ASCII_COLON_SPACE,
  AUTH_EMAIL_PREFIX,
  CANCEL_BUTTON_LABEL,
  CANCEL_SECTION_TITLE,
  COL_MD_12,
  EMAIL_AUTH_HEADING,
  FULLWIDTH_COLON,
  HISTORY_BUTTON_LABEL,
  INPUT_REQUIRED_LABEL,
  PAYMENT_INFO_HEADING,
  PAYMENT_INFO_HINT,
  PLAN_PRO_LABEL,
  PLAN_SELECTION_HEADING,
  SCREEN_ALL_ID,
  SELECTED_PLAN_PREFIX,
  SETTING_COMPLETE_LABEL,
  START_PLAN_BUTTON_LABEL,
} from './constants';
import 'v2/views/AccountSettings/styles/account-info.css';

const AccountInformation = () => {
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    const request = { cancelled: false };
    api
      .get(`${USERS_PATH}/${Cookies.get(USER_ID_COOKIE_KEY)}`)
      .then((res) => {
        if (request.cancelled) return;
        setUserDetail(res.data.data);
      })
      .catch((err) => {
        if (request.cancelled) return;
        if (err.response?.data.code === API_EXPIRED_CODE) {
          tokenExpired();
        }
      });
    return () => {
      request.cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="content">
        <Row id={SCREEN_ALL_ID}>
          <Col md={COL_MD_12}>
            <Card>
              <CardHeader>
                <div className="acc-info__title">{ACCOUNT_INFO_TITLE}</div>
                <div className="acc-info__heading">
                  {ACCOUNT_INFO_HEADING}
                </div>
              </CardHeader>
              <CardBody>
                <div>
                  <div className="acc-info__body">
                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>{MENU_LABELS.BASIC_SETTING}</div>
                          <div className="acc-info__item-complete">{SETTING_COMPLETE_LABEL}</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p>
                            {SETTING_COMPLETE_LABEL}{ASCII_COLON_SPACE}<span>{userDetail.full_name}</span>
                          </p>
                          <p>
                            {COMPANY_NAME_LABEL}{FULLWIDTH_COLON}<span>{userDetail.company_name}</span>
                          </p>
                          <p>
                            {PHONE_LABEL}{FULLWIDTH_COLON}<span>{userDetail.phone_number}</span>
                          </p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <div></div>
                        <button
                          className="btn btn btn-outline-primary"
                          onClick={() => {
                            window.location.href = getAdminRoutePath(ADMIN_PATHS.BASIC_SETTING);
                          }}
                        >
                          {ACTION_LABELS[ACTION_EDIT]}
                        </button>
                      </div>
                    </div>

                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>{PLAN_SELECTION_HEADING}</div>
                          <div className="acc-info__item-complete">{SETTING_COMPLETE_LABEL}</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p>
                            {SELECTED_PLAN_PREFIX}{FULLWIDTH_COLON}<span className="acc-info__item-desc--pro">{PLAN_PRO_LABEL}</span>
                          </p>
                          <p>
                            {ACTIVE_BOT_COUNT_PREFIX}{FULLWIDTH_COLON}<span>{ACTIVE_BOT_COUNT_VALUE}</span>
                          </p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <div></div>
                        <button className="btn btn-outline-primary">{ACTION_LABELS[ACTION_EDIT]}</button>
                      </div>
                    </div>

                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>{EMAIL_AUTH_HEADING}</div>
                          <div className="acc-info__item-complete">{SETTING_COMPLETE_LABEL}</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p>
                            {AUTH_EMAIL_PREFIX}{FULLWIDTH_COLON}<span>{userDetail.email}</span>
                          </p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <div></div>
                        <button className="btn btn-outline-primary" disabled>
                          {SETTING_COMPLETE_LABEL}
                        </button>
                      </div>
                    </div>

                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>{PAYMENT_INFO_HEADING}</div>
                          <div className="acc-info__item-complete">{INPUT_REQUIRED_LABEL}</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p className="acc-info__item-desc-pri">
                            {PAYMENT_INFO_HINT}
                          </p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <button className="btn" disabled>
                          {HISTORY_BUTTON_LABEL}
                        </button>
                        <button className="btn btn-outline-primary">{ACTION_LABELS[ACTION_EDIT]}</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="acc-info_footer">
                  <button className="btn acc-info_footer-btn" disabled>
                    {START_PLAN_BUTTON_LABEL}
                  </button>
                  <div className="acc-info__title">{CANCEL_SECTION_TITLE}</div>
                  <button className="btn btn-outline-default">{CANCEL_BUTTON_LABEL}</button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AccountInformation;
