import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select } from 'antd';
import { AdminActionButton } from 'v2/components/AdminShell';
import {
  ADD_BUTTON_LABEL,
  ADD_USER_TITLE,
  CLIENT_REQUIRED,
  EMAIL_FORMAT,
  EMAIL_REGEX,
  FORM_LABEL_COL,
  FORM_WRAPPER_COL,
  LABEL_CLIENT,
  LABEL_LOGIN_ID,
  LABEL_NAME,
  LABEL_PASSWORD,
  LABEL_PASSWORD_CONFIRM,
  LABEL_ROLE,
  LOGIN_MAX,
  LOGIN_REQUIRED,
  NAME_MAX,
  NAME_MAX_LENGTH,
  NAME_REQUIRED,
  PASSWORD_CONFIRM_REQUIRED,
  PASSWORD_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MISMATCH,
  PASSWORD_REQUIRED,
  PLACEHOLDER_CLIENT,
  ROLE_ADMIN_CLIENT,
  ROLE_OPTIONS,
  ROLE_REQUIRED,
  USER_MODAL_WIDTH,
} from './constants';

const validatePasswordLength = (_, value) => {
  if (!value) return Promise.resolve();
  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
    return Promise.reject(new Error(PASSWORD_LENGTH));
  }
  return Promise.resolve();
};

const UserAddModal = ({ open, onClose, listClient, onSubmit, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ role: ROLE_ADMIN_CLIENT });
    }
  }, [open, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  const clientOptions =
    listClient?.clients?.map((client) => ({
      value: client.id,
      label: client.name,
    })) || [];

  return (
    <Modal
      title={ADD_USER_TITLE}
      open={open}
      onCancel={onClose}
      width={USER_MODAL_WIDTH}
      destroyOnClose
      footer={
        <div className="admin-form-actions">
          <AdminActionButton action="cancel" onClick={onClose} />
          <AdminActionButton action="create" label={ADD_BUTTON_LABEL} onClick={handleOk} loading={loading} />
        </div>
      }
    >
      <Form
        form={form}
        layout="horizontal"
        colon={false}
        labelAlign="left"
        labelCol={FORM_LABEL_COL}
        wrapperCol={FORM_WRAPPER_COL}
      >
        <Form.Item
          label={LABEL_NAME}
          name="full_name"
          rules={[
            { required: true, message: NAME_REQUIRED },
            { max: NAME_MAX_LENGTH, message: NAME_MAX },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={LABEL_LOGIN_ID}
          name="email"
          rules={[
            { required: true, message: LOGIN_REQUIRED },
            { max: NAME_MAX_LENGTH, message: LOGIN_MAX },
            { pattern: EMAIL_REGEX, message: EMAIL_FORMAT },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={LABEL_PASSWORD}
          name="password"
          rules={[
            { required: true, message: PASSWORD_REQUIRED },
            { validator: validatePasswordLength },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={LABEL_PASSWORD_CONFIRM}
          name="password_confirmation"
          dependencies={['password']}
          rules={[
            { required: true, message: PASSWORD_CONFIRM_REQUIRED },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(PASSWORD_MISMATCH));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={LABEL_CLIENT}
          name="client_id"
          rules={[{ required: true, message: CLIENT_REQUIRED }]}
        >
          <Select options={clientOptions} placeholder={PLACEHOLDER_CLIENT} />
        </Form.Item>
        <Form.Item
          label={LABEL_ROLE}
          name="role"
          rules={[{ required: true, message: ROLE_REQUIRED }]}
        >
          <Select options={ROLE_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UserAddModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  listClient: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

export default UserAddModal;
