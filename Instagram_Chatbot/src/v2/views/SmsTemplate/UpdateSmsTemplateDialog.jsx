import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, message } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schema/createSmsTemplateFormSchema';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  SMS_TEMPLATES_PATH,
  EDIT_TITLE,
  TEMPLATE_NAME_LABEL,
  MESSAGE_LABEL,
  SAVE_OK,
  CANCEL,
  CHAR_COUNT_SUFFIX,
  SUCCESS_SAVE,
} from './constants';

const UpdateSmsTemplateDialog = ({ botId, resolver, id, open }) => {
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
      const response = await api.put(`${SMS_TEMPLATES_PATH}/${id}`, {
        chatbot_id: botId,
        sms_template: { name: data.name, content: data.content },
      });
      if (response?.data?.code === 2) {
        message.error(response?.data?.message);
      }
      if (response?.data?.code === 1) {
        message.success(SUCCESS_SAVE);
        resolver(response?.data?.data);
      }
    } catch (error) {
      if (error.response?.data.code === 0) tokenExpired();
    }
  };

  useEffect(() => {
    const request = { cancelled: false };
    if (open && id) {
      api
        .get(`${SMS_TEMPLATES_PATH}/${id}`, { params: { chatbot_id: botId } })
        .then((res) => {
          if (request.cancelled) return;
          if (res?.data.code === 1) {
            setValue('name', res?.data?.data?.name, { shouldValidate: true });
            setValue('content', res?.data?.data?.content, { shouldValidate: true });
          }
          if (res?.data.code === 2) resolver();
        })
        .catch((error) => {
          if (request.cancelled) return;
          if (error.response?.data.code === 0) tokenExpired();
        });
    }
    if (!open) reset();
    return () => {
      request.cancelled = true;
    };
  }, [open, id, botId, setValue, reset, resolver]);

  return (
    <Modal
      title={EDIT_TITLE}
      open={open}
      onCancel={() => resolver()}
      onOk={handleSubmit(onSubmit)}
      okText={SAVE_OK}
      cancelText={CANCEL}
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
        <Form.Item label={TEMPLATE_NAME_LABEL} validateStatus={errors?.name ? 'error' : ''} help={errors?.name?.message} required>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item label={MESSAGE_LABEL} validateStatus={errors?.content ? 'error' : ''} help={errors?.content?.message} required>
          <Controller
            name="content"
            control={control}
            render={({ field }) => <Input.TextArea rows={4} {...field} />}
          />
        </Form.Item>
        <span className="admin-char-count">{watchContent?.length || 0}{CHAR_COUNT_SUFFIX}</span>
      </Form>
    </Modal>
  );
};

UpdateSmsTemplateDialog.propTypes = {
  botId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  resolver: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  open: PropTypes.bool.isRequired,
};

export default UpdateSmsTemplateDialog;
