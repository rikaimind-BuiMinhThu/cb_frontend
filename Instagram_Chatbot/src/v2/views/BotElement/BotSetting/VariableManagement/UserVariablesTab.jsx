import React, { useMemo } from 'react';
import {
  AdminTable,
  AdminSearchBar,
} from '../../../../components/AdminShell';
import { PAGE_SIZE } from './constants';
import { createUserVariableColumns } from './columns';
import VariableCreateRow from './VariableCreateRow';

const UserVariablesTab = ({
  variables,
  total,
  page,
  loading,
  keyword,
  onKeywordChange,
  onSearch,
  onPageChange,
  fieldErrors,
  savingIds,
  onChangeField,
  onSave,
  onDelete,
  addingNew,
  newVariable,
  creating,
  onChangeNewVariable,
  onCreate,
  onCancelCreate,
}) => {
  const columns = useMemo(
    () => createUserVariableColumns({
      page,
      fieldErrors,
      savingIds,
      onChangeField,
      onSave,
      onDelete,
    }),
    [fieldErrors, onChangeField, onDelete, onSave, page, savingIds]
  );

  return (
    <>
      <AdminTable
        loading={loading}
        toolbar={
          <AdminSearchBar
            searchValue={keyword}
            onSearchChange={onKeywordChange}
            onSearch={onSearch}
            searchPlaceholder="変数検索..."
          />
        }
        columns={columns}
        dataSource={variables}
        rowKey="id"
        emptyDescription="変数がありません"
        pagination={{
          current: page,
          total,
          pageSize: PAGE_SIZE,
          onChange: onPageChange,
        }}
      />
      {addingNew && (
        <VariableCreateRow
          values={newVariable}
          nameError={fieldErrors.new_variable_name}
          creating={creating}
          onChange={onChangeNewVariable}
          onSave={onCreate}
          onCancel={onCancelCreate}
        />
      )}
    </>
  );
};

export default UserVariablesTab;
