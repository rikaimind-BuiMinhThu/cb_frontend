import React, { useCallback, useState } from 'react';
import { Tabs } from 'antd';
import {
  AdminPage,
  AdminActionButton,
  AdminConfirmModal,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import { TABS } from './constants';
import { variableFieldErrorKey } from './variableUtils';
import UserVariablesTab from './UserVariablesTab';
import SystemVariablesTab from './SystemVariablesTab';
import useVariableList from './hooks/useVariableList';
import useVariableMutations from './hooks/useVariableMutations';

const VariableManagement = () => {
  const [tab, setTab] = useState(TABS.USER);
  const {
    botId,
    variables,
    total,
    page,
    keyword,
    setKeyword,
    loading,
    handleSearch,
    handlePageChange,
    updateField,
    reload,
    goToFirstPage,
  } = useVariableList();
  const {
    addingNew,
    newVariable,
    fieldErrors,
    savingIds,
    creating,
    deleteId,
    deleting,
    clearFieldError,
    startCreate,
    cancelCreate,
    changeNewVariable,
    handleSave,
    handleCreate,
    confirmDelete,
    handleDelete,
    closeDelete,
  } = useVariableMutations({ botId, reload, goToFirstPage });

  const handleFieldChange = useCallback((id, field, value) => {
    updateField(id, field, value);
    clearFieldError(variableFieldErrorKey(id, field));
  }, [clearFieldError, updateField]);

  useAdminHeaderActions(
    tab === TABS.USER ? (
      <AdminActionButton
        action="create"
        label="変数追加"
        onClick={startCreate}
        disabled={addingNew}
      />
    ) : null
  );

  return (
    <>
      <AdminPage description="※ユーザの入力内容などを保管する変数です。シナリオの中で代入や参照ができます。">
        <Tabs
          activeKey={tab}
          onChange={setTab}
          className="admin-page-tabs"
          items={[
            {
              key: TABS.USER,
              label: 'ユーザー定義関数',
              children: (
                <UserVariablesTab
                  variables={variables}
                  total={total}
                  page={page}
                  loading={loading}
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                  onSearch={handleSearch}
                  onPageChange={handlePageChange}
                  fieldErrors={fieldErrors}
                  savingIds={savingIds}
                  onChangeField={handleFieldChange}
                  onSave={handleSave}
                  onDelete={confirmDelete}
                  addingNew={addingNew}
                  newVariable={newVariable}
                  creating={creating}
                  onChangeNewVariable={changeNewVariable}
                  onCreate={handleCreate}
                  onCancelCreate={cancelCreate}
                />
              ),
            },
            {
              key: TABS.SYSTEM,
              label: 'システム変数',
              children: <SystemVariablesTab />,
            },
          ]}
        />
      </AdminPage>

      <AdminConfirmModal
        open={Boolean(deleteId)}
        message="変数を削除しますか。"
        okText="削除"
        danger
        loading={deleting}
        onOk={handleDelete}
        onCancel={closeDelete}
      />
    </>
  );
};

export default VariableManagement;
