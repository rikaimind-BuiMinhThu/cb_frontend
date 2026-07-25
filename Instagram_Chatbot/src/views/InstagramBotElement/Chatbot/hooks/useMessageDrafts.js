import { useCallback, useMemo, useState } from 'react';
import { BUTTON_TYPES, CHOICE_MODES } from '../constants/buttonTypes';
import { DRAFT_ERRORS, MESSAGE_TYPES } from '../constants';
import { createEmptyDraft } from '../utils/previewBuilder';

function isChoiceButtonValid(btn) {
  if (!btn.title?.trim()) return false;
  if (btn.buttonType === BUTTON_TYPES.WEB_URL) {
    return Boolean(btn.content?.trim());
  }
  if (btn.buttonType === BUTTON_TYPES.MESS) {
    return Boolean(btn.messageBagId);
  }
  return false;
}

function isDraftValid(draft) {
  if (!draft) return true;

  if (draft.messageType === MESSAGE_TYPES.IMG) {
    return Boolean(draft.imgValue || draft.previewUrl);
  }
  if (draft.messageType === MESSAGE_TYPES.IMG_MSG) {
    return Boolean(draft.imgValue || draft.previewUrl) && Boolean(draft.messageValue?.trim());
  }
  if (draft.messageType === MESSAGE_TYPES.PAST_POST) {
    return Boolean(draft.previewPastPostUrl);
  }
  if (draft.messageType === MESSAGE_TYPES.PROFILE_MSG) {
    return Boolean(draft.profileFieldKey) && Boolean(draft.messageValue?.trim());
  }
  if (draft.messageType === MESSAGE_TYPES.MSG) {
    if (!draft.messageValue?.trim()) return false;
    if (draft.choiceMode === CHOICE_MODES.FREE_INPUT) {
      return draft.freeInput.labels.some((l) => l.trim());
    }
    if (draft.choiceMode === CHOICE_MODES.SINGLE || draft.choiceMode === CHOICE_MODES.THREE) {
      return draft.choiceData.buttons.every(isChoiceButtonValid);
    }
    return true;
  }
  return false;
}

export default function useMessageDrafts() {
  const [draft, setDraftState] = useState(null);

  const hasActiveDraft = Boolean(draft && !draft.isComplete);
  const canAddNew = !hasActiveDraft;

  const setDraft = useCallback((updater) => {
    setDraftState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (!next) return null;
      return { ...next, isComplete: isDraftValid(next) };
    });
  }, []);

  const startDraft = useCallback((messageType) => {
    if (!canAddNew) return false;
    setDraftState(createEmptyDraft(messageType));
    return true;
  }, [canAddNew]);

  const loadDraftFromMessage = useCallback((messageDraft) => {
    setDraftState({ ...messageDraft, isEditing: true, isComplete: true });
  }, []);

  const clearDraft = useCallback(() => {
    setDraftState(null);
  }, []);

  const markDraftComplete = useCallback(() => {
    setDraftState(null);
  }, []);

  const draftError = useMemo(() => {
    if (!hasActiveDraft) return '';
    return isDraftValid(draft) ? '' : DRAFT_ERRORS.INCOMPLETE;
  }, [draft, hasActiveDraft]);

  return {
    draft,
    setDraft,
    hasActiveDraft,
    canAddNew,
    draftError,
    startDraft,
    loadDraftFromMessage,
    clearDraft,
    markDraftComplete,
  };
}
