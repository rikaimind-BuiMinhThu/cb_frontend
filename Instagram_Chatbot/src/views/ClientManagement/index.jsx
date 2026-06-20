import React, { useState } from 'react';
import ModalNoti from '../Popup/ModalNoti';
import '../Popup/modal.css';
import { AdminConfirmModal } from '../../components/AdminShell';
import ClientManagementList from './ClientManagementList';
import ClientDetailModal from './ClientDetailModal';
import ClientAddModal from './ClientAddModal';
import useClientList from './hooks/useClientList';
import useClientForm from './hooks/useClientForm';
import useClientMutations from './hooks/useClientMutations';

function ClientManagement() {
  const [msgNoti, setMsgNoti] = useState('');
  const [isOpenNoti, setIsOpenNoti] = useState(false);

  const list = useClientList();
  const form = useClientForm(list.plans);
  const mutations = useClientMutations({
    form,
    reloadListClient: list.reloadListClient,
    page: list.page,
    setMsgNoti,
    setIsOpenNoti,
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
      />
      <ClientAddModal
        open={form.isOpenAddUser}
        onClose={() => form.setIsOpenAddUser(false)}
        form={form}
        onSubmit={mutations.addClient}
      />
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <span style={{ fontSize: '16px' }}>{msgNoti}</span>
        </div>
      </ModalNoti>
      <AdminConfirmModal
        open={form.isOpenDeleteClient}
        message="クライアントを削除しますか。"
        onOk={mutations.deleteClientUser}
        onCancel={() => form.setIsOpenDeleteClient(false)}
        danger
      />
    </>
  );
}

export default ClientManagement;
