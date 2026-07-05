import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input, List, Modal, Space, message } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';
import api from 'api/api-management';
import { AdminPage, AdminConfirmModal, AdminActionButton, useAdminHeaderActions } from '../../../../components/AdminShell';

function ScenarioTemplateList() {
  const [isOpenCreateTemplate, setIsOpenCreateTemplate] = useState(false);
  const [isOpenDeleteTemplate, setIsOpenDeleteTemplate] = useState(false);
  const [listTemplate, setListTemplate] = useState([]);
  const [templateSelectId, setTemplateSelectId] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [nameError, setNameError] = useState('');

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
      setNameError('テンプレート名を必ず指定してください。');
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
    api
      .post('/api/v1/managements/scenario_templates', {
        scenario_template: { name: newTemplateName },
      })
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に追加されました！');
          Cookies.set('scenario_template_id', res.data.data.id);
          setTimeout(() => document.getElementById('to_scenario_template')?.click(), 1500);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
        getListTemplate();
        setIsOpenCreateTemplate(false);
        setNewTemplateName('');
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteTemplate = (id) => {
    setIsOpenDeleteTemplate(true);
    setTemplateSelectId(id);
  };

  const deleteTemplate = () => {
    api
      .delete(`/api/v1/managements/scenario_templates/${templateSelectId}`)
      .then((res) => {
        if (res.data.code === 1) message.success('正常に削除されました！');
        else if (res.data.code === 2) message.warning(res.data.message);
        getListTemplate();
        setIsOpenDeleteTemplate(false);
      });
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
                  <AdminActionButton action="edit" onClick={() => onclickEditTemplate(template.id)} />
                </Link>,
                <AdminActionButton key="del" action="delete" onClick={() => handleDeleteTemplate(template.id)} />,
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
      >
        <div style={{ marginBottom: 8 }}>
          <label>テンプレート名</label>
          <Input
            value={newTemplateName}
            onChange={(e) => {
              setNewTemplateName(e.target.value);
              checkInputTemplateName(e.target.value);
            }}
            style={{ marginTop: 8 }}
          />
          {nameError && <div style={{ color: '#ff4d4f', marginTop: 4 }}>{nameError}</div>}
        </div>
        <p style={{ color: '#6b7280', fontSize: 13 }}>※テンプレートに任意の名称をつけることができます。</p>
      </Modal>

      <AdminConfirmModal
        open={isOpenDeleteTemplate}
        message="本当に削除しますか。"
        onOk={deleteTemplate}
        onCancel={() => setIsOpenDeleteTemplate(false)}
        danger
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
