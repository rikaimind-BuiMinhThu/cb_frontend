import { Space } from 'antd';
import { AdminActionButton } from '../../../components/AdminShell';

function ClientManagementActions({ item, onPayment, onView, onEdit, onDelete }) {
  return (
    <Space size={0} className="admin-table-actions admin-table-actions--client">
      <AdminActionButton
        action="payment"
        iconOnly
        onClick={() => onPayment(item)}
      />
      <AdminActionButton action="preview" label="詳細" iconOnly onClick={() => onView(item)} />
      <AdminActionButton action="edit" iconOnly onClick={() => onEdit(item)} />
      <AdminActionButton action="delete" iconOnly onClick={() => onDelete(item.id)} />
    </Space>
  );
}

export default ClientManagementActions;
