import '../../../../assets/css/bot/scenario/scenario-list.css';
import { Col, Row, Card, CardBody, CardHeader, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ModalShort from '../../../Popup/ModalShort';
import api from '../../../../api/api-management';
import ModalNoti from '../../../../views/Popup/ModalNoti';
import Cookies from 'js-cookie';
import moment from 'moment';
import Pagination from '@material-ui/lab/Pagination';
import Preview from '../Preview';

let data = [
    {
        id: '1',
        name: 'Scenario 1',
        is_active: true,
        last_updated: '2022-08-12',
    },
    {
        id: '2',
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
    const [botId, setBotId] = useState();
    const [isOpenNoti, setIsOpenNoti] = useState(false);
    const [messageNoti, setMessageNoti] = useState('');
    const [listScenario, setListScenario] = useState([]);
    const [scenarioSelected, setScenarioSelected] = useState(false);
    const [scenarioSelectedClone, setScenarioSelectedClone] = useState(false);

    const [isOpenPreview, setIsOpenPreview] = useState(false);
    var [pageIndex, setPageIndex] = useState(1);
    var [totalPage, setTotalPage] = useState();
    var [page, setPage] = useState(1);

    const [scenarioId, setScenarioId] = useState('');

    useEffect(() => {
        setBotId(Cookies.get('bot_id'));
    }, [])

    // side effects
    useEffect(() => {
        document.title = 'Scenario List';
        window.scrollTo(0, 0);
    }, []);

    //Get list scenario
    useEffect(() => {
        getListScenario(1);
    }, []);

    const handleOpenPreview = (isOpen) => {
        if (isOpen) {
            document.getElementById('sp-container').style.height = "610px";
            document.getElementById('sp-header').style.position = "static";
            document.getElementById('sp-header').style.borderBottomLeftRadius = "0px";
            document.getElementById('sp-header').style.borderBottomRightRadius = "0px";
            document.getElementById('sp-process-bar').style.display = "block";
            document.getElementById('sp-body').style.display = "block";
        } else {
            document.getElementById('sp-container').style.height = "0px";
            document.getElementById('sp-process-bar').style.display = "none";
            document.getElementById('sp-body').style.display = "none";
            document.getElementById('sp-header').style.borderBottomLeftRadius = "25px";
            document.getElementById('sp-header').style.borderBottomRightRadius = "25px";
            document.getElementById('sp-header').style.position = "absolute";
            document.getElementById('sp-header').style.bottom = "13px";
        }
        setIsOpenPreview(!isOpenPreview);
    }

    const onClickPreview = (scenarioId) => {
        Cookies.set('scenario_id', scenarioId);
        setScenarioId(scenarioId);
        setIsOpenPreview(true);
    }

    const getListScenario = (pgIndex) => {
        api.get(`/api/v1/managements/chatbots/${Cookies.get('bot_id')}/scenarios?page=${pgIndex}`).then((res) => {
            console.log(res.data);
            let scenarios = [...res?.data?.data];
            let totalPage = Math.ceil(res?.data?.total / 25);
            setTotalPage(totalPage);
            setScenarioSelected(res.data.scenario_selected);
            setScenarioSelectedClone(res.data.scenario_selected);
            setListScenario(scenarios);
        }).catch((error) => { console.error(error) });
    }

    function checkInputScenarioName(scenarioName) {
        // console.log(scenarioName, 'check input name');
        if (scenarioName.length === 0) {
            // setErrorMessage('Scenario name can"t be empty');
            document.getElementById('sl-err-create-scenario').innerHTML = 'Scenario name can"t be empty';
            document.getElementById('sl-err-create-scenario').style.display = 'block';
            return false;
        } else if (scenarioName.length > 50) {
            // setErrorMessage('Scenario name can"t greater than 50 charecter');
            document.getElementById('sl-err-create-scenario').innerHTML = 'Scenario name can"t greater than 50 charecter';
            document.getElementById('sl-err-create-scenario').style.display = 'block';
            return false;
        } else {
            document.getElementById('sl-err-create-scenario').style.display = 'none';
            return true;
        }
    }

    // create scenario
    const createScenario = () => {
        let inputName = document.getElementById('sl-popup-create-scenario-input').value;

        if (checkInputScenarioName(inputName)) {
            console.log('call api');
            let add = { scenario: { name: inputName } }
            api.post(`/api/v1/managements/chatbots/${botId}/scenarios`, add).then(res => {
                setIsOpenNoti(true);
                console.log(res);
                if (res.data.code === 1) {
                    setMessageNoti('Add scenario successfully');
                    Cookies.set('scenario_id', res.data.data.id)
                    setTimeout(() => {
                        document.getElementById('to_scenario').click()
                    }, 1500)
                } else if (res.data.code === 2) {
                    setMessageNoti(res.data.message);
                }
                getListScenario(pageIndex);
                setTimeout(() => {
                    setIsOpenNoti(false);
                    setMessageNoti('');
                }, 2000);
                setIsOpenCreateScenario(false);
            }).catch(err => {
                console.log(err);
            });
        }

    };

    // handle duplication scenario
    const handleDuplicationScenario = (id) => {
        api.post(`/api/v1/managements/chatbots/${botId}/scenarios/${id}/duplicate`).then(res => {
            console.log(res.data);
            setIsOpenNoti(true);
            if (res.data.code === 1) {
                setMessageNoti('Duplicate scenario successfully');
            } else if (res.data.code === 2) {
                setMessageNoti(res.data.message);
            }
            setTimeout(() => {
                setIsOpenNoti(false);
                setMessageNoti('');
            }, 2000);
            getListScenario(pageIndex);
        }).catch(err => { console.error(err); });
    };

    // handle delete scenario
    const handleDeleteScenario = (id) => {
        setIsOpenDeleteScenario(true);
        setScenarioSelectId(id);
    };

    // handle delete scenario
    const deleteScenario = () => {
        api.delete(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioSelectId}`).then(res => {
            console.log(res, 'check res delete');
            setIsOpenNoti(true);
            if (res.data.code === 1) {
                setMessageNoti('Delete scenario successfully');
            } else if (res.data.code === 2) {
                setMessageNoti(res.data.message);
            }
            getListScenario(pageIndex);
            setTimeout(() => {
                setIsOpenNoti(false);
                setMessageNoti('');
            }, 2000);
            setIsOpenDeleteScenario(false);
        })
    };

    const handleSaveSelectScenario = () => {
        let data = {
            scenario_selected: scenarioSelected
        };
        api.post(`/api/v1/managements/chatbots/${botId}/scenario_selected`, data)
            .then(res => {
                console.log(res);
                setIsOpenNoti(true);
                if (res.data.code === 1) {
                    setMessageNoti('Save list scenario successfully');
                } else if (res.data.code === 2) {
                    setMessageNoti(res.data.message);
                }
                getListScenario(pageIndex);
                setTimeout(() => {
                    setIsOpenNoti(false);
                    setMessageNoti('');
                }, 2000);
            })
    }

    function handleChange(event, value) {
        console.log(value);
        if (totalPage > 1) {
            // console.log('pageIndex: ', value);
            setPage(parseInt(value));
            setPageIndex(value);
            getListScenario(value);
            // window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('.main-panel').scrollTop = 0;
        }
    }

    const onclickEditScenario = (id) => {
        Cookies.set('scenario_id', id);
    }

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
                                    <Button className="sl-btn-save-scenario" onClick={() => handleSaveSelectScenario()}>Save</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="sl-body">
                                    <ul className="sl-items">
                                        {listScenario ? listScenario.map((scenario) => (
                                            <li key={scenario.id} className="sl-item-wrapper">
                                                <div className="sl-item">
                                                    <div className="sl-item-left">
                                                        <div className="sl-radio-active">
                                                            <input
                                                                type="radio"
                                                                // name="sl-radio-active"
                                                                id="sl-active"
                                                                checked={scenarioSelected === scenario.id}
                                                                onChange={() => setScenarioSelected(scenario.id)}
                                                            />
                                                        </div>
                                                        <div className="sl-info">
                                                            <div className="sl-info-top">
                                                                <div className={`sl-status ${scenarioSelectedClone === scenario.id && 'active'}`}>
                                                                    <span>{scenarioSelectedClone === scenario.id ? 'In operation' : 'Not used'}</span>
                                                                </div>
                                                                <div className="sl-last-update">
                                                                    <span>last updated: {moment(scenario.updated_at).format('YYYY/MM/DD')}</span>
                                                                </div>
                                                            </div>
                                                            <div className="sl-name sl-info-bottom">
                                                                <span>{scenario.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="sl-item-right">
                                                        <Link to={`/admin/scenario-setting`}>
                                                            <Button className="sl-btn-action-edit" onClick={() => onclickEditScenario(scenario.id)}>Edit</Button>
                                                        </Link>
                                                        <Button
                                                            className="sl-btn-action-preview"
                                                            onClick={() => onClickPreview(scenario.id)}
                                                        >Preview</Button>
                                                        <Button
                                                            className="sl-btn-action-duplication"
                                                            onClick={() => handleDuplicationScenario(scenario.id)}
                                                        >
                                                            Duplication
                                                        </Button>
                                                        {scenarioSelectedClone !== scenario.id ? (
                                                            <Button
                                                                className="sl-btn-action-delete"
                                                                onClick={() => handleDeleteScenario(scenario.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        ) : <div style={{ width: '92.73px' }}></div>}
                                                    </div>
                                                </div>
                                            </li>
                                        )) : null}
                                    </ul>
                                </div>
                                <br />
                                <Pagination
                                    count={totalPage}
                                    variant="outlined"
                                    page={page}
                                    onChange={handleChange}
                                />
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
                            onChange={(e) => checkInputScenarioName(e.target.value)}
                        />

                    </div>
                    <span id="sl-err-create-scenario" style={{ color: "red" }}></span>
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
            <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
                <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
                    <span style={{ fontSize: '16px' }}>{messageNoti}</span>
                </div>
            </ModalNoti>
            {scenarioId && <Preview isOpen={isOpenPreview} onOpenPreview={(isOpen) => handleOpenPreview(isOpen)} />}
            <Link to={`/admin/scenario-setting`}>
                <button id='to_scenario' style={{ display: 'none' }}>ScSetting</button>
            </Link>
        </div>
    );
}

export default ScenarioList;
