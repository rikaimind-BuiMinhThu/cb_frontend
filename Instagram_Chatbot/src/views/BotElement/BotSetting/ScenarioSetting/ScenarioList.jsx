import '../../../../assets/css/bot/scenario/scenario-list.css';
import { Col, Row, Card, CardBody, CardHeader, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ModalShort from '../../../Popup/ModalShort';

let data = [
  {
    id: '1',
    name: 'Scenario 1',
    is_active: true,
    last_updated: '2022-08-12',
  },
  {
    id: '1',
    name: 'Scenario 1',
    is_active: false,
    last_updated: '2022-09-12',
  },
];

function ScenarioList() {
  // states
  const [isOpenCreateScenario, setIsOpenCreateScenario] = useState(false);
  const [scenarioSelectId, setScenarioSelectId] = useState('');
  const [isOpenDeleteScenario, setIsOpenDeleteScenario] = useState(false);

  // side effects
  useEffect(() => {
    document.title = 'Scenario List';
    window.scrollTo(0, 0);
  }, []);

  // create scenario
  const createScenario = () => {};

  // handle duplication scenario
  const handleDuplicationScenario = (id) => {};

  // handle delete scenario
  const handleDeleteScenario = (id) => {
    setIsOpenDeleteScenario(true);
    setScenarioSelectId(id);
  };

  // handle delete scenario
  const deleteScenario = () => {};

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <div className="sl-wrapper">
            <Card>
              <CardHeader>
                <div className="sl-header">
                  <Button
                    className="sl-btn-create-scenario"
                    onClick={() => setIsOpenCreateScenario(true)}
                  >
                    Create Scenario
                  </Button>
                  <Button className="sl-btn-save-scenario">Save</Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="sl-body">
                  <ul className="sl-items">
                    {data.map((scenario) => (
                      <li key={scenario.id} className="sl-item-wrapper">
                        <div className="sl-item">
                          <div className="sl-item-left">
                            <div className="sl-radio-active">
                              <input
                                type="radio"
                                name="sl-radio-active"
                                id="sl-active"
                                checked={scenario.is_active}
                              />
                            </div>
                            <div className="sl-info">
                              <div className="sl-info-top">
                                <div className={`sl-status ${scenario.is_active && 'active'}`}>
                                  <span>{scenario.is_active ? 'In operation' : 'Not used'}</span>
                                </div>
                                <div className="sl-last-update">
                                  <span>last updated: {scenario.last_updated}</span>
                                </div>
                              </div>
                              <div className="sl-name sl-info-bottom">
                                <span>{scenario.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="sl-item-right">
                            <Link to={`/admin/scenario-setting`}>
                              <Button className="sl-btn-action-edit">Edit</Button>
                            </Link>
                            <Button className="sl-btn-action-preview">Preview</Button>
                            <Button
                              className="sl-btn-action-duplication"
                              onClick={() => handleDuplicationScenario(scenario.id)}
                            >
                              Duplication
                            </Button>
                            {!scenario.is_active && (
                              <Button
                                className="sl-btn-action-delete"
                                onClick={() => handleDeleteScenario(scenario.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
      <ModalShort open={isOpenCreateScenario} onClose={() => setIsOpenCreateScenario(false)}>
        <div className="sl-popup-create-scenario-wrapper">
          <h4>Create Scenario</h4>
          <div className="sl-popup-create-scenario-input-wrapper">
            <span>Scenario name</span>
            <input
              type="text"
              name="sl-popup-create-scenario-input"
              id="sl-popup-create-scenario-input"
            />
          </div>
          <div className="sl-popup-create-scenario-note-wrapper">
            <span>* Any name can be given to the scenario.</span>
          </div>
          <div className="sl-popup-create-scenario-btn-wrapper">
            <Button
              className="sl-popup-create-scenario-create-btn"
              onClick={() => createScenario()}
            >
              Create
            </Button>
            <Button
              className="sl-popup-create-scenario-cancel-btn"
              onClick={() => setIsOpenCreateScenario(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </ModalShort>
      <ModalShort open={isOpenDeleteScenario} onClose={() => setIsOpenDeleteScenario(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <h4>Confirm delete scenario ?</h4>
          <Button onClick={() => deleteScenario()}>はい</Button>
          <Button onClick={() => setIsOpenDeleteScenario(false)}>いいえ</Button>
        </div>
      </ModalShort>
    </div>
  );
}

export default ScenarioList;
