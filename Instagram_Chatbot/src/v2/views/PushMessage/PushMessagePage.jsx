import * as React from 'react';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import SavePushMessageDialog from './SavePushMessageDialog';
import PushMessageList from './PushMessageList';
import PushMessageHistory from './PushMessageHistory';
import { AdminPage, useAdminHeaderActions } from 'v2/components/AdminShell';

const PushMessagePage = () => {
  const { botId } = useParams();
  const [tab, setTab] = React.useState('list');
  const [tick, setTick] = React.useState(0);

  const handleCreateSuccess = () => {
    setTick((pre) => pre + 1);
  };

  const headerActions = React.useMemo(
    () => (tab === 'list' ? <SavePushMessageDialog botId={botId} resolver={handleCreateSuccess} /> : null),
    [tab, botId]
  );

  useAdminHeaderActions(headerActions);

  return (
    <AdminPage description="プッシュメッセージの作成・配信管理">
      <Tabs
        activeKey={tab}
        onChange={setTab}
        className="admin-page-tabs"
        items={[
          {
            key: 'list',
            label: 'プッシュメッセージ一覧',
            children: <PushMessageList tick={tick} />,
          },
          {
            key: 'history',
            label: '配信履歴',
            children: <PushMessageHistory />,
          },
        ]}
      />
    </AdminPage>
  );
};

export default PushMessagePage;
