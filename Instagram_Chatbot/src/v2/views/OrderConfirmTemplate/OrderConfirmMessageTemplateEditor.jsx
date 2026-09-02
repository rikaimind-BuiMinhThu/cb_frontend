import { useEffect, useState } from 'react';
import { message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { AdminPage, AdminActionButton, useAdminHeaderActions } from 'v2/components/AdminShell';
import OrderConfirmTemplateForm from './OrderConfirmTemplateForm';
import { getAdminRoutePath, getSignInPath } from 'v2/variables/constants';
import {
  getDefaultOrderConfirmConfig,
  normalizeOrderConfirmConfig,
} from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/OrderConfirmLpScriptGenerator';
import {
  API_SUCCESS_CODE,
  API_WARNING_CODE,
  LOAD_FAILED,
  NAME_MAX,
  NAME_MAX_LENGTH,
  NAME_REQUIRED_SHORT,
  ROLE_ADMIN_DEEL,
  SAVE_LABEL,
  SUCCESS_SAVED,
  TEMPLATE_ID_COOKIE_KEY,
  TEMPLATE_LIST_PATH,
  TEMPLATES_API_PATH,
  USER_ROLE_COOKIE_KEY,
} from './constants';

const OrderConfirmMessageTemplateEditor = () => {
  const [templateId, setTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [config, setConfig] = useState(getDefaultOrderConfirmConfig());
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadTemplate = (id) => {
    api
      .get(`${TEMPLATES_API_PATH}/${id}`)
      .then((res) => {
        if (res.data.code !== API_SUCCESS_CODE) {
          message.warning(res.data.message || LOAD_FAILED);
          return;
        }
        const data = res.data.data;
        setTemplateName(data.name || '');
        setConfig(normalizeOrderConfirmConfig(data.config || {}));
      });
  };

  const validateName = (name) => {
    if (!name || name.length === 0) {
      setNameError(NAME_REQUIRED_SHORT);
      return false;
    }
    if (name.length > NAME_MAX_LENGTH) {
      setNameError(NAME_MAX);
      return false;
    }
    setNameError('');
    return true;
  };

  const saveTemplate = () => {
    if (!validateName(templateName)) return;

    setSaving(true);
    api
      .put(`${TEMPLATES_API_PATH}/${templateId}`, {
        order_confirm_message_template: { name: templateName },
        config: normalizeOrderConfirmConfig(config),
      })
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          message.success(SUCCESS_SAVED);
        } else if (res.data.code === API_WARNING_CODE) {
          message.warning(res.data.message);
        }
      })
      .finally(() => setSaving(false));
  };

  const handleTemplateNameChange = (value) => {
    setTemplateName(value);
    validateName(value);
  };

  useEffect(() => {
    const userRole = Cookies.get(USER_ROLE_COOKIE_KEY);
    if (!userRole || userRole !== ROLE_ADMIN_DEEL) {
      window.location.href = getSignInPath();
      return;
    }

    const id = Cookies.get(TEMPLATE_ID_COOKIE_KEY);
    if (!id) {
      window.location.href = getAdminRoutePath(TEMPLATE_LIST_PATH);
      return;
    }

    setTemplateId(id);
    loadTemplate(id);
  }, []);

  useAdminHeaderActions(
    <>
      <AdminActionButton
        action="back"
        onClick={() => { window.location.href = getAdminRoutePath(TEMPLATE_LIST_PATH); }}
      />
      <AdminActionButton action="save" label={SAVE_LABEL} onClick={saveTemplate} loading={saving} />
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
};

export default OrderConfirmMessageTemplateEditor;
