import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  AdminPage,
  AdminTable,
  AdminSearchBar,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import { ADD_USER_TITLE, PAGE_SIZE, SEARCH_PLACEHOLDER } from './constants';
import { createUserColumns } from './userManagementColumns';

const UserManagementList = ({
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
}) => {
  const columns = useMemo(
    () => createUserColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  );

  useAdminHeaderActions(
    <AdminActionButton action="create" label={ADD_USER_TITLE} onClick={onAdd} />
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
            searchPlaceholder={SEARCH_PLACEHOLDER}
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
};

UserManagementList.propTypes = {
  users: PropTypes.array,
  total: PropTypes.number,
  page: PropTypes.number,
  loading: PropTypes.bool,
  namesearch: PropTypes.string,
  setNamesearch: PropTypes.func,
  handleSearch: PropTypes.func,
  handlePageChange: PropTypes.func,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default UserManagementList;
