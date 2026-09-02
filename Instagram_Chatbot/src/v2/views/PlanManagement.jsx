import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, InputNumber, Modal, Space, message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminTable, AdminActionButton } from '../components/AdminShell';
import { getSignInPath } from 'v2/variables/constants';

function PlanManagement() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState();
  const [code, setCode] = useState();
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const userRole = Cookies.get('user_role');
    if (!userRole || userRole !== 'admin_deel') {
      window.location.href = getSignInPath();
    }
  }, []);

  useEffect(() => {
    if (
      Cookies.get('token') === undefined ||
      Cookies.get('token') == null ||
      Cookies.get('token') === ''
    ) {
      window.location.href = getSignInPath();
    }
    if (Cookies.get('is_auth') == 'false') {
      window.location.href = getSignInPath();
    }
  }, []);

  function reloadList() {
    setLoading(true);
    api
      .get(`/api/v1/managements/plans`)
      .then((res) => {
        setDataList(res.data.data || []);
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reloadList();
  }, []);

  function openEdit(item) {
    api
      .get(`/api/v1/managements/plans/${item.id}`)
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
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function updatePlan() {
    form.validateFields().then((values) => {
      api
        .patch(`/api/v1/managements/plans/${planId}`, {
          name: values.name,
          price: values.price,
          description: values.description,
        })
        .then(() => {
          reloadList();
          message.success('クライアント更新しました!');
          setIsOpenUpdate(false);
        })
        .catch((error) => {
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    });
  }

  const columns = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', width: 80 },
      { title: 'プラン名称', dataIndex: 'name' },
      {
        title: 'プラン価格',
        dataIndex: 'price',
        render: (price, record) => (
          <>
            {price}
            {record.code === 4 ? ' / CV' : ''}
          </>
        ),
      },
      { title: '説明', dataIndex: 'description' },
      {
        title: 'アクション',
        width: 100,
        render: (_, item) => (
          <Space className="admin-table-actions">
            <AdminActionButton action="edit" iconOnly onClick={() => openEdit(item)} />
          </Space>
        ),
      },
    ],
    []
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
        title="プラン編集"
        open={isOpenUpdate}
        onOk={updatePlan}
        onCancel={() => setIsOpenUpdate(false)}
        okText="更新"
        cancelText="キャンセル"
        width={520}
        destroyOnClose
      >
        <Form
          form={form}
          layout="horizontal"
          colon={false}
          labelAlign="left"
          labelCol={{ flex: '0 0 140px' }}
          wrapperCol={{ flex: 1 }}
        >
          <Form.Item label="プラン名称" name="name" rules={[{ required: true, message: 'プラン名称は、必ず指定してください。' }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={code === 4 ? 'プラン価格 / CV' : 'プラン価格'}
            name="price"
            rules={[
              { required: true, message: 'プラン価格は、必ず指定してください。' },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null || value === '') {
                    return Promise.reject(new Error('プラン価格は、必ず指定してください。'));
                  }
                  if (Number(value) < 0) {
                    return Promise.reject(new Error('正数を入力してください。'));
                  }
                  if (!/^\d+$/.test(String(value))) {
                    return Promise.reject(new Error('プラン価格 は整数の必要です。'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} precision={0} />
          </Form.Item>
          <Form.Item label="説明" name="description">
            <Input.TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PlanManagement;
