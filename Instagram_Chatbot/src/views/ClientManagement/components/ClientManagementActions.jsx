import { Space } from 'antd';
import { AdminActionButton } from '../../../components/AdminShell';

function ClientManagementActions({ item, onPayment, onView, onEdit, onDelete }) {
  return (
    <Space size={0} className="admin-table-actions admin-table-actions--client">
      <AdminActionButton
        action="payment"
        label=""
        title="Payment History"
        onClick={() => onPayment(item)}
      />
      <AdminActionButton action="preview" label="" title="詳細" onClick={() => onView(item)} />
      <AdminActionButton action="edit" label="" title="編集" onClick={() => onEdit(item)} />
      <AdminActionButton action="delete" label="" title="削除" onClick={() => onDelete(item.id)} />
    </Space>
  );
}

export default ClientManagementActions;
