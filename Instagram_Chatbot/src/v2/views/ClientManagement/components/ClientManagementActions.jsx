import PropTypes from 'prop-types';
import { Space } from 'antd';
import { AdminActionButton } from 'v2/components/AdminShell';
import { DETAIL_BUTTON_LABEL } from '../constants';

const ClientManagementActions = ({ item, onPayment, onView, onEdit, onDelete }) => (
  <Space size={0} className="admin-table-actions admin-table-actions--client">
    <AdminActionButton
      action="payment"
      iconOnly
      onClick={() => onPayment(item)}
    />
    <AdminActionButton action="preview" label={DETAIL_BUTTON_LABEL} iconOnly onClick={() => onView(item)} />
    <AdminActionButton action="edit" iconOnly onClick={() => onEdit(item)} />
    <AdminActionButton action="delete" iconOnly onClick={() => onDelete(item.id)} />
  </Space>
);

ClientManagementActions.propTypes = {
  item: PropTypes.object,
  onPayment: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ClientManagementActions;
