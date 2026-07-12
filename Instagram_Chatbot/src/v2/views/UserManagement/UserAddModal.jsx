import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { AdminActionButton } from '../../components/AdminShell';
import { EMAIL_REGEX, ROLE_OPTIONS } from './constants';

function UserAddModal({ open, onClose, listClient, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ role: 'admin_client' });
    }
  }, [open, form]);

  function handleOk() {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  }

  const clientOptions =
    listClient?.clients?.map((client) => ({
      value: client.id,
      label: client.name,
    })) || [];

  return (
    <Modal
      title="ユーザー追加"
      visible={open}
      onCancel={onClose}
      width={520}
      destroyOnClose
      footer={
        <div className="admin-form-actions">
          <AdminActionButton action="cancel" onClick={onClose} />
          <AdminActionButton action="create" label="追加" onClick={handleOk} />
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="名称"
          name="full_name"
          rules={[
            { required: true, message: '入力してください。' },
            { max: 35, message: '35文字以下入力してください。' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="ログインID"
          name="email"
          rules={[
            { required: true, message: 'メールアドレス を入力してください。' },
            { max: 35, message: '35文字以下入力してください。' },
            { pattern: EMAIL_REGEX, message: 'メールの正しい形式で入力してください：abc@abc.com' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="パスワード"
          name="password"
          rules={[
            { required: true, message: '入力してください。' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (value.length < 6 || value.length > 24) {
                  return Promise.reject(
                    new Error('24文字以下入力してください。6文字以上入力してください。')
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="パスワード（確認用）"
          name="password_confirmation"
          dependencies={['password']}
          rules={[
            { required: true, message: '入力してください。' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('パスワードが一致しません。もう一度ご入力ください。')
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="クライアント"
          name="client_id"
          rules={[{ required: true, message: 'クライアントを選択してください。' }]}
        >
          <Select options={clientOptions} placeholder="クライアントを選択" />
        </Form.Item>
        <Form.Item
          label="権限"
          name="role"
          rules={[{ required: true, message: '権限を選択してください。' }]}
        >
          <Select options={ROLE_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserAddModal;
