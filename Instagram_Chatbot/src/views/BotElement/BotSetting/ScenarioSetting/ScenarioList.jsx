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
    }, []);

    // side effects
    useEffect(() => {
        document.title = 'シナリオ一覧';
        window.scrollTo(0, 0);
    }, []);

    //Get list scenario
    useEffect(() => {
        getListScenario(1);
    }, []);

    const handleOpenPreview = (isOpen) => {
        if (isOpen) {
            document.getElementById('sp-container').style.height = '610px';
            document.getElementById('sp-header').style.position = 'static';
            document.getElementById('sp-header').style.borderBottomLeftRadius = '0px';
            document.getElementById('sp-header').style.borderBottomRightRadius = '0px';
            document.getElementById('sp-header').style.borderTopLeftRadius = "2px";
            document.getElementById('sp-header').style.borderTopRightRadius = "2px";
            document.getElementById('sp-process-bar').style.display = 'block';
            document.getElementById('sp-body').style.display = 'block';
        } else {
            document.getElementById('sp-container').style.height = '0px';
            document.getElementById('sp-process-bar').style.display = 'none';
            document.getElementById('sp-body').style.display = 'none';
            document.getElementById('sp-header').style.borderBottomLeftRadius = '25px';
            document.getElementById('sp-header').style.borderBottomRightRadius = '25px';
            document.getElementById('sp-header').style.borderTopLeftRadius = "25px";
            document.getElementById('sp-header').style.borderTopRightRadius = "25px";
            document.getElementById('sp-header').style.position = 'absolute';
            document.getElementById('sp-header').style.bottom = '13px';
        }
        setIsOpenPreview(!isOpenPreview);
    };

    const onClickPreview = (scenarioId) => {
        Cookies.set('scenario_id', scenarioId);
        setScenarioId('');
        setTimeout(() => {
            setScenarioId(scenarioId);
        }, [100]);
        // handleOpenPreview(true);
        setIsOpenPreview(true);
    };

    const getListScenario = (pgIndex) => {
        api
            .get(`/api/v1/managements/chatbots/${Cookies.get('bot_id')}/scenarios?page=${pgIndex}`)
            .then((res) => {
                console.log(res.data);
                let scenarios = [...res?.data?.data];
                let totalPage = Math.ceil(res?.data?.total / 25);
                setTotalPage(totalPage);
                setScenarioSelected(res.data.scenario_selected);
                setScenarioSelectedClone(res.data.scenario_selected);
                setListScenario(scenarios);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    function checkInputScenarioName(scenarioName) {
        // console.log(scenarioName, 'check input name');
        if (scenarioName.length === 0) {
            // setErrorMessage('Scenario name can"t be empty');
            document.getElementById('sl-err-create-scenario').innerHTML =
                'シナリオ名を必ず指定してください。';
            document.getElementById('sl-err-create-scenario').style.display = 'block';
            return false;
        } else if (scenarioName.length > 50) {
            // setErrorMessage('Scenario name can"t greater than 50 charecter');
            document.getElementById('sl-err-create-scenario').innerHTML =
                'シナリオ名は50文字以下にしてください。';
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
            let add = { scenario: { name: inputName } };
            api
                .post(`/api/v1/managements/chatbots/${botId}/scenarios`, add)
                .then((res) => {
                    setIsOpenNoti(true);
                    console.log(res);
                    if (res.data.code === 1) {
                        setMessageNoti('正常に追加されました！');
                        Cookies.set('scenario_id', res.data.data.id);
                        setTimeout(() => {
                            document.getElementById('to_scenario').click();
                        }, 1500);
                    } else if (res.data.code === 2) {
                        setMessageNoti(res.data.message);
                    }
                    getListScenario(pageIndex);
                    setTimeout(() => {
                        setIsOpenNoti(false);
                        setMessageNoti('');
                    }, 2000);
                    setIsOpenCreateScenario(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    // handle duplication scenario
    const handleDuplicationScenario = (id) => {
        api
            .post(`/api/v1/managements/chatbots/${botId}/scenarios/${id}/duplicate`)
            .then((res) => {
                console.log(res.data);
                setIsOpenNoti(true);
                if (res.data.code === 1) {
                    setMessageNoti('正常に複製されました！');
                } else if (res.data.code === 2) {
                    setMessageNoti(res.data.message);
                }
                setTimeout(() => {
                    setIsOpenNoti(false);
                    setMessageNoti('');
                }, 2000);
                getListScenario(pageIndex);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // handle delete scenario
    const handleDeleteScenario = (id) => {
        setIsOpenDeleteScenario(true);
        setScenarioSelectId(id);
    };

    // handle delete scenario
    const deleteScenario = () => {
        api
            .delete(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioSelectId}`)
            .then((res) => {
                console.log(res, 'check res delete');
                setIsOpenNoti(true);
                if (res.data.code === 1) {
                    setMessageNoti('正常に削除されました！');
                } else if (res.data.code === 2) {
                    setMessageNoti(res.data.message);
                }
                getListScenario(pageIndex);
                setTimeout(() => {
                    setIsOpenNoti(false);
                    setMessageNoti('');
                }, 2000);
                setIsOpenDeleteScenario(false);
            });
    };

    const handleSaveSelectScenario = () => {
        let data = {
            scenario_selected: scenarioSelected,
        };
        api.post(`/api/v1/managements/chatbots/${botId}/scenario_selected`, data).then((res) => {
            console.log(res);
            setIsOpenNoti(true);
            if (res.data.code === 1) {
                setMessageNoti('正常に保存されました！');
            } else if (res.data.code === 2) {
                setMessageNoti(res.data.message); // change language after
            }
            getListScenario(pageIndex);
            setTimeout(() => {
                setIsOpenNoti(false);
                setMessageNoti('');
            }, 2000);
        });
    };

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
    };

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
                                        シナリオ作成
                                    </Button>
                                    <Button
                                        className="sl-btn-save-scenario"
                                        onClick={() => handleSaveSelectScenario()}
                                    >
                                        保存
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="sl-body">
                                    <ul className="sl-items">
                                        {listScenario
                                            ? listScenario.map((scenario) => (
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
                                                                    <div
                                                                        className={`sl-status ${scenarioSelectedClone === scenario.id && 'active'
                                                                            }`}
                                                                    >
                                                                        <span>
                                                                            {scenarioSelectedClone === scenario.id ? '有効' : '無効'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="sl-last-update">
                                                                        <span>
                                                                            最後の更新日時{' '}
                                                                            {moment(scenario.updated_at).format('YYYY/MM/DD')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="sl-name sl-info-bottom">
                                                                    <span>{scenario.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="sl-item-right">
                                                            <Link to={`/admin/scenario-setting`}>
                                                                <Button
                                                                    className="sl-btn-action-edit"
                                                                    onClick={() => onclickEditScenario(scenario.id)}
                                                                >
                                                                    編集
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                className="sl-btn-action-preview"
                                                                onClick={() => onClickPreview(scenario.id)}
                                                            >
                                                                プレビュー
                                                            </Button>
                                                            <Button
                                                                className="sl-btn-action-duplication"
                                                                onClick={() => handleDuplicationScenario(scenario.id)}
                                                            >
                                                                複製
                                                            </Button>
                                                            {scenarioSelectedClone !== scenario.id ? (
                                                                <Button
                                                                    className="sl-btn-action-delete"
                                                                    onClick={() => handleDeleteScenario(scenario.id)}
                                                                >
                                                                    削除
                                                                </Button>
                                                            ) : (
                                                                <div style={{ width: '67.99px' }}></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                            : null}
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
                    <h4>シナリオ作成</h4>
                    <div className="sl-popup-create-scenario-input-wrapper">
                        <span>シナリオ名</span>
                        <input
                            type="text"
                            name="sl-popup-create-scenario-input"
                            id="sl-popup-create-scenario-input"
                            onChange={(e) => checkInputScenarioName(e.target.value)}
                        />
                    </div>
                    <span id="sl-err-create-scenario" style={{ color: 'red' }}></span>
                    <div className="sl-popup-create-scenario-note-wrapper">
                        <span>※シナリオに任意の名称をつけることができます。</span>
                    </div>
                    <div className="sl-popup-create-scenario-btn-wrapper">
                        <Button
                            className="sl-popup-create-scenario-create-btn"
                            onClick={() => createScenario()}
                        >
                            作成
                        </Button>
                        <Button
                            className="sl-popup-create-scenario-cancel-btn"
                            onClick={() => setIsOpenCreateScenario(false)}
                        >
                            キャンセル
                        </Button>
                    </div>
                </div>
            </ModalShort>
            <ModalShort open={isOpenDeleteScenario} onClose={() => setIsOpenDeleteScenario(false)}>
                <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
                    <h4>本当に削除しますか。</h4>
                    <Button onClick={() => deleteScenario()}>はい</Button>
                    <Button onClick={() => setIsOpenDeleteScenario(false)}>いいえ</Button>
                </div>
            </ModalShort>
            <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
                <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
                    <span style={{ fontSize: '16px' }}>{messageNoti}</span>
                </div>
            </ModalNoti>
            {scenarioId && (
                <Preview isOpen={isOpenPreview} onOpenPreview={(isOpen) => handleOpenPreview(isOpen)} />
            )}
            <Link to={`/admin/scenario-setting`}>
                <button id="to_scenario" style={{ display: 'none' }}>
                    ScSetting
                </button>
            </Link>
        </div>
    );
}

export default ScenarioList;
