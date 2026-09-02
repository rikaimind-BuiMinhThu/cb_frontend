import { useEffect, useState } from 'react';
import { message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { AdminPage, AdminActionButton, useAdminHeaderActions } from 'v2/components/AdminShell';
import OrderConfirmTemplateForm from './OrderConfirmTemplateForm';
import { getSignInPath } from 'v2/variables/constants';
import {
  getDefaultOrderConfirmConfig,
  normalizeOrderConfirmConfig,
} from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/OrderConfirmLpScriptGenerator';

function OrderConfirmMessageTemplateEditor() {
  const [templateId, setTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [config, setConfig] = useState(getDefaultOrderConfirmConfig());
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadTemplate = (id) => {
    api
      .get(`/api/v1/managements/order_confirm_message_templates/${id}`)
      .then((res) => {
        if (res.data.code !== 1) {
          message.warning(res.data.message || 'テンプレートの読み込みに失敗しました');
          return;
        }
        const data = res.data.data;
        setTemplateName(data.name || '');
        setConfig(normalizeOrderConfirmConfig(data.config || {}));
      })
      .catch((error) => console.error(error));
  };

  const validateName = (name) => {
    if (!name || name.length === 0) {
      setNameError('テンプレート名を必ず指定してください。');
      return false;
    }
    if (name.length > 50) {
      setNameError('テンプレート名は50文字以下にしてください。');
      return false;
    }
    setNameError('');
    return true;
  };

  const saveTemplate = () => {
    if (!validateName(templateName)) return;

    setSaving(true);
    api
      .put(`/api/v1/managements/order_confirm_message_templates/${templateId}`, {
        order_confirm_message_template: { name: templateName },
        config: normalizeOrderConfirmConfig(config),
      })
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に保存されました！');
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setSaving(false));
  };

  const handleTemplateNameChange = (value) => {
    setTemplateName(value);
    validateName(value);
  };

  useEffect(() => {
    const userRole = Cookies.get('user_role');
    if (!userRole || userRole !== 'admin_deel') {
      window.location.href = getSignInPath();
      return;
    }

    const id = Cookies.get('order_confirm_message_template_id');
    if (!id) {
      window.location.href = '/v2/admin/order-confirm-template-list';
      return;
    }

    setTemplateId(id);
    loadTemplate(id);
  }, []);

  useAdminHeaderActions(
    <>
      <AdminActionButton
        action="back"
        onClick={() => { window.location.href = '/v2/admin/order-confirm-template-list'; }}
      />
      <AdminActionButton action="save" label="保存" onClick={saveTemplate} loading={saving} />
    </>
  );

  return (
    <AdminPage className="admin-page--order-confirm-template" card={false}>
      <OrderConfirmTemplateForm
        templateName={templateName}
        nameError={nameError}
        onTemplateNameChange={handleTemplateNameChange}
        config={config}
        onConfigChange={setConfig}
      />
    </AdminPage>
  );
}

export default OrderConfirmMessageTemplateEditor;
