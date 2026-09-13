import Cookies from 'js-cookie';
import React, { useEffect, useMemo, useState } from 'react';
import { Input, message } from 'antd';
import { Link } from 'react-router-dom';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { getAdminRoutePath, getEcChatBotFrontEndBaseUrl } from 'v2/variables/constants';
import {
  CHAT_BODY_VERSION_DEFAULT,
  buildFaqEmbedScript,
  buildPaymentEmbedScript,
  getSdkEmbedPaths,
} from 'v2/views/InstallationTag/sdkEmbedPaths';
import { AdminPage, AdminFormRow, AdminActionButton, useAdminHeaderActions } from 'v2/components/AdminShell';
import {
  BOT_ID_COOKIE_KEY,
  CHATBOTS_API_PATH,
  COPY_SUCCESS,
  DEMO_BOT_PATH_PREFIX,
  EMBED_HINT,
  FAQ_EMBED_LABEL,
  OPEN_DEMO_LABEL,
  PAYMENT_EMBED_LABEL,
  TEXTAREA_ROWS,
} from './constants';

const InstallationTag = () => {
  const [urlDemo, setUrlDemo] = useState('');
  const [botId] = useState(Cookies.get(BOT_ID_COOKIE_KEY));
  const [chatBodyVersion, setChatBodyVersion] = useState(CHAT_BODY_VERSION_DEFAULT);

  const { paymentSdkUrl, faqSdkUrl } = useMemo(
    () => getSdkEmbedPaths(chatBodyVersion, getEcChatBotFrontEndBaseUrl()),
    [chatBodyVersion],
  );

  const paymentScript = buildPaymentEmbedScript(botId, paymentSdkUrl);
  const faqScript = buildFaqEmbedScript(botId, faqSdkUrl, { includeBotType: true });

  useEffect(() => {
    setUrlDemo(getAdminRoutePath(`${DEMO_BOT_PATH_PREFIX}${botId}`));
    if (!botId) return undefined;

    api
      .get(`${CHATBOTS_API_PATH}/${botId}`)
      .then((res) => {
        const version = res?.data?.data?.chat_body_version;
        if (version) setChatBodyVersion(version);
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });

    return undefined;
  }, [botId]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    message.success(COPY_SUCCESS);
  };

  useAdminHeaderActions(
    <Link to={urlDemo}>
      <AdminActionButton action="preview" label={OPEN_DEMO_LABEL} />
    </Link>
  );

  return (
    <AdminPage>
      <div className="admin-page-body">
        <AdminFormRow alignTop label={PAYMENT_EMBED_LABEL} hint={EMBED_HINT}>
          <Input.TextArea
            value={paymentScript}
            readOnly
            rows={TEXTAREA_ROWS}
            className="admin-code-textarea"
          />
          <div className="admin-form-row-action">
            <AdminActionButton action="copy" onClick={() => copyText(paymentScript)} />
          </div>
        </AdminFormRow>

        <AdminFormRow alignTop label={FAQ_EMBED_LABEL} hint={EMBED_HINT}>
          <Input.TextArea
            value={faqScript}
            readOnly
            rows={TEXTAREA_ROWS}
            className="admin-code-textarea"
          />
          <div className="admin-form-row-action">
            <AdminActionButton action="copy" onClick={() => copyText(faqScript)} />
          </div>
        </AdminFormRow>
      </div>
    </AdminPage>
  );
};

export default InstallationTag;
