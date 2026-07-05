import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input, List, Modal, Radio, Select, Space, Tag, message } from 'antd';
import api from 'api/api-management';
import Cookies from 'js-cookie';
import moment from 'moment';
import { getAdminRoutePath } from 'v2/variables/constants';
import { AdminPage, AdminConfirmModal, AdminActionButton, useAdminHeaderActions } from '../../../../components/AdminShell';

function ScenarioList() {
  const history = useHistory();
  const [isOpenCreateScenario, setIsOpenCreateScenario] = useState(false);
  const [scenarioSelectId, setScenarioSelectId] = useState('');
  const [isOpenDeleteScenario, setIsOpenDeleteScenario] = useState(false);
  const [botId, setBotId] = useState();
  const [listScenario, setListScenario] = useState([]);
  const [scenarioSelected, setScenarioSelected] = useState(false);
  const [scenarioSelectedClone, setScenarioSelectedClone] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [nameError, setNameError] = useState('');
  const [listTemplate, setListTemplate] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(undefined);

  useEffect(() => {
    setBotId(Cookies.get('bot_id'));
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getListScenario(1);
    getListTemplate();
  }, []);

  const getListTemplate = () => {
    api
      .get('/api/v1/managements/scenario_templates')
      .then((res) => {
        setListTemplate(res?.data?.data || []);
      })
      .catch((error) => console.error(error));
  };

  const getListScenario = (pgIndex) => {
    api
      .get(`/api/v1/managements/chatbots/${Cookies.get('bot_id')}/scenarios?page=${pgIndex}`)
      .then((res) => {
        setTotal(res?.data?.total || 0);
        setScenarioSelected(res.data.scenario_selected);
        setScenarioSelectedClone(res.data.scenario_selected);
        setListScenario(res?.data?.data || []);
      })
      .catch((error) => console.error(error));
  };

  const checkInputScenarioName = (scenarioName) => {
    if (scenarioName.length === 0) {
      setNameError('シナリオ名を必ず指定してください。');
      return false;
    }
    if (scenarioName.length > 50) {
      setNameError('シナリオ名は50文字以下にしてください。');
      return false;
    }
    setNameError('');
    return true;
  };

  const createScenario = () => {
    if (!checkInputScenarioName(newScenarioName)) return;
    api
      .post(`/api/v1/managements/chatbots/${botId}/scenarios`, {
        scenario: { name: newScenarioName },
        template_id: selectedTemplateId || undefined,
      })
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に追加されました！');
          Cookies.set('scenario_id', res.data.data.id);
          setTimeout(() => document.getElementById('to_scenario')?.click(), 1500);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
        getListScenario(page);
        setIsOpenCreateScenario(false);
        setNewScenarioName('');
        setSelectedTemplateId(undefined);
      })
      .catch((err) => console.log(err));
  };

  const handleDuplicationScenario = (id) => {
    api
      .post(`/api/v1/managements/chatbots/${botId}/scenarios/${id}/duplicate`)
      .then((res) => {
        if (res.data.code === 1) message.success('正常に複製されました！');
        else if (res.data.code === 2) message.warning(res.data.message);
        getListScenario(page);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteScenario = (id) => {
    setIsOpenDeleteScenario(true);
    setScenarioSelectId(id);
  };

  const deleteScenario = () => {
    api
      .delete(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioSelectId}`)
      .then((res) => {
        if (res.data.code === 1) message.success('正常に削除されました！');
        else if (res.data.code === 2) message.warning(res.data.message);
        getListScenario(page);
        setIsOpenDeleteScenario(false);
      });
  };

  const handleSaveSelectScenario = () => {
    api
      .post(`/api/v1/managements/chatbots/${botId}/scenario_selected`, { scenario_selected: scenarioSelected })
      .then((res) => {
        if (res.data.code === 1) message.success('正常に保存されました！');
        else if (res.data.code === 2) message.warning(res.data.message);
        getListScenario(page);
      });
  };

  const onClickPreview = (id) => {
    Cookies.set('scenario_id', id);
    history.push(getAdminRoutePath(`/demo-bot/${id}`));
  };

  const onclickEditScenario = (id) => {
    Cookies.set('scenario_id', id);
  };

  useAdminHeaderActions(
    <Space>
      <AdminActionButton action="create" label="シナリオ作成" onClick={() => setIsOpenCreateScenario(true)} />
      <AdminActionButton action="save" onClick={handleSaveSelectScenario} />
    </Space>
  );

  return (
    <>
      <AdminPage>
        <List
          className="admin-scenario-list"
          dataSource={listScenario}
          pagination={{
            current: page,
            pageSize: 25,
            total,
            onChange: (p) => {
              setPage(p);
              getListScenario(p);
              window.scrollTo(0, 0);
            },
          }}
          renderItem={(scenario) => (
            <List.Item
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                background: '#fff',
              }}
              actions={[
                <Link to={getAdminRoutePath('/scenario-setting')} key="edit">
                  <AdminActionButton action="edit" onClick={() => onclickEditScenario(scenario.id)} />
                </Link>,
                <AdminActionButton key="preview" action="preview" onClick={() => onClickPreview(scenario.id)} />,
                <AdminActionButton key="dup" action="duplicate" onClick={() => handleDuplicationScenario(scenario.id)} />,
                scenarioSelectedClone !== scenario.id ? (
                  <AdminActionButton key="del" action="delete" onClick={() => handleDeleteScenario(scenario.id)} />
                ) : null,
              ]}
            >
              <div className="admin-scenario-list-row">
                <Radio
                  checked={scenarioSelected === scenario.id}
                  onChange={() => setScenarioSelected(scenario.id)}
                />
                <div className="admin-scenario-list-content">
                  <Space>
                    <Tag color={scenarioSelectedClone === scenario.id ? 'green' : 'default'}>
                      {scenarioSelectedClone === scenario.id ? '有効' : '無効'}
                    </Tag>
                    <span className="admin-scenario-list-name">{scenario.name}</span>
                  </Space>
                  <div className="admin-scenario-list-meta">
                    {`最後の更新日時 ${moment(scenario.updated_at).format('YYYY/MM/DD')}`}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </AdminPage>

      <Modal
        title="シナリオ作成"
        open={isOpenCreateScenario}
        onOk={createScenario}
        onCancel={() => {
          setIsOpenCreateScenario(false);
          setNewScenarioName('');
          setNameError('');
          setSelectedTemplateId(undefined);
        }}
        okText="作成"
        cancelText="キャンセル"
      >
        <div style={{ marginBottom: 8 }}>
          <label>シナリオ名</label>
          <Input
            value={newScenarioName}
            onChange={(e) => {
              setNewScenarioName(e.target.value);
              checkInputScenarioName(e.target.value);
            }}
            style={{ marginTop: 8 }}
          />
          {nameError && <div style={{ color: '#ff4d4f', marginTop: 4 }}>{nameError}</div>}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>テンプレート（任意）</label>
          <Select
            allowClear
            placeholder="テンプレートなし"
            value={selectedTemplateId}
            onChange={(value) => setSelectedTemplateId(value)}
            style={{ width: '100%', marginTop: 8 }}
            options={listTemplate.map((template) => ({
              value: template.id,
              label: template.name,
            }))}
          />
        </div>
        <p style={{ color: '#6b7280', fontSize: 13 }}>※シナリオに任意の名称をつけることができます。</p>
      </Modal>

      <AdminConfirmModal
        open={isOpenDeleteScenario}
        message="本当に削除しますか。"
        onOk={deleteScenario}
        onCancel={() => setIsOpenDeleteScenario(false)}
        danger
      />

      <Link to={getAdminRoutePath('/scenario-setting')}>
        <button id="to_scenario" style={{ display: 'none' }} type="button">
          ScSetting
        </button>
      </Link>
    </>
  );
}

export default ScenarioList;
