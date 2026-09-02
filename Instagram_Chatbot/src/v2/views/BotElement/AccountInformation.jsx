import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../assets/css/account-info.css';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';

function AccountInformation() {
  const [userIdEC, setUserIdEC] = useState();
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    setUserIdEC(Cookies.get('user_id'));
  }, []);

  useEffect(() => {
    api
      .get(`/api/v1/managements/users/${Cookies.get('user_id')}`)
      .then((res) => {
        console.log(res.data.data);
        setUserDetail(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired()
        }
      });
  }, []);
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="acc-info__title">アカウント情報トップ</div>
                <div className="acc-info__heading">
                  有料プランを開始するには下記の4項目全てを設定する必要があります。内容を確認の上、プランを開始してください。
                </div>
              </CardHeader>
              <CardBody>
                <div>
                  <div className="acc-info__body">
                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>基本設定</div>
                          <div className="acc-info__item-complete">設定完了</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p>
                            設定完了: <span>{userDetail.full_name}</span>
                          </p>
                          <p>
                            企業名：<span>{userDetail.company_name}</span>
                          </p>
                          <p>
                            電話番号：<span>{userDetail.phone_number}</span>
                          </p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <div></div>
                        <button
                          className="btn btn btn-outline-primary"
                          onClick={() => {
                            window.location.href = '/v2/admin/basic-setting';
                          }}
                        >
                          編集
                        </button>
                      </div>
                    </div>

                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>プラン選択</div>
                          <div className="acc-info__item-complete">設定完了</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p>
                            選択中のプラン：<span className="acc-info__item-desc--pro">Pro</span>
                          </p>
                          <p>
                            アクティブボット数：<span>0 / 1</span>
                          </p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <div></div>
                        <button className="btn btn-outline-primary">編集</button>
                      </div>
                    </div>

                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>メール認証</div>
                          <div className="acc-info__item-complete">設定完了</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p>
                            認証先のメールアドレス：<span>{userDetail.email}</span>
                          </p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <div></div>
                        <button className="btn btn-outline-primary" disabled>
                          設定完了
                        </button>
                      </div>
                    </div>

                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>支払い情報</div>
                          <div className="acc-info__item-complete">入力が必要です</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p className="acc-info__item-desc-pri">
                            ※プランを開始するためのお支払い情報が設定されておりません。「編集」から設定してください。
                          </p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <button className="btn" disabled>
                          履歴を確認
                        </button>
                        <button className="btn btn-outline-primary">編集</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="acc-info_footer">
                  <button className="btn acc-info_footer-btn" disabled>
                    プランを開始する
                  </button>
                  <div className="acc-info__title">解約する場合はこちらから</div>
                  <button className="btn btn-outline-default">解約する</button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AccountInformation;
