import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './validates/CreateTableSchema';
import {
  Checkbox,
  Input,
  Select,
  Form,
  Typography,
  Modal,
  Space,
  DatePicker,
  Row,
  Col,
  Button,
  message,
  Divider,
} from 'antd';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { MinusCircleOutlined } from '@ant-design/icons';
import { sinceMinutesOptions, hoursOptions, sinceOptions } from './utils';
import moment from 'moment';
import { AdminActionButton } from 'v2/components/AdminShell';
import {
  PUSH_MESSAGES_PATH,
  EMAILS_PATH,
  SMS_TEMPLATES_PATH,
  CREATE_LABEL,
  EDIT_TITLE,
  SAVE_OK,
  CANCEL,
  SUCCESS_SAVE,
  LABEL_NAME,
  PLACEHOLDER_NAME,
  NAME_HINT,
  LABEL_SENDING_METHOD,
  LABEL_TEMPLATE,
  LABEL_START_TIME,
  START_TIME_HINT,
  LABEL_EXCLUDE_TIME,
  LABEL_EXCLUDE_RANGE,
  LABEL_ALTERNATE_TIME,
  EXCLUDE_RANGE_SEPARATOR,
  EXCLUDE_PUSH_TIME_ERROR,
  FILTER_TITLE,
  FILTER_HINT,
  FILTER_VAR_LABEL,
  FILTER_LAST_LABEL,
  FILTER_OF_LABEL,
  BTN_ADD_CONDITION,
  TAG_EMAIL,
  TAG_SMS,
  METHOD_EMAIL,
  METHOD_SMS,
  STATUS_UNSUBSCRIBE,
  DATETIME_FORMAT,
  DEFAULT_HOUR,
  FILTER_VAR_VALUE,
  FILTER_LAST_VALUE,
  FILTER_OF_VALUE,
  FILTER_AND_VALUE,
  OPERATOR_CONTAINS,
  OPERATOR_IS,
  OPERATOR_IS_NOT,
  OPERATOR_AND,
} from './constants';

const SENDING_METHOD_OPTIONS = [
  { value: METHOD_EMAIL, label: TAG_EMAIL },
  { value: METHOD_SMS, label: TAG_SMS },
];

const FILTER_VAR_OPTIONS = [{ value: FILTER_VAR_VALUE, label: FILTER_VAR_LABEL }];
const FILTER_LAST_OPTIONS = [{ value: FILTER_LAST_VALUE, label: FILTER_LAST_LABEL }];
const FILTER_OF_OPTIONS = [{ value: FILTER_OF_VALUE, label: FILTER_OF_LABEL }];
const FILTER_AND_OPTIONS = [{ value: FILTER_AND_VALUE, label: OPERATOR_AND }];

const COMPARISON_OPTIONS = [
  { value: OPERATOR_CONTAINS, label: OPERATOR_CONTAINS },
  { value: OPERATOR_IS, label: OPERATOR_IS },
  { value: OPERATOR_IS_NOT, label: OPERATOR_IS_NOT },
];

const SavePushMessageDialog = ({
  botId,
  resolver,
  item,
  onCancel,
}) => {
  const [open, setOpen] = useState(false);
  const [emailTemplateOptions, setEmailTemplateOptions] = useState([]);
  const [smsTemplateOptions, setSmsTemplateOptions] = useState([]);
  const [variables, setVariables] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);

  const {
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: item?.title || '',
      sending_method: item?.sending_method || METHOD_EMAIL,
      sending_template: item
        ? item.sending_method === METHOD_EMAIL
          ? item.email_id
          : item.sms_template_id
        : undefined,
      is_exclude_time: item?.has_timezone_exclusion === 'yes' ? true : false,
      exclude_start_time: item?.excluded_time_from || 0,
      exclude_end_time: item?.excluded_time_to || 0,
      exclude_push_time: item?.alternate_send_time || 0,
      last_message_datetime_since:
        item?.last_message_datetime_since || sinceMinutesOptions[0].value,
      start_time: item
        ? moment(item.started_at, DATETIME_FORMAT)
        : undefined,
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset({
      name: '',
      sending_method: METHOD_EMAIL,
      sending_template: undefined,
      is_exclude_time: false,
      exclude_start_time: 0,
      exclude_end_time: 0,
      exclude_push_time: 0,
      last_message_datetime_since: sinceMinutesOptions[0].value,
      start_time: undefined,
    });
    setSelectedVariables([]);
    onCancel?.();
  };

  const watchSendingMethod = watch('sending_method');
  const watchIsExcludeTime = watch('is_exclude_time');
  const watchExculdeTime = watch([
    'exclude_start_time',
    'exclude_end_time',
    'exclude_push_time',
  ]);
  const excludeFrom = watchExculdeTime[0];
  const excludeTo = watchExculdeTime[1];
  const excludePushTime = watchExculdeTime[2];

  const onSubmit = async (data) => {
    const push_message = {
      title: data.name,
      sending_method: data.sending_method,
      email_id: data.sending_method === METHOD_EMAIL ? data.sending_template : null,
      sms_template_id:
        data.sending_method === METHOD_SMS ? data.sending_template : null,
      started_at: data.start_time,
      has_timezone_exclusion: data.is_exclude_time,
      excluded_time_from: data.exclude_start_time,
      excluded_time_to: data.exclude_end_time,
      alternate_send_time: data.exclude_push_time,
      subscribe_status: item?.subscribe_status || STATUS_UNSUBSCRIBE,
      last_message_datetime_since: data.last_message_datetime_since,
      variables: selectedVariables,
    };
    try {
      const response = item
        ? await api.put(`${PUSH_MESSAGES_PATH}/${item.id}`, {
            chatbot_id: botId,
            push_message,
          })
        : await api.post(
            `${PUSH_MESSAGES_PATH}?chatbot_id=${botId}`,
            {
              push_message,
            }
          );
      if (response?.data?.code === 2) {
        message.warning(response?.data?.message);
      }
      if (response?.data?.code === 1) {
        message.success(SUCCESS_SAVE);
        resolver(response?.data?.data);
        handleClose();
      }
    } catch (error) {
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    }
  };

  useEffect(() => {
    const request = { cancelled: false };
    api
      .get(`${EMAILS_PATH}?page=all&chatbot_id=${botId}`)
      .then((res) => {
        if (request.cancelled) return;
        if (res.data.code === 1) {
          const options = res.data?.data?.map((each) => ({
            value: each.id,
            label: each.email_template_name,
          }));
          setEmailTemplateOptions(options);
          if (!item && options.length > 0) {
            setValue('sending_template', options[0].value);
          }
        }
      })
      .catch((err) => {
        if (request.cancelled) return;
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      request.cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- adding item may reset form on parent rerender
  }, [botId, setValue]);

  useEffect(() => {
    const request = { cancelled: false };
    api
      .get(`${SMS_TEMPLATES_PATH}?page=all&chatbot_id=${botId}`)
      .then((res) => {
        if (request.cancelled) return;
        if (res.data.code === 1) {
          const options = res.data?.data?.map((each) => ({
            value: each.id,
            label: each.name,
          }));
          setSmsTemplateOptions(options);
        }
      })
      .catch((err) => {
        if (request.cancelled) return;
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      request.cancelled = true;
    };
  }, [botId]);

  useEffect(() => {
    if (!watchIsExcludeTime) {
      return;
    }

    const [from, to, pushTime] = [excludeFrom, excludeTo, excludePushTime];
    const hours = [...Array(24).keys()];

    if (from < to) {
      const rangeHours = hours.slice(from, to + 1);
      if (rangeHours.includes(pushTime)) {
        setError('exclude_push_time', {
          type: 'custom',
          message: EXCLUDE_PUSH_TIME_ERROR,
        });
        return;
      }
    }

    if (from > to || from === to) {
      const fromHours = hours.slice(from, hours.length);
      const toHours = hours.slice(0, to + 1);
      const rangeHours = [...fromHours, ...toHours];
      if (rangeHours.includes(pushTime)) {
        setError('exclude_push_time', {
          type: 'custom',
          message: EXCLUDE_PUSH_TIME_ERROR,
        });
        return;
      }
    }
    clearErrors('exclude_push_time');
  }, [
    watchIsExcludeTime,
    excludeFrom,
    excludeTo,
    excludePushTime,
    watchExculdeTime,
    clearErrors,
    setError,
  ]);

  useEffect(() => {
    const request = { cancelled: false };
    api
      .get(`/api/v1/managements/chatbots/${botId}/variables?page=all`)
      .then((res) => {
        if (request.cancelled) return;
        const vars = res.data.data.map((each) => ({
          value: each.id,
          label: each.variable_name,
        }));
        setVariables(vars);
      })
      .catch((err) => {
        if (request.cancelled) return;
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      request.cancelled = true;
    };
  }, [botId]);

  useEffect(() => {
    if (item) {
      handleClickOpen();
    }
  }, [item]);

  useEffect(() => {
    if (item && item.push_message_variables > 0) {
      setSelectedVariables(
        item?.push_message_variables.map((each) => ({
          variable_id: each.id,
          value: each.value,
          operator: each.operator,
        }))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate from item.push_message_variables; full item identity is unstable
  }, [item?.push_message_variables]);

  return (
    <div>
      {!item && (
        <AdminActionButton
          action="create"
          label={CREATE_LABEL}
          onClick={handleClickOpen}
        />
      )}
      <Modal
        className="admin-push-modal"
        title={item ? EDIT_TITLE : CREATE_LABEL}
        open={open}
        okText={SAVE_OK}
        cancelText={CANCEL}
        confirmLoading={isSubmitting}
        onCancel={handleClose}
        onOk={handleSubmit(onSubmit)}
        onClose={handleClose}
      >
        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 24 }}>
          <Form.Item
            label={LABEL_NAME}
            required
            validateStatus={errors?.name?.message ? 'error' : undefined}
            help={errors?.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input placeholder={PLACEHOLDER_NAME} {...field} />
              )}
            />
            <Typography.Text>
              {NAME_HINT}
            </Typography.Text>
          </Form.Item>
          <Form.Item
            label={LABEL_SENDING_METHOD}
            required
            validateStatus={
              errors?.sending_method?.message ? 'error' : undefined
            }
            help={errors?.sending_method?.message}
          >
            <Controller
              name="sending_method"
              control={control}
              render={({ field }) => (
                <Select
                  options={SENDING_METHOD_OPTIONS}
                  {...field}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label={LABEL_TEMPLATE}
            required
            validateStatus={
              errors?.sending_template?.message ? 'error' : undefined
            }
            help={errors?.sending_template?.message}
          >
            <Controller
              name="sending_template"
              control={control}
              render={({ field }) => (
                <Select
                  options={
                    watchSendingMethod === METHOD_EMAIL
                      ? emailTemplateOptions
                      : smsTemplateOptions
                  }
                  {...field}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label={LABEL_START_TIME}
            required
            validateStatus={errors?.start_time?.message ? 'error' : undefined}
            help={errors?.start_time?.message}
          >
            <Space direction="vertical">
              <Controller
                control={control}
                name="start_time"
                render={({ field }) => (
                  <DatePicker
                    format={DATETIME_FORMAT}
                    showTime={true}
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                    {...field}
                  />
                )}
              />
              <Typography.Text>
                {START_TIME_HINT}
              </Typography.Text>
            </Space>
          </Form.Item>
          <Form.Item
            label={LABEL_EXCLUDE_TIME}
            validateStatus={
              errors?.is_exclude_time?.message ? 'error' : undefined
            }
            help={errors?.is_exclude_time?.message}
          >
            <Controller
              control={control}
              name="is_exclude_time"
              render={({ field }) => (
                <Checkbox {...field} checked={field.value} />
              )}
            />
          </Form.Item>
          {watchIsExcludeTime && (
            <>
              <Form.Item label={LABEL_EXCLUDE_RANGE} required>
                <Space direction="horizontal">
                  <Controller
                    name="exclude_start_time"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={DEFAULT_HOUR}
                        options={hoursOptions}
                        {...field}
                      />
                    )}
                  />
                  {EXCLUDE_RANGE_SEPARATOR}
                  <Controller
                    name="exclude_end_time"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={DEFAULT_HOUR}
                        options={hoursOptions}
                        {...field}
                      />
                    )}
                  />
                </Space>
              </Form.Item>
              <Form.Item
                label={LABEL_ALTERNATE_TIME}
                required
                validateStatus={
                  errors?.exclude_push_time?.message ? 'error' : undefined
                }
                help={errors?.exclude_push_time?.message}
              >
                <Space direction="horizontal">
                  <Controller
                    name="exclude_push_time"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={DEFAULT_HOUR}
                        options={hoursOptions}
                        {...field}
                      />
                    )}
                  />
                </Space>
              </Form.Item>
            </>
          )}
          <Divider />
          <Row>
            <Space direction="vertical">
              <Typography.Text strong>{FILTER_TITLE}</Typography.Text>
              <Typography.Text>
                {FILTER_HINT}
              </Typography.Text>
            </Space>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={4}> </Col>
            <Col span={3}>
              <Select
                defaultValue={FILTER_VAR_VALUE}
                options={FILTER_VAR_OPTIONS}
              />
            </Col>
            <Col span={6}>
              <Select
                defaultValue={FILTER_LAST_VALUE}
                options={FILTER_LAST_OPTIONS}
              />
            </Col>
            <Col span={3}>
              <Select
                defaultValue={FILTER_OF_VALUE}
                options={FILTER_OF_OPTIONS}
              />
            </Col>
            <Col span={4}>
              <Controller
                name="last_message_datetime_since"
                control={control}
                render={({ field }) => (
                  <Select
                    defaultValue={sinceMinutesOptions[0]}
                    options={sinceOptions}
                    {...field}
                    className="push-select-min-width"
                  />
                )}
              />
            </Col>
            <Col span={4}> </Col>
          </Row>
          {variables.length > 0 && (
            <Row gutter={[16, 16]} className="push-variables-row">
              <Col span={24}>
                <Form.List
                  name="variables"
                  initialValue={item?.push_message_variables?.map(
                    (_, index) => ({
                      fieldKey: index,
                      isListField: true,
                      key: index,
                      name: index,
                    })
                  )}
                >
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={16} className="push-variables-row" key={name}>
                          <Col span={4}>
                            <Form.Item {...restField} name={[name, 'and']}>
                              <Select
                                defaultValue={FILTER_AND_VALUE}
                                options={FILTER_AND_OPTIONS}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item {...restField} name={[name, 'var']}>
                              <Select
                                defaultValue={FILTER_VAR_VALUE}
                                options={FILTER_VAR_OPTIONS}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'variable']}
                            >
                              <Select
                                defaultValue={
                                  item
                                    ? item.push_message_variables[name]
                                        ?.variable_id
                                    : variables[0]?.value
                                }
                                options={variables}
                                onChange={(value) =>
                                  setSelectedVariables((pre) =>
                                    pre.map((each, index) =>
                                      index === name
                                        ? { ...each, variable_id: value }
                                        : each
                                    )
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'comparation']}
                              required
                            >
                              <Select
                                defaultValue={
                                  item
                                    ? item.push_message_variables[name]
                                        ?.operator
                                    : OPERATOR_IS
                                }
                                options={COMPARISON_OPTIONS}
                                onChange={(value) =>
                                  setSelectedVariables((pre) =>
                                    pre.map((each, index) =>
                                      index === name
                                        ? { ...each, operator: value }
                                        : each
                                    )
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>

                          <Col span={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'value']}
                              required
                            >
                              <Input
                                defaultValue={
                                  item
                                    ? item.push_message_variables[name]?.value
                                    : ''
                                }
                                onChange={(e) => {
                                  setSelectedVariables((pre) =>
                                    pre.map((each, index) =>
                                      index === name
                                        ? { ...each, value: e.target.value }
                                        : each
                                    )
                                  );
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => {
                                remove(name);
                                setSelectedVariables((pre) =>
                                  pre.filter((_, index) => index !== name)
                                );
                              }}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Space
                          direction="vertical"
                          className="push-add-condition-space"
                        >
                          <Button
                            onClick={() => {
                              add();
                              setSelectedVariables((pre) => [
                                ...pre,
                                {
                                  variable_id: variables[0].value,
                                  value: '',
                                  operator: OPERATOR_IS,
                                },
                              ]);
                            }}
                            type="primary"
                          >
                            {BTN_ADD_CONDITION}
                          </Button>
                        </Space>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </div>
  );
};

SavePushMessageDialog.propTypes = {
  botId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  resolver: PropTypes.func.isRequired,
  item: PropTypes.object,
  onCancel: PropTypes.func,
};

export default SavePushMessageDialog;
