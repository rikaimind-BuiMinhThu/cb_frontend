import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, InputNumber, Modal, Space, message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminTable, AdminActionButton } from 'v2/components/AdminShell';
import { getSignInPath } from 'v2/variables/constants';
import {
  AUTH_FALSE_VALUE,
  CANCEL_BUTTON_LABEL,
  COL_ACTIONS,
  COL_DESCRIPTION,
  COL_ID,
  COL_PLAN_NAME,
  COL_PLAN_PRICE,
  DESCRIPTION_ROWS,
  EDIT_PLAN_TITLE,
  EMPTY_STRING,
  FORM_LABEL_COL,
  FORM_WRAPPER_COL,
  INTEGER_REGEX,
  IS_AUTH_COOKIE_KEY,
  LABEL_DESCRIPTION,
  LABEL_PLAN_NAME,
  LABEL_PLAN_PRICE,
  LABEL_PLAN_PRICE_CV,
  NAME_REQUIRED,
  PLAN_CODE_CV,
  PLAN_MODAL_WIDTH,
  PLANS_API_PATH,
  POSITIVE_NUMBER,
  PRICE_INTEGER,
  PRICE_MIN,
  PRICE_PER_CV_SUFFIX,
  PRICE_PRECISION,
  PRICE_REQUIRED,
  ROLE_ADMIN_DEEL,
  SUCCESS_CLIENT_UPDATED,
  TOKEN_COOKIE_KEY,
  TOKEN_EXPIRED_CODE,
  UPDATE_BUTTON_LABEL,
  USER_ROLE_COOKIE_KEY,
} from './planManagementConstants';

const validatePlanPrice = (_, value) => {
  if (value === undefined || value === null || value === EMPTY_STRING) {
    return Promise.reject(new Error(PRICE_REQUIRED));
  }
  if (Number(value) < PRICE_MIN) {
    return Promise.reject(new Error(POSITIVE_NUMBER));
  }
  if (!INTEGER_REGEX.test(String(value))) {
    return Promise.reject(new Error(PRICE_INTEGER));
  }
  return Promise.resolve();
};

const PlanManagement = () => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState();
  const [code, setCode] = useState();
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const userRole = Cookies.get(USER_ROLE_COOKIE_KEY);
    if (!userRole || userRole !== ROLE_ADMIN_DEEL) {
      window.location.href = getSignInPath();
    }
  }, []);

  useEffect(() => {
    if (
      Cookies.get(TOKEN_COOKIE_KEY) === undefined ||
      Cookies.get(TOKEN_COOKIE_KEY) == null ||
      Cookies.get(TOKEN_COOKIE_KEY) === EMPTY_STRING
    ) {
      window.location.href = getSignInPath();
    }
    if (Cookies.get(IS_AUTH_COOKIE_KEY) === AUTH_FALSE_VALUE) {
      window.location.href = getSignInPath();
    }
  }, []);

  const reloadList = () => {
    setLoading(true);
    api
      .get(PLANS_API_PATH)
      .then((res) => {
        setDataList(res.data.data || []);
      })
      .catch((error) => {
        if (error.response?.data.code === TOKEN_EXPIRED_CODE) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reloadList();
  }, []);

  const openEdit = useCallback((item) => {
    api
      .get(`${PLANS_API_PATH}/${item.id}`)
      .then((res) => {
        const data = res.data.data;
        setPlanId(data.id);
        setCode(data.code);
        form.setFieldsValue({
          name: data.name,
          price: data.price,
          description: data.description,
        });
        setIsOpenUpdate(true);
      })
      .catch((error) => {
        if (error.response?.data.code === TOKEN_EXPIRED_CODE) {
          tokenExpired();
        }
      });
  }, [form]);

  const updatePlan = () => {
    form.validateFields().then((values) => {
      api
        .patch(`${PLANS_API_PATH}/${planId}`, {
          name: values.name,
          price: values.price,
          description: values.description,
        })
        .then(() => {
          reloadList();
          message.success(SUCCESS_CLIENT_UPDATED);
          setIsOpenUpdate(false);
        })
        .catch((error) => {
          if (error.response?.data.code === TOKEN_EXPIRED_CODE) {
            tokenExpired();
          }
        });
    });
  };

  const columns = useMemo(
    () => [
      { title: COL_ID, dataIndex: 'id', width: 80 },
      { title: COL_PLAN_NAME, dataIndex: 'name' },
      {
        title: COL_PLAN_PRICE,
        dataIndex: 'price',
        render: (price, record) => (
          <>
            {price}
            {record.code === PLAN_CODE_CV ? PRICE_PER_CV_SUFFIX : EMPTY_STRING}
          </>
        ),
      },
      { title: COL_DESCRIPTION, dataIndex: 'description' },
      {
        title: COL_ACTIONS,
        width: 100,
        render: (_, item) => (
          <Space className="admin-table-actions">
            <AdminActionButton action="edit" iconOnly onClick={() => openEdit(item)} />
          </Space>
        ),
      },
    ],
    [openEdit]
  );

  return (
    <>
      <AdminPage>
        <AdminTable
          loading={loading}
          columns={columns}
          dataSource={dataList}
          rowKey="id"
          pagination={false}
        />
      </AdminPage>

      <Modal
        title={EDIT_PLAN_TITLE}
        open={isOpenUpdate}
        onOk={updatePlan}
        onCancel={() => setIsOpenUpdate(false)}
        okText={UPDATE_BUTTON_LABEL}
        cancelText={CANCEL_BUTTON_LABEL}
        width={PLAN_MODAL_WIDTH}
        destroyOnClose
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
            label={LABEL_PLAN_NAME}
            name="name"
            rules={[{ required: true, message: NAME_REQUIRED }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={code === PLAN_CODE_CV ? LABEL_PLAN_PRICE_CV : LABEL_PLAN_PRICE}
            name="price"
            rules={[
              { required: true, message: PRICE_REQUIRED },
              { validator: validatePlanPrice },
            ]}
          >
            <InputNumber className="admin-field-full-width" min={PRICE_MIN} precision={PRICE_PRECISION} />
          </Form.Item>
          <Form.Item label={LABEL_DESCRIPTION} name="description">
            <Input.TextArea rows={DESCRIPTION_ROWS} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PlanManagement;
