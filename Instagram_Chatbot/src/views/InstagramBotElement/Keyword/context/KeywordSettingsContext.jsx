import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import useKeywords from '../hooks/useKeywords';
import useDefaultReply from '../hooks/useDefaultReply';
import useBagLookup from '../hooks/useBagLookup';

const KeywordSettingsContext = createContext(null);

export function KeywordSettingsProvider({ children }) {
  const defaultReply = useDefaultReply();
  const instagramAccountId = defaultReply.instagramSetting?.id ?? null;
  const keywords = useKeywords(instagramAccountId);
  const bagLookup = useBagLookup();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openAddModal = useCallback(() => {
    setEditingKeyword(null);
    setFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((keyword) => {
    setEditingKeyword(keyword);
    setFormModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setFormModalOpen(false);
    setEditingKeyword(null);
  }, []);

  const openDeleteModal = useCallback((keyword) => {
    setDeleteTarget(keyword);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await keywords.removeKeyword(deleteTarget.id);
      closeDeleteModal();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, keywords, closeDeleteModal]);

  const value = useMemo(
    () => ({
      defaultReply,
      keywords,
      bagLookup,
      formModalOpen,
      editingKeyword,
      deleteModalOpen,
      deleteTarget,
      deleteLoading,
      openAddModal,
      openEditModal,
      closeFormModal,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    }),
    [
      defaultReply,
      keywords,
      bagLookup,
      formModalOpen,
      editingKeyword,
      deleteModalOpen,
      deleteTarget,
      deleteLoading,
      openAddModal,
      openEditModal,
      closeFormModal,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    ]
  );

  return (
    <KeywordSettingsContext.Provider value={value}>
      {children}
    </KeywordSettingsContext.Provider>
  );
}

export function useKeywordSettings() {
  const context = useContext(KeywordSettingsContext);
  if (!context) {
    throw new Error('useKeywordSettings must be used within KeywordSettingsProvider');
  }
  return context;
}
