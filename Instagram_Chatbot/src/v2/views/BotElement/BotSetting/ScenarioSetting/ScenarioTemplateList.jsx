import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input, List, Modal, Space, message } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';
import api from 'api/api-management';
import { AdminPage, AdminConfirmModal, AdminActionButton, AdminFormRow, useAdminHeaderActions } from '../../../../components/AdminShell';

function ScenarioTemplateList() {
  const [isOpenCreateTemplate, setIsOpenCreateTemplate] = useState(false);
  const [isOpenDeleteTemplate, setIsOpenDeleteTemplate] = useState(false);
  const [listTemplate, setListTemplate] = useState([]);
  const [templateSelectId, setTemplateSelectId] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [nameError, setNameError] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const userRole = Cookies.get('user_role');
    if (!userRole || userRole !== 'admin_deel') {
      window.location.href = '/';
      return;
    }
    window.scrollTo(0, 0);
    getListTemplate();
  }, []);

  useAdminHeaderActions(
    <AdminActionButton action="create" label="テンプレート作成" onClick={() => setIsOpenCreateTemplate(true)} />
  );

  const getListTemplate = () => {
    api
      .get('/api/v1/managements/scenario_templates')
      .then((res) => {
        setListTemplate(res?.data?.data || []);
      })
      .catch((error) => console.error(error));
  };

  const checkInputTemplateName = (templateName) => {
    if (templateName.length === 0) {
      setNameError('テンプレート名は、必ず指定してください。');
      return false;
    }
    if (templateName.length > 50) {
      setNameError('テンプレート名は50文字以下にしてください。');
      return false;
    }
    setNameError('');
    return true;
  };

  const createTemplate = () => {
    if (!checkInputTemplateName(newTemplateName)) return;
    setCreating(true);
    api
      .post('/api/v1/managements/scenario_templates', {
        scenario_template: { name: newTemplateName },
      })
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に追加されました！');
          Cookies.set('scenario_template_id', res.data.data.id);
          setIsOpenCreateTemplate(false);
          setNewTemplateName('');
          setNameError('');
          setTimeout(() => document.getElementById('to_scenario_template')?.click(), 1500);
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
      .delete(`/api/v1/managements/scenario_templates/${templateSelectId}`)
      .then((res) => {
        if (res.data.code === 1) message.success('正常に削除されました！');
        else if (res.data.code === 2) message.warning(res.data.message);
        getListTemplate();
        setIsOpenDeleteTemplate(false);
      })
      .finally(() => setDeleting(false));
  };

  const onclickEditTemplate = (id) => {
    Cookies.set('scenario_template_id', id);
  };

  return (
    <>
      <AdminPage>
        <List
          dataSource={listTemplate}
          renderItem={(template) => (
            <List.Item
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                background: '#fff',
              }}
              actions={[
                <Link to="/v2/admin/scenario-template-setting" key="edit">
                  <AdminActionButton action="edit" iconOnly onClick={() => onclickEditTemplate(template.id)} />
                </Link>,
                <AdminActionButton key="del" action="delete" iconOnly onClick={() => handleDeleteTemplate(template.id)} />,
              ]}
            >
              <List.Item.Meta
                title={<span style={{ fontWeight: 500 }}>{template.name}</span>}
                description={`最後の更新日時 ${moment(template.updated_at).format('YYYY/MM/DD')}`}
              />
            </List.Item>
          )}
        />
      </AdminPage>

      <Modal
        title="テンプレート作成"
        open={isOpenCreateTemplate}
        onOk={createTemplate}
        onCancel={() => {
          setIsOpenCreateTemplate(false);
          setNewTemplateName('');
          setNameError('');
        }}
        okText="作成"
        cancelText="キャンセル"
        confirmLoading={creating}
      >
        <AdminFormRow
          label="テンプレート名"
          htmlFor="new-template-name"
          required
          error={nameError}
          hint="※テンプレートに任意の名称をつけることができます。"
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
        message="本当に削除しますか。"
        onOk={deleteTemplate}
        onCancel={() => setIsOpenDeleteTemplate(false)}
        danger
        loading={deleting}
      />

      <Link to="/v2/admin/scenario-template-setting">
        <button id="to_scenario_template" style={{ display: 'none' }} type="button">
          TemplateSetting
        </button>
      </Link>
    </>
  );
}

export default ScenarioTemplateList;
