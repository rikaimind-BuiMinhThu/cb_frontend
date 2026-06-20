import { useCallback, useEffect, useState } from 'react';
import { message as antMessage } from 'antd';
import {
  copyMessageBag,
  createMessageBag,
  deleteMessageBag,
  fetchMessageGroup,
  moveMessageBag,
  updateMessageBag,
} from '../api/messageManagementApi';
import { TOAST_MESSAGES } from '../constants';

export default function useMessageBags(selectedGroupId) {
  const [bags, setBags] = useState([]);
  const [selectedBagId, setSelectedBagId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragBagId, setDragBagId] = useState(null);
  const [pendingMoveBagId, setPendingMoveBagId] = useState(null);

  const loadBags = useCallback(async (groupId = selectedGroupId) => {
    if (!groupId) {
      setBags([]);
      setSelectedBagId(null);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMessageGroup(groupId);
      setBags(data.message_bags || []);
    } catch (error) {
      console.error(error);
      setBags([]);
    } finally {
      setLoading(false);
    }
  }, [selectedGroupId]);

  useEffect(() => {
    loadBags(selectedGroupId);
  }, [selectedGroupId, loadBags]);

  useEffect(() => {
    if (selectedBagId && !bags.some((bag) => bag.id === selectedBagId)) {
      setSelectedBagId(null);
    }
  }, [bags, selectedBagId]);

  const addBag = useCallback(async (groupId, bagName) => {
    await createMessageBag(groupId, bagName);
    antMessage.success(TOAST_MESSAGES.BAG_ADDED);
    await loadBags(groupId);
    return true;
  }, [loadBags]);

  const renameBag = useCallback(async (id, bagName) => {
    await updateMessageBag(id, bagName);
    antMessage.success(TOAST_MESSAGES.BAG_RENAMED);
    await loadBags();
    return true;
  }, [loadBags]);

  const removeBag = useCallback(async (id) => {
    await deleteMessageBag(id);
    antMessage.success(TOAST_MESSAGES.BAG_DELETED);
    if (selectedBagId === id) {
      setSelectedBagId(null);
    }
    await loadBags();
  }, [loadBags, selectedBagId]);

  const duplicateBag = useCallback(async (id) => {
    await copyMessageBag(id);
    antMessage.success(TOAST_MESSAGES.BAG_COPIED);
    await loadBags();
  }, [loadBags]);

  const moveBag = useCallback(async (bagId, targetGroupId) => {
    await moveMessageBag(bagId, targetGroupId);
    antMessage.success(TOAST_MESSAGES.BAG_MOVED);
    await loadBags(selectedGroupId);
    if (targetGroupId !== selectedGroupId && selectedBagId === bagId) {
      setSelectedBagId(null);
    }
  }, [loadBags, selectedGroupId, selectedBagId]);

  return {
    bags,
    selectedBagId,
    setSelectedBagId,
    loading,
    dragBagId,
    setDragBagId,
    pendingMoveBagId,
    setPendingMoveBagId,
    loadBags,
    addBag,
    renameBag,
    removeBag,
    duplicateBag,
    moveBag,
  };
}
