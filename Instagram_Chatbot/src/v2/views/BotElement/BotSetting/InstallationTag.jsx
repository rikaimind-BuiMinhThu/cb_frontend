import Cookies from 'js-cookie';
import React, { useEffect, useMemo, useState } from 'react';
import { Input, message } from 'antd';
import { Link } from 'react-router-dom';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { getAdminRoutePath, getEcChatBotFrontEndBaseUrl } from 'v2/variables/constants';
import {
  CHAT_BODY_VERSION_DEFAULT,
  buildFaqEmbedScript,
  buildPaymentEmbedScript,
  getSdkEmbedPaths,
} from 'utils/sdkEmbedPaths';
import { AdminPage, AdminFormRow, AdminActionButton, useAdminHeaderActions } from '../../../components/AdminShell';

function InstallationTag() {
  const [urlDemo, setUrlDemo] = useState('');
  const [botId] = useState(Cookies.get('bot_id'));
  const [chatBodyVersion, setChatBodyVersion] = useState(CHAT_BODY_VERSION_DEFAULT);

  const { paymentSdkUrl, faqSdkUrl } = useMemo(
    () => getSdkEmbedPaths(chatBodyVersion, getEcChatBotFrontEndBaseUrl()),
    [chatBodyVersion],
  );

  const paymentScript = buildPaymentEmbedScript(botId, paymentSdkUrl);
  const faqScript = buildFaqEmbedScript(botId, faqSdkUrl, { includeBotType: true });

  useEffect(() => {
    setUrlDemo(getAdminRoutePath('/demo-bot/' + botId));
    if (!botId) return undefined;

    api
      .get(`/api/v1/managements/chatbots/${botId}`)
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
    message.success('コピーしました');
  };

  useAdminHeaderActions(
    <Link to={urlDemo}>
      <AdminActionButton action="preview" label="デモページを開く" />
    </Link>
  );

  return (
    <AdminPage>
      <div className="admin-page-body">
        <AdminFormRow alignTop label="決済チャットボット — サイトにボットを埋め込む" hint="ページの右下にウェブチャットを表示するためにウェブサイトの <body> タグ内に以下のコードを貼り付けてください。">
          <Input.TextArea value={paymentScript} readOnly rows={4} style={{ fontFamily: 'monospace', fontSize: 12 }} />
          <div className="admin-form-row-action">
            <AdminActionButton action="copy" onClick={() => copyText(paymentScript)} />
          </div>
        </AdminFormRow>

        <AdminFormRow alignTop label="FAQ チャットボット — サイトにボットを埋め込む" hint="ページの右下にウェブチャットを表示するためにウェブサイトの <body> タグ内に以下のコードを貼り付けてください。">
          <Input.TextArea value={faqScript} readOnly rows={4} style={{ fontFamily: 'monospace', fontSize: 12 }} />
          <div className="admin-form-row-action">
            <AdminActionButton action="copy" onClick={() => copyText(faqScript)} />
          </div>
        </AdminFormRow>
      </div>
    </AdminPage>
  );
}

export default InstallationTag;
