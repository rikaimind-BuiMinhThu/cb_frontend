import { useCallback, useState } from 'react';
import { message } from 'antd';
import {
  createCustomItem,
  createLabel,
  deleteCustomItem,
  deleteLabel,
  disableSupportingUser,
  updateUserStatus,
} from '../api/crmApi';

export default function useCrmMutations({ onStatusUpdated, onListRefresh }) {
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [autoReplyLoading, setAutoReplyLoading] = useState(false);

  const changeStatus = useCallback(
    async (userId, status) => {
      setStatusUpdating(true);
      try {
        await updateUserStatus(userId, status);
        message.success('ステータスを変更しました。');
        await onStatusUpdated?.(userId);
      } catch (err) {
        console.error(err);
        message.error('ステータスの変更に失敗しました');
      } finally {
        setStatusUpdating(false);
      }
    },
    [onStatusUpdated]
  );

  const addLabel = useCallback(async ({ name, instagramUserId }) => {
    await createLabel({ name, instagramUserId });
    message.success('ラベルを追加しました');
  }, []);

  const removeLabel = useCallback(async (id) => {
    await deleteLabel(id);
    message.success('ラベルを削除しました');
  }, []);

  const addCustomItem = useCallback(async ({ title, value, instagramUserId }) => {
    await createCustomItem({ title, value, instagramUserId });
    message.success('顧客データを追加しました');
  }, []);

  const removeCustomItem = useCallback(async (id) => {
    await deleteCustomItem(id);
    message.success('顧客データを削除しました');
  }, []);

  const switchToAutoReply = useCallback(
    async (userId) => {
      setAutoReplyLoading(true);
      try {
        await disableSupportingUser(userId);
        message.success('自動応答に切り替えました！');
        await onListRefresh?.();
      } catch (err) {
        console.error(err);
        message.error('自動応答への切り替えに失敗しました');
      } finally {
        setAutoReplyLoading(false);
      }
    },
    [onListRefresh]
  );

  return {
    statusUpdating,
    autoReplyLoading,
    changeStatus,
    addLabel,
    removeLabel,
    addCustomItem,
    removeCustomItem,
    switchToAutoReply,
  };
}
