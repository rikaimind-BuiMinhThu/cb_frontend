import React from 'react';
import { Route, Switch } from 'react-router-dom';
import V2PreviewFaq from 'v2/views/BotElement/BotSetting/PreviewFaq';
import V2PreviewFukushashiki from 'v2/views/BotElement/BotSetting/PreviewFukushashiki';
import ScenarioPreviewEditorPage from 'v2/views/BotElement/BotSetting/ScenarioSetting/preview/ScenarioPreviewEditorPage';
import { getAppPath, getSignInPath } from 'v2/variables/constants';
import V2Admin from './layouts/Admin';
import V2Login from './Login';
import {
  ADMIN_APP_PATH,
  PREVIEW_CUSTOMER_FUKUSHASHIKI_PATH,
  PREVIEW_FAQ_PATH,
  PREVIEW_SCENARIO_EDITOR_PATH,
} from './constants';

const AdminV2 = () => (
  <Switch>
    <Route path={getSignInPath()} component={V2Login} />
    <Route
      exact
      path={getAppPath(PREVIEW_CUSTOMER_FUKUSHASHIKI_PATH)}
      component={V2PreviewFukushashiki}
    />
    <Route exact path={getAppPath(PREVIEW_FAQ_PATH)} component={V2PreviewFaq} />
    <Route
      exact
      path={getAppPath(PREVIEW_SCENARIO_EDITOR_PATH)}
      component={ScenarioPreviewEditorPage}
    />
    <Route path={getAppPath(ADMIN_APP_PATH)} render={(props) => <V2Admin {...props} />} />
  </Switch>
);

export default AdminV2;
