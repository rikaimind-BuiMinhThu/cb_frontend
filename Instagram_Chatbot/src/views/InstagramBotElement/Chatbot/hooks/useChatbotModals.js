import { useCallback, useMemo, useState } from 'react';

const INITIAL_MODALS = {
  addGroup: false,
  renameGroup: false,
  copyGroup: false,
  deleteGroup: false,
  addBag: false,
  renameBag: false,
  copyBag: false,
  deleteBag: false,
  moveBag: false,
  hotTemplateSetting: false,
  hotTemplateDetail: false,
  pastPostPicker: false,
  profileMessage: false,
};

export default function useChatbotModals() {
  const [modals, setModals] = useState(INITIAL_MODALS);
  const [modalTargetId, setModalTargetId] = useState(null);

  const openModal = useCallback((name, targetId = null) => {
    setModalTargetId(targetId);
    setModals((prev) => ({ ...prev, [name]: true }));
  }, []);

  const closeModal = useCallback((name) => {
    setModals((prev) => ({ ...prev, [name]: false }));
    setModalTargetId(null);
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(INITIAL_MODALS);
    setModalTargetId(null);
  }, []);

  return useMemo(
    () => ({
      modals,
      modalTargetId,
      openModal,
      closeModal,
      closeAllModals,
    }),
    [modals, modalTargetId, openModal, closeModal, closeAllModals]
  );
}
