import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input, Modal, Space, message } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';
import api from 'v2/api/api-management';
import { USER_ROLE_COOKIE_KEY, ROLE_ADMIN_DEEL } from 'v2/api/constants';
import { getAdminRoutePath, getSignInPath } from 'v2/variables/constants';
import { AdminPage, AdminTable, AdminConfirmModal, AdminActionButton, AdminFormRow, useAdminHeaderActions } from 'v2/components/AdminShell';
import {
  TEMPLATE_CREATE_SUCCESS,
  TEMPLATE_DELETE_SUCCESS,
  TEMPLATE_CREATE_TITLE,
  TEMPLATE_NAME_LABEL,
  TEMPLATE_NAME_REQUIRED,
  TEMPLATE_NAME_MAX_LENGTH,
  TEMPLATE_NAME_HINT,
  TEMPLATE_CREATE_BUTTON,
  TEMPLATE_CANCEL_BUTTON,
  TEMPLATE_DELETE_CONFIRM,
  TEMPLATE_CREATE_ACTION,
  TEMPLATE_COLUMN_NAME,
  TEMPLATE_COLUMN_UPDATED,
  TEMPLATE_COLUMN_ACTION,
  TEMPLATE_NAV_DELAY_MS,
  TEMPLATE_LIST_API,
  TEMPLATE_SETTING_ROUTE,
  TEMPLATE_COOKIE_KEY,
} from './scenarioTemplateConstants';

const ScenarioTemplateList = () => {
  const history = useHistory();
  const [isOpenCreateTemplate, setIsOpenCreateTemplate] = useState(false);
  const [isOpenDeleteTemplate, setIsOpenDeleteTemplate] = useState(false);
  const [listTemplate, setListTemplate] = useState([]);
  const [templateSelectId, setTemplateSelectId] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [nameError, setNameError] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userRole = Cookies.get(USER_ROLE_COOKIE_KEY);
    if (!userRole || userRole !== ROLE_ADMIN_DEEL) {
      window.location.href = getSignInPath();
      return;
    }
    window.scrollTo(0, 0);
    getListTemplate();
  }, []);

  useAdminHeaderActions(
    <AdminActionButton action="create" label={TEMPLATE_CREATE_ACTION} onClick={() => setIsOpenCreateTemplate(true)} />
  );

  const getListTemplate = () => {
    setLoading(true);
    api
      .get(TEMPLATE_LIST_API)
      .then((res) => {
        setListTemplate(res?.data?.data || []);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const checkInputTemplateName = (templateName) => {
    if (templateName.length === 0) {
      setNameError(TEMPLATE_NAME_REQUIRED);
      return false;
    }
    if (templateName.length > 50) {
      setNameError(TEMPLATE_NAME_MAX_LENGTH);
      return false;
    }
    setNameError('');
    return true;
  };

  const navigateToTemplateSetting = () => {
    history.push(getAdminRoutePath(TEMPLATE_SETTING_ROUTE));
  };

  const createTemplate = () => {
    if (!checkInputTemplateName(newTemplateName)) return;
    setCreating(true);
    api
      .post(TEMPLATE_LIST_API, {
        scenario_template: { name: newTemplateName },
      })
      .then((res) => {
        if (res.data.code === 1) {
          message.success(TEMPLATE_CREATE_SUCCESS);
          Cookies.set(TEMPLATE_COOKIE_KEY, res.data.data.id);
          setIsOpenCreateTemplate(false);
          setNewTemplateName('');
          setNameError('');
          setTimeout(navigateToTemplateSetting, TEMPLATE_NAV_DELAY_MS);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
        getListTemplate();
      })
      .catch((err) => console.log(err))
      .finally(() => setCreating(false));
  };

  const handleDeleteTemplate = (id) => {
    setIsOpenDeleteTemplate(true);
    setTemplateSelectId(id);
  };

  const deleteTemplate = () => {
    setDeleting(true);
    api
      .delete(`${TEMPLATE_LIST_API}/${templateSelectId}`)
      .then((res) => {
        if (res.data.code === 1) message.success(TEMPLATE_DELETE_SUCCESS);
        else if (res.data.code === 2) message.warning(res.data.message);
        getListTemplate();
        setIsOpenDeleteTemplate(false);
      })
      .finally(() => setDeleting(false));
  };

  const onclickEditTemplate = (id) => {
    Cookies.set(TEMPLATE_COOKIE_KEY, id);
    history.push(getAdminRoutePath(TEMPLATE_SETTING_ROUTE));
  };

  const columns = [
    { title: TEMPLATE_COLUMN_NAME, dataIndex: 'name' },
    {
      title: TEMPLATE_COLUMN_UPDATED,
      dataIndex: 'updated_at',
      render: (value) => moment(value).format('YYYY/MM/DD'),
    },
    {
      title: TEMPLATE_COLUMN_ACTION,
      width: 140,
      render: (_, template) => (
        <Space className="admin-table-actions">
          <AdminActionButton action="edit" iconOnly onClick={() => onclickEditTemplate(template.id)} />
          <AdminActionButton action="delete" iconOnly onClick={() => handleDeleteTemplate(template.id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminPage>
        <AdminTable
          loading={loading}
          columns={columns}
          dataSource={listTemplate}
          rowKey="id"
          pagination={false}
        />
      </AdminPage>

      <Modal
        title={TEMPLATE_CREATE_TITLE}
        open={isOpenCreateTemplate}
        onOk={createTemplate}
        onCancel={() => {
          setIsOpenCreateTemplate(false);
          setNewTemplateName('');
          setNameError('');
        }}
        okText={TEMPLATE_CREATE_BUTTON}
        cancelText={TEMPLATE_CANCEL_BUTTON}
        confirmLoading={creating}
      >
        <AdminFormRow
          label={TEMPLATE_NAME_LABEL}
          htmlFor="new-template-name"
          required
          error={nameError}
          hint={TEMPLATE_NAME_HINT}
        >
          <Input
            id="new-template-name"
            value={newTemplateName}
            onChange={(e) => {
              setNewTemplateName(e.target.value);
              checkInputTemplateName(e.target.value);
            }}
          />
        </AdminFormRow>
      </Modal>

      <AdminConfirmModal
        open={isOpenDeleteTemplate}
        message={TEMPLATE_DELETE_CONFIRM}
        onOk={deleteTemplate}
        onCancel={() => setIsOpenDeleteTemplate(false)}
        danger
        loading={deleting}
      />
    </>
  );
};

export default ScenarioTemplateList;
