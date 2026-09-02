import { useCallback, useRef, useState } from 'react';
import { message } from 'antd';
import api from 'v2/api/api-management';
import { EMPTY_VARIABLE } from '../constants';
import {
  notifyApiError,
  omitKey,
  validateVariableName,
  variableFieldErrorKey,
  variablesApiPath,
} from '../variableUtils';

const useVariableMutations = ({ botId, reload, goToFirstPage }) => {
  const [addingNew, setAddingNew] = useState(false);
  const [newVariable, setNewVariable] = useState(EMPTY_VARIABLE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [savingIds, setSavingIds] = useState({});
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const savingIdsRef = useRef(savingIds);
  savingIdsRef.current = savingIds;
  const creatingRef = useRef(false);
  const deletingRef = useRef(false);

  const clearFieldError = useCallback((key) => {
    setFieldErrors((prev) => (prev[key] ? omitKey(prev, key) : prev));
  }, []);

  const startCreate = useCallback(() => {
    setAddingNew(true);
    setNewVariable(EMPTY_VARIABLE);
    clearFieldError('new_variable_name');
  }, [clearFieldError]);

  const cancelCreate = useCallback(() => {
    setAddingNew(false);
    setNewVariable(EMPTY_VARIABLE);
    clearFieldError('new_variable_name');
  }, [clearFieldError]);

  const changeNewVariable = useCallback((field, value) => {
    setNewVariable((prev) => ({ ...prev, [field]: value }));
    if (field === 'variable_name') {
      clearFieldError('new_variable_name');
    }
  }, [clearFieldError]);

  const handleSave = useCallback(async (item) => {
    if (savingIdsRef.current[item.id]) return;

    const nameError = validateVariableName(item.variable_name);
    if (nameError) {
      setFieldErrors((prev) => ({
        ...prev,
        [variableFieldErrorKey(item.id, 'variable_name')]: nameError,
      }));
      return;
    }

    const { id, variable_name: variableName, default_value: defaultValue } = item;
    setSavingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const { data } = await api.patch(variablesApiPath(botId, id), {
        variable: {
          variable_name: variableName,
          default_value: defaultValue || '',
        },
      });
      if (data.code === 1) {
        message.success('更新しました。');
        reload();
      } else {
        message.warning(data.message || '更新できませんでした。');
      }
    } catch (error) {
      notifyApiError(error, '更新に失敗しました。');
    } finally {
      setSavingIds((prev) => omitKey(prev, id));
    }
  }, [botId, reload]);

  const handleCreate = useCallback(async () => {
    if (creatingRef.current) return;

    const { variable_name: variableName, default_value: defaultValue } = newVariable;
    const nameError = validateVariableName(variableName);
    if (nameError) {
      setFieldErrors((prev) => ({ ...prev, new_variable_name: nameError }));
      return;
    }

    creatingRef.current = true;
    setCreating(true);

    try {
      const { data } = await api.post(variablesApiPath(botId), {
        variable: {
          variable_name: variableName,
          default_value: defaultValue || '',
        },
      });
      if (data.code === 1) {
        message.success('保存しました。');
        cancelCreate();
        goToFirstPage();
        reload();
      } else {
        message.warning(data.message || '保存できませんでした。');
      }
    } catch (error) {
      notifyApiError(error, '保存に失敗しました。');
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }
  }, [botId, cancelCreate, goToFirstPage, newVariable, reload]);

  const confirmDelete = useCallback((id) => {
    setDeleteId(id);
  }, []);

  const closeDelete = useCallback(() => {
    if (deletingRef.current) return;
    setDeleteId(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId || deletingRef.current) return;

    deletingRef.current = true;
    setDeleting(true);

    try {
      const { data } = await api.delete(variablesApiPath(botId, deleteId));
      if (data.code === 1) {
        message.success('削除しました。');
        reload();
      } else {
        message.error('削除できませんでした。');
      }
    } catch (error) {
      notifyApiError(error, '削除に失敗しました。');
    } finally {
      deletingRef.current = false;
      setDeleteId(null);
      setDeleting(false);
    }
  }, [botId, deleteId, reload]);

  return {
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
  };
};

export default useVariableMutations;
