import { useCallback, useEffect, useState } from 'react';
import { fetchCrmUserDetail } from '../api/crmApi';
import { MESSAGE_HISTORY_LIMIT } from '../constants';

export default function useCrmUserDetail(userId) {
  const [user, setUser] = useState(null);
  const [labels, setLabels] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [messageHistories, setMessageHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDetail = useCallback(async (id) => {
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const detail = await fetchCrmUserDetail(id);
      setUser(detail.user);
      setLabels(detail.labels);
      setCustomItems(detail.customItems);
      setMessageHistories(detail.messageHistories.slice(0, MESSAGE_HISTORY_LIMIT));
    } catch (err) {
      console.error(err);
      setError('ユーザー詳細の取得に失敗しました');
      setUser(null);
      setLabels([]);
      setCustomItems([]);
      setMessageHistories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadDetail(userId);
    } else {
      setUser(null);
      setLabels([]);
      setCustomItems([]);
      setMessageHistories([]);
    }
  }, [loadDetail, userId]);

  return {
    user,
    labels,
    customItems,
    messageHistories,
    loading,
    error,
    setUser,
    setLabels,
    setCustomItems,
    setMessageHistories,
    reload: () => loadDetail(userId),
  };
}
