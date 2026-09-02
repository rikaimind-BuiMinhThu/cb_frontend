import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input, Modal, Select, Space, Switch, message } from 'antd';
import api from 'v2/api/api-management';
import Cookies from 'js-cookie';
import moment from 'moment';
import { getAdminRoutePath } from 'v2/variables/constants';
import { BOT_ID_COOKIE_KEY, SCENARIO_ID_COOKIE_KEY } from 'v2/api/constants';
import { AdminPage, AdminTable, AdminConfirmModal, AdminActionButton, AdminFormRow, useAdminHeaderActions } from 'v2/components/AdminShell';
import {
  SCENARIO_CREATE_SUCCESS,
  SCENARIO_REQUEST_FAILED,
  SCENARIO_DUPLICATE_SUCCESS,
  SCENARIO_DELETE_SUCCESS,
  SCENARIO_SAVE_SUCCESS,
  SCENARIO_CREATE_TITLE,
  SCENARIO_NAME_LABEL,
  SCENARIO_NAME_REQUIRED,
  SCENARIO_NAME_MAX_LENGTH,
  SCENARIO_NAME_HINT,
  SCENARIO_TEMPLATE_LABEL,
  SCENARIO_TEMPLATE_PLACEHOLDER,
  SCENARIO_CREATE_BUTTON,
  SCENARIO_CANCEL_BUTTON,
  SCENARIO_DELETE_CONFIRM,
  SCENARIO_CREATE_ACTION,
  SCENARIO_STATUS_ACTIVE,
  SCENARIO_STATUS_INACTIVE,
  SCENARIO_COLUMN_STATUS,
  SCENARIO_COLUMN_STATUS_WIDTH,
  SCENARIO_COLUMN_NAME,
  SCENARIO_COLUMN_UPDATED,
  SCENARIO_COLUMN_ACTION,
  SCENARIO_COLUMN_ACTION_WIDTH,
  SCENARIO_NAV_DELAY_MS,
  SCENARIO_TEMPLATES_API,
  SCENARIO_LIST_API,
  SCENARIO_SELECTED_API,
  SCENARIO_SETTING_ROUTE,
} from './constants';

const ScenarioList = () => {
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
    setBotId(Cookies.get(BOT_ID_COOKIE_KEY));
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getListScenario(1);
    getListTemplate();
  }, []);

  const getListTemplate = () => {
    api
      .get(SCENARIO_TEMPLATES_API)
      .then((res) => {
        setListTemplate(res?.data?.data || []);
      })
      .catch((error) => console.error(error));
  };

  const getListScenario = (pgIndex) => {
    setLoading(true);
    api
      .get(`${SCENARIO_LIST_API}/${Cookies.get(BOT_ID_COOKIE_KEY)}/scenarios?page=${pgIndex}`)
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
      setNameError(SCENARIO_NAME_REQUIRED);
      return false;
    }
    if (scenarioName.length > 50) {
      setNameError(SCENARIO_NAME_MAX_LENGTH);
      return false;
    }
    setNameError('');
    return true;
  };

  const navigateToScenarioSetting = () => {
    history.push(getAdminRoutePath(SCENARIO_SETTING_ROUTE));
  };

  const createScenario = () => {
    if (!checkInputScenarioName(newScenarioName)) return;
    setCreating(true);
    api
      .post(`${SCENARIO_LIST_API}/${botId}/scenarios`, {
        scenario: { name: newScenarioName },
        template_id: selectedTemplateId || undefined,
      })
      .then((res) => {
        if (res.data.code === 1) {
          message.success(SCENARIO_CREATE_SUCCESS);
          Cookies.set(SCENARIO_ID_COOKIE_KEY, res.data.data.id);
          setIsOpenCreateScenario(false);
          setNewScenarioName('');
          setNameError('');
          setSelectedTemplateId(undefined);
          setTimeout(navigateToScenarioSetting, SCENARIO_NAV_DELAY_MS);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
        getListScenario(page);
      })
      .catch(() => message.error(SCENARIO_REQUEST_FAILED))
      .finally(() => setCreating(false));
  };

  const handleDuplicationScenario = (id) => {
    api
      .post(`${SCENARIO_LIST_API}/${botId}/scenarios/${id}/duplicate`)
      .then((res) => {
        if (res.data.code === 1) message.success(SCENARIO_DUPLICATE_SUCCESS);
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
      .delete(`${SCENARIO_LIST_API}/${botId}/scenarios/${scenarioSelectId}`)
      .then((res) => {
        if (res.data.code === 1) message.success(SCENARIO_DELETE_SUCCESS);
        else if (res.data.code === 2) message.warning(res.data.message);
        getListScenario(page);
        setIsOpenDeleteScenario(false);
      })
      .finally(() => setDeleting(false));
  };

  const handleSaveSelectScenario = () => {
    api
      .post(`${SCENARIO_LIST_API}/${botId}${SCENARIO_SELECTED_API}`, { scenario_selected: scenarioSelected })
      .then((res) => {
        if (res.data.code === 1) message.success(SCENARIO_SAVE_SUCCESS);
        else if (res.data.code === 2) message.warning(res.data.message);
        getListScenario(page);
      });
  };

  const onClickPreview = (id) => {
    Cookies.set(SCENARIO_ID_COOKIE_KEY, id);
    history.push(getAdminRoutePath(`/demo-bot/${id}`));
  };

  const onclickEditScenario = (id) => {
    Cookies.set(SCENARIO_ID_COOKIE_KEY, id);
  };

  const handleSelectScenario = (scenarioId, checked) => {
    if (!checked) {
      return;
    }
    setScenarioSelected(scenarioId);
  };

  useAdminHeaderActions(
    <Space>
      <AdminActionButton action="create" label={SCENARIO_CREATE_ACTION} onClick={() => setIsOpenCreateScenario(true)} />
      <AdminActionButton action="save" onClick={handleSaveSelectScenario} />
    </Space>
  );

  const columns = [
    {
      title: SCENARIO_COLUMN_STATUS,
      width: SCENARIO_COLUMN_STATUS_WIDTH,
      render: (_, scenario) => (
        <Switch
          checked={scenarioSelected === scenario.id}
          checkedChildren={SCENARIO_STATUS_ACTIVE}
          unCheckedChildren={SCENARIO_STATUS_INACTIVE}
          onChange={(checked) => handleSelectScenario(scenario.id, checked)}
        />
      ),
    },
    {
      title: SCENARIO_COLUMN_NAME,
      dataIndex: 'name',
    },
    {
      title: SCENARIO_COLUMN_UPDATED,
      dataIndex: 'updated_at',
      render: (value) => moment(value).format('YYYY/MM/DD'),
    },
    {
      title: SCENARIO_COLUMN_ACTION,
      width: SCENARIO_COLUMN_ACTION_WIDTH,
      render: (_, scenario) => (
        <Space className="admin-table-actions">
          <AdminActionButton
            action="edit"
            iconOnly
            onClick={() => {
              onclickEditScenario(scenario.id);
              history.push(getAdminRoutePath(SCENARIO_SETTING_ROUTE));
            }}
          />
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
        title={SCENARIO_CREATE_TITLE}
        open={isOpenCreateScenario}
        onOk={createScenario}
        onCancel={() => {
          setIsOpenCreateScenario(false);
          setNewScenarioName('');
          setNameError('');
          setSelectedTemplateId(undefined);
        }}
        okText={SCENARIO_CREATE_BUTTON}
        cancelText={SCENARIO_CANCEL_BUTTON}
        confirmLoading={creating}
      >
        <AdminFormRow
          label={SCENARIO_NAME_LABEL}
          htmlFor="new-scenario-name"
          required
          error={nameError}
          hint={SCENARIO_NAME_HINT}
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
        <AdminFormRow label={SCENARIO_TEMPLATE_LABEL}>
          <Select
            allowClear
            placeholder={SCENARIO_TEMPLATE_PLACEHOLDER}
            value={selectedTemplateId}
            onChange={(value) => setSelectedTemplateId(value)}
            className="admin-field-full-width"
            options={listTemplate.map((template) => ({
              value: template.id,
              label: template.name,
            }))}
          />
        </AdminFormRow>
      </Modal>

      <AdminConfirmModal
        open={isOpenDeleteScenario}
        message={SCENARIO_DELETE_CONFIRM}
        onOk={deleteScenario}
        onCancel={() => setIsOpenDeleteScenario(false)}
        danger
        loading={deleting}
      />
    </>
  );
};

export default ScenarioList;
