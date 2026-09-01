import React from 'react';
import { AdminConfirmModal } from '../../components/AdminShell';
import ClientManagementList from './ClientManagementList';
import ClientDetailModal from './ClientDetailModal';
import ClientAddModal from './ClientAddModal';
import useClientList from './hooks/useClientList';
import useClientForm from './hooks/useClientForm';
import useClientMutations from './hooks/useClientMutations';

function ClientManagement() {
  const list = useClientList();
  const form = useClientForm(list.plans);
  const mutations = useClientMutations({
    form,
    reloadListClient: list.reloadListClient,
    page: list.page,
  });

  return (
    <>
      <ClientManagementList
        {...list}
        onAdd={form.openAdd}
        onView={form.openDetail}
        onEdit={form.openEdit}
        onDelete={form.deleteClientPopup}
      />
      <ClientDetailModal
        open={form.isOpen}
        onClose={() => form.setIsOpen(false)}
        title={form.detailUpdateTitle}
        form={form}
        onSubmit={mutations.updateClient}
        loading={mutations.submitting}
      />
      <ClientAddModal
        open={form.isOpenAddUser}
        onClose={() => form.setIsOpenAddUser(false)}
        form={form}
        onSubmit={mutations.addClient}
        loading={mutations.submitting}
      />
      <AdminConfirmModal
        open={form.isOpenDeleteClient}
        message="本当に削除しますか。"
        onOk={mutations.deleteClientUser}
        onCancel={() => form.setIsOpenDeleteClient(false)}
        loading={mutations.deleting}
        danger
      />
    </>
  );
}

export default ClientManagement;
