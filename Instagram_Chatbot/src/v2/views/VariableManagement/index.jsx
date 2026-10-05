import React, { useCallback, useState } from 'react';
import { Tabs } from 'antd';
import {
  AdminPage,
  AdminActionButton,
  AdminConfirmModal,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import {
  TABS,
  ADD_VARIABLE_LABEL,
  TAB_USER_LABEL,
  TAB_SYSTEM_LABEL,
  PAGE_DESCRIPTION,
  DELETE_CONFIRM,
  DELETE_OK,
} from './constants';
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
        label={ADD_VARIABLE_LABEL}
        onClick={startCreate}
        disabled={addingNew}
      />
    ) : null
  );

  return (
    <>
      <AdminPage description={PAGE_DESCRIPTION}>
        <Tabs
          activeKey={tab}
          onChange={setTab}
          className="admin-page-tabs"
          items={[
            {
              key: TABS.USER,
              label: TAB_USER_LABEL,
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
              label: TAB_SYSTEM_LABEL,
              children: <SystemVariablesTab />,
            },
          ]}
        />
      </AdminPage>

      <AdminConfirmModal
        open={Boolean(deleteId)}
        message={DELETE_CONFIRM}
        okText={DELETE_OK}
        danger
        loading={deleting}
        onOk={handleDelete}
        onCancel={closeDelete}
      />
    </>
  );
};

export default VariableManagement;
