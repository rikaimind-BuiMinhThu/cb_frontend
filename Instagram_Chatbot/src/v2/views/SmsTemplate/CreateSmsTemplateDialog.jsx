import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, message } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schema/createSmsTemplateFormSchema';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminActionButton } from 'v2/components/AdminShell';
import {
  SMS_TEMPLATES_PATH,
  CREATE_LABEL,
  TEMPLATE_NAME_LABEL,
  MESSAGE_LABEL,
  CREATE_OK,
  CANCEL,
  CHAR_COUNT_SUFFIX,
  SUCCESS_CREATE,
} from './constants';

const CreateSmsTemplateDialog = ({ botId, resolver }) => {
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
      const response = await api.post(SMS_TEMPLATES_PATH, {
        chatbot_id: botId,
        sms_template: { name: data.name, content: data.content },
      });
      if (response?.data?.code === 2) {
        message.error(response?.data?.message);
      }
      if (response?.data?.code === 1) {
        message.success(SUCCESS_CREATE);
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
      <AdminActionButton action="create" label={CREATE_LABEL} onClick={handleClickOpen} />
      <Modal
        title={CREATE_LABEL}
        open={open}
        onCancel={handleClose}
        onOk={handleSubmit(onSubmit)}
        okText={CREATE_OK}
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
          <Form.Item
            label={TEMPLATE_NAME_LABEL}
            validateStatus={errors?.name ? 'error' : ''}
            help={errors?.name?.message}
            required
          >
            <Input {...register('name')} />
          </Form.Item>
          <Form.Item
            label={MESSAGE_LABEL}
            validateStatus={errors?.content ? 'error' : ''}
            help={errors?.content?.message}
            required
          >
            <Input.TextArea rows={4} {...register('content')} />
          </Form.Item>
          <span className="admin-char-count">{watchContent?.length || 0}{CHAR_COUNT_SUFFIX}</span>
        </Form>
      </Modal>
    </>
  );
};

CreateSmsTemplateDialog.propTypes = {
  botId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  resolver: PropTypes.func.isRequired,
};

export default CreateSmsTemplateDialog;
