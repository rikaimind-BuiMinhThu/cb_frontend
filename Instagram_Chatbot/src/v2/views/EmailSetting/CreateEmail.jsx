import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminActionButton, AdminFormRow, useAdminHeaderTitle, useAdminHeaderActions } from 'v2/components/AdminShell';
import { Input, message } from 'antd';
import { getAdminRoutePath } from 'v2/variables/constants';
import {
  CREATE_BUTTON,
  LABEL_BCC,
  LABEL_CONTENT,
  LABEL_SENDER,
  LABEL_SUBJECT,
  LABEL_TEMPLATE_NAME,
  PLACEHOLDER_CONTENT,
  PLACEHOLDER_SENDER,
  PLACEHOLDER_SUBJECT,
  PLACEHOLDER_TEMPLATE_NAME,
} from './constants';
import 'v2/assets/css/bot/email/create-email.css';

const CHIP_REMOVE_LABEL = 'X';
const ENTER_KEY = 'Enter';
const SPACE_KEY = ' ';

const EMAIL_FORMAT =
  /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

const EMPTY_FORM = {
  email_template_name: '',
  sender_name: '',
  to: '',
  reply_to: '',
  subject: '',
  content: '',
};

const EmailChipList = ({ emails, onRemove }) => (
  <div className="email-chip-list">
    {emails.map((email, index) => (
      <div key={`${email}-${index}`} className="email-chip">
        <span>{email}</span>
        <span
          role="button"
          tabIndex={0}
          className="email-chip-remove"
          onClick={() => onRemove(index)}
          onKeyDown={(event) => {
            if (event.key === ENTER_KEY || event.key === SPACE_KEY) onRemove(index);
          }}
        >
          {CHIP_REMOVE_LABEL}
        </span>
      </div>
    ))}
  </div>
);

const CreateEmail = () => {
  const isEdit = window.location.pathname.includes('edit-email');
  const [ccAll, setCcAll] = useState([]);
  const [bccAll, setBccAll] = useState([]);
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');
  const [ccError, setCcError] = useState('');
  const [bccError, setBccError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return undefined;
    const id = window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1);
    const cancellation = { aborted: false };
    api
      .get(`/api/v1/managements/emails/${id}`)
      .then((res) => {
        if (cancellation.aborted) return;
        if (res.data.code === 1) {
          const email = res.data.data?.email || {};
          setFormValues({
            email_template_name: email.email_template_name || '',
            sender_name: email.sender_name || '',
            to: email.to || '',
            reply_to: email.reply_to || '',
            subject: email.subject || '',
            content: email.content || '',
          });
          setCcAll((res.data.data.email_cc || []).map((item) => item.to).filter(Boolean));
          setBccAll((res.data.data.email_bcc || []).map((item) => item.to).filter(Boolean));
        }
      })
      .catch((err) => {
        if (cancellation.aborted) return;
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      cancellation.aborted = true;
    };
  }, [isEdit]);

  const updateField = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  const addAddress = (value, list, setList, setError, setInput) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return;
    if (!EMAIL_FORMAT.test(trimmed)) {
      setError('メールの正しい形式で入力してください：abc@abc.com');
      return;
    }
    if (list.indexOf(trimmed) !== -1) {
      setError('メール複製');
      return;
    }
    setList(list.concat(trimmed));
    setError('');
    setInput('');
  }

  const addCC = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      addAddress(ccInput, ccAll, setCcAll, setCcError, setCcInput);
    }
  }

  const addBCC = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      addAddress(bccInput, bccAll, setBccAll, setBccError, setBccInput);
    }
  }

  const collectForm = () => {
    return {
      email: {
        ...formValues,
        cc: ccAll,
        bcc: bccAll,
        chatbot_id: Cookies.get('bot_id'),
      },
    };
  }

  const setFieldError = (key, value) => {
    setFieldErrors((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }

  const checkRequired = (key, label, errorKey = key) => {
    if (!formValues[key]) {
      setFieldError(errorKey, `${label}は、必ず指定してください。`);
      return false;
    }
    setFieldError(errorKey, '');
    return true;
  }

  const checkEmail = (key) => {
    const value = formValues[key] || '';
    if (key === 'to' && value.slice(0, 2) === '{{' && value.slice(-2) === '}}') {
      if (value.slice(2, value.length - 2).replace(/\s/g, '') === '') {
        setFieldError(key, 'メールの変数を指定してください');
        return false;
      }
      setFieldError(key, '');
      return true;
    }
    if (!EMAIL_FORMAT.test(value)) {
      setFieldError(key, 'メールの正しい形式で入力してください：abc@abc.com');
      return false;
    }
    setFieldError(key, '');
    return true;
  }

  const checkTo = (key, label) => {
    return checkRequired(key, label) && checkEmail(key);
  }

  const isFormValid = () => {
    return (
      checkRequired('email_template_name', 'テンプレート名') &&
      checkTo('to', '宛先') &&
      checkRequired('subject', '件名') &&
      checkRequired('content', 'メール内容', 'text')
    );
  }

  const addEmail = (e) => {
    e.preventDefault();
    if (saving || !isFormValid()) return;
    setSaving(true);
    api
      .post('/api/v1/managements/emails', collectForm())
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に追加されました！!');
          setTimeout(() => {
            window.location.href = getAdminRoutePath('/list-email');
          }, 1500);
        } else if (res.data.code === 2) {
          setSaving(false);
          message.warning(res.data.message);
        } else {
          setSaving(false);
        }
      })
      .catch((err) => {
        setSaving(false);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  const saveEmail = (e) => {
    e.preventDefault();
    if (saving || !isFormValid()) return;
    const id = window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1);
    setSaving(true);
    api
      .patch(`/api/v1/managements/emails/${id}`, collectForm())
      .then((res) => {
        if (res.data.code === 1) {
          message.success('正常に更新されました！');
          setTimeout(() => {
            window.location.href = getAdminRoutePath('/list-email');
          }, 1500);
        } else if (res.data.code === 2) {
          setSaving(false);
          message.warning(res.data.message);
        } else {
          setSaving(false);
        }
      })
      .catch((err) => {
        setSaving(false);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  useAdminHeaderTitle(isEdit ? 'メール編集' : 'メール作成');

  useAdminHeaderActions(
    <>
      <AdminActionButton
        action="back"
        onClick={() => { window.location.href = getAdminRoutePath('/list-email'); }}
      />
      {isEdit ? (
        <AdminActionButton action="save" loading={saving} onClick={(e) => saveEmail(e)} />
      ) : (
        <AdminActionButton action="create" label={CREATE_BUTTON} loading={saving} onClick={(e) => addEmail(e)} />
      )}
    </>
  );

  return (
    <>
      <AdminPage>
        <div className="admin-page-body">
          <form id="create-email-form">
            <AdminFormRow label={LABEL_TEMPLATE_NAME} required htmlFor="email_template_name" error={fieldErrors.email_template_name}>
              <Input
                id="email_template_name"
                value={formValues.email_template_name}
                placeholder={PLACEHOLDER_TEMPLATE_NAME}
                name="email_template_name"
                onChange={(e) => {
                  updateField('email_template_name', e.target.value);
                  setFieldError('email_template_name', e.target.value ? '' : 'テンプレート名は、必ず指定してください。');
                }}
                onBlur={() => checkRequired('email_template_name', 'テンプレート名')}
              />
            </AdminFormRow>

            <AdminFormRow label={LABEL_SENDER} htmlFor="sender_name">
              <Input
                id="sender_name"
                value={formValues.sender_name}
                placeholder={PLACEHOLDER_SENDER}
                name="sender_name"
                onChange={(e) => updateField('sender_name', e.target.value)}
              />
            </AdminFormRow>

            <AdminFormRow label="TO" required htmlFor="to" error={fieldErrors.to}>
              <Input
                id="to"
                value={formValues.to}
                placeholder="no-reply@ec-chatbot.com"
                name="to"
                onChange={(e) => {
                  updateField('to', e.target.value);
                }}
                onBlur={() => checkTo('to', '宛先')}
              />
            </AdminFormRow>

            <AdminFormRow label="CC" htmlFor="cc" alignTop error={ccError}>
              <EmailChipList emails={ccAll} onRemove={(index) => setCcAll(ccAll.filter((_, i) => i !== index))} />
              <Input
                id="cc"
                value={ccInput}
                placeholder="no-reply@ec-chatbot.com"
                onChange={(e) => setCcInput(e.target.value)}
                onKeyDown={addCC}
              />
            </AdminFormRow>

            <AdminFormRow label={LABEL_BCC} htmlFor="bcc" alignTop error={bccError}>
              <EmailChipList emails={bccAll} onRemove={(index) => setBccAll(bccAll.filter((_, i) => i !== index))} />
              <Input
                id="bcc"
                value={bccInput}
                placeholder="no-reply@botchan.chat"
                onChange={(e) => setBccInput(e.target.value)}
                onKeyDown={addBCC}
              />
            </AdminFormRow>

            <AdminFormRow label="Reply-To">
              <Input
                value={formValues.reply_to}
                placeholder="no-reply@ec-chatbot.com"
                name="reply_to"
                onChange={(e) => updateField('reply_to', e.target.value)}
              />
            </AdminFormRow>

            <AdminFormRow label={LABEL_SUBJECT} required htmlFor="subject" error={fieldErrors.subject}>
              <Input
                id="subject"
                value={formValues.subject}
                placeholder={PLACEHOLDER_SUBJECT}
                name="subject"
                onChange={(e) => {
                  updateField('subject', e.target.value);
                  setFieldError('subject', e.target.value ? '' : '件名は、必ず指定してください。');
                }}
                onBlur={() => checkRequired('subject', '件名')}
              />
            </AdminFormRow>

            <AdminFormRow label={LABEL_CONTENT} required htmlFor="text" alignTop error={fieldErrors.text}>
              <Input.TextArea
                id="text"
                rows={7}
                value={formValues.content}
                placeholder={PLACEHOLDER_CONTENT}
                name="content"
                onChange={(e) => {
                  updateField('content', e.target.value);
                  setFieldError('text', e.target.value ? '' : 'メール内容は、必ず指定してください。');
                }}
                onBlur={() => checkRequired('content', 'メール内容', 'text')}
              />
            </AdminFormRow>
          </form>
        </div>
      </AdminPage>
    </>
  );
};

export default CreateEmail;
