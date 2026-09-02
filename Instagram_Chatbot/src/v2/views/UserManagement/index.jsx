import React from 'react';
import { AdminConfirmModal } from 'v2/components/AdminShell';
import UserManagementList from './UserManagementList';
import UserAddModal from './UserAddModal';
import UserEditModal from './UserEditModal';
import useUserList from './hooks/useUserList';
import useUserMutations from './hooks/useUserMutations';

function UserManagement() {
  const list = useUserList();
  const mutations = useUserMutations({
    reloadList: list.reloadList,
    page: list.page,
  });

  return (
    <>
      <UserManagementList
        users={list.users}
        total={list.total}
        page={list.page}
        loading={list.loading}
        namesearch={list.namesearch}
        setNamesearch={list.setNamesearch}
        handleSearch={list.handleSearch}
        handlePageChange={list.handlePageChange}
        onAdd={mutations.openAdd}
        onEdit={mutations.openEdit}
        onDelete={mutations.confirmDelete}
      />
      <UserAddModal
        open={mutations.isOpenAdd}
        onClose={() => mutations.setIsOpenAdd(false)}
        listClient={list.listClient}
        onSubmit={mutations.addUser}
        loading={mutations.submitting}
      />
      <UserEditModal
        open={mutations.isOpenEdit}
        onClose={() => mutations.setIsOpenEdit(false)}
        listClient={list.listClient}
        editingUser={mutations.editingUser}
        onSubmit={mutations.updateUser}
        loading={mutations.submitting}
      />
      <AdminConfirmModal
        open={mutations.isOpenDelete}
        message="本当に削除しますか。"
        onOk={mutations.deleteUser}
        onCancel={() => mutations.setIsOpenDelete(false)}
        danger
        loading={mutations.deleting}
      />
    </>
  );
}

export default UserManagement;
