import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { MAX_LABEL_NAME_LENGTH } from '../constants';

function AddLabelModal({ open, loading, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [form, open]);

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit?.(values.name.trim());
    form.resetFields();
  };

  return (
    <Modal
      title="ラベル追加"
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
          name="name"
          label="ラベル名"
          rules={[
            { required: true, message: '入力してください。' },
            { max: MAX_LABEL_NAME_LENGTH, message: `最大${MAX_LABEL_NAME_LENGTH}文字` },
          ]}
        >
          <Input placeholder="ラベル名" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddLabelModal;
