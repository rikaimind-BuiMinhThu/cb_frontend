import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, message, Space, Tag } from 'antd';
import { Link } from 'react-router-dom';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminConfirmModal, AdminPage, AdminTable, AdminActionButton, useAdminHeaderActions } from '../../../../components/AdminShell';

const PAGE_SIZE = 25;

const AGENCY_LABELS = {
  gmo: 'GMO',
  np_payment: 'NP後払い',
};

function formatAgency(agency) {
  return AGENCY_LABELS[agency] || agency || '—';
}

function formatMode(mode) {
  if (mode === 'test') return 'テスト';
  if (mode === 'production') return '本番';
  return mode || '—';
}

function formatConfigInfo(item) {
  if (item.payment_agency === 'gmo') {
    return item.shop_id ? `ショップID: ${item.shop_id}` : '—';
  }
  if (item.payment_agency === 'np_payment') {
    return item.merchant_code ? `加盟店コード: ${item.merchant_code}` : '—';
  }
  return '—';
}

function PaymentGateway() {
  const [gateway, setGateway] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchGateways = useCallback((pageIndex) => {
    setLoading(true);
    api
      .get(`/api/v1/payment_managements/payment_gateways?page=${pageIndex}`)
      .then((res) => {
        if (res?.data?.code === 1) {
          setGateway(res.data.data || []);
          setTotal(res.data.total || 0);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchGateways(page);
  }, [fetchGateways, page]);

  const handleDelete = () => {
    api
      .delete(`/api/v1/payment_managements/payment_gateways/${deleteId}`)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('決済ゲートウェイを削除しました。');
          setDeleteId(null);
          fetchGateways(page);
        } else if (res.data.code === 2) {
          message.warning(res.data.message);
          setDeleteId(null);
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  };

  const handleSetDefault = (id) => {
    api
      .patch(`/api/v1/payment_managements/payment_gateways/${id}`, {
        payment: {
          is_default: 'yes',
        },
      })
      .then((res) => {
        if (res.data?.code === 1) {
          message.success('デフォルト決済ゲートウェイを更新しました。');
          fetchGateways(page);
        } else if (res.data?.code !== 1) {
          message.warning(res.data?.message || '更新に失敗しました。');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = useMemo(
    () => [
      {
        title: 'No.',
        width: 64,
        render: (_, __, index) => (page - 1) * PAGE_SIZE + index + 1,
      },
      {
        title: '決済ゲートウェイ名',
        dataIndex: 'gateway_name',
        render: (name, item) => (
          <Space size={8} wrap>
            <span>{name}</span>
            {item?.is_default === 'yes' && <Tag color="blue">デフォルト</Tag>}
          </Space>
        ),
      },
      {
        title: '決済代行会社',
        dataIndex: 'payment_agency',
        width: 140,
        render: (agency) => formatAgency(agency),
      },
      {
        title: 'モード',
        dataIndex: 'mode',
        width: 100,
        render: (mode) => (
          <Tag color={mode === 'production' ? 'green' : 'default'}>{formatMode(mode)}</Tag>
        ),
      },
      {
        title: '設定情報',
        render: (_, item) => formatConfigInfo(item),
      },
      {
        title: 'アクション',
        width: 200,
        render: (_, item) => (
          <Space size="small" className="admin-table-actions">
            {item?.is_default !== 'yes' && (
              <Button type="link" size="small" onClick={() => handleSetDefault(item.id)}>
                デフォルト
              </Button>
            )}
            <Link to={`/v2/admin/edit-payment-gateway/${item.id}`}>
              <AdminActionButton action="edit" />
            </Link>
            <AdminActionButton action="delete" onClick={() => setDeleteId(item.id)} />
          </Space>
        ),
      },
    ],
    [page]
  );

  useAdminHeaderActions(
    <Link to="/v2/admin/add-payment-gateway">
      <AdminActionButton action="create" label="追加" />
    </Link>
  );

  return (
    <>
      <AdminPage>
        <AdminTable
          columns={columns}
          dataSource={gateway}
          rowKey="id"
          loading={loading}
          emptyDescription="決済ゲートウェイがありません"
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            onChange: (nextPage) => setPage(nextPage),
          }}
        />
      </AdminPage>

      <AdminConfirmModal
        open={Boolean(deleteId)}
        message="本当に削除しますか。"
        okText="削除"
        danger
        onOk={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}

export default PaymentGateway;
