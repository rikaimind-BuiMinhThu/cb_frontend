import { useCallback, useEffect, useState } from 'react';
import {
  createPersistentMenu,
  deletePersistentMenu,
  fetchPersistentMenus,
  fetchPersistentMenusStatus,
  turnOffPersistentMenus,
  turnOnPersistentMenus,
  updatePersistentMenu,
} from '../api/releaseApi';
import { MAX_PERSISTENT_MENUS } from '../constants';

function isPublished(statusResponse) {
  const menus = statusResponse?.instagram_persistent_menus?.data?.[0]?.persistent_menu;
  return Array.isArray(menus) && menus.length > 0;
}

export default function usePersistentMenus(igId) {
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
        fetchPersistentMenus(),
        fetchPersistentMenusStatus(igId).catch(() => null),
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

  const addItem = useCallback(async (payload) => {
    if (items.length >= MAX_PERSISTENT_MENUS) {
      throw new Error(`固定メニューは最大${MAX_PERSISTENT_MENUS}件までです。`);
    }
    await createPersistentMenu({ persistent_menu: payload });
    if (published && igId) {
      await turnOnPersistentMenus(igId);
    }
    await load();
  }, [igId, items.length, load, published]);

  const editItem = useCallback(async (id, payload) => {
    await updatePersistentMenu(id, { persistent_menu: payload });
    if (published && igId) {
      await turnOnPersistentMenus(igId);
    }
    await load();
  }, [igId, load, published]);

  const removeItem = useCallback(async (id) => {
    if (items.length <= 1) {
      throw new Error('固定メッセージが最低1つの選択がある必要です。');
    }
    await deletePersistentMenu(id);
    if (published && igId) {
      await turnOnPersistentMenus(igId);
    }
    await load();
  }, [igId, items.length, load, published]);

  const togglePublish = useCallback(async (nextPublished) => {
    if (!igId) throw new Error('Instagramアカウントが接続されていません。');
    setToggling(true);
    try {
      if (nextPublished) {
        await turnOnPersistentMenus(igId);
      } else {
        await turnOffPersistentMenus(igId);
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
