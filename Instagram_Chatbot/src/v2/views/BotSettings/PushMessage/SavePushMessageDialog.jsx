import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "./validates/CreateTableSchema";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Divider } from "antd";
import { Checkbox } from "antd";
import { Input } from "antd";
import { Select } from "antd";
import { Form } from "antd";
import { Typography } from "antd";
import { Modal, Space, DatePicker, Row, Col, Button } from "antd";
import api from "api/api-management";
import { tokenExpired } from "v2/api/tokenExpired";
import { MinusCircleOutlined } from "@ant-design/icons";
import { sinceMinutesOptions, hoursOptions, sinceOptions } from "./utils";
import moment from "moment";
import { AdminActionButton } from "../../../components/AdminShell";

export default function SavePushMessageDialog({
  botId,
  resolver,
  item,
  onCancel,
}) {
  console.log(item);
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [emailTemplateOptions, setEmailTemplateOptions] = React.useState([]);
  const [smsTemplateOptions, setSmsTemplateOptions] = React.useState([]);
  const [variables, setVariables] = React.useState([]);
  const [selectedVariables, setSelectedVariables] = React.useState([]);

  const {
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: item?.title || "",
      sending_method: item?.sending_method || "email",
      sending_template: item
        ? item.sending_method === "email"
          ? item.email_id
          : item.sms_template_id
        : undefined,
      is_exclude_time: item?.has_timezone_exclusion === "yes" ? true : false,
      exclude_start_time: item?.excluded_time_from || 0,
      exclude_end_time: item?.excluded_time_to || 0,
      exclude_push_time: item?.alternate_send_time || 0,
      last_message_datetime_since:
        item?.last_message_datetime_since || sinceMinutesOptions[0].value,
      start_time: item
        ? moment(item.started_at, "YYYY-MM-DD HH:mm")
        : undefined,
    },
  });

  const handleOpenToast = () => {
    setOpenToast(true);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
    setErrorMessage("");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCancel?.();
  };

  const watchSendingMethod = watch("sending_method");
  const watchIsExcludeTime = watch("is_exclude_time");
  const watchExculdeTime = watch([
    "exclude_start_time",
    "exclude_end_time",
    "exclude_push_time",
  ]);

  const onSubmit = async (data) => {
    const push_message = {
      title: data.name,
      sending_method: data.sending_method,
      email_id: data.sending_method === "email" ? data.sending_template : null,
      sms_template_id:
        data.sending_method === "sms" ? data.sending_template : null,
      started_at: data.start_time,
      has_timezone_exclusion: data.is_exclude_time,
      excluded_time_from: data.exclude_start_time,
      excluded_time_to: data.exclude_end_time,
      alternate_send_time: data.exclude_push_time,
      subscribe_status: item?.subscribe_status || "unsubscribe",
      last_message_datetime_since: data.last_message_datetime_since,
      variables: selectedVariables,
    };
    try {
      const response = item
        ? await api.put(`/api/v1/managements/push_messages/${item.id}`, {
            chatbot_id: botId,
            push_message,
          })
        : await api.post(
            `/api/v1/managements/push_messages?chatbot_id=${botId}`,
            {
              push_message,
            }
          );
      if (response?.data?.code === 2) {
        handleOpenToast();
        setErrorMessage(response?.data?.message);
      }
      if (response?.data?.code === 1) {
        handleOpenToast();
        resolver(response?.data?.data);
        handleClose();
      }
    } catch (error) {
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    }
  };

  React.useEffect(() => {
    api
      .get(`/api/v1/managements/emails?page=all&chatbot_id=${botId}`)
      .then((res) => {
        if (res.data.code == 1) {
          const options = res.data?.data?.map((each) => ({
            value: each.id,
            label: each.email_template_name,
          }));
          setEmailTemplateOptions(options);
          if (!item && options.length > 0) {
            setValue("sending_template", options[0].value);
          }
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, [botId]);

  React.useEffect(() => {
    api
      .get(`/api/v1/managements/sms_templates?page=all&chatbot_id=${botId}`)
      .then((res) => {
        if (res.data.code == 1) {
          const options = res.data?.data?.map((each) => ({
            value: each.id,
            label: each.name,
          }));
          setSmsTemplateOptions(options);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, [botId]);

  React.useEffect(() => {
    if (!watchIsExcludeTime) {
      return;
    }

    const [from, to, pushTime] = watchExculdeTime;
    const hours = [...Array(24).keys()];

    if (from < to) {
      const rangeHours = hours.slice(from, to + 1);
      if (rangeHours.includes(pushTime)) {
        setError("exclude_push_time", {
          type: "custom",
          message: "代替送信時間を除外時間以外と設定してください。",
        });
        return;
      }
    }

    if (from > to || from === to) {
      const fromHours = hours.slice(from, hours.length);
      const toHours = hours.slice(0, to + 1);
      const rangeHours = [...fromHours, ...toHours];
      if (rangeHours.includes(pushTime)) {
        setError("exclude_push_time", {
          type: "custom",
          message: "代替送信時間を除外時間以外と設定してください。",
        });
        return;
      }
    }
    clearErrors("exclude_push_time");
  }, [
    watchIsExcludeTime,
    watchExculdeTime[0],
    watchExculdeTime[1],
    watchExculdeTime[2],
  ]);

  React.useEffect(() => {
    api
      .get(`/api/v1/managements/chatbots/${botId}/variables?page=all`)
      .then((res) => {
        const vars = res.data.data.map((each) => ({
          value: each.id,
          label: each.variable_name,
        }));
        setVariables(vars);
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  React.useEffect(() => {
    if (item) {
      handleClickOpen();
    }
  }, [item]);

  React.useEffect(() => {
    if (item && item.push_message_variables > 0) {
      setSelectedVariables(
        item?.push_message_variables.map((each) => {
          return {
            variable_id: each.id,
            value: each.value,
            operator: each.operator,
          };
        })
      );
    }
  }, [item?.push_message_variables]);

  return (
    <div>
      {!item && (
        <AdminActionButton
          action="create"
          label="プッシュメッセージ作成"
          onClick={handleClickOpen}
        />
      )}
      <Modal
        style={{ top: 20 }}
        title="プッシュメッセージ作成"
        open={open}
        okText="保存"
        cancelText="キャンセル"
        onCancel={handleClose}
        onOk={handleSubmit(onSubmit)}
        onClose={handleClose}
      >
        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 24 }}>
          {/** name */}
          <Form.Item
            label="プッシュメッセージ名"
            required
            validateStatus={errors?.name?.message ? "error" : undefined}
            help={errors?.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input placeholder="プッシュメッセージ名" {...field} />
              )}
            />
            <Typography.Text>
              ※プッシュメッセージに任意の名前をつけます。この名称がチャットに表示されることはありません。
            </Typography.Text>
          </Form.Item>
          {/** method */}
          <Form.Item
            label="送信方法"
            required
            validateStatus={
              errors?.sending_method?.message ? "error" : undefined
            }
            help={errors?.sending_method?.message}
          >
            <Controller
              name="sending_method"
              control={control}
              render={({ field }) => (
                <Select
                  options={[
                    { value: "email", label: "メール" },
                    { value: "sms", label: "SMS" },
                  ]}
                  {...field}
                />
              )}
            />
          </Form.Item>
          {/** template */}
          <Form.Item
            label="鋳型"
            required
            validateStatus={
              errors?.sending_template?.message ? "error" : undefined
            }
            help={errors?.sending_template?.message}
          >
            <Controller
              name="sending_template"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    options={
                      watchSendingMethod === "email"
                        ? emailTemplateOptions
                        : smsTemplateOptions
                    }
                    {...field}
                  />
                );
              }}
            />
          </Form.Item>
          {/** Start time */}
          <Form.Item
            label="開始日時"
            required
            validateStatus={errors?.start_time?.message ? "error" : undefined}
            help={errors?.start_time?.message}
          >
            <Space direction="vertical">
              <Controller
                control={control}
                name="start_time"
                render={({ field }) => (
                  <DatePicker
                    format="YYYY-MM-DD HH:mm"
                    showTime={true}
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                    {...field}
                  />
                )}
              />
              <Typography.Text>
                ※プッシュメッセージを送信する日時を指定します。
              </Typography.Text>
            </Space>
          </Form.Item>
          {/** exclude time */}
          <Form.Item
            label="自動送信プッシュの時間帯除外"
            validateStatus={
              errors?.is_exclude_time?.message ? "error" : undefined
            }
            help={errors?.is_exclude_time?.message}
          >
            <Controller
              control={control}
              name="is_exclude_time"
              render={({ field }) => (
                <Checkbox {...field} checked={field.value}></Checkbox>
              )}
            />
          </Form.Item>
          {watchIsExcludeTime && (
            <>
              <Form.Item label="除外時間" required>
                <Space direction="horizontal">
                  <Controller
                    name="exclude_start_time"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={"00"}
                        options={hoursOptions}
                        {...field}
                      />
                    )}
                  />
                  ~
                  <Controller
                    name="exclude_end_time"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={"00"}
                        options={hoursOptions}
                        {...field}
                      />
                    )}
                  />
                </Space>
              </Form.Item>
              <Form.Item
                label="代替送信時間"
                required
                validateStatus={
                  errors?.exclude_push_time?.message ? "error" : undefined
                }
                help={errors?.exclude_push_time?.message}
              >
                <Space direction="horizontal">
                  <Controller
                    name="exclude_push_time"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={"00"}
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
          {/** filter */}
          <Row>
            <Space direction="vertical">
              <Typography.Text strong>対象者指定</Typography.Text>
              <Typography.Text>
                ※条件を加えることでプッシュメッセージを送信する対象者を絞り込むことができます。
              </Typography.Text>
            </Space>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={4}> </Col>
            <Col span={3}>
              <Select
                defaultValue={"var"}
                options={[{ value: "var", label: "変数" }]}
              />
            </Col>
            <Col span={6}>
              <Select
                defaultValue={"last"}
                options={[{ value: "last", label: "last_message_datetime" }]}
              />
            </Col>
            <Col span={3}>
              <Select
                defaultValue={"of"}
                options={[{ value: "of", label: "の" }]}
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
                    style={{ minWidth: "100px" }}
                  />
                )}
              />
            </Col>
            <Col span={4}> </Col>
          </Row>
          {/** variables */}
          {variables.length > 0 && (
            <Row gutter={[16, 16]} style={{ width: "100%" }}>
              <Col span={24}>
                <Form.List
                  name="variables"
                  initialValue={item?.push_message_variables?.map(
                    (_, index) => {
                      return {
                        fieldKey: index,
                        isListField: true,
                        key: index,
                        name: index,
                      };
                    }
                  )}
                >
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Row gutter={16} style={{ width: "100%" }} key={name}>
                            <Col span={4}>
                              <Form.Item {...restField} name={[name, "and"]}>
                                <Select
                                  defaultValue={"and"}
                                  options={[{ value: "and", label: "AND" }]}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item {...restField} name={[name, "var"]}>
                                <Select
                                  defaultValue={"var"}
                                  options={[{ value: "var", label: "変数" }]}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...restField}
                                name={[name, "variable"]}
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
                                name={[name, "comparation"]}
                                required
                              >
                                <Select
                                  defaultValue={
                                    item
                                      ? item.push_message_variables[name]
                                          ?.operator
                                      : "is"
                                  }
                                  options={[
                                    { value: "contains", label: "contains" },
                                    { value: "is", label: "is" },
                                    { value: "is_not", label: "is not" },
                                  ]}
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
                                name={[name, "value"]}
                                required
                              >
                                <Input
                                  defaultValue={
                                    item
                                      ? item.push_message_variables[name]?.value
                                      : ""
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
                            style={{ alignItems: "flex-end", width: "100%" }}
                          >
                            <Button
                              onClick={() => {
                                add();
                                setSelectedVariables((pre) => [
                                  ...pre,
                                  {
                                    variable_id: variables[0].value,
                                    value: "",
                                    operator: "is",
                                  },
                                ]);
                              }}
                              type="primary"
                            >
                              条件追加
                            </Button>
                          </Space>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
      <Snackbar
        open={openToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleCloseToast}
      >
        {errorMessage ? (
          <MuiAlert
            severity="error"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            {errorMessage}
          </MuiAlert>
        ) : (
          <MuiAlert
            severity="success"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            プッシュメッセージを正常に保存しました。
          </MuiAlert>
        )}
      </Snackbar>
    </div>
  );
}
