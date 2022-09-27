import '../../../../assets/css/bot/scenario/scenario-list.css';
import { Col, Row, Card, CardBody, CardHeader, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function ScenarioList() {
  // states

  // side effects
  useEffect(() => {
    document.title = 'Scenario List';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <div className="sl-wrapper">
            <Card>
              <CardHeader>
                <div className="sl-header">
                  <Button className="sl-btn-create-scenario">Create Scenario</Button>
                  <Button className="sl-btn-save-scenario">Save</Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="sl-body">
                  <ul className="sl-items">
                    <li className="sl-item-wrapper">
                      <div className="sl-item">
                        <div className="sl-item-left">
                          <div className="sl-radio-active">
                            <input type="radio" name="sl-radio-active" id="sl-active" checked />
                          </div>
                          <div className="sl-info">
                            <div className="sl-info-top">
                              <div className="sl-status active">
                                <span>In operation</span>
                              </div>
                              <div className="sl-last-update">
                                <span>last updated: 2022/09/26</span>
                              </div>
                            </div>
                            <div className="sl-name sl-info-bottom">
                              <span>Scenario 1</span>
                            </div>
                          </div>
                        </div>
                        <div className="sl-item-right">
                          <Link to={`/admin/scenario-setting`}>
                            <Button className="sl-btn-action-edit">Edit</Button>
                          </Link>
                          <Button className="sl-btn-action-preview">Preview</Button>
                          <Button className="sl-btn-action-duplication">Duplication</Button>
                          <Button className="sl-btn-action-delete">Delete</Button>
                        </div>
                      </div>
                    </li>
                    <li className="sl-item-wrapper">
                      <div className="sl-item">
                        <div className="sl-item-left">
                          <div className="sl-radio-active">
                            <input type="radio" name="sl-radio-active" id="sl-active" />
                          </div>
                          <div className="sl-info">
                            <div className="sl-info-top">
                              <div className="sl-status">
                                <span>Not used</span>
                              </div>
                              <div className="sl-last-update">
                                <span>last updated: 2022/09/26</span>
                              </div>
                            </div>
                            <div className="sl-name sl-info-bottom">
                              <span>Scenario 1</span>
                            </div>
                          </div>
                        </div>
                        <div className="sl-item-right">
                          <Link to={`/admin/scenario-setting`}>
                            <Button className="sl-btn-action-edit">Edit</Button>
                          </Link>
                          <Button className="sl-btn-action-preview">Preview</Button>
                          <Button className="sl-btn-action-duplication">Duplication</Button>
                          <Button className="sl-btn-action-delete">Delete</Button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ScenarioList;
