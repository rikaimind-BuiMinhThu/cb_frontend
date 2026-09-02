import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminActionButton, AdminFormRow, useAdminHeaderTitle, useAdminHeaderActions } from '../../../../components/AdminShell';
import { Input, message } from 'antd';
import { getAdminRoutePath } from 'v2/variables/constants';
import '../../../../assets/css/bot/email/create-email.css';

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

const chipStyle = {
  margin: '0 5px 5px 0',
  borderRadius: 5,
  width: 'max-content',
  backgroundColor: '#e0e0e0',
  display: 'flex',
  alignItems: 'center',
  padding: '2px 8px',
};

function EmailChipList({ emails, onRemove }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 8 }}>
      {emails.map((email, index) => (
        <div key={`${email}-${index}`} style={chipStyle}>
          <span>{email}</span>
          <span
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer', marginLeft: 8 }}
            onClick={() => onRemove(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onRemove(index);
            }}
          >
            X
          </span>
        </div>
      ))}
    </div>
  );
}

function CreateEmail() {
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
    let cancelled = false;
    api
      .get(`/api/v1/managements/emails/${id}`)
      .then((res) => {
        if (cancelled) return;
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
        if (cancelled) return;
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit]);

  function updateField(key, value) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  function addAddress(value, list, setList, setError, setInput) {
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

  function addCC(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      addAddress(ccInput, ccAll, setCcAll, setCcError, setCcInput);
    }
  }

  function addBCC(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      addAddress(bccInput, bccAll, setBccAll, setBccError, setBccInput);
    }
  }

  function collectForm() {
    return {
      email: {
        ...formValues,
        cc: ccAll,
        bcc: bccAll,
        chatbot_id: Cookies.get('bot_id'),
      },
    };
  }

  function setFieldError(key, value) {
    setFieldErrors((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }

  function checkRequired(key, label, errorKey = key) {
    if (!formValues[key]) {
      setFieldError(errorKey, `${label}は、必ず指定してください。`);
      return false;
    }
    setFieldError(errorKey, '');
    return true;
  }

  function checkEmail(key) {
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

  function checkTo(key, label) {
    return checkRequired(key, label) && checkEmail(key);
  }

  function isFormValid() {
    return (
      checkRequired('email_template_name', 'テンプレート名') &&
      checkTo('to', '宛先') &&
      checkRequired('subject', '件名') &&
      checkRequired('content', 'メール内容', 'text')
    );
  }

  function addEmail(e) {
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

  function saveEmail(e) {
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
        <AdminActionButton action="create" label="作成" loading={saving} onClick={(e) => addEmail(e)} />
      )}
    </>
  );

  return (
    <>
      <AdminPage>
        <div className="admin-page-body">
          <form id="create-email-form">
            <AdminFormRow label="テンプレート名" required htmlFor="email_template_name" error={fieldErrors.email_template_name}>
              <Input
                id="email_template_name"
                value={formValues.email_template_name}
                placeholder="テンプレート名は、必ず指定してください。"
                name="email_template_name"
                onChange={(e) => {
                  updateField('email_template_name', e.target.value);
                  setFieldError('email_template_name', e.target.value ? '' : 'テンプレート名は、必ず指定してください。');
                }}
                onBlur={() => checkRequired('email_template_name', 'テンプレート名')}
              />
            </AdminFormRow>

            <AdminFormRow label="差出人" htmlFor="sender_name">
              <Input
                id="sender_name"
                value={formValues.sender_name}
                placeholder="差出人は、必ず指定してください。"
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

            <AdminFormRow label="BCC（同報）" htmlFor="bcc" alignTop error={bccError}>
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

            <AdminFormRow label="件名" required htmlFor="subject" error={fieldErrors.subject}>
              <Input
                id="subject"
                value={formValues.subject}
                placeholder="件名は、必ず指定してください。"
                name="subject"
                onChange={(e) => {
                  updateField('subject', e.target.value);
                  setFieldError('subject', e.target.value ? '' : '件名は、必ず指定してください。');
                }}
                onBlur={() => checkRequired('subject', '件名')}
              />
            </AdminFormRow>

            <AdminFormRow label="メール内容" required htmlFor="text" alignTop error={fieldErrors.text}>
              <Input.TextArea
                id="text"
                rows={7}
                value={formValues.content}
                placeholder="メール内容は、必ず指定してください。"
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
}

export default CreateEmail;
