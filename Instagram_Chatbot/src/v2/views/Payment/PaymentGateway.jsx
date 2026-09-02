import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, message, Space, Tag } from 'antd';
import { Link } from 'react-router-dom';
import api from 'v2/api/api-management';
import { API_SUCCESS_CODE } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AdminConfirmModal,
  AdminPage,
  AdminTable,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import {
  ADD_GATEWAY_PATH,
  AGENCY_GMO,
  AGENCY_GMO_SHORT_LABEL,
  AGENCY_NP,
  AGENCY_NP_LABEL,
  API_WARNING_CODE,
  COL_ACTIONS,
  COL_ACTIONS_WIDTH,
  COL_AGENCY_WIDTH,
  COL_CONFIG,
  COL_MODE_WIDTH,
  COL_NO,
  COL_NO_WIDTH,
  CREATE_GATEWAY_LABEL,
  DASH,
  DEFAULT_TAG,
  DEFAULT_YES,
  DELETE_CONFIRM_MESSAGE,
  EDIT_GATEWAY_PATH_PREFIX,
  EMPTY_GATEWAYS,
  FAIL_UPDATE,
  GATEWAYS_API_PATH,
  IS_DEFAULT_PAYLOAD,
  LABEL_AGENCY,
  LABEL_GATEWAY_NAME,
  LABEL_MODE,
  MERCHANT_CODE_PREFIX,
  MODE_PRODUCTION,
  MODE_PRODUCTION_LABEL,
  MODE_TEST,
  MODE_TEST_LABEL,
  PAGE_SIZE,
  SET_DEFAULT_LABEL,
  SHOP_ID_PREFIX,
  SUCCESS_DEFAULT,
  SUCCESS_DELETED,
} from './gatewayFormConstants';

const AGENCY_LABELS = {
  [AGENCY_GMO]: AGENCY_GMO_SHORT_LABEL,
  [AGENCY_NP]: AGENCY_NP_LABEL,
};

const formatAgency = (agency) => AGENCY_LABELS[agency] || agency || DASH;

const formatMode = (mode) => {
  if (mode === MODE_TEST) {
    return MODE_TEST_LABEL;
  }
  if (mode === MODE_PRODUCTION) {
    return MODE_PRODUCTION_LABEL;
  }
  return mode || DASH;
};

const formatConfigInfo = (item) => {
  if (item.payment_agency === AGENCY_GMO) {
    return item.shop_id ? `${SHOP_ID_PREFIX}${item.shop_id}` : DASH;
  }
  if (item.payment_agency === AGENCY_NP) {
    return item.merchant_code ? `${MERCHANT_CODE_PREFIX}${item.merchant_code}` : DASH;
  }
  return DASH;
};

const PaymentGateway = () => {
  const [gateway, setGateway] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchGateways = useCallback((pageIndex) => {
    setLoading(true);
    api
      .get(`${GATEWAYS_API_PATH}?page=${pageIndex}`)
      .then((res) => {
        if (res?.data?.code === API_SUCCESS_CODE) {
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
      .delete(`${GATEWAYS_API_PATH}/${deleteId}`)
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          message.success(SUCCESS_DELETED);
          setDeleteId(null);
          fetchGateways(page);
          return;
        }
        if (res.data.code === API_WARNING_CODE) {
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

  const handleSetDefault = useCallback((id) => {
    api
      .patch(`${GATEWAYS_API_PATH}/${id}`, IS_DEFAULT_PAYLOAD)
      .then((res) => {
        if (res.data?.code === API_SUCCESS_CODE) {
          message.success(SUCCESS_DEFAULT);
          fetchGateways(page);
          return;
        }
        message.warning(res.data?.message || FAIL_UPDATE);
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  }, [fetchGateways, page]);

  const columns = useMemo(
    () => [
      {
        title: COL_NO,
        width: COL_NO_WIDTH,
        render: (_, __, index) => (page - 1) * PAGE_SIZE + index + 1,
      },
      {
        title: LABEL_GATEWAY_NAME,
        dataIndex: 'gateway_name',
        render: (name, item) => (
          <Space size={8} wrap>
            <span>{name}</span>
            {item?.is_default === DEFAULT_YES && <Tag color="blue">{DEFAULT_TAG}</Tag>}
          </Space>
        ),
      },
      {
        title: LABEL_AGENCY,
        dataIndex: 'payment_agency',
        width: COL_AGENCY_WIDTH,
        render: (agency) => formatAgency(agency),
      },
      {
        title: LABEL_MODE,
        dataIndex: 'mode',
        width: COL_MODE_WIDTH,
        render: (mode) => (
          <Tag color={mode === MODE_PRODUCTION ? 'green' : 'default'}>{formatMode(mode)}</Tag>
        ),
      },
      {
        title: COL_CONFIG,
        render: (_, item) => formatConfigInfo(item),
      },
      {
        title: COL_ACTIONS,
        width: COL_ACTIONS_WIDTH,
        render: (_, item) => (
          <Space size="small" className="admin-table-actions">
            {item?.is_default !== DEFAULT_YES && (
              <Button type="link" size="small" onClick={() => handleSetDefault(item.id)}>
                {SET_DEFAULT_LABEL}
              </Button>
            )}
            <Link to={`${EDIT_GATEWAY_PATH_PREFIX}${item.id}`}>
              <AdminActionButton action="edit" iconOnly />
            </Link>
            <AdminActionButton action="delete" iconOnly onClick={() => setDeleteId(item.id)} />
          </Space>
        ),
      },
    ],
    [page, handleSetDefault]
  );

  useAdminHeaderActions(
    <Link to={ADD_GATEWAY_PATH}>
      <AdminActionButton action="create" label={CREATE_GATEWAY_LABEL} />
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
          emptyDescription={EMPTY_GATEWAYS}
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
        message={DELETE_CONFIRM_MESSAGE}
        danger
        onOk={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};

export default PaymentGateway;
