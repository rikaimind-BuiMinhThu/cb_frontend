import React from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import './../../assets/css/account-info.css';



function AccountInformation() {
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className='acc-info__title'>アカウント情報トップ</div>
                <div className='acc-info__heading'>有料プランを開始するには下記の4項目全てを設定する必要があります。内容を確認の上、プランを開始してください。</div>
              </CardHeader>
              <CardBody>
                <div>
                  <div className='acc-info__body'>
                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>基本設定</div>
                          <div className='acc-info__item-complete'>設定完了</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p>設定完了: <span>EC webchat</span></p>
                          <p>企業名：<span>EC</span></p>
                          <p>電話番号：<span>09063305809</span></p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <div></div>
                        <button className='btn btn btn-outline-primary'>編集</button>
                      </div>
                    </div>

                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>プラン選択</div>
                          <div className='acc-info__item-complete'>設定完了</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p>選択中のプラン：<span className='acc-info__item-desc--pro'>Pro</span></p>
                          <p>アクティブボット数：<span>0 / 1</span></p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <div></div>
                        <button className='btn btn-outline-primary'>編集</button>
                      </div>
                    </div>

                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>メール認証</div>
                          <div className='acc-info__item-complete'>設定完了</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p>認証先のメールアドレス：<span>ecchatbot.com</span></p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <div></div>
                        <button className='btn btn-outline-primary' disabled>設定完了</button>
                      </div>
                    </div>

                    <div className="acc-info__item">
                      <div className="acc-info__item-top">
                        <div className="acc-info__item-head">
                          <div>支払い情報</div>
                          <div className='acc-info__item-complete'>入力が必要です</div>
                        </div>
                        <div className="acc-info__item-desc">
                          <p className='acc-info__item-desc-pri'>※プランを開始するためのお支払い情報が設定されておりません。「編集」から設定してください。</p>
                        </div>
                      </div>
                      <div className="acc-info__item-bottom">
                        <button className='btn' disabled>履歴を確認</button>
                        <button className='btn btn-outline-primary'>編集</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='acc-info_footer'>
                  <button className='btn acc-info_footer-btn' disabled>プランを開始する</button>
                  <div className='acc-info__title'>解約する場合はこちらから</div>
                  <button className='btn btn-outline-default'>解約する</button>
                </div>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default AccountInformation