import React, { useEffect, useState } from 'react';
import { Input, Select } from 'antd';
import { fetchMessageGroup } from '../../api/messageManagementApi';
import {
  BUTTON_TYPE_OPTIONS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
} from '../../constants';
import { BUTTON_TYPES } from '../../constants/buttonTypes';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';

function BagSelect({ groupId, value, onChange }) {
  const [bags, setBags] = useState([]);

  useEffect(() => {
    if (!groupId) {
      setBags([]);
      return;
    }
    fetchMessageGroup(groupId).then((data) => {
      setBags(data.message_bags || []);
    });
  }, [groupId]);

  return (
    <Select
      className="cb-field cb-field-block"
      placeholder={FORM_PLACEHOLDERS.SELECT_BAG}
      value={value || undefined}
      onChange={onChange}
      options={bags.map((bag) => ({ value: bag.id, label: bag.bag_name }))}
    />
  );
}

export default function ChoiceEditorForm() {
  const { drafts, groups } = useChatbotEditor();
  const { draft, setDraft } = drafts;

  if (!draft?.choiceData?.buttons?.length) return null;

  const updateButton = (index, patch) => {
    setDraft((prev) => {
      const buttons = [...prev.choiceData.buttons];
      buttons[index] = { ...buttons[index], ...patch };
      return { ...prev, choiceData: { ...prev.choiceData, buttons } };
    });
  };

  return (
    <div className="cb-form-block">
      {draft.choiceData.buttons.map((btn, index) => (
        <div key={index} className="cb-choice-card">
          <div className="cb-choice-card__title">
            {FORM_LABELS.BUTTON_PREFIX} {index + 1}
          </div>
          <Input
            placeholder={FORM_PLACEHOLDERS.TITLE}
            value={btn.title}
            onChange={(e) => updateButton(index, { title: e.target.value })}
          />
          <Select
            className="cb-field cb-field-block"
            value={btn.buttonType}
            onChange={(value) => updateButton(index, { buttonType: value })}
            options={BUTTON_TYPE_OPTIONS}
          />
          {btn.buttonType === BUTTON_TYPES.WEB_URL ? (
            <Input
              className="cb-field-block"
              placeholder={FORM_PLACEHOLDERS.URL}
              value={btn.content}
              onChange={(e) => updateButton(index, { content: e.target.value })}
            />
          ) : (
            <>
              <Select
                className="cb-field cb-field-block"
                placeholder={FORM_PLACEHOLDERS.SELECT_GROUP}
                value={btn.messageGroupId || undefined}
                onChange={(value) =>
                  updateButton(index, { messageGroupId: value, messageBagId: '' })
                }
                options={groups.groups.map((g) => ({ value: g.id, label: g.group_name }))}
              />
              <BagSelect
                groupId={btn.messageGroupId}
                value={btn.messageBagId}
                onChange={(value) => updateButton(index, { messageBagId: value })}
              />
            </>
          )}
          <Input
            className="cb-field-block"
            placeholder={FORM_PLACEHOLDERS.LABEL}
            value={(btn.labels && btn.labels[0]) || ''}
            onChange={(e) => updateButton(index, { labels: [e.target.value] })}
          />
        </div>
      ))}
    </div>
  );
}
