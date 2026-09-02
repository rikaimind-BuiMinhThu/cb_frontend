import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { BOT_ID_COOKIE_KEY, SCENARIO_ID_COOKIE_KEY } from 'v2/api/constants';
import { AdminPage } from 'v2/components/AdminShell';
import PreviewFukushashiki from 'v2/views/BotElement/BotSetting/PreviewFukushashiki';
import {
  ACTION_CLICK_TITLE,
  BOT_DEMO_PREVIEW_CLOSED_CLASS,
  BOT_DEMO_PREVIEW_OPEN_CLASS,
  CHATBOTS_MANAGEMENT_PATH,
  EMPTY_SCENARIO_ID,
  NO_SCENARIO_WARNING,
  OPEN_CLOSE_BUTTON,
  OPEN_PREVIEW_DELAY_MS,
  SCENARIO_SELECTED_SUFFIX,
} from './botDemoConstants';

const BotDemo = () => {
  const [isChatBoxClick, setIsChatBoxClick] = useState(true);
  const [scenarioId, setScenarioId] = useState(EMPTY_SCENARIO_ID);
  const botId = Cookies.get(BOT_ID_COOKIE_KEY);

  useEffect(() => {
    const timer = setTimeout(() => setIsChatBoxClick(true), OPEN_PREVIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!botId) return undefined;
    const request = { cancelled: false };
    api
      .get(`${CHATBOTS_MANAGEMENT_PATH}/${botId}/${SCENARIO_SELECTED_SUFFIX}`)
      .then((response) => {
        if (request.cancelled) return;
        if (response.data.data) {
          setScenarioId(response.data.data.id);
          Cookies.set(SCENARIO_ID_COOKIE_KEY, response.data.data.id);
          return;
        }
        message.warning(NO_SCENARIO_WARNING);
      });
    return () => {
      request.cancelled = true;
    };
  }, [botId]);

  const previewClassName = isChatBoxClick
    ? BOT_DEMO_PREVIEW_OPEN_CLASS
    : BOT_DEMO_PREVIEW_CLOSED_CLASS;

  return (
    <AdminPage>
      <div className="admin-page-body">
        <h3 className="bot-demo-title">{ACTION_CLICK_TITLE}</h3>
        <Button
          className="bot-demo-toggle"
          onClick={() => setIsChatBoxClick(!isChatBoxClick)}
        >
          {OPEN_CLOSE_BUTTON}
        </Button>
        {scenarioId && (
          <div className={previewClassName}>
            <PreviewFukushashiki />
          </div>
        )}
      </div>
    </AdminPage>
  );
};

export default BotDemo;
