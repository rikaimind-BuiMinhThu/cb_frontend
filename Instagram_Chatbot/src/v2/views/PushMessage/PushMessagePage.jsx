import * as React from 'react';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import SavePushMessageDialog from './SavePushMessageDialog';
import PushMessageList from './PushMessageList';
import PushMessageHistory from './PushMessageHistory';
import { AdminPage, useAdminHeaderActions } from 'v2/components/AdminShell';
import {
  PAGE_DESCRIPTION,
  TAB_HISTORY,
  TAB_HISTORY_LABEL,
  TAB_LIST,
  TAB_LIST_LABEL,
} from './constants';

const PushMessagePage = () => {
  const { botId } = useParams();
  const [tab, setTab] = React.useState(TAB_LIST);
  const [tick, setTick] = React.useState(0);

  const handleCreateSuccess = () => {
    setTick((pre) => pre + 1);
  };

  const headerActions = React.useMemo(
    () => (tab === TAB_LIST ? <SavePushMessageDialog botId={botId} resolver={handleCreateSuccess} /> : null),
    [tab, botId]
  );

  useAdminHeaderActions(headerActions);

  return (
    <AdminPage description={PAGE_DESCRIPTION}>
      <Tabs
        activeKey={tab}
        onChange={setTab}
        className="admin-page-tabs"
        items={[
          {
            key: TAB_LIST,
            label: TAB_LIST_LABEL,
            children: <PushMessageList tick={tick} />,
          },
          {
            key: TAB_HISTORY,
            label: TAB_HISTORY_LABEL,
            children: <PushMessageHistory />,
          },
        ]}
      />
    </AdminPage>
  );
};

export default PushMessagePage;
