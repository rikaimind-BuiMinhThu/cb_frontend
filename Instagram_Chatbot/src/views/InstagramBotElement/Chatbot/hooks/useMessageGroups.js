import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { message as antMessage } from 'antd';
import {
  copyMessageGroup,
  createMessageGroup,
  deleteMessageGroup,
  fetchMessageGroups,
  updateMessageGroup,
} from '../api/messageManagementApi';
import { GROUP_PAGE_SIZE, TOAST_MESSAGES } from '../constants';

export default function useMessageGroups() {
  const [groups, setGroups] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const loadGroups = useCallback(async (pageNum = page) => {
    setLoading(true);
    try {
      const result = await fetchMessageGroups(pageNum);
      setGroups(result.data);
      setTotal(result.total);
      setPage(pageNum);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!Cookies.get('token') || Cookies.get('is_auth') === 'false') {
      window.location.href = '/';
      return;
    }
    loadGroups(1);
  }, []);

  const handlePageChange = useCallback((nextPage) => {
    loadGroups(nextPage);
    document.querySelector('.main-panel')?.scrollTo(0, 0);
  }, [loadGroups]);

  const addGroup = useCallback(async (groupName) => {
    const result = await createMessageGroup(groupName);
    if (result.code === 2) {
      antMessage.error(TOAST_MESSAGES.GROUP_EXISTS);
      return false;
    }
    antMessage.success(TOAST_MESSAGES.GROUP_ADDED);
    await loadGroups(page);
    return true;
  }, [loadGroups, page]);

  const renameGroup = useCallback(async (id, groupName) => {
    await updateMessageGroup(id, groupName);
    antMessage.success(TOAST_MESSAGES.GROUP_RENAMED);
    await loadGroups(page);
    return true;
  }, [loadGroups, page]);

  const removeGroup = useCallback(async (id) => {
    await deleteMessageGroup(id);
    antMessage.success(TOAST_MESSAGES.GROUP_DELETED);
    if (selectedGroupId === id) {
      setSelectedGroupId(null);
    }
    await loadGroups(page);
  }, [loadGroups, page, selectedGroupId]);

  const duplicateGroup = useCallback(async (id) => {
    await copyMessageGroup(id);
    antMessage.success(TOAST_MESSAGES.GROUP_COPIED);
    await loadGroups(page);
  }, [loadGroups, page]);

  const totalPages = Math.max(1, Math.ceil(total / GROUP_PAGE_SIZE));

  return {
    groups,
    total,
    page,
    totalPages,
    loading,
    selectedGroupId,
    setSelectedGroupId,
    loadGroups,
    handlePageChange,
    addGroup,
    renameGroup,
    removeGroup,
    duplicateGroup,
  };
}
