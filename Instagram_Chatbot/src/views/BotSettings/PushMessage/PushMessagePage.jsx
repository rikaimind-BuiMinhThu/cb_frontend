import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabPanel from "./TabPanel";
import CardHeader from "@mui/material/CardHeader";
import { useParams } from "react-router-dom";
import CreatePushMessageDialog from "./CreatePushMessageDialog";
import PushMessageList from "./PushMessageList";
import PushMessageHistory from "./PushMessageHistory";

const PushMessagePage = () => {
  const { botId } = useParams();
  const [tab, setTab] = React.useState("list");
  const [tick, setTick] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleCreateSuccess = () => {
    setTick((pre) => ++pre)
  };

  return (
    <div className="content">
      <Card>
        <CardHeader
          title="ブッシュメッセージ"
          action={
            <div hidden={tab === "history"}>
              <CreatePushMessageDialog
                botId={botId}
                resolver={handleCreateSuccess}
              />
            </div>
          }
        />
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tab} onChange={handleChangeTab}>
              <Tab label="プッシュメッセージ一覧" value={"list"} />
              <Tab label="配信履歴" value={"history"} />
            </Tabs>
          </Box>
          <TabPanel value={"list"} selected={tab}>
            <PushMessageList tick={tick}/>
          </TabPanel>
          <TabPanel value={"history"} selected={tab}>
            <PushMessageHistory />
          </TabPanel>
        </CardContent>
      </Card>
    </div>
  );
};

export default PushMessagePage;
