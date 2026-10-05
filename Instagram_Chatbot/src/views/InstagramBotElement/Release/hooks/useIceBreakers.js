import { useCallback, useEffect, useState } from 'react';
import {
  createIceBreaker,
  deleteIceBreaker,
  fetchIceBreakers,
  fetchIceBreakersStatus,
  turnOffIceBreakers,
  turnOnIceBreakers,
  updateIceBreaker,
} from '../api/releaseApi';
import { MAX_ICE_BREAKERS } from '../constants';

function isPublished(statusResponse) {
  const iceBreakers = statusResponse?.instagram_ice_breakers?.data?.[0]?.ice_breakers;
  return Array.isArray(iceBreakers) && iceBreakers.length > 0;
}

export default function useIceBreakers(igId) {
  const [items, setItems] = useState([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const load = useCallback(async () => {
    if (!igId) {
      setItems([]);
      setPublished(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [list, status] = await Promise.all([
        fetchIceBreakers(),
        fetchIceBreakersStatus(igId).catch(() => null),
      ]);
      setItems(Array.isArray(list) ? list : []);
      setPublished(isPublished(status));
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [igId]);

  useEffect(() => {
    load();
  }, [load]);

  const addItem = useCallback(async ({ question, messageBagId }) => {
    if (items.length >= MAX_ICE_BREAKERS) {
      throw new Error(`FAQは最大${MAX_ICE_BREAKERS}件までです。`);
    }
    await createIceBreaker({ ice_breaker: { question, message_bag_id: messageBagId } });
    await load();
  }, [items.length, load]);

  const editItem = useCallback(async (id, { question, messageBagId }) => {
    await updateIceBreaker(id, { ice_breaker: { question, message_bag_id: messageBagId } });
    await load();
  }, [load]);

  const removeItem = useCallback(async (id) => {
    if (published && items.length <= 1) {
      throw new Error('よくある質問が最低1つの選択がある必要です。');
    }
    await deleteIceBreaker(id);
    if (published && igId) {
      await turnOnIceBreakers(igId);
    }
    await load();
  }, [igId, items.length, load, published]);

  const togglePublish = useCallback(async (nextPublished) => {
    if (!igId) throw new Error('Instagramアカウントが接続されていません。');
    setToggling(true);
    try {
      if (nextPublished) {
        await turnOnIceBreakers(igId);
      } else {
        await turnOffIceBreakers(igId);
      }
      await load();
      return nextPublished;
    } finally {
      setToggling(false);
    }
  }, [igId, load]);

  return {
    items,
    published,
    loading,
    toggling,
    load,
    addItem,
    editItem,
    removeItem,
    togglePublish,
  };
}
