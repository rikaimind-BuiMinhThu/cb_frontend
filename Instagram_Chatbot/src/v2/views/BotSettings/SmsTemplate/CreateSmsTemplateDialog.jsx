import React, { useEffect } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schema/createSmsTemplateFormSchema';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminActionButton } from '../../../components/AdminShell';

export default function CreateSmsTemplateDialog({ botId, resolver }) {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const watchContent = watch('content');

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const response = await api.post(`/api/v1/managements/sms_templates`, {
        chatbot_id: botId,
        sms_template: { name: data.name, content: data.content },
      });
      if (response?.data?.code === 2) {
        message.error(response?.data?.message);
      }
      if (response?.data?.code === 1) {
        message.success('テンプレートが正常に作成されました。');
        resolver(response?.data?.data);
        handleClose();
      }
    } catch (error) {
      if (error.response?.data.code === 0) tokenExpired();
    }
  };

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <>
      <AdminActionButton action="create" label="SMS作成" onClick={handleClickOpen} />
      <Modal
        title="SMS作成"
        open={open}
        onCancel={handleClose}
        onOk={handleSubmit(onSubmit)}
        okText="作成"
        cancelText="キャンセル"
        confirmLoading={isSubmitting}
        width={520}
      >
        <Form
          layout="horizontal"
          colon={false}
          labelAlign="left"
          labelCol={{ flex: '0 0 140px' }}
          wrapperCol={{ flex: 1 }}
        >
          <Form.Item
            label="テンプレート名"
            validateStatus={errors?.name ? 'error' : ''}
            help={errors?.name?.message}
            required
          >
            <Input {...register('name')} />
          </Form.Item>
          <Form.Item
            label="メッセージ"
            validateStatus={errors?.content ? 'error' : ''}
            help={errors?.content?.message}
            required
          >
            <Input.TextArea rows={4} {...register('content')} />
          </Form.Item>
          <span style={{ color: '#6b7280' }}>{watchContent?.length || 0} 文字</span>
        </Form>
      </Modal>
    </>
  );
}
