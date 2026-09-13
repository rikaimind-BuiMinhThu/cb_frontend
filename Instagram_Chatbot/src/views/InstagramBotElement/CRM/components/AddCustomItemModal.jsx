import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { MAX_CUSTOM_FIELD_LENGTH } from '../constants';

function AddCustomItemModal({ open, loading, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [form, open]);

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit?.({
      title: values.title.trim(),
      value: values.value.trim(),
    });
    form.resetFields();
  };

  return (
    <Modal
      title="集客データ追加"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="追加"
      cancelText="キャンセル"
      confirmLoading={loading}
      centered
      width={400}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="タイトル"
          rules={[
            { required: true, message: '入力してください。' },
            { max: MAX_CUSTOM_FIELD_LENGTH, message: `最大${MAX_CUSTOM_FIELD_LENGTH}文字` },
          ]}
        >
          <Input placeholder="タイトル" />
        </Form.Item>
        <Form.Item
          name="value"
          label="値"
          rules={[
            { required: true, message: '入力してください。' },
            { max: MAX_CUSTOM_FIELD_LENGTH, message: `最大${MAX_CUSTOM_FIELD_LENGTH}文字` },
          ]}
        >
          <Input placeholder="値" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddCustomItemModal;
