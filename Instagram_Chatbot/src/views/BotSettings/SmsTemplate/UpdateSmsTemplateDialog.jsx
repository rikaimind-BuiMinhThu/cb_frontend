import React, { useEffect } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schema/createSmsTemplateFormSchema';
import api from 'api/api-management';
import { tokenExpired } from 'api/tokenExpired';

export default function UpdateSmsTemplateDialog({ botId, resolver, id, open }) {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', content: '' },
  });

  const watchContent = watch('content');

  const onSubmit = async (data) => {
    try {
      const response = await api.put(`/api/v1/managements/sms_templates/${id}`, {
        chatbot_id: botId,
        sms_template: { name: data.name, content: data.content },
      });
      if (response?.data?.code === 2) {
        message.error(response?.data?.message);
      }
      if (response?.data?.code === 1) {
        message.success('SMSを正常に保存しました。');
        resolver(response?.data?.data);
      }
    } catch (error) {
      if (error.response?.data.code === 0) tokenExpired();
    }
  };

  useEffect(() => {
    if (open && id) {
      api
        .get(`/api/v1/managements/sms_templates/${id}`, { params: { chatbot_id: botId } })
        .then((res) => {
          if (res?.data.code === 1) {
            setValue('name', res?.data?.data?.name, true);
            setValue('content', res?.data?.data?.content, true);
          }
          if (res?.data.code === 2) resolver();
        })
        .catch((error) => {
          if (error.response?.data.code === 0) tokenExpired();
        });
    }
    if (!open) reset();
  }, [open, id, botId, setValue, reset, resolver]);

  return (
    <Modal
      title="SMS編集"
      open={open}
      onCancel={() => resolver()}
      onOk={handleSubmit(onSubmit)}
      okText="保存"
      cancelText="閉じる"
      confirmLoading={isSubmitting}
      width={520}
    >
      <Form layout="vertical">
        <Form.Item label="テンプレート名" validateStatus={errors?.name ? 'error' : ''} help={errors?.name?.message} required>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item label="メッセージ" validateStatus={errors?.content ? 'error' : ''} help={errors?.content?.message} required>
          <Controller
            name="content"
            control={control}
            render={({ field }) => <Input.TextArea rows={4} {...field} />}
          />
        </Form.Item>
        <span style={{ color: '#6b7280' }}>{watchContent?.length || 0} 文字</span>
      </Form>
    </Modal>
  );
}
