import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { message as antMessage } from 'antd';
import {
  createKeyword,
  deleteKeyword,
  fetchKeywords,
  updateKeyword,
} from '../api/keywordSettingsApi';
import { KEYWORD_PAGE_SIZE, TOAST_MESSAGES } from '../constants';
import { channelsToPayload, serializeKeywords } from '../utils/keywordFormatters';

export default function useKeywords(instagramAccountId) {
  const [keywords, setKeywords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadKeywords = useCallback(async (pageNum = page) => {
    setLoading(true);
    try {
      const result = await fetchKeywords(pageNum);
      const totalPages = Math.max(1, Math.ceil(result.total / KEYWORD_PAGE_SIZE));
      const safePage = pageNum > totalPages ? totalPages : pageNum;

      if (safePage !== pageNum) {
        const adjusted = await fetchKeywords(safePage);
        setKeywords(adjusted.data);
        setTotal(adjusted.total);
        setPage(safePage);
      } else {
        setKeywords(result.data);
        setTotal(result.total);
        setPage(pageNum);
      }
    } catch (error) {
      console.error(error);
      setKeywords([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!Cookies.get('token') || Cookies.get('is_auth') === 'false') {
      window.location.href = '/';
      return;
    }
    loadKeywords(1);
  }, []);

  const handlePageChange = useCallback((nextPage) => {
    loadKeywords(nextPage);
    document.querySelector('.main-panel')?.scrollTo(0, 0);
  }, [loadKeywords]);

  const addKeyword = useCallback(async (formValues) => {
    if (!instagramAccountId) return false;

    await createKeyword({
      title: formValues.title.trim(),
      keyword: serializeKeywords(formValues.keywords),
      instagram_account_id: instagramAccountId,
      message_bag_id: parseInt(formValues.messageBagId, 10),
      is_active: true,
      ...channelsToPayload(formValues.channels),
    });
    antMessage.success(TOAST_MESSAGES.KEYWORD_ADDED);
    await loadKeywords(page);
    return true;
  }, [instagramAccountId, loadKeywords, page]);

  const editKeyword = useCallback(async (id, formValues, existingKeyword) => {
    await updateKeyword(id, {
      title: formValues.title.trim(),
      keyword: serializeKeywords(formValues.keywords),
      instagram_account_id: existingKeyword.instagram_account_id,
      message_bag_id: parseInt(formValues.messageBagId, 10),
      is_active: existingKeyword.is_active ?? true,
      ...channelsToPayload(formValues.channels),
    });
    antMessage.success(TOAST_MESSAGES.KEYWORD_UPDATED);
    await loadKeywords(page);
    return true;
  }, [loadKeywords, page]);

  const removeKeyword = useCallback(async (id) => {
    await deleteKeyword(id);
    antMessage.success(TOAST_MESSAGES.KEYWORD_DELETED);
    await loadKeywords(page);
  }, [loadKeywords, page]);

  const toggleActive = useCallback(async (keyword) => {
    const nextActive = !(keyword.is_active ?? false);
    await updateKeyword(keyword.id, {
      title: keyword.title,
      keyword: keyword.keyword,
      instagram_account_id: keyword.instagram_account_id,
      message_bag_id: keyword.message_bag_id,
      is_active: nextActive,
      is_dm: keyword.is_dm ?? false,
      is_story_comment: keyword.is_story_comment ?? false,
      is_post_comment: keyword.is_post_comment ?? false,
      is_live_comment: keyword.is_live_comment ?? false,
    });
    antMessage.success(TOAST_MESSAGES.KEYWORD_TOGGLED);
    await loadKeywords(page);
  }, [loadKeywords, page]);

  const totalPages = Math.max(1, Math.ceil(total / KEYWORD_PAGE_SIZE));

  return {
    keywords,
    total,
    page,
    totalPages,
    loading,
    loadKeywords,
    handlePageChange,
    addKeyword,
    editKeyword,
    removeKeyword,
    toggleActive,
  };
}
