import React, { useMemo } from 'react';
import {
  AdminPage,
  AdminTable,
  AdminSearchBar,
  AdminActionButton,
  useAdminHeaderActions,
} from '../../components/AdminShell';
import { PAGE_SIZE } from './constants';
import { createUserColumns } from './userManagementColumns';

function UserManagementList({
  users,
  total,
  page,
  loading,
  namesearch,
  setNamesearch,
  handleSearch,
  handlePageChange,
  onAdd,
  onEdit,
  onDelete,
}) {
  const columns = useMemo(
    () => createUserColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  useAdminHeaderActions(
    <AdminActionButton action="create" label="ユーザー追加" onClick={onAdd} />
  );

  return (
    <AdminPage>
      <AdminTable
        loading={loading}
        columns={columns}
        dataSource={users}
        rowKey="id"
        toolbar={
          <AdminSearchBar
            searchValue={namesearch}
            onSearchChange={setNamesearch}
            onSearch={handleSearch}
            searchPlaceholder="ユーザー名 ..."
          />
        }
        pagination={{
          current: page,
          total,
          pageSize: PAGE_SIZE,
          onChange: handlePageChange,
        }}
      />
    </AdminPage>
  );
}

export default UserManagementList;
