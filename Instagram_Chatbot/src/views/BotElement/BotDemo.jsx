import { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import Preview from './BotSetting/Preview';
import Cookies from 'js-cookie';
import api from '../../api/api-management';
import { AdminPage } from '../../components/AdminShell';

const BotDemo = () => {
  const [isChatBoxClick, setIsChatBoxClick] = useState(true);
  const [scenarioId, setScenarioId] = useState('');
  const bot_id = Cookies.get('bot_id');

  useEffect(() => {
    setTimeout(() => setIsChatBoxClick(true), 300);
  }, []);

  useEffect(() => {
    api.get(`/api/v1/managements/chatbots/${bot_id}/get_scenario_selected`).then((response) => {
      if (response.data.data) {
        setScenarioId(response.data.data.id);
        Cookies.set('scenario_id', response.data.data.id);
      } else {
        message.warning('シナリオがありません。');
      }
    });
  }, [bot_id]);

  const handleOpenPreview = (isOpen) => {
    const container = document.getElementById('sp-container');
    if (!container) return;
    if (isOpen) {
      container.style.height = '620px';
      document.getElementById('sp-header').style.position = 'static';
      document.getElementById('sp-process-bar').style.display = 'block';
      document.getElementById('sp-body').style.display = 'block';
    } else {
      container.style.height = '0px';
      document.getElementById('sp-process-bar').style.display = 'none';
      document.getElementById('sp-body').style.display = 'none';
      document.getElementById('sp-header').style.position = 'absolute';
      document.getElementById('sp-header').style.bottom = '13px';
    }
    setIsChatBoxClick(isOpen);
  };

  return (
    <AdminPage title="ボットデモ" card={false}>
      <Card bordered={false} style={{ borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>アクションクリック</h3>
          <Button onClick={() => handleOpenPreview(!isChatBoxClick)} style={{ marginBottom: 24 }}>
            open-close
          </Button>
          {scenarioId && (
            <Preview isOpen={isChatBoxClick} onOpenPreview={(isOpen) => handleOpenPreview(isOpen)} />
          )}
        </div>
      </Card>
    </AdminPage>
  );
};

export default BotDemo;
