import Cookies from 'js-cookie';
import React, { useEffect, useMemo, useState } from 'react';
import { Input, message } from 'antd';
import { Link } from 'react-router-dom';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { getAdminRoutePath, getEcChatBotFrontEndBaseUrl } from 'v2/variables/constants';
import {
  CHAT_BODY_VERSION_1,
  buildCartConfirmEmbedScript,
  buildConversionLogEmbedScript,
  buildFaqEmbedScript,
  buildPaymentEmbedScript,
  getSdkEmbedPaths,
} from 'v2/views/InstallationTag/sdkEmbedPaths';
import { AdminPage, AdminFormRow, AdminActionButton, useAdminHeaderActions } from 'v2/components/AdminShell';
import {
  BOT_ID_COOKIE_KEY,
  CART_CONFIRM_EMBED_LABEL,
  CHATBOTS_API_PATH,
  COPY_SUCCESS,
  DEMO_BOT_PATH_PREFIX,
  FAQ_EMBED_LABEL,
  OPEN_DEMO_LABEL,
  PAYMENT_EMBED_LABEL,
  SUPPORT_EMBED_HINT,
  TEXTAREA_ROWS,
  THANKS_EMBED_LABEL,
} from './constants';

const InstallationTag = () => {
  const [urlDemo, setUrlDemo] = useState('');
  const [botId] = useState(Cookies.get(BOT_ID_COOKIE_KEY));
  const [chatBodyVersion, setChatBodyVersion] = useState(CHAT_BODY_VERSION_1);

  const {
    paymentSdkUrl,
    faqSdkUrl,
    utilsSdkUrl,
    cartConfirmSdkUrl,
    conversionLogSdkUrl,
  } = useMemo(
    () => getSdkEmbedPaths(chatBodyVersion, getEcChatBotFrontEndBaseUrl()),
    [chatBodyVersion],
  );

  const embedRows = useMemo(
    () => [
      {
        key: 'payment',
        label: PAYMENT_EMBED_LABEL,
        script: buildPaymentEmbedScript(botId, paymentSdkUrl),
      },
      {
        key: 'faq',
        label: FAQ_EMBED_LABEL,
        script: buildFaqEmbedScript(botId, faqSdkUrl, { includeBotType: true }),
      },
      {
        key: 'cart-confirm',
        label: CART_CONFIRM_EMBED_LABEL,
        script: buildCartConfirmEmbedScript(utilsSdkUrl, cartConfirmSdkUrl),
      },
      {
        key: 'thanks',
        label: THANKS_EMBED_LABEL,
        script: buildConversionLogEmbedScript(utilsSdkUrl, conversionLogSdkUrl),
      },
    ],
    [
      botId,
      paymentSdkUrl,
      faqSdkUrl,
      utilsSdkUrl,
      cartConfirmSdkUrl,
      conversionLogSdkUrl,
    ],
  );

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

  const renderEmbedTagRow = ({ key, label, script }) => (
    <AdminFormRow key={key} alignTop label={label} hint={SUPPORT_EMBED_HINT}>
      <Input.TextArea
        value={script}
        readOnly
        rows={TEXTAREA_ROWS}
        className="admin-code-textarea"
      />
      <div className="admin-form-row-action">
        <AdminActionButton action="copy" onClick={() => copyText(script)} />
      </div>
    </AdminFormRow>
  );

  return (
    <AdminPage>
      <div className="admin-page-body">
        {embedRows.map(renderEmbedTagRow)}
      </div>
    </AdminPage>
  );
};

export default InstallationTag;
