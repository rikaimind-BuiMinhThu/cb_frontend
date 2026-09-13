import React from 'react';
import { EC_CHATBOT_URL } from '../../variables/constants';
import { getStatusLabel } from './utils/clientManagementUtils';
import ClientManagementActions from './components/ClientManagementActions';
import {
  ADDRESS_SEPARATOR,
  COL_ACTIONS,
  COL_ADDRESS,
  COL_BILLING_START,
  COL_ID,
  COL_IMAGE,
  COL_INSTAGRAM_BOT,
  COL_INSTAGRAM_CV,
  COL_LAST_LOGIN,
  COL_LINE_BOT,
  COL_LINE_CV,
  COL_MIN_PERIOD_END,
  COL_NAME,
  COL_PLAN,
  COL_PLAN_PRICE,
  COL_STATUS,
  COL_TIKTOK_BOT,
  COL_TIKTOK_CV,
  COL_WEB_BOT,
  COL_WEB_CV,
  DATE_SLICE_LENGTH,
  FEATURE_NO,
  FEATURE_YES,
} from './constants';

const featureLabel = (value) => (value ? FEATURE_YES : FEATURE_NO);

const formatDateCell = (value) => (value == null ? value : value.slice(0, DATE_SLICE_LENGTH));

export const createClientColumns = ({ plans, onPayment, onView, onEdit, onDelete }) => [
  { title: COL_ID, dataIndex: 'id', width: 80, align: 'center' },
  {
    title: COL_IMAGE,
    dataIndex: 'logo_url',
    width: 90,
    align: 'center',
    render: (logoUrl) =>
      logoUrl?.url ? (
        <img
          src={`${EC_CHATBOT_URL}${logoUrl.url}`}
          className="admin-client-logo-thumb"
          alt=""
        />
      ) : null,
  },
  { title: COL_NAME, dataIndex: 'name', width: 160, ellipsis: true },
  {
    title: COL_PLAN,
    dataIndex: 'plan',
    width: 140,
    render: (planCode) => plans.find((el) => el.code === planCode)?.name,
  },
  {
    title: COL_STATUS,
    dataIndex: 'status',
    width: 100,
    render: (status) => getStatusLabel(status),
  },
  { title: COL_PLAN_PRICE, dataIndex: 'price', width: 110, align: 'center' },
  {
    title: COL_BILLING_START,
    dataIndex: 'subscription_start_at',
    width: 130,
    render: formatDateCell,
  },
  {
    title: COL_MIN_PERIOD_END,
    dataIndex: 'subscription_end_at',
    width: 160,
    render: formatDateCell,
  },
  {
    title: COL_ADDRESS,
    key: 'address',
    width: 200,
    ellipsis: true,
    render: (_, item) =>
      `${item.prefecture}${ADDRESS_SEPARATOR}${item.address}${ADDRESS_SEPARATOR}${item.building_name}`,
  },
  {
    title: COL_INSTAGRAM_BOT,
    dataIndex: 'is_instagram',
    width: 120,
    align: 'center',
    render: featureLabel,
  },
  {
    title: COL_WEB_BOT,
    dataIndex: 'is_web',
    width: 100,
    align: 'center',
    render: featureLabel,
  },
  {
    title: COL_LINE_BOT,
    dataIndex: 'is_line',
    width: 100,
    align: 'center',
    render: featureLabel,
  },
  {
    title: COL_TIKTOK_BOT,
    dataIndex: 'is_tiktok',
    width: 110,
    align: 'center',
    render: featureLabel,
  },
  { title: COL_INSTAGRAM_CV, dataIndex: 'bot_cv_instagram', width: 130, align: 'center' },
  { title: COL_WEB_CV, dataIndex: 'bot_cv_web', width: 110, align: 'center' },
  { title: COL_LINE_CV, dataIndex: 'bot_cv_line', width: 110, align: 'center' },
  { title: COL_TIKTOK_CV, dataIndex: 'bot_cv_tiktok', width: 120, align: 'center' },
  {
    title: COL_LAST_LOGIN,
    dataIndex: 'last_sign_in_at',
    width: 160,
    render: (value) => value?.replaceAll('/', '-'),
  },
  {
    title: COL_ACTIONS,
    key: 'actions',
    width: 160,
    fixed: 'right',
    render: (_, item) => (
      <ClientManagementActions
        item={item}
        onPayment={onPayment}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
