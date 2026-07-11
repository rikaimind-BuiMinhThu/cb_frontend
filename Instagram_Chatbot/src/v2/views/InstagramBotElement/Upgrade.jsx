import React from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

function Upgrade() {
  return (
    <>
      <div className="content">
        <Row>
          <Col className="ml-auto mr-auto" md="8">
            <Card className="card-upgrade">
              <CardHeader className="text-center">
                <CardTitle tag="h4">Paper Dashboard PRO</CardTitle>
                <p className="card-category">
                  より多くのコンポーネントをお探しですか？Paper Dashboard PROのプレミアム版をご確認ください。
                </p>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th />
                      <th className="text-center">無料</th>
                      <th className="text-center">PRO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>コンポーネント</td>
                      <td className="text-center">16</td>
                      <td className="text-center">160</td>
                    </tr>
                    <tr>
                      <td>プラグイン</td>
                      <td className="text-center">4</td>
                      <td className="text-center">13</td>
                    </tr>
                    <tr>
                      <td>サンプルページ</td>
                      <td className="text-center">7</td>
                      <td className="text-center">27</td>
                    </tr>
                    <tr>
                      <td>ログイン・登録・料金・ロックページ</td>
                      <td className="text-center">
                        <i className="nc-icon nc-simple-remove text-danger" />
                      </td>
                      <td className="text-center">
                        <i className="nc-icon nc-check-2 text-success" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        DataTables、VectorMap、SweetAlert、Wizard、
                        jQueryValidation、FullCalendar など
                      </td>
                      <td className="text-center">
                        <i className="nc-icon nc-simple-remove text-danger" />
                      </td>
                      <td className="text-center">
                        <i className="nc-icon nc-check-2 text-success" />
                      </td>
                    </tr>
                    <tr>
                      <td>ミニサイドバー</td>
                      <td className="text-center">
                        <i className="nc-icon nc-simple-remove text-danger" />
                      </td>
                      <td className="text-center">
                        <i className="nc-icon nc-check-2 text-success" />
                      </td>
                    </tr>
                    <tr>
                      <td>プレミアムサポート</td>
                      <td className="text-center">
                        <i className="nc-icon nc-simple-remove text-danger" />
                      </td>
                      <td className="text-center">
                        <i className="nc-icon nc-check-2 text-success" />
                      </td>
                    </tr>
                    <tr>
                      <td />
                      <td className="text-center">無料</td>
                      <td className="text-center">$49〜</td>
                    </tr>
                    <tr>
                      <td className="text-center" />
                      <td className="text-center">
                        <Button
                          className="btn-round disabled"
                          color="default"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          現在のバージョン
                        </Button>
                      </td>
                      <td className="text-center">
                        <Button
                          className="btn-round"
                          color="primary"
                          href="https://www.creative-tim.com/product/paper-dashboard-2-pro?ref=pd-free-upgrade-live"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          PROにアップグレード
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Upgrade;
