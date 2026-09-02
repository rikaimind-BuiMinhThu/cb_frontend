import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input, Modal, Radio, Select, Space, Tag, message } from 'antd';
import api from 'v2/api/api-management';
import Cookies from 'js-cookie';
import moment from 'moment';
import { getAdminRoutePath } from 'v2/variables/constants';
import { AdminPage, AdminTable, AdminConfirmModal, AdminActionButton, AdminFormRow, useAdminHeaderActions } from '../../../../components/AdminShell';

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
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    api
      .get(`/api/v1/managements/chatbots/${Cookies.get('bot_id')}/scenarios?page=${pgIndex}`)
      .then((res) => {
        setTotal(res?.data?.total || 0);
        setScenarioSelected(res.data.scenario_selected);
        setScenarioSelectedClone(res.data.scenario_selected);
        setListScenario(res?.data?.data || []);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const checkInputScenarioName = (scenarioName) => {
    if (scenarioName.length === 0) {
      setNameError('シナリオ名は、必ず指定してください。');
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
    setCreating(true);
    api
      .post(`/api/v1/managements/chatbots/${botId}/scenarios`, {
        scenario: { name: newScenarioName },
        template_id: selectedTemplateId || undefined,
      })
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に追加されました！');
          Cookies.set('scenario_id', res.data.data.id);
          setIsOpenCreateScenario(false);
          setNewScenarioName('');
          setNameError('');
          setSelectedTemplateId(undefined);
          setTimeout(() => document.getElementById('to_scenario')?.click(), 1500);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
        getListScenario(page);
      })
      .catch((err) => console.log(err))
      .finally(() => setCreating(false));
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
    setDeleting(true);
    api
      .delete(`/api/v1/managements/chatbots/${botId}/scenarios/${scenarioSelectId}`)
      .then((res) => {
        if (res.data.code === 1) message.success('正常に削除されました！');
        else if (res.data.code === 2) message.warning(res.data.message);
        getListScenario(page);
        setIsOpenDeleteScenario(false);
      })
      .finally(() => setDeleting(false));
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

  const columns = [
    {
      title: '',
      width: 48,
      render: (_, scenario) => (
        <Radio
          checked={scenarioSelected === scenario.id}
          onChange={() => setScenarioSelected(scenario.id)}
        />
      ),
    },
    {
      title: 'ステータス',
      width: 90,
      render: (_, scenario) => (
        <Tag color={scenarioSelectedClone === scenario.id ? 'green' : 'default'}>
          {scenarioSelectedClone === scenario.id ? '有効' : '無効'}
        </Tag>
      ),
    },
    {
      title: 'シナリオ名',
      dataIndex: 'name',
    },
    {
      title: '最後の更新日時',
      dataIndex: 'updated_at',
      render: (value) => moment(value).format('YYYY/MM/DD'),
    },
    {
      title: 'アクション',
      width: 220,
      render: (_, scenario) => (
        <Space className="admin-table-actions">
          <Link to={getAdminRoutePath('/scenario-setting')}>
            <AdminActionButton action="edit" iconOnly onClick={() => onclickEditScenario(scenario.id)} />
          </Link>
          <AdminActionButton action="preview" iconOnly onClick={() => onClickPreview(scenario.id)} />
          <AdminActionButton action="duplicate" iconOnly onClick={() => handleDuplicationScenario(scenario.id)} />
          {scenarioSelectedClone !== scenario.id ? (
            <AdminActionButton action="delete" iconOnly onClick={() => handleDeleteScenario(scenario.id)} />
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminPage>
        <AdminTable
          className="admin-scenario-list"
          loading={loading}
          columns={columns}
          dataSource={listScenario}
          rowKey="id"
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
        confirmLoading={creating}
      >
        <AdminFormRow
          label="シナリオ名"
          htmlFor="new-scenario-name"
          required
          error={nameError}
          hint="※シナリオに任意の名称をつけることができます。"
        >
          <Input
            id="new-scenario-name"
            value={newScenarioName}
            onChange={(e) => {
              setNewScenarioName(e.target.value);
              checkInputScenarioName(e.target.value);
            }}
          />
        </AdminFormRow>
        <AdminFormRow label="テンプレート（任意）">
          <Select
            allowClear
            placeholder="テンプレートなし"
            value={selectedTemplateId}
            onChange={(value) => setSelectedTemplateId(value)}
            style={{ width: '100%' }}
            options={listTemplate.map((template) => ({
              value: template.id,
              label: template.name,
            }))}
          />
        </AdminFormRow>
      </Modal>

      <AdminConfirmModal
        open={isOpenDeleteScenario}
        message="本当に削除しますか。"
        onOk={deleteScenario}
        onCancel={() => setIsOpenDeleteScenario(false)}
        danger
        loading={deleting}
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
