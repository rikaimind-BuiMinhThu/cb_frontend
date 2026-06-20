import { EC_CHATBOT_URL } from '../../variables/constants';
import { getStatusLabel } from './utils/clientManagementUtils';
import ClientManagementActions from './components/ClientManagementActions';

export function createClientColumns({ plans, onPayment, onView, onEdit, onDelete }) {
  return [
    { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
    {
      title: '画像',
      dataIndex: 'logo_url',
      width: 90,
      align: 'center',
      render: (logoUrl) =>
        logoUrl?.url ? (
          <img
            src={`${EC_CHATBOT_URL}${logoUrl.url}`}
            style={{ height: 60, width: 60, objectFit: 'cover' }}
            alt=""
          />
        ) : null,
    },
    { title: '名称', dataIndex: 'name', width: 160, ellipsis: true },
    {
      title: 'プラン',
      dataIndex: 'plan',
      width: 140,
      render: (planCode) => plans.find((el) => el.code === planCode)?.name,
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      width: 100,
      render: (status) => getStatusLabel(status),
    },
    { title: 'プラン価格', dataIndex: 'price', width: 110, align: 'center' },
    {
      title: '課金開始日',
      dataIndex: 'subscription_start_at',
      width: 130,
      render: (value) => (value == null ? value : value.slice(0, 10)),
    },
    {
      title: '最低利用期間終了日',
      dataIndex: 'subscription_end_at',
      width: 160,
      render: (value) => (value == null ? value : value.slice(0, 10)),
    },
    {
      title: '住所',
      key: 'address',
      width: 200,
      ellipsis: true,
      render: (_, item) => `${item.prefecture}、${item.address}、${item.building_name}`,
    },
    {
      title: 'Instagram bot',
      dataIndex: 'is_instagram',
      width: 120,
      align: 'center',
      render: (value) => (value ? 'あり' : 'なし'),
    },
    {
      title: 'Web bot',
      dataIndex: 'is_web',
      width: 100,
      align: 'center',
      render: (value) => (value ? 'あり' : 'なし'),
    },
    {
      title: 'LineBot',
      dataIndex: 'is_line',
      width: 100,
      align: 'center',
      render: (value) => (value ? 'あり' : 'なし'),
    },
    {
      title: 'Tiktok bot',
      dataIndex: 'is_tiktok',
      width: 110,
      align: 'center',
      render: (value) => (value ? 'あり' : 'なし'),
    },
    { title: 'Instagram bot CV', dataIndex: 'bot_cv_instagram', width: 130, align: 'center' },
    { title: 'Web bot CV', dataIndex: 'bot_cv_web', width: 110, align: 'center' },
    { title: 'Line bot CV', dataIndex: 'bot_cv_line', width: 110, align: 'center' },
    { title: 'Tiktok bot CV', dataIndex: 'bot_cv_tiktok', width: 120, align: 'center' },
    {
      title: '最終ログイン日時',
      dataIndex: 'last_sign_in_at',
      width: 160,
      render: (value) => value?.replaceAll('/', '-'),
    },
    {
      title: 'アクション',
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
}
