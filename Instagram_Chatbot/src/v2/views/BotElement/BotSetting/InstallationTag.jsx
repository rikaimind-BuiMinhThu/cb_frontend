import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Button, Input, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { getAdminRoutePath, getEcChatBotFrontEndBaseUrl } from 'v2/variables/constants';
import { AdminPage, AdminFormRow, AdminActionButton, useAdminHeaderActions } from '../../../components/AdminShell';

function InstallationTag() {
  const [urlDemo, setUrlDemo] = useState('');
  const [botId] = useState(Cookies.get('bot_id'));

  const paymentScript = `<script>sessionStorage.setItem("bot_id", "${botId}");</script>\n<script src="${getEcChatBotFrontEndBaseUrl()}/v2/sdk.js" defer></script>`;
  const faqScript = `<script>sessionStorage.setItem("bot_id", "${botId}");sessionStorage.setItem("bot_type", "faq");</script>\n<script src="${getEcChatBotFrontEndBaseUrl()}/v2/sdk-faq.js" defer></script>`;

  useEffect(() => {
    setUrlDemo(getAdminRoutePath('/demo-bot/' + botId));
    api
      .get(`/api/v1/managements/chatbots/${botId}/get_scenario_selected`)
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
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
      <div style={{ padding: '20px 24px' }}>
        <AdminFormRow label="決済チャットボット — サイトにボットを埋め込む" hint="ページの右下にウェブチャットを表示するためにウェブサイトの <body> タグ内に以下のコードを貼り付けてください。">
          <Input.TextArea value={paymentScript} readOnly rows={4} style={{ fontFamily: 'monospace', fontSize: 12 }} />
          <Button icon={<CopyOutlined />} style={{ marginTop: 8 }} onClick={() => copyText(paymentScript)}>コピー</Button>
        </AdminFormRow>

        <AdminFormRow label="FAQ チャットボット — サイトにボットを埋め込む" hint="ページの右下にウェブチャットを表示するためにウェブサイトの <body> タグ内に以下のコードを貼り付けてください。">
          <Input.TextArea value={faqScript} readOnly rows={4} style={{ fontFamily: 'monospace', fontSize: 12 }} />
          <Button icon={<CopyOutlined />} style={{ marginTop: 8 }} onClick={() => copyText(faqScript)}>コピー</Button>
        </AdminFormRow>
      </div>
    </AdminPage>
  );
}

export default InstallationTag;
