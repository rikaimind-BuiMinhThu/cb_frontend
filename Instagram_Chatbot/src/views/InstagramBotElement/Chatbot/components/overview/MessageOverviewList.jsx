import React, { useState } from 'react';
import {
  FileImageOutlined,
  InstagramOutlined,
  MessageOutlined,
  PictureOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  ADD_MESSAGE_OPTIONS,
  DRAFT_ERRORS,
  EMPTY_STATES,
  MESSAGE_TYPE_LABELS,
  SECTION_TITLES,
} from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';

const ICON_MAP = {
  picture: PictureOutlined,
  message: MessageOutlined,
  'file-image': FileImageOutlined,
  instagram: InstagramOutlined,
  user: UserOutlined,
};

export default function MessageOverviewList() {
  const { messages, drafts, selectMessage, bags } = useChatbotEditor();
  const [dragId, setDragId] = useState(null);

  if (!bags.selectedBagId) {
    return <div className="cb-empty-state">{EMPTY_STATES.SELECT_BAG}</div>;
  }

  if (messages.loading) {
    return <div className="cb-empty-state">{EMPTY_STATES.LOADING_MESSAGES}</div>;
  }

  if (!messages.messages.length && !drafts.hasActiveDraft) {
    return <div className="cb-empty-state">{EMPTY_STATES.NO_MESSAGES}</div>;
  }

  const handleDragStart = (messageId) => setDragId(messageId);

  const handleDrop = (targetId) => {
    if (dragId && dragId !== targetId) {
      messages.moveMessage(dragId, targetId);
    }
    setDragId(null);
  };

  return (
    <div>
      <h3 className="cb-section-title">{SECTION_TITLES.MESSAGE_CONTENT}</h3>
      {messages.messages.map((message) => (
        <div
          key={message.id}
          className={`cb-message-card${
            messages.selectedMessageId === message.id ? ' is-selected' : ''
          }${dragId === message.id ? ' is-dragging' : ''}`}
          draggable
          onDragStart={() => handleDragStart(message.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(message.id)}
          onClick={() => selectMessage(message)}
        >
          <strong>{MESSAGE_TYPE_LABELS[message.message_type] || message.message_type}</strong>
          <div className="cb-message-card__meta">
            {message.message_value?.slice(0, 60) ||
              (message.img_value ? EMPTY_STATES.IMAGE : '') ||
              message.preview_past_post_url?.slice(0, 60)}
          </div>
        </div>
      ))}
      {drafts.hasActiveDraft && (
        <div className="cb-message-card is-selected">
          <strong>
            {EMPTY_STATES.DRAFT_NEW_PREFIX}
            {MESSAGE_TYPE_LABELS[drafts.draft.messageType]}
          </strong>
          <div className="cb-message-card__meta">{EMPTY_STATES.DRAFT_EDITING}</div>
        </div>
      )}
    </div>
  );
}

export function MessageTypeToolbar() {
  const { drafts, modals, bags } = useChatbotEditor();

  const handleAdd = (type) => {
    if (!bags.selectedBagId) return;
    if (type === 'profile_msg') {
      modals.openModal('profileMessage');
      return;
    }
    if (type === 'past_post') {
      modals.openModal('pastPostPicker');
      return;
    }
    drafts.startDraft(type);
  };

  return (
    <div>
      <h3 className="cb-section-title">{SECTION_TITLES.MESSAGE_TYPE}</h3>
      <div className="cb-type-toolbar">
        {ADD_MESSAGE_OPTIONS.map((option) => {
          const Icon = ICON_MAP[option.icon];
          return (
            <button
              key={option.type}
              type="button"
              className="cb-type-btn"
              disabled={!bags.selectedBagId || !drafts.canAddNew}
              onClick={() => handleAdd(option.type)}
            >
              {Icon && <Icon className="cb-type-btn__icon" />}
              {option.label}
            </button>
          );
        })}
      </div>
      {drafts.draftError && <div className="cb-error-text">{DRAFT_ERRORS.INCOMPLETE}</div>}
    </div>
  );
}
